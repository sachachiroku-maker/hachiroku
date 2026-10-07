/**
 * /api/cotacao: recebe o formulário de cotação de seguro auto
 * (src/components/ui/CotacaoSeguro.astro) e entrega o pedido à equipe comercial do
 * Hachiroku pelo CRM (crm-leads, POST /api/v1/leads). Vercel Function (Node, Web
 * Standard `fetch`), a única parte não estática do site.
 *
 * GET devolve { token } para o pop-up (pedido só quando a pessoa abre o pop-up):
 * base64url("<ms>.<aleatório>.<HMAC-SHA256(COTACAO_SEGREDO, "<ms>.<aleatório>")>"),
 * com Cache-Control no-store. É o relógio do servidor que mede o tempo mínimo.
 *
 * Caminho do POST (crm-leads/docs/PLANO-CRM.md §5, "Mudanças no Hachiroku"):
 *   1. confere origem (lista exata, sem curinga), limite por IP (5 envios a cada 10 min,
 *      por instância), tamanho em bytes (8 KB, 413 acima), armadilha `empresa` e o token:
 *      ausente, forjado, com menos de 2,5 s ou mais de 2 h = robô (responde sucesso e
 *      descarta). O `tempoMs` do navegador é só sinal extra, nunca prova;
 *   2. valida e normaliza; gera o `id_externo` (UUID) e o `aceito_em` em ISO 8601 com
 *      o fuso de Brasília (-03:00);
 *   3. envia ao CRM com tempo limite de 5 s. 2xx (201 criado, 200 agrupado/repetido) = entregue;
 *   4. qualquer outra resposta, tempo esgotado ou falha de rede: grava na planilha do
 *      Google como RESERVA (status "Reserva", com o mesmo id_externo, para o reenvio
 *      não duplicar) e registra no log só o código (ex.: "HTTP 401"), nunca o pedido.
 * O limite por IP vive na memória de cada instância; a regra de rate limit no Firewall
 * da Vercel (docs/COTACAO-SEGURO.md) é o que vale para todas as instâncias.
 *
 * Variáveis de ambiente (Vercel → Settings → Environment Variables):
 *   COTACAO_SEGREDO    segredo do token do formulário (16+ caracteres). Sem ele: 503.
 *   COTACAO_ORIGENS_EXTRAS  origens https extras aceitas no POST, separadas por vírgula
 *                      (ex.: o endereço fixo de um preview). Opcional.
 *   CRM_URL            origem do CRM (https://...; http só para localhost)
 *   CRM_CHAVE          chave do projeto de seguro auto do Hachiroku no CRM (crm_ + 48 hex). Só servidor.
 *   GOOGLE_SA_JSON     JSON inteiro da chave da service account (planilha de reserva)
 *   COTACAO_SHEET_ID   ID da planilha (trecho da URL entre /d/ e /edit)
 *   COTACAO_SHEET_TAB  nome da aba (default: Pedidos)
 *   RESEND_API_KEY     alerta de reserva (D12) pelo Resend. Opcional.
 *   EMAIL_ADMIN        quem recebe o alerta. Sem esta ou sem a anterior, o alerta só vai para o log.
 *   EMAIL_REMETENTE    remetente do alerta, num domínio verificado no Resend. Opcional.
 * O alerta diz só a hora e o motivo, sai no máximo uma vez por hora (marca na aba
 * "Controle" da planilha, que todas as instâncias leem) e nunca derruba o pedido.
 * A planilha precisa estar compartilhada como Editor com o client_email da
 * service account. Responde 503 só se faltarem AS DUAS saídas (CRM e planilha); se a
 * saída disponível falhar, 502: o visitante vê o aviso de erro e pode tentar de novo.
 *
 * Sem dependência externa: o JWT da service account é assinado com
 * node:crypto, mesmo esquema de scripts/google-index.mjs.
 */
import crypto from 'node:crypto';

/** Manter igual a COTACAO_SEGURO.versaoAviso (src/config/cotacao-seguro.ts); o teste confere. */
export const VERSAO_AVISO = '2026-10-06';
/** Planilha de reserva. A coluna id_externo fica no fim para não deslocar linhas antigas. */
export const COLUNAS = [
  'Recebido em', 'Nome', 'WhatsApp', 'E-mail', 'CEP', 'Carro', 'Ano', 'Já tem seguro',
  'Página', 'Posição do banner', 'Versão do aviso', 'Status', 'id_externo',
];
export const STATUS_RESERVA = 'Reserva';
/** Tempo limite do envio ao CRM (PLANO-CRM §5). */
export const TEMPO_LIMITE_CRM_MS = 5000;

/** Origens de produção aceitas no POST. Comparação exata: nenhum curinga (nada de *.vercel.app). */
export const ORIGENS_PRODUCAO = ['https://hachiroku.com.br', 'https://www.hachiroku.com.br'];
const ORIGEM_LOCAL = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
/** Teto do corpo do POST, em bytes (o formulário manda menos de 1 KB). */
export const MAX_BYTES = 8 * 1024;
/** Idade mínima do token (medida no servidor) e validade máxima. */
export const TEMPO_MINIMO_MS = 2500;
export const VALIDADE_TOKEN_MS = 2 * 60 * 60 * 1000;
export const TAMANHO_MINIMO_SEGREDO = 16;
/** Limite por IP, por instância da função (janela deslizante em memória). */
export const LIMITE_POR_IP = 5;
export const JANELA_LIMITE_MS = 10 * 60 * 1000;
const SEGURO_ATUAL = ['nao informado', 'nao tenho', 'tenho, quero comparar'];
const FORMATO_CHAVE_CRM = /^crm_[0-9a-f]{48}$/;

const json = (status, corpo) => Response.json(corpo, { status, headers: { 'Cache-Control': 'no-store' } });
const soDigitos = (v) => String(v ?? '').replace(/\D/g, '');
const texto = (v, max) => String(v ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
// Valor gravado como texto puro (RAW), mas a planilha pode virar CSV e abrir no
// Excel: célula começando com = + - @ vira fórmula lá. O apóstrofo neutraliza.
const celula = (v) => (/^[=+\-@]/.test(v) ? `'${v}` : v);

/**
 * Origens aceitas no POST: as de produção, as de COTACAO_ORIGENS_EXTRAS (separadas por
 * vírgula; só https, sem caminho; o resto é ignorado) e, só em desenvolvimento
 * (`vercel dev`, ou fora da Vercel), localhost.
 */
export function origensPermitidas(env) {
  const extras = String(env.COTACAO_ORIGENS_EXTRAS ?? '').split(',')
    .map((s) => s.trim().toLowerCase().replace(/\/+$/, ''))
    .filter((s) => /^https:\/\/[a-z0-9.-]+(:\d+)?$/.test(s));
  return new Set([...ORIGENS_PRODUCAO, ...extras]);
}
const emDesenvolvimento = (env) => (env.VERCEL_ENV ? env.VERCEL_ENV === 'development' : env.NODE_ENV !== 'production');
export const origemPermitida = (origem, env) => origensPermitidas(env).has(origem) || (emDesenvolvimento(env) && ORIGEM_LOCAL.test(origem));

/** COTACAO_SEGREDO, ou null se faltar ou tiver menos de TAMANHO_MINIMO_SEGREDO caracteres. */
const segredoDe = (env) => {
  const s = String(env.COTACAO_SEGREDO ?? '').trim();
  return s.length >= TAMANHO_MINIMO_SEGREDO ? s : null;
};
const assinar = (segredo, base) => crypto.createHmac('sha256', segredo).update(base).digest('base64url');
const resumo = (s) => crypto.createHash('sha256').update(s).digest();

/** Token do formulário: base64url("<ms>.<aleatório>.<HMAC>"). `agora` em ms (injetável no gate). */
export function emitirToken(segredo, agora = Date.now()) {
  const base = `${agora}.${crypto.randomBytes(16).toString('base64url')}`;
  return Buffer.from(`${base}.${assinar(segredo, base)}`).toString('base64url');
}

/**
 * Confere o token. Devolve { ok: true, id, emitidoEm } ou { ok: false, motivo } com um
 * código curto para o log. A assinatura é comparada em tempo constante (sha256 dos dois
 * lados + timingSafeEqual), e só depois a idade: menos de TEMPO_MINIMO_MS ou mais de
 * VALIDADE_TOKEN_MS, medidos pelo relógio do servidor, não passa.
 */
export function conferirToken(token, segredo, agora = Date.now()) {
  if (typeof token !== 'string' || !token) return { ok: false, motivo: 'token ausente' };
  if (token.length > 200 || !/^[A-Za-z0-9_-]+$/.test(token)) return { ok: false, motivo: 'token inválido' };
  const partes = Buffer.from(token, 'base64url').toString('utf8').split('.');
  if (partes.length !== 3 || !/^\d{13}$/.test(partes[0]) || !/^[A-Za-z0-9_-]{22}$/.test(partes[1])) {
    return { ok: false, motivo: 'token inválido' };
  }
  const [ms, aleatorio, mac] = partes;
  if (!crypto.timingSafeEqual(resumo(mac), resumo(assinar(segredo, `${ms}.${aleatorio}`)))) return { ok: false, motivo: 'token inválido' };
  const idade = agora - Number(ms);
  if (idade < TEMPO_MINIMO_MS) return { ok: false, motivo: 'token novo demais' };
  if (idade > VALIDADE_TOKEN_MS) return { ok: false, motivo: 'token vencido' };
  return { ok: true, id: aleatorio, emitidoEm: Number(ms) };
}

/**
 * Tokens já usados num pedido aceito, nesta instância: o mesmo token não serve para
 * um segundo pedido. Cada um é esquecido quando venceria de qualquer jeito.
 */
export function criarTokensUsados(maxItens = 20000) {
  const usados = new Map();
  return {
    usado: (id, agora = Date.now()) => (usados.get(id) ?? 0) > agora,
    marcar(id, expiraEm, agora = Date.now()) {
      if (usados.size >= maxItens) for (const [k, fim] of usados) if (fim <= agora) usados.delete(k);
      if (usados.size >= maxItens) usados.delete(usados.keys().next().value);
      usados.set(id, expiraEm);
    },
    desmarcar: (id) => usados.delete(id),
  };
}

/**
 * Limite por IP numa janela deslizante em memória: `maximo` envios a cada `janelaMs`.
 * Vale por instância da função (cada instância conta os seus); o teto global é a regra
 * de rate limit no Firewall da Vercel. O mapa tem tamanho máximo: acima dele, saem
 * primeiro os IPs sem envio na janela e depois os mais antigos.
 */
export function criarLimitador({ maximo = LIMITE_POR_IP, janelaMs = JANELA_LIMITE_MS, maxChaves = 5000 } = {}) {
  const envios = new Map();
  return {
    permitir(chave, agora = Date.now()) {
      const recentes = (envios.get(chave) ?? []).filter((t) => agora - t < janelaMs);
      envios.delete(chave);
      if (recentes.length >= maximo) {
        envios.set(chave, recentes);
        return false;
      }
      recentes.push(agora);
      // Reinserido no fim: a ordem do Map vai do envio mais antigo ao mais recente.
      envios.set(chave, recentes);
      if (envios.size > maxChaves) {
        for (const [k, ts] of envios) if (ts.every((t) => agora - t >= janelaMs)) envios.delete(k);
        for (const k of envios.keys()) {
          if (envios.size <= maxChaves) break;
          envios.delete(k);
        }
      }
      return true;
    },
    /** Quantos IPs estão no mapa (o gate confere o teto). */
    get tamanho() { return envios.size; },
  };
}

/** IP do visitante: primeiro valor do x-forwarded-for (a Vercel sobrescreve o que o cliente manda), senão x-real-ip. */
export function ipDoPedido(request) {
  const xff = request.headers.get('x-forwarded-for');
  const ip = (xff ? xff.split(',')[0] : request.headers.get('x-real-ip') ?? '').trim();
  return ip.slice(0, 64) || 'sem-ip';
}

/**
 * Lê o corpo contando BYTES, com teto `limite`: Content-Length declarado acima do teto
 * recusa sem ler; sem ele (ou mentindo), a leitura em fluxo para no primeiro byte a mais.
 * Devolve { grande: true } ou { texto }.
 */
export async function lerCorpo(request, limite = MAX_BYTES) {
  const declarado = Number(request.headers.get('content-length'));
  if (Number.isFinite(declarado) && declarado > limite) return { grande: true };
  if (!request.body) return { texto: '' };
  const leitor = request.body.getReader();
  const partes = [];
  let total = 0;
  for (;;) {
    const { done, value } = await leitor.read();
    if (done) break;
    total += value.byteLength;
    if (total > limite) {
      await leitor.cancel().catch(() => undefined);
      return { grande: true };
    }
    partes.push(value);
  }
  return { texto: new TextDecoder().decode(Buffer.concat(partes)) };
}

/**
 * Motivo curto de uma falha da planilha (ou do Google) para o log. Nunca a mensagem crua:
 * o erro do JSON.parse ecoa um trecho do GOOGLE_SA_JSON, que traz a chave privada.
 */
export function causaDaFalha(e, abortado = false) {
  if (e?.status) return `Sheets HTTP ${e.status}`;
  if (abortado) return 'tempo esgotado';
  if (e?.name === 'SyntaxError') return 'GOOGLE_SA_JSON inválido';
  if (typeof e?.message === 'string' && e.message.startsWith('token Google')) return 'token Google recusado';
  return 'falha de rede';
}

/**
 * Valida e normaliza. Devolve { erro } ou { campos, linha }: `campos` vai ao CRM (sem
 * neutralizar fórmula) e `linha` à planilha de reserva (sem a data e sem o id_externo,
 * postos no envio).
 */
export function validar(d) {
  const nome = texto(d.nome, 80);
  if (nome.length < 2) return { erro: 'Informe o seu nome.' };
  const tel = soDigitos(d.whatsapp);
  if (tel.length < 10 || tel.length > 11) return { erro: 'Confira o WhatsApp, com DDD.' };
  const email = texto(d.email, 120);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { erro: 'Confira o e-mail, ou deixe em branco.' };
  const carro = texto(d.carro, 80);
  if (carro.length < 2) return { erro: 'Informe a marca e o modelo do carro.' };
  const ano = texto(d.ano, 20);
  if (!/^(19|20)\d{2}$/.test(ano) && ano !== 'anterior a 1990') return { erro: 'Escolha o ano do modelo.' };
  const cep = soDigitos(d.cep);
  if (cep.length !== 8) return { erro: 'O CEP tem 8 números.' };
  if (d.ciencia !== true) return { erro: 'Marque a caixa de ciência para pedir a cotação.' };
  const seguro = SEGURO_ATUAL.includes(d.seguroAtual) ? d.seguroAtual : 'nao informado';
  const whatsapp = tel.length === 11
    ? `(${tel.slice(0, 2)}) ${tel.slice(2, 7)}-${tel.slice(7)}`
    : `(${tel.slice(0, 2)}) ${tel.slice(2, 6)}-${tel.slice(6)}`;
  const campos = {
    nome, whatsapp, email, cep: `${cep.slice(0, 5)}-${cep.slice(5)}`, carro, ano, seguro,
    pagina: texto(d.pagina, 200), posicao: texto(d.posicao, 20),
  };
  return {
    campos,
    linha: [
      campos.nome, campos.whatsapp, campos.email, campos.cep, campos.carro, campos.ano, campos.seguro,
      campos.pagina, campos.posicao, VERSAO_AVISO, STATUS_RESERVA,
    ].map(celula),
  };
}

/** "2026-10-05 14:30:12", no fuso de Brasília. */
export function agoraBrasilia(data = new Date()) {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  }).format(data);
}

/** ISO 8601 com o fuso de Brasília: "2026-10-05T14:30:12-03:00" (o CRM exige o fuso). */
export function isoBrasilia(data = new Date()) {
  const fuso = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', timeZoneName: 'longOffset' })
    .formatToParts(data)
    .find((p) => p.type === 'timeZoneName')?.value ?? 'GMT-03:00';
  const deslocamento = fuso === 'GMT' ? '+00:00' : fuso.replace('GMT', '');
  return `${agoraBrasilia(data).replace(' ', 'T')}${deslocamento}`;
}

/** Endereço completo da página do pedido, só se `pagina` for um caminho deste site. */
function urlDaPagina(origem, pagina) {
  if (!pagina.startsWith('/') || pagina.startsWith('//')) return undefined;
  try {
    const url = new URL(pagina, origem);
    return url.origin === origem ? url.href : undefined;
  } catch {
    return undefined;
  }
}

/** Corpo do POST /api/v1/leads, no contrato de crm-leads/src/lib/ingestao.ts. */
export function corpoCrm(campos, { idExterno, aceitoEm, origem }) {
  const url = urlDaPagina(origem, campos.pagina);
  return {
    nome: campos.nome,
    telefone: campos.whatsapp,
    ...(campos.email ? { email: campos.email } : {}),
    dados: { carro: campos.carro, ano: campos.ano, cep: campos.cep, seguro_atual: campos.seguro },
    origem: { ...(url ? { url } : {}), ...(campos.posicao ? { posicao: campos.posicao } : {}) },
    consentimento: { versao: VERSAO_AVISO, aceito_em: aceitoEm },
    id_externo: idExterno,
  };
}

/** Origem do CRM aceita: https, ou http só em localhost (dev). Sem barra final. */
function origemCrm(valor) {
  const v = String(valor ?? '').trim().replace(/\/+$/, '');
  if (/^https:\/\/[^/\s]+$/.test(v) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(v)) return v;
  return null;
}

const crmConfigurado = (env) => Boolean(env.CRM_URL && env.CRM_CHAVE);
const planilhaConfigurada = (env) => Boolean(env.GOOGLE_SA_JSON && env.COTACAO_SHEET_ID);

/**
 * Envia ao CRM. Devolve { ok: true, status } quando o CRM confirma (2xx), ou
 * { ok: false, motivo } com um código curto para o log ("HTTP 401", "tempo esgotado").
 * Nunca lança e nunca registra o pedido nem a chave. Redirecionamento não é seguido
 * (a chave não pode ir para outro endereço): vira "HTTP 3xx" e cai na reserva.
 */
export async function enviarAoCrm(corpo, env, { fetch: buscar = fetch, tempoLimiteMs = TEMPO_LIMITE_CRM_MS } = {}) {
  const base = origemCrm(env.CRM_URL);
  if (!base) return { ok: false, motivo: 'CRM_URL inválida' };
  const chave = String(env.CRM_CHAVE ?? '').trim();
  if (!FORMATO_CHAVE_CRM.test(chave)) return { ok: false, motivo: 'CRM_CHAVE fora do formato' };
  // Relógio próprio (não AbortSignal.timeout, cujo timer não segura o processo): o tempo
  // limite vale do início da conexão até o fim da resposta.
  const controle = new AbortController();
  const relogio = setTimeout(() => controle.abort(new DOMException('tempo esgotado', 'TimeoutError')), tempoLimiteMs);
  try {
    const r = await buscar(`${base}/api/v1/leads`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${chave}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(corpo),
      signal: controle.signal,
      redirect: 'manual',
    });
    await r.body?.cancel?.().catch(() => undefined);
    if (r.status >= 200 && r.status <= 299) return { ok: true, status: r.status };
    return { ok: false, motivo: `HTTP ${r.status}` };
  } catch (e) {
    const nome = e && typeof e === 'object' ? e.name : '';
    return { ok: false, motivo: controle.signal.aborted || nome === 'TimeoutError' ? 'tempo esgotado' : 'falha de rede' };
  } finally {
    clearTimeout(relogio);
  }
}

let tokenCache = { valor: '', expira: 0 };
/** Token da service account. `buscar` e `signal` são injetáveis (alerta de reserva, retenção e testes). */
export async function tokenGoogle(sa, buscar = fetch, signal = undefined) {
  if (tokenCache.valor && Date.now() < tokenCache.expira) return tokenCache.valor;
  const b64 = (s) => Buffer.from(s).toString('base64url');
  const agora = Math.floor(Date.now() / 1000);
  const cab = b64(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = b64(JSON.stringify({
    iss: sa.client_email, scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token', iat: agora, exp: agora + 3600,
  }));
  const assinatura = crypto.createSign('RSA-SHA256').update(`${cab}.${claim}`).sign(sa.private_key).toString('base64url');
  const r = await buscar('https://oauth2.googleapis.com/token', {
    method: 'POST',
    signal,
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${cab}.${claim}.${assinatura}` }),
  });
  const t = await r.json();
  if (!t.access_token) throw new Error(`token Google: ${t.error || r.status}`);
  tokenCache = { valor: t.access_token, expira: Date.now() + (t.expires_in - 120) * 1000 };
  return t.access_token;
}

export async function gravarLinha(linha, env = process.env) {
  const sa = JSON.parse(env.GOOGLE_SA_JSON);
  const aba = env.COTACAO_SHEET_TAB || 'Pedidos';
  const intervalo = encodeURIComponent(`${aba}!A1`);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${env.COTACAO_SHEET_ID}/values/${intervalo}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`;
  const r = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${await tokenGoogle(sa)}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ values: [linha] }),
  });
  // Só o código: o texto de erro da API poderia ecoar parte da linha (dado pessoal).
  if (!r.ok) throw Object.assign(new Error(`Sheets append HTTP ${r.status}`), { status: r.status });
}

/** Intervalo em notação A1 com o nome da aba entre aspas simples (aceita espaço e acento). */
export const faixa = (aba, celulas) => `'${String(aba).replace(/'/g, "''")}'!${celulas}`;

/**
 * Cliente mínimo da API do Google Sheets, usado pelo alerta de reserva, pela retenção
 * (api/retencao-planilha.js) e pelo reenvio (scripts/reenviar-planilha.mjs). `fetch` e
 * `signal` injetáveis. Erro leva só o código HTTP (`e.status`): o texto da API pode
 * ecoar conteúdo de célula, que é dado pessoal.
 */
export function clientePlanilha(env, { fetch: buscar = fetch, signal = undefined } = {}) {
  const sa = JSON.parse(env.GOOGLE_SA_JSON);
  const base = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(String(env.COTACAO_SHEET_ID).trim())}`;
  const chamar = async (caminho, init = {}) => {
    const r = await buscar(`${base}${caminho}`, {
      ...init,
      signal,
      headers: { Authorization: `Bearer ${await tokenGoogle(sa, buscar, signal)}`, 'Content-Type': 'application/json' },
    });
    if (!r.ok) {
      await r.body?.cancel?.().catch(() => undefined);
      throw Object.assign(new Error(`Sheets HTTP ${r.status}`), { status: r.status });
    }
    return r.json();
  };
  const em = (intervalo) => encodeURIComponent(intervalo);
  return {
    /** Valores do intervalo (linhas vazias no fim são omitidas pela API). */
    ler: async (intervalo) => (await chamar(`/values/${em(intervalo)}`)).values ?? [],
    /** Grava texto puro (RAW): nada vira fórmula. */
    escrever: (intervalo, linhas) => chamar(`/values/${em(intervalo)}?valueInputOption=RAW`, {
      method: 'PUT', body: JSON.stringify({ range: intervalo, values: linhas }),
    }),
    /** [{ sheetId, title }] de cada aba. */
    abas: async () => ((await chamar('?fields=sheets.properties(sheetId,title)')).sheets ?? []).map((s) => s.properties),
    lote: (requests) => chamar(':batchUpdate', { method: 'POST', body: JSON.stringify({ requests }) }),
  };
}

/** Aba de controle da planilha: linha 1 = último alerta de reserva; linha 2 = última retenção. */
export const ABA_CONTROLE = 'Controle';

/**
 * Marca de "já feito" numa linha da aba Controle, lida por todas as instâncias da função.
 * Se a marca atual tiver menos de `validadeMs`, devolve { ok: false }. Senão grava uma
 * marca nova ("<ISO> <uuid>") e relê: se outra instância gravou por cima no meio do
 * caminho, a releitura não confere e esta desiste (só a última a gravar segue).
 * Cria a aba Controle se ela não existir.
 */
export async function reservarMarca(planilha, linha, rotulo, { agora = new Date(), validadeMs }) {
  const intervalo = faixa(ABA_CONTROLE, `A${linha}:B${linha}`);
  let atual;
  try {
    atual = await planilha.ler(intervalo);
  } catch (e) {
    if (e?.status !== 400) throw e;
    // 400 "Unable to parse range": a aba ainda não existe.
    await planilha.lote([{ addSheet: { properties: { title: ABA_CONTROLE } } }]);
    atual = [];
  }
  const anterior = String(atual?.[0]?.[1] ?? '');
  const quando = Date.parse(anterior.split(' ')[0]);
  if (Number.isFinite(quando) && Math.abs(agora.getTime() - quando) < validadeMs) return { ok: false, anterior };
  const valor = `${agora.toISOString()} ${crypto.randomUUID()}`;
  await planilha.escrever(intervalo, [[rotulo, valor]]);
  const conferido = String((await planilha.ler(intervalo))?.[0]?.[1] ?? '');
  if (conferido !== valor) return { ok: false, anterior: conferido };
  return {
    ok: true,
    valor,
    anterior,
    /** Devolve a marca anterior (ex.: o e-mail falhou e o próximo pedido deve tentar de novo). */
    desfazer: () => planilha.escrever(intervalo, [[rotulo, anterior]]),
  };
}

/** Alerta de reserva (PLANO-CRM §5, D12): e-mail ao admin, no máximo um por hora. */
export const INTERVALO_ALERTA_MS = 60 * 60 * 1000;
export const TEMPO_LIMITE_ALERTA_MS = 4000;
export const URL_RESEND = 'https://api.resend.com/emails';
const LINHA_ALERTA = 1;
const ROTULO_ALERTA = 'Último alerta de reserva';
/** O domínio do remetente precisa estar verificado no Resend; EMAIL_REMETENTE troca o padrão. */
const REMETENTE_PADRAO = 'Hachiroku <avisos@hachiroku.com.br>';

/**
 * E-mail do alerta: só a hora e o motivo (ex.: "HTTP 401"). Nenhum dado do pedido.
 * Texto puro (sem html).
 */
export function emailDeAlerta(motivo, agora, env) {
  const hora = agoraBrasilia(agora).slice(11, 16);
  return {
    from: String(env.EMAIL_REMETENTE || REMETENTE_PADRAO).trim(),
    to: String(env.EMAIL_ADMIN).split(',').map((s) => s.trim()).filter(Boolean),
    subject: 'Hachiroku: pedido de cotação na planilha de reserva',
    text: [
      `Pedido na reserva desde ${hora} (horário de Brasília), motivo: ${motivo}.`,
      '',
      'O CRM não confirmou o recebimento e o pedido ficou na planilha de reserva.',
      'Depois de resolver o motivo, rode "node scripts/reenviar-planilha.mjs --enviar" no Hachiroku para levar os pedidos ao CRM.',
      '',
      'Este aviso sai no máximo uma vez por hora e não traz dados do pedido.',
    ].join('\n'),
  };
}

/**
 * Avisa o admin de que um pedido caiu na reserva. Nunca lança e nunca registra dado do
 * pedido nem chave. Sem RESEND_API_KEY ou EMAIL_ADMIN, só registra no log.
 * Devolve 'so-log' | 'ja-avisado' | 'enviado' | 'falha' (para o gate).
 */
export async function alertarReserva(motivo, env, { fetch: buscar = fetch, agora = new Date(), tempoLimiteMs = TEMPO_LIMITE_ALERTA_MS } = {}) {
  if (!env.RESEND_API_KEY || !env.EMAIL_ADMIN) {
    console.error(`cotacao: alerta de reserva só no log (RESEND_API_KEY ou EMAIL_ADMIN ausente); motivo: ${motivo}`);
    return 'so-log';
  }
  const controle = new AbortController();
  const relogio = setTimeout(() => controle.abort(), tempoLimiteMs);
  let marca;
  try {
    const planilha = clientePlanilha(env, { fetch: buscar, signal: controle.signal });
    marca = await reservarMarca(planilha, LINHA_ALERTA, ROTULO_ALERTA, { agora, validadeMs: INTERVALO_ALERTA_MS });
    if (!marca.ok) {
      console.log('cotacao: alerta de reserva já enviado na última hora');
      return 'ja-avisado';
    }
    const r = await buscar(URL_RESEND, {
      method: 'POST',
      signal: controle.signal,
      redirect: 'manual',
      headers: {
        Authorization: `Bearer ${String(env.RESEND_API_KEY).trim()}`,
        'Content-Type': 'application/json',
        'User-Agent': 'hachiroku-cotacao/1.0',
        'Idempotency-Key': `alerta-reserva-${marca.valor.split(' ')[1]}`,
      },
      body: JSON.stringify(emailDeAlerta(motivo, agora, env)),
    });
    await r.body?.cancel?.().catch(() => undefined);
    if (r.ok) {
      console.log('cotacao: alerta de reserva enviado ao admin');
      return 'enviado';
    }
    console.error(`cotacao: alerta de reserva recusado pelo Resend (HTTP ${r.status})`);
  } catch (e) {
    console.error(`cotacao: alerta de reserva não enviado (${causaDaFalha(e, controle.signal.aborted)})`);
  } finally {
    clearTimeout(relogio);
  }
  // Falhou depois de marcar: devolve a marca anterior para o próximo pedido tentar de novo.
  if (marca?.ok) await marca.desfazer().catch(() => undefined);
  return 'falha';
}

/** Estado por instância: limite por IP e tokens já usados (o gate injeta os seus em `opcoes`). */
const LIMITADOR = criarLimitador();
const TOKENS_USADOS = criarTokensUsados();
const INDISPONIVEL = 'Cotação indisponível no momento. Tente mais tarde.';
const TENTE_DE_NOVO = 'Não deu para enviar agora. Tente de novo em instantes.';

/**
 * `opcoes` (injetáveis no gate): fetch e tempoLimiteMs do envio ao CRM, `limitador`
 * (criarLimitador), `tokensUsados` (criarTokensUsados) e `relogio` (() => ms).
 */
export async function tratar(request, env = process.env, gravar = gravarLinha, opcoes = {}) {
  const { limitador = LIMITADOR, tokensUsados = TOKENS_USADOS, relogio = Date.now } = opcoes;
  if (request.method !== 'POST' && request.method !== 'GET') return json(405, { ok: false, erro: 'Método não permitido.' });
  const segredo = segredoDe(env);
  if (!segredo) {
    console.error(`cotacao: COTACAO_SEGREDO ausente ou com menos de ${TAMANHO_MINIMO_SEGREDO} caracteres`);
    return json(503, { ok: false, erro: INDISPONIVEL });
  }
  // Token do pop-up: só o horário do servidor, assinado. Nada de cookie.
  if (request.method === 'GET') return json(200, { token: emitirToken(segredo, relogio()) });

  const origem = request.headers.get('origin') || '';
  if (!origemPermitida(origem, env)) return json(403, { ok: false, erro: 'Origem não permitida.' });
  const temCrm = crmConfigurado(env);
  const temPlanilha = planilhaConfigurada(env);
  if (!temCrm && !temPlanilha) {
    console.error('cotacao: CRM_URL/CRM_CHAVE e GOOGLE_SA_JSON/COTACAO_SHEET_ID ausentes');
    return json(503, { ok: false, erro: INDISPONIVEL });
  }
  if (!limitador.permitir(ipDoPedido(request), relogio())) {
    return json(429, { ok: false, erro: 'Muitos pedidos seguidos. Tente de novo mais tarde.' });
  }

  let corpo;
  try { corpo = await lerCorpo(request, MAX_BYTES); } catch { return json(400, { ok: false, erro: 'Pedido inválido.' }); }
  if (corpo.grande) return json(413, { ok: false, erro: 'Pedido grande demais.' });
  let d;
  try { d = JSON.parse(corpo.texto); } catch { return json(400, { ok: false, erro: 'Pedido inválido.' }); }
  if (!d || typeof d !== 'object') return json(400, { ok: false, erro: 'Pedido inválido.' });

  // Robô: preencheu a armadilha, veio sem token válido (ausente, forjado, com menos de
  // 2,5 s ou mais de 2 h no relógio do servidor), com token já usado ou com o tempoMs do
  // navegador curto (sinal extra). Responde sucesso e não grava, para não ensinar o robô
  // a contornar a checagem; o log leva só o motivo.
  const agoraMs = relogio();
  const token = conferirToken(d.token, segredo, agoraMs);
  const robo = texto(d.empresa, 10) ? 'armadilha'
    : !token.ok ? token.motivo
      : tokensUsados.usado(token.id, agoraMs) ? 'token já usado'
        : Number(d.tempoMs) < TEMPO_MINIMO_MS ? 'tempoMs curto' : '';
  if (robo) {
    console.log(`cotacao: pedido descartado como robô (${robo})`);
    return json(200, { ok: true });
  }

  const v = validar(d);
  if (v.erro) return json(422, { ok: false, erro: v.erro });

  // Marcado antes do envio (dois pedidos simultâneos com o mesmo token não passam);
  // desmarcado se o visitante tiver de tentar de novo (502).
  tokensUsados.marcar(token.id, token.emitidoEm + VALIDADE_TOKEN_MS, agoraMs);
  const falhou = () => {
    tokensUsados.desmarcar(token.id);
    return json(502, { ok: false, erro: TENTE_DE_NOVO });
  };

  const agora = new Date(agoraMs);
  const idExterno = crypto.randomUUID();
  let motivo = 'CRM não configurado';
  if (temCrm) {
    const r = await enviarAoCrm(corpoCrm(v.campos, { idExterno, aceitoEm: isoBrasilia(agora), origem }), env, opcoes);
    if (r.ok) return json(200, { ok: true });
    motivo = r.motivo;
  }

  // Reserva: o CRM não confirmou (ou não está configurado). Log só com o código.
  if (!temPlanilha) {
    console.error(`cotacao: CRM não confirmou (${motivo}) e a planilha de reserva não está configurada`);
    return falhou();
  }
  console.error(`cotacao: CRM não confirmou (${motivo}); pedido gravado na reserva`);
  try {
    await gravar([agoraBrasilia(agora), ...v.linha, idExterno], env);
  } catch (e) {
    // Mesmo mapeamento do alerta: a mensagem crua do JSON.parse ecoaria trecho da chave.
    console.error(`cotacao: falha ao gravar na reserva (${causaDaFalha(e)})`);
    return falhou();
  }
  // Alerta ao admin (D12). Aguardado antes de responder porque a função pode ser
  // congelada logo depois da resposta; tem tempo limite próprio e nunca derruba o pedido.
  await alertarReserva(motivo, env, { fetch: opcoes.fetch, agora });
  return json(200, { ok: true });
}

export default {
  fetch: (request) => tratar(request),
};
