#!/usr/bin/env node
/**
 * Gate da função de cotação de seguro (api/cotacao.js), sem rede: valida,
 * barra robô e origem estranha, envia ao CRM com o contrato certo e, quando o
 * CRM não confirma (401, 422, 500, tempo esgotado, rede), grava na planilha de
 * reserva com o mesmo id_externo. O fetch do CRM e a gravação são injetados.
 * Também cobre, com Google (token e Sheets), Resend e CRM falsos num fetch injetado:
 * o alerta de reserva (sem dado do lead, no máximo um por hora, marca na aba Controle),
 * a retenção da planilha (api/retencao-planilha.js, CRON_SECRET em tempo constante,
 * 12 meses) e o reenvio da reserva ao CRM (scripts/reenviar-planilha.mjs).
 * Portas públicas: origem em lista exata (sem *.vercel.app), token do servidor
 * (ausente, forjado, novo ou velho demais = robô), limite por IP (429), corpo em bytes
 * (413 acima de 8 KB) e log sem a mensagem crua do JSON.parse nem o segredo.
 *
 *   node scripts/check-cotacao.mjs
 *   node scripts/check-cotacao.mjs --real <ID_DA_PLANILHA>
 *      grava UMA linha de teste de verdade na planilha, com a chave local
 *      .secrets/google-indexing.json (a mesma service account fit-82).
 *
 * Sai com código 1 em qualquer falha.
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import {
  tratar, gravarLinha, agoraBrasilia, isoBrasilia, VERSAO_AVISO, COLUNAS, STATUS_RESERVA, TEMPO_LIMITE_CRM_MS,
  alertarReserva, TEMPO_LIMITE_ALERTA_MS,
  emitirToken, conferirToken, criarLimitador, criarTokensUsados, MAX_BYTES, VALIDADE_TOKEN_MS, LIMITE_POR_IP, JANELA_LIMITE_MS,
} from '../api/cotacao.js';
import { tratarRetencao, segredoConfere, RETENCAO_MESES } from '../api/retencao-planilha.js';
import {
  reenviar, pedidoDaLinha, linhaEnviada, STATUS_ENVIADO, COLUNAS_MANTIDAS,
} from './reenviar-planilha.mjs';

let falhas = 0;
const checar = (nome, ok, detalhe = '') => {
  console.log((ok ? '  OK    ' : '  FALHA ') + nome + (detalhe ? '  ' + detalhe : ''));
  if (!ok) falhas += 1;
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const ISO_BRASILIA = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}-03:00$/;
const CHAVE_FALSA = `crm_${'ab'.repeat(24)}`;
const SEGREDO = 'segredo-do-formulario-Zq81xW';
const ENV_SEGREDO = { COTACAO_SEGREDO: SEGREDO };
const ENV_PLANILHA = { ...ENV_SEGREDO, GOOGLE_SA_JSON: '{}', COTACAO_SHEET_ID: 'x' };
const ENV_CRM = { ...ENV_SEGREDO, CRM_URL: 'https://crm.exemplo.com.br/', CRM_CHAVE: CHAVE_FALSA };
const ENV_AMBOS = { ...ENV_PLANILHA, ...ENV_CRM };
const valido = {
  nome: 'Maria Souza', whatsapp: '(31) 98765-4321', email: 'maria@exemplo.com', carro: 'Hyundai HB20S',
  ano: '2021', cep: '30140-071', seguroAtual: 'nao tenho', ciencia: true, empresa: '',
  pagina: '/problemas/hyundai/hb20s/consumo-alto-combustivel/', posicao: 'h2-1', tempoMs: 15000,
};
/** Token válido, emitido há `idadeMs` (o servidor exige de 2,5 s a 2 h). */
const tokenValido = (idadeMs = 10_000, segredo = SEGREDO) => emitirToken(segredo, Date.now() - idadeMs);
let ipSeq = 0;
/** IP novo a cada pedido, salvo quando o caso pede um IP fixo. */
const ipNovo = () => { ipSeq += 1; return `10.${(ipSeq >> 16) & 255}.${(ipSeq >> 8) & 255}.${ipSeq & 255}`; };
/**
 * Pedido ao /api/cotacao/. Corpo objeto ganha um token válido, salvo `token` explícito
 * (null = sem token). `cabecalhos` substitui ou acrescenta (ex.: x-forwarded-for, content-length).
 */
const pedido = (corpo, origem = 'https://hachiroku.com.br', metodo = 'POST', { token, cabecalhos = {} } = {}) => {
  let body;
  if (metodo === 'POST') {
    if (typeof corpo === 'string') body = corpo;
    else {
      const t = token === undefined ? tokenValido() : token;
      body = JSON.stringify(t === null ? corpo : { ...corpo, token: t });
    }
  }
  return new Request('https://hachiroku.com.br/api/cotacao/', {
    method: metodo,
    headers: { origin: origem, 'content-type': 'application/json', 'x-forwarded-for': `${ipNovo()}, 10.0.0.1`, ...cabecalhos },
    body,
  });
};

/** CRM falso: responde `status` (ou executa `comportamento`) e guarda o que recebeu. */
function crmFalso(status, comportamento) {
  const chamadas = [];
  const buscar = async (url, init) => {
    chamadas.push({ url, init, corpo: JSON.parse(init.body) });
    if (comportamento) return comportamento(init);
    return new Response(JSON.stringify({ resultado: 'x' }), { status, headers: { 'content-type': 'application/json' } });
  };
  return { buscar, chamadas };
}

/** Todo log capturado no gate, para conferir no fim que nenhum traz o segredo. */
const todosOsLogs = [];
/**
 * Roda tratar() com gravação e CRM injetados; captura console.log e console.error para
 * conferir o log. Limite por IP e tokens usados novos a cada chamada, salvo os passados.
 */
async function rodar(corpo, {
  origem, metodo, env = ENV_PLANILHA, crm = crmFalso(201), tempoLimiteMs, token, cabecalhos,
  limitador = criarLimitador(), tokensUsados = criarTokensUsados(), gravar, requisicao,
} = {}) {
  const gravadas = [];
  const logs = [];
  const [log, erro] = [console.log, console.error];
  console.log = (...partes) => { logs.push(partes.map(String).join(' ')); };
  console.error = (...partes) => { logs.push(partes.map(String).join(' ')); };
  try {
    const r = await tratar(requisicao ?? pedido(corpo, origem, metodo, { token, cabecalhos }), env, gravar ?? (async (l) => { gravadas.push(l); }), {
      fetch: crm.buscar, limitador, tokensUsados, ...(tempoLimiteMs ? { tempoLimiteMs } : {}),
    });
    return { status: r.status, cabecalhos: r.headers, corpo: await r.json(), gravadas, chamadas: crm.chamadas, log: logs.join('\n') };
  } finally {
    console.log = log;
    console.error = erro;
    todosOsLogs.push(...logs);
  }
}

const semDadoPessoal = (log) => !['Maria', 'Souza', '98765', '4321', 'maria@', 'HB20S', '30140', CHAVE_FALSA].some((t) => log.includes(t));

console.log('VERSAO E FUSO');
{
  const cfg = fs.readFileSync('src/config/cotacao-seguro.ts', 'utf8');
  const m = cfg.match(/versaoAviso:\s*'([^']+)'/);
  checar('versao do aviso igual na config e na API', m && m[1] === VERSAO_AVISO, `(${m?.[1]} x ${VERSAO_AVISO})`);
  checar('tempo limite do CRM = 5 s', TEMPO_LIMITE_CRM_MS === 5000, `(${TEMPO_LIMITE_CRM_MS})`);
  const iso = isoBrasilia(new Date('2026-10-06T17:30:12Z'));
  checar('aceito_em em ISO 8601 com -03:00', iso === '2026-10-06T14:30:12-03:00', `(${iso})`);
}

console.log('\nCRM CONFIRMA (201 e 200): nada vai para a planilha');
for (const status of [201, 200]) {
  const crm = crmFalso(status);
  const r = await rodar(valido, { env: ENV_AMBOS, crm });
  checar(`CRM ${status}: visitante recebe 200 ok`, r.status === 200 && r.corpo.ok === true, `(${r.status})`);
  checar(`CRM ${status}: uma chamada ao CRM`, r.chamadas.length === 1, `(${r.chamadas.length})`);
  checar(`CRM ${status}: planilha intocada`, r.gravadas.length === 0, `(${r.gravadas.length})`);
  if (status === 201) {
    const c = r.chamadas[0] ?? { init: { headers: {} }, corpo: {} };
    checar('POST em <CRM_URL>/api/v1/leads (sem barra dupla)', c.url === 'https://crm.exemplo.com.br/api/v1/leads' && c.init.method === 'POST', `(${c.url})`);
    checar('Authorization: Bearer <CRM_CHAVE>', c.init.headers.Authorization === `Bearer ${CHAVE_FALSA}`);
    checar('Content-Type JSON', c.init.headers['Content-Type'] === 'application/json');
    checar('tempo limite ligado (signal)', c.init.signal instanceof AbortSignal);
    checar('redirecionamento não é seguido', c.init.redirect === 'manual');
    const b = c.corpo;
    checar('campos do contrato, sem campo a mais',
      JSON.stringify(Object.keys(b).sort()) === JSON.stringify(['consentimento', 'dados', 'email', 'id_externo', 'nome', 'origem', 'telefone']),
      `(${Object.keys(b).sort().join(',')})`);
    checar('nome, telefone e email', b.nome === 'Maria Souza' && b.telefone === '(31) 98765-4321' && b.email === 'maria@exemplo.com');
    checar('dados {carro, ano, cep, seguro_atual}',
      JSON.stringify(b.dados) === JSON.stringify({ carro: 'Hyundai HB20S', ano: '2021', cep: '30140-071', seguro_atual: 'nao tenho' }),
      `(${JSON.stringify(b.dados)})`);
    checar('origem {url completa da pagina, posicao}',
      b.origem?.url === 'https://hachiroku.com.br/problemas/hyundai/hb20s/consumo-alto-combustivel/' && b.origem?.posicao === 'h2-1',
      `(${JSON.stringify(b.origem)})`);
    checar('consentimento.versao = VERSAO_AVISO', b.consentimento?.versao === VERSAO_AVISO);
    checar('consentimento.aceito_em com -03:00', ISO_BRASILIA.test(b.consentimento?.aceito_em ?? ''), `(${b.consentimento?.aceito_em})`);
    checar('id_externo e UUID v4', UUID.test(b.id_externo ?? ''), `(${b.id_externo})`);
    const semEmail = await rodar({ ...valido, email: '' }, { env: ENV_AMBOS, crm: crmFalso(201) });
    checar('e-mail vazio nao vai ao CRM', !('email' in (semEmail.chamadas[0]?.corpo ?? {})));
    const paginaFora = await rodar({ ...valido, pagina: 'https://golpe.example/x' }, { env: ENV_AMBOS, crm: crmFalso(201) });
    checar('pagina que nao e caminho do site nao vira origem.url', !('url' in (paginaFora.chamadas[0]?.corpo?.origem ?? {})));
  }
}

console.log('\nCRM NAO CONFIRMA: pedido vai para a planilha como Reserva, com o mesmo id_externo');
{
  const casos = [
    ['CRM 401', crmFalso(401), 'HTTP 401'],
    ['CRM 422', crmFalso(422), 'HTTP 422'],
    ['CRM 500', crmFalso(500), 'HTTP 500'],
    ['CRM demora mais que o limite', crmFalso(0, (init) => new Promise((_, rejeitar) => {
      init.signal.addEventListener('abort', () => rejeitar(init.signal.reason));
    })), 'tempo esgotado'],
    ['falha de rede', crmFalso(0, () => { throw new TypeError('fetch failed'); }), 'falha de rede'],
  ];
  for (const [nome, crm, motivo] of casos) {
    const inicio = Date.now();
    const r = await rodar(valido, { env: ENV_AMBOS, crm, tempoLimiteMs: 50 });
    const l = r.gravadas[0] ?? [];
    const enviado = r.chamadas[0]?.corpo?.id_externo;
    checar(`${nome}: visitante recebe 200 ok`, r.status === 200 && r.corpo.ok === true, `(${r.status})`);
    checar(`${nome}: uma linha na planilha`, r.gravadas.length === 1, `(${r.gravadas.length})`);
    checar(`${nome}: uma celula por coluna`, l.length === COLUNAS.length, `(${l.length} x ${COLUNAS.length})`);
    checar(`${nome}: status Reserva`, l[COLUNAS.indexOf('Status')] === STATUS_RESERVA, `(${l[COLUNAS.indexOf('Status')]})`);
    checar(`${nome}: id_externo da linha = o enviado ao CRM`, UUID.test(enviado ?? '') && l[COLUNAS.indexOf('id_externo')] === enviado);
    checar(`${nome}: log com o codigo (${motivo})`, r.log.includes(motivo), `(${r.log})`);
    checar(`${nome}: log sem dado pessoal nem chave`, semDadoPessoal(r.log));
    if (nome.startsWith('CRM demora')) checar(`${nome}: desistiu no tempo limite`, Date.now() - inicio < 2000);
  }
  const http = await rodar(valido, { env: { ...ENV_PLANILHA, CRM_URL: 'http://crm.exemplo.com.br', CRM_CHAVE: CHAVE_FALSA } });
  checar('CRM_URL http fora do localhost: chave nao sai, vai para a reserva', http.chamadas.length === 0 && http.gravadas.length === 1);
  const torta = await rodar(valido, { env: { ...ENV_PLANILHA, CRM_URL: 'https://crm.exemplo.com.br', CRM_CHAVE: 'chave-torta' } });
  checar('CRM_CHAVE fora do formato: nao chama o CRM, vai para a reserva', torta.chamadas.length === 0 && torta.gravadas.length === 1);
}

console.log('\nSAIDAS DISPONIVEIS');
{
  const soPlanilha = await rodar(valido, { env: ENV_PLANILHA });
  const l = soPlanilha.gravadas[0] ?? [];
  checar('so planilha: grava a reserva sem chamar o CRM', soPlanilha.status === 200 && soPlanilha.chamadas.length === 0 && soPlanilha.gravadas.length === 1);
  checar('data no fuso de Brasilia', /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(l[0] ?? ''), `(${l[0]})`);
  checar('WhatsApp normalizado', l[2] === '(31) 98765-4321', `(${l[2]})`);
  checar('CEP normalizado', l[4] === '30140-071', `(${l[4]})`);
  checar('versao do aviso na linha', l[10] === VERSAO_AVISO, `(${l[10]})`);
  const soCrm = await rodar(valido, { env: ENV_CRM, crm: crmFalso(201) });
  checar('so CRM e CRM confirma: 200', soCrm.status === 200 && soCrm.chamadas.length === 1);
  const soCrmFalha = await rodar(valido, { env: ENV_CRM, crm: crmFalso(500) });
  checar('so CRM e CRM falha: 502 (visitante tenta de novo)', soCrmFalha.status === 502 && soCrmFalha.gravadas.length === 0, `(${soCrmFalha.status})`);
  const nenhuma = await rodar(valido, { env: ENV_SEGREDO });
  checar('sem nenhuma das duas saidas: 503', nenhuma.status === 503 && nenhuma.gravadas.length === 0 && nenhuma.chamadas.length === 0, `(${nenhuma.status})`);
  const falhaPlanilha = await (async () => {
    const original = console.error;
    console.error = () => {};
    try {
      const crm = crmFalso(500);
      const r = await tratar(pedido(valido), ENV_AMBOS, async () => { throw new Error('Sheets append HTTP 403'); }, { fetch: crm.buscar });
      return r.status;
    } finally {
      console.error = original;
    }
  })();
  checar('CRM e planilha falham: 502', falhaPlanilha === 502, `(${falhaPlanilha})`);
}

console.log('\nRECUSAS');
{
  const casos = [
    ['sem nome', { ...valido, nome: ' ' }, 422],
    ['WhatsApp curto', { ...valido, whatsapp: '9876-5432' }, 422],
    ['e-mail torto', { ...valido, email: 'maria@' }, 422],
    ['CEP com 7 digitos', { ...valido, cep: '3014007' }, 422],
    ['ano fora do padrao', { ...valido, ano: '21' }, 422],
    ['sem ciencia', { ...valido, ciencia: false }, 422],
    ['JSON quebrado', '{nome:', 400],
  ];
  for (const [nome, corpo, esperado] of casos) {
    const r = await rodar(corpo, { env: ENV_AMBOS });
    checar(`${nome} -> ${esperado}, nada enviado nem gravado`, r.status === esperado && r.gravadas.length === 0 && r.chamadas.length === 0, `(${r.status})`);
  }
  const o = await rodar(valido, { origem: 'https://golpe.example', env: ENV_AMBOS });
  checar('origem estranha -> 403', o.status === 403 && o.gravadas.length === 0 && o.chamadas.length === 0, `(${o.status})`);
  const put = await rodar(valido, { metodo: 'PUT', env: ENV_AMBOS });
  checar('PUT -> 405', put.status === 405, `(${put.status})`);
}

console.log('\nROBO');
{
  const hp = await rodar({ ...valido, empresa: 'ACME' }, { env: ENV_AMBOS });
  checar('armadilha preenchida: 200 e nada enviado', hp.status === 200 && hp.gravadas.length === 0 && hp.chamadas.length === 0);
  const rapido = await rodar({ ...valido, tempoMs: 800 }, { env: ENV_AMBOS });
  checar('tempoMs do navegador abaixo de 2,5 s (sinal extra): 200 e nada enviado', rapido.status === 200 && rapido.gravadas.length === 0 && rapido.chamadas.length === 0);
  const formula = await rodar({ ...valido, nome: '=HYPERLINK("x")' }, { env: ENV_PLANILHA });
  checar('celula com formula neutralizada na planilha', formula.gravadas[0]?.[1]?.startsWith("'="), `(${formula.gravadas[0]?.[1]})`);
}

// ---------------------------------------------------------------------------
// Portas públicas: origem, token do servidor, limite por IP, tamanho do corpo e log.
// ---------------------------------------------------------------------------
/** Entregue = chegou ao CRM ou à planilha. Descartado como robô = 200 sem nada enviado. */
const entregue = (r) => r.status === 200 && r.corpo.ok === true && (r.chamadas.length + r.gravadas.length) > 0;
const descartado = (r) => r.status === 200 && r.corpo.ok === true && r.chamadas.length === 0 && r.gravadas.length === 0;

console.log('\nORIGEM: lista exata, sem curinga');
{
  const casos = [
    ['preview *.vercel.app recusado', 'https://hachiroku-git-main-equipe.vercel.app', {}, 403],
    ['outro *.vercel.app recusado', 'https://golpe.vercel.app', {}, 403],
    ['dominio parecido recusado', 'https://hachiroku.com.br.golpe.example', {}, 403],
    ['http do dominio recusado', 'http://hachiroku.com.br', {}, 403],
    ['sem Origin recusado', '', {}, 403],
    ['www aceito', 'https://www.hachiroku.com.br', {}, 200],
    ['origem extra da env aceita', 'https://preview-fixo.hachiroku.com.br', { COTACAO_ORIGENS_EXTRAS: ' https://preview-fixo.hachiroku.com.br/ , http://inseguro.example' }, 200],
    ['extra exata de um preview aceita (so ela)', 'https://hachiroku-abc123.vercel.app', { COTACAO_ORIGENS_EXTRAS: 'https://hachiroku-abc123.vercel.app' }, 200],
    ['outro preview com extra definida recusado', 'https://hachiroku-zzz999.vercel.app', { COTACAO_ORIGENS_EXTRAS: 'https://hachiroku-abc123.vercel.app' }, 403],
    ['extra em http ignorada', 'http://inseguro.example', { COTACAO_ORIGENS_EXTRAS: 'http://inseguro.example' }, 403],
    ['extra com curinga ignorada', 'https://x.vercel.app', { COTACAO_ORIGENS_EXTRAS: 'https://*.vercel.app' }, 403],
    ['localhost em dev (fora da Vercel) aceito', 'http://localhost:4321', {}, 200],
    ['localhost no vercel dev aceito', 'http://localhost:3000', { VERCEL_ENV: 'development' }, 200],
    ['localhost em producao recusado', 'http://localhost:4321', { VERCEL_ENV: 'production' }, 403],
    ['localhost em preview recusado', 'http://localhost:4321', { VERCEL_ENV: 'preview' }, 403],
    ['localhost com NODE_ENV production recusado', 'http://localhost:4321', { NODE_ENV: 'production' }, 403],
  ];
  for (const [nome, origem, extra, esperado] of casos) {
    const r = await rodar(valido, { origem, env: { ...ENV_AMBOS, ...extra } });
    const ok = esperado === 200 ? entregue(r) : r.status === 403 && r.chamadas.length === 0 && r.gravadas.length === 0;
    checar(`${nome} -> ${esperado}`, ok, `(${r.status})`);
  }
}

console.log('\nTOKEN DO SERVIDOR (GET /api/cotacao/)');
{
  const get = await rodar(null, { metodo: 'GET', env: ENV_AMBOS });
  checar('GET devolve 200 com { token }', get.status === 200 && typeof get.corpo.token === 'string' && Object.keys(get.corpo).length === 1, `(${get.status})`);
  checar('GET com Cache-Control no-store', get.cabecalhos.get('cache-control') === 'no-store', `(${get.cabecalhos.get('cache-control')})`);
  checar('GET nao chama CRM nem planilha', get.chamadas.length === 0 && get.gravadas.length === 0);
  const t = get.corpo.token ?? '';
  const decodificado = Buffer.from(t, 'base64url').toString('utf8');
  checar('token = base64url("<ms>.<aleatorio>.<HMAC>")', /^\d{13}\.[A-Za-z0-9_-]{22}\.[A-Za-z0-9_-]{43}$/.test(decodificado), `(${decodificado})`);
  checar('token sem o segredo', !decodificado.includes(SEGREDO) && !t.includes(SEGREDO));
  const ms = Number(decodificado.split('.')[0]);
  checar('token confere 3 s depois', conferirToken(t, SEGREDO, ms + 3000).ok === true);
  checar('token nao confere com outro segredo', conferirToken(t, 'outro-segredo-qualquer-123', ms + 3000).ok === false);
  const doisGets = await rodar(null, { metodo: 'GET', env: ENV_AMBOS });
  checar('cada GET devolve um token diferente', doisGets.corpo.token !== t);

  for (const [nome, env] of [['sem COTACAO_SEGREDO', { ...ENV_AMBOS, COTACAO_SEGREDO: '' }], ['COTACAO_SEGREDO curto (< 16)', { ...ENV_AMBOS, COTACAO_SEGREDO: 'curto-Kx9' }]]) {
    const g = await rodar(null, { metodo: 'GET', env });
    const p = await rodar(valido, { env });
    checar(`${nome}: GET e POST -> 503, nada enviado`, g.status === 503 && p.status === 503 && p.chamadas.length === 0 && p.gravadas.length === 0, `(${g.status} ${p.status})`);
    checar(`${nome}: log diz o motivo sem o valor`, p.log.includes('COTACAO_SEGREDO ausente ou com menos de 16') && !p.log.includes('curto-Kx9'), `(${p.log})`);
  }

  const crua = Buffer.from(tokenValido(), 'base64url').toString('utf8').split('.');
  const adulterado = Buffer.from(`${Number(crua[0]) - 60_000}.${crua[1]}.${crua[2]}`).toString('base64url');
  const casos = [
    ['token ausente', null, 'token ausente'],
    ['token vazio', '', 'token ausente'],
    ['token lixo', 'abc', 'token inválido'],
    ['token com caractere fora do base64url', `${tokenValido()}!`, 'token inválido'],
    ['token forjado (outro segredo)', tokenValido(10_000, 'segredo-do-atacante-123456'), 'token inválido'],
    ['token adulterado (horario mudado, mesma assinatura)', adulterado, 'token inválido'],
    ['token gigante', 'A'.repeat(300), 'token inválido'],
    ['token novo demais (0 s)', tokenValido(0), 'token novo demais'],
    ['token novo demais (2,4 s)', tokenValido(2400), 'token novo demais'],
    ['token do futuro', tokenValido(-60_000), 'token novo demais'],
    ['token velho demais (2 h e 1 s)', tokenValido(VALIDADE_TOKEN_MS + 1000), 'token vencido'],
  ];
  for (const [nome, token, motivo] of casos) {
    const r = await rodar(valido, { env: ENV_AMBOS, token });
    checar(`${nome}: resposta de robo (200) e nada enviado`, descartado(r), `(${r.status} ${r.chamadas.length}/${r.gravadas.length})`);
    checar(`${nome}: log com o motivo (${motivo})`, r.log.includes(`descartado como robô (${motivo})`), `(${r.log})`);
  }
  const imediato = await rodar(valido, { env: ENV_AMBOS, token: get.corpo.token });
  checar('token do GET usado na hora (robo rapido): descartado', descartado(imediato));
  for (const [nome, idade] of [['2,6 s', 2600], ['1 h 59 min', VALIDADE_TOKEN_MS - 60_000]]) {
    const r = await rodar(valido, { env: ENV_AMBOS, token: tokenValido(idade) });
    checar(`token valido com ${nome}: aceito e enviado ao CRM`, entregue(r) && r.chamadas.length === 1, `(${r.status} ${r.chamadas.length})`);
  }

  const usados = criarTokensUsados();
  const unico = tokenValido();
  const primeiro = await rodar(valido, { env: ENV_AMBOS, token: unico, tokensUsados: usados });
  const repeticao = await rodar(valido, { env: ENV_AMBOS, token: unico, tokensUsados: usados });
  checar('mesmo token num segundo pedido: o primeiro entra, o segundo e descartado', entregue(primeiro) && descartado(repeticao) && repeticao.log.includes('token já usado'), `(${repeticao.log})`);
  const usados502 = criarTokensUsados();
  const deNovo = tokenValido();
  const r502 = await rodar(valido, { env: ENV_CRM, crm: crmFalso(500), token: deNovo, tokensUsados: usados502 });
  const retentativa = await rodar(valido, { env: ENV_CRM, crm: crmFalso(201), token: deNovo, tokensUsados: usados502 });
  checar('depois de um 502 o visitante tenta de novo com o mesmo token e entra', r502.status === 502 && entregue(retentativa), `(${r502.status} ${retentativa.status})`);
  const usados422 = criarTokensUsados();
  const t422 = tokenValido();
  const r422 = await rodar({ ...valido, cep: '123' }, { env: ENV_AMBOS, token: t422, tokensUsados: usados422 });
  const corrigido = await rodar(valido, { env: ENV_AMBOS, token: t422, tokensUsados: usados422 });
  checar('depois de um 422 o visitante corrige e entra com o mesmo token', r422.status === 422 && entregue(corrigido), `(${r422.status} ${corrigido.status})`);
}

console.log('\nLIMITE POR IP (5 envios a cada 10 min, por instancia)');
{
  checar('limite = 5 por 10 min', LIMITE_POR_IP === 5 && JANELA_LIMITE_MS === 600_000);
  const limitador = criarLimitador();
  const ip = { 'x-forwarded-for': '203.0.113.7, 10.0.0.1' };
  const seis = [];
  for (let i = 0; i < 6; i += 1) seis.push(await rodar(valido, { env: ENV_AMBOS, cabecalhos: ip, limitador }));
  checar('5 primeiros envios do mesmo IP entram', seis.slice(0, 5).every(entregue), `(${seis.map((r) => r.status)})`);
  const sexto = seis[5];
  checar('6o envio do mesmo IP -> 429, nada enviado', sexto.status === 429 && sexto.chamadas.length === 0 && sexto.gravadas.length === 0, `(${sexto.status})`);
  checar('429 com mensagem generica', sexto.corpo.ok === false && /Tente de novo mais tarde/.test(sexto.corpo.erro ?? ''), `(${sexto.corpo.erro})`);
  const outro = await rodar(valido, { env: ENV_AMBOS, cabecalhos: { 'x-forwarded-for': '203.0.113.8' }, limitador });
  checar('outro IP segue entrando', entregue(outro), `(${outro.status})`);
  const proxies = criarLimitador();
  const viaProxy = [];
  for (let i = 0; i < 6; i += 1) viaProxy.push(await rodar(valido, { env: ENV_AMBOS, cabecalhos: { 'x-forwarded-for': `198.51.100.9, 10.1.0.${i}` }, limitador: proxies }));
  checar('conta pelo PRIMEIRO valor do x-forwarded-for', viaProxy[5].status === 429, `(${viaProxy.map((r) => r.status)})`);
  const real = criarLimitador();
  const viaReal = [];
  for (let i = 0; i < 6; i += 1) viaReal.push(await rodar(valido, { env: ENV_AMBOS, cabecalhos: { 'x-forwarded-for': '', 'x-real-ip': '192.0.2.44' }, limitador: real }));
  checar('sem x-forwarded-for, conta pelo x-real-ip', viaReal.slice(0, 5).every(entregue) && viaReal[5].status === 429, `(${viaReal.map((r) => r.status)})`);
  const reais = criarLimitador();
  const distintos = [];
  for (let i = 0; i < 6; i += 1) distintos.push(await rodar(valido, { env: ENV_AMBOS, cabecalhos: { 'x-forwarded-for': '', 'x-real-ip': `192.0.2.${100 + i}` }, limitador: reais }));
  checar('x-real-ip diferentes nao dividem a mesma cota', distintos.every(entregue), `(${distintos.map((r) => r.status)})`);
  const janela = criarLimitador();
  const t0 = 1_800_000_000_000;
  const res = [];
  for (let i = 0; i < 5; i += 1) res.push(janela.permitir('ip', t0 + i * 60_000));
  res.push(janela.permitir('ip', t0 + 9 * 60_000), janela.permitir('ip', t0 + 10 * 60_000 - 1), janela.permitir('ip', t0 + 10 * 60_000), janela.permitir('ip', t0 + 10 * 60_000 + 1));
  checar('janela deslizante: libera um envio quando o mais antigo sai da janela', JSON.stringify(res) === JSON.stringify([true, true, true, true, true, false, false, true, false]), `(${res})`);
  const pequeno = criarLimitador({ maxChaves: 3 });
  for (const k of ['a', 'b', 'c', 'd', 'e']) pequeno.permitir(k, t0);
  checar('mapa de IPs com teto (nao cresce sem limite)', pequeno.tamanho === 3, `(${pequeno.tamanho})`);
}

console.log('\nCORPO: teto de 8 KB em bytes');
{
  checar('MAX_BYTES = 8 KB', MAX_BYTES === 8192);
  const nove = JSON.stringify({ ...valido, token: tokenValido(), pagina: `/x/${'a'.repeat(9 * 1024)}` });
  const r9 = await rodar(nove, { env: ENV_AMBOS });
  checar('corpo de 9 KB (sem Content-Length) -> 413, nada enviado', r9.status === 413 && r9.chamadas.length === 0 && r9.gravadas.length === 0, `(${r9.status})`);
  const declarado = await rodar(valido, { env: ENV_AMBOS, cabecalhos: { 'content-length': '9216' } });
  checar('Content-Length declarado acima de 8 KB -> 413 sem ler', declarado.status === 413 && declarado.chamadas.length === 0, `(${declarado.status})`);
  const acentos = JSON.stringify({ ...valido, token: tokenValido(), carro: `HB20 ${'ã'.repeat(4100)}` });
  const ra = await rodar(acentos, { env: ENV_AMBOS });
  checar(`conta BYTES, nao caracteres (${acentos.length} caracteres, ${Buffer.byteLength(acentos)} bytes) -> 413`, Buffer.byteLength(acentos) > 8192 && acentos.length < 8192 && ra.status === 413, `(${ra.status})`);
  const sete = JSON.stringify({ ...valido, token: tokenValido(), pagina: `/x/${'a'.repeat(7 * 1024)}` });
  const r7 = await rodar(sete, { env: ENV_AMBOS });
  checar(`corpo de ${Buffer.byteLength(sete)} bytes (abaixo de 8 KB) entra`, entregue(r7), `(${r7.status})`);
}

console.log('\nLOG DA RESERVA: codigo fixo, nunca a mensagem crua');
{
  const vazado = 'trecho-secreto-da-chave-XY77';
  const envQuebrado = { ...ENV_SEGREDO, GOOGLE_SA_JSON: `{"private_key": ${vazado}}`, COTACAO_SHEET_ID: 'x' };
  let mensagemCrua = '';
  try { JSON.parse(envQuebrado.GOOGLE_SA_JSON); } catch (e) { mensagemCrua = e.message; }
  const r = await rodar(valido, { env: envQuebrado, gravar: gravarLinha });
  checar('GOOGLE_SA_JSON quebrado: 502', r.status === 502, `(${r.status})`);
  checar('log diz "GOOGLE_SA_JSON inválido"', r.log.includes('falha ao gravar na reserva (GOOGLE_SA_JSON inválido)'), `(${r.log})`);
  checar('a mensagem crua do JSON.parse ecoa trecho da chave (premissa do teste)', mensagemCrua.includes(vazado.slice(0, 10)), `(${mensagemCrua})`);
  checar('log sem a mensagem crua do JSON.parse nem trecho da chave', !r.log.includes(vazado.slice(0, 10)) && !r.log.includes('_key') && !r.log.includes(mensagemCrua), `(${r.log})`);
  const http = await rodar(valido, { env: ENV_PLANILHA, gravar: async () => { throw Object.assign(new Error('Sheets append HTTP 403 Maria'), { status: 403 }); } });
  checar('falha HTTP do Sheets: log so com o codigo', http.log.includes('falha ao gravar na reserva (Sheets HTTP 403)') && !http.log.includes('Maria'), `(${http.log})`);
}

// ---------------------------------------------------------------------------
// Google (token + Sheets), Resend e CRM falsos num único fetch injetado.
// A planilha falsa guarda as abas em memória e entende a notação A1 usada pelo código.
// ---------------------------------------------------------------------------
const { privateKey: CHAVE_PRIVADA_TESTE } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  publicKeyEncoding: { type: 'spki', format: 'pem' },
});
const SA_TESTE = JSON.stringify({ client_email: 'gate@teste.iam.gserviceaccount.com', private_key: CHAVE_PRIVADA_TESTE });
const RESEND_FALSA = 're_chave_falsa_de_teste_123';
const ADMIN_FALSO = 'admin.gate@exemplo.com';
const ENV_ALERTA = { ...ENV_CRM, GOOGLE_SA_JSON: SA_TESTE, COTACAO_SHEET_ID: 'planilha-teste', RESEND_API_KEY: RESEND_FALSA, EMAIL_ADMIN: ADMIN_FALSO };
const SEGREDO_CRON = 'segredo-do-cron-com-32-caracteres!';
const ENV_RETENCAO = { GOOGLE_SA_JSON: SA_TESTE, COTACAO_SHEET_ID: 'planilha-teste', CRON_SECRET: SEGREDO_CRON };

const colunaN = (s) => s.split('').reduce((a, ch) => a * 26 + ch.charCodeAt(0) - 64, 0) - 1;
function lerFaixa(texto) {
  const m = /^'((?:[^']|'')+)'!([A-Z]+)(\d*)(?::([A-Z]+)(\d*))?$/.exec(texto);
  if (!m) throw new Error(`faixa inesperada: ${texto}`);
  const r1 = m[3] ? Number(m[3]) - 1 : 0;
  const r2 = m[5] ? Number(m[5]) - 1 : (m[3] && !m[4] ? r1 : Infinity);
  return { aba: m[1].replace(/''/g, "'"), c1: colunaN(m[2]), c2: colunaN(m[4] ?? m[2]), r1, r2 };
}
const aparar = (linha) => { const l = [...linha]; while (l.length && (l[l.length - 1] ?? '') === '') l.pop(); return l; };

/**
 * Mundo falso. `abas`: { titulo: linhas[][] }. `crm(corpo, n)` decide o status do CRM;
 * `resend(n)` o do Resend (ou uma Promise, para simular o Resend parado);
 * `aoGravarControle()` roda depois de cada escrita na aba Controle (simula outra instância).
 */
function mundoFalso({ abas = {}, crm = () => 201, resend = () => 200, aoGravarControle, sheetsFalha } = {}) {
  const planilha = new Map(Object.entries(abas).map(([t, linhas], i) => [t, { sheetId: 100 + i, linhas: linhas.map((l) => [...l]) }]));
  const chamadas = { token: 0, sheets: [], resend: [], crm: [] };
  const resposta = (status, corpo = {}) => new Response(JSON.stringify(corpo), { status, headers: { 'content-type': 'application/json' } });
  const buscar = async (endereco, init = {}) => {
    const url = new URL(endereco);
    if (url.host === 'oauth2.googleapis.com') { chamadas.token += 1; return resposta(200, { access_token: 'tok-teste', expires_in: 3600 }); }
    if (url.host === 'api.resend.com') {
      chamadas.resend.push({ init, corpo: JSON.parse(init.body) });
      const s = resend(chamadas.resend.length);
      if (s instanceof Promise) return new Promise((_, rejeitar) => init.signal?.addEventListener('abort', () => rejeitar(init.signal.reason)));
      return resposta(s, { id: 'x' });
    }
    if (url.host === 'sheets.googleapis.com') {
      chamadas.sheets.push({ metodo: init.method ?? 'GET', caminho: decodeURIComponent(url.pathname), autorizacao: init.headers?.Authorization });
      if (sheetsFalha) return resposta(sheetsFalha);
      const [, resto] = url.pathname.split('/v4/spreadsheets/');
      if (resto.endsWith(':batchUpdate')) {
        for (const pedidoLote of JSON.parse(init.body).requests) {
          if (pedidoLote.addSheet) planilha.set(pedidoLote.addSheet.properties.title, { sheetId: 900, linhas: [] });
          if (pedidoLote.deleteDimension) {
            const { sheetId, startIndex, endIndex } = pedidoLote.deleteDimension.range;
            const aba = [...planilha.values()].find((a) => a.sheetId === sheetId);
            aba.linhas.splice(startIndex, endIndex - startIndex);
          }
        }
        return resposta(200, {});
      }
      if (!resto.includes('/values/')) {
        return resposta(200, { sheets: [...planilha.entries()].map(([title, a]) => ({ properties: { sheetId: a.sheetId, title } })) });
      }
      const f = lerFaixa(decodeURIComponent(resto.split('/values/')[1]));
      const aba = planilha.get(f.aba);
      if (!aba) return resposta(400, { error: { message: 'Unable to parse range' } });
      if ((init.method ?? 'GET') === 'PUT') {
        JSON.parse(init.body).values.forEach((linha, i) => {
          const destino = (aba.linhas[f.r1 + i] ??= []);
          linha.forEach((v, j) => { while (destino.length < f.c1 + j) destino.push(''); destino[f.c1 + j] = v; });
        });
        for (let i = 0; i < aba.linhas.length; i += 1) aba.linhas[i] ??= [];
        if (f.aba === 'Controle') aoGravarControle?.(planilha);
        return resposta(200, {});
      }
      const fim = f.r2 === Infinity ? undefined : f.r2 + 1;
      const valores = aba.linhas.slice(f.r1, fim).map((l) => aparar((l ?? []).slice(f.c1, f.c2 + 1)));
      while (valores.length && valores[valores.length - 1].length === 0) valores.pop();
      return resposta(200, valores.length ? { values: valores } : {});
    }
    // CRM
    const corpo = JSON.parse(init.body);
    chamadas.crm.push({ url: endereco, init, corpo });
    return resposta(crm(corpo, chamadas.crm.length), {});
  };
  return { buscar, chamadas, planilha, linhas: (t) => planilha.get(t)?.linhas ?? null };
}

/** Roda `fn` com console.log e console.error capturados. */
async function capturar(fn) {
  const logs = [];
  const [log, erro] = [console.log, console.error];
  console.log = (...p) => { logs.push(p.map(String).join(' ')); };
  console.error = (...p) => { logs.push(p.map(String).join(' ')); };
  try {
    return { valor: await fn(), log: logs.join('\n') };
  } finally {
    console.log = log;
    console.error = erro;
  }
}
const semSegredo = (texto) => ![RESEND_FALSA, ADMIN_FALSO, SEGREDO_CRON, 'tok-teste', 'PRIVATE KEY'].some((t) => texto.includes(t));

console.log('\nALERTA DE RESERVA (D12): e-mail ao admin sem dado do lead, no maximo um por hora');
{
  const semVar = await rodar(valido, { env: ENV_AMBOS, crm: crmFalso(500) });
  checar('sem RESEND_API_KEY/EMAIL_ADMIN: so registra no log', semVar.log.includes('alerta de reserva só no log') && semVar.log.includes('HTTP 500'), `(${semVar.log})`);
  checar('sem as variaveis: nenhuma chamada alem do CRM', semVar.chamadas.length === 1);

  const m = mundoFalso({ abas: { Controle: [] }, crm: () => 500 });
  const pedidos = [];
  const duas = await capturar(async () => {
    const r1 = await tratar(pedido(valido), ENV_ALERTA, async (l) => { pedidos.push(l); }, { fetch: m.buscar });
    const r2 = await tratar(pedido(valido), ENV_ALERTA, async (l) => { pedidos.push(l); }, { fetch: m.buscar });
    return [r1.status, r2.status];
  });
  checar('dois pedidos na reserva na mesma hora: visitante recebe 200 nos dois', duas.valor[0] === 200 && duas.valor[1] === 200, `(${duas.valor})`);
  checar('dois pedidos na reserva: as duas linhas gravadas', pedidos.length === 2);
  checar('dois pedidos na mesma hora: UM e-mail so', m.chamadas.resend.length === 1, `(${m.chamadas.resend.length})`);
  const email = m.chamadas.resend[0] ?? { init: { headers: {} }, corpo: {} };
  checar('e-mail vai ao Resend com a chave e User-Agent', email.init.headers.Authorization === `Bearer ${RESEND_FALSA}` && Boolean(email.init.headers['User-Agent']));
  checar('e-mail com Idempotency-Key', /^alerta-reserva-[0-9a-f-]{36}$/.test(email.init.headers['Idempotency-Key'] ?? ''));
  checar('e-mail para EMAIL_ADMIN', JSON.stringify(email.corpo.to) === JSON.stringify([ADMIN_FALSO]));
  checar('e-mail diz a hora e o motivo', /Pedido na reserva desde \d{2}:\d{2} .*motivo: HTTP 500\./.test(email.corpo.text ?? ''), `(${email.corpo.text?.split('\n')[0]})`);
  checar('e-mail SEM dado do lead (nome, telefone, e-mail, carro, CEP, pagina)', semDadoPessoal(JSON.stringify(email.corpo)) && !JSON.stringify(email.corpo).includes(valido.pagina));
  checar('e-mail so em texto (sem html)', !('html' in email.corpo));
  checar('e-mail sem travessao', !/[\u2013\u2014]/.test(`${email.corpo.subject}${email.corpo.text}`));
  checar('marca do alerta na aba Controle', /^\d{4}-\d{2}-\d{2}T.+Z [0-9a-f-]{36}$/.test(m.linhas('Controle')?.[0]?.[1] ?? ''), `(${m.linhas('Controle')?.[0]})`);
  checar('Sheets chamado com o token da service account', m.chamadas.sheets.length > 0 && m.chamadas.sheets.every((c) => c.autorizacao === 'Bearer tok-teste'));
  checar('log do alerta sem dado pessoal, sem chave e sem o e-mail do admin', semDadoPessoal(duas.log) && semSegredo(duas.log));

  const base = new Date('2026-10-07T12:00:00Z');
  const h = mundoFalso({ abas: { Controle: [] } });
  const seq = await capturar(async () => [
    await alertarReserva('HTTP 401', ENV_ALERTA, { fetch: h.buscar, agora: base }),
    await alertarReserva('HTTP 401', ENV_ALERTA, { fetch: h.buscar, agora: new Date(base.getTime() + 59 * 60_000) }),
    await alertarReserva('HTTP 401', ENV_ALERTA, { fetch: h.buscar, agora: new Date(base.getTime() + 61 * 60_000) }),
  ]);
  checar('alerta: envia, segura dentro da hora, envia de novo depois de 1 h', JSON.stringify(seq.valor) === JSON.stringify(['enviado', 'ja-avisado', 'enviado']), `(${seq.valor})`);
  checar('alerta: hora no fuso de Brasilia (09:00)', Boolean(h.chamadas.resend[0]?.corpo?.text?.includes('desde 09:00')), `(${h.chamadas.resend[0]?.corpo?.text?.split('\n')[0]})`);

  const semAba = mundoFalso({ abas: {} });
  const r = await capturar(() => alertarReserva('HTTP 500', ENV_ALERTA, { fetch: semAba.buscar, agora: base }));
  checar('sem a aba Controle: cria a aba e envia', r.valor === 'enviado' && semAba.linhas('Controle') !== null, `(${r.valor})`);

  const falhaResend = mundoFalso({ abas: { Controle: [] }, resend: (n) => (n === 1 ? 500 : 200) });
  const fr = await capturar(async () => [
    await alertarReserva('HTTP 500', ENV_ALERTA, { fetch: falhaResend.buscar, agora: base }),
    await alertarReserva('HTTP 500', ENV_ALERTA, { fetch: falhaResend.buscar, agora: new Date(base.getTime() + 60_000) }),
  ]);
  checar('Resend falha: marca desfeita e o pedido seguinte tenta de novo', JSON.stringify(fr.valor) === JSON.stringify(['falha', 'enviado']), `(${fr.valor})`);
  checar('Resend falha: log com o codigo', fr.log.includes('recusado pelo Resend (HTTP 500)'), `(${fr.log})`);

  const corrida = mundoFalso({
    abas: { Controle: [] },
    aoGravarControle: (p) => { p.get('Controle').linhas[0] = ['Último alerta de reserva', `${base.toISOString()} outra-instancia`]; },
  });
  const c = await capturar(() => alertarReserva('HTTP 500', ENV_ALERTA, { fetch: corrida.buscar, agora: base }));
  checar('outra instancia marcou no meio: esta desiste e nao manda e-mail', c.valor === 'ja-avisado' && corrida.chamadas.resend.length === 0, `(${c.valor})`);

  const sheetsFora = mundoFalso({ sheetsFalha: 403 });
  const sf = await capturar(() => alertarReserva('HTTP 500', ENV_ALERTA, { fetch: sheetsFora.buscar, agora: base }));
  checar('controle ilegivel (Sheets 403): nao manda e-mail sem controle', sf.valor === 'falha' && sheetsFora.chamadas.resend.length === 0 && sf.log.includes('Sheets HTTP 403'), `(${sf.valor} ${sf.log})`);

  const lento = mundoFalso({ abas: { Controle: [] }, resend: () => new Promise(() => {}) });
  const t0 = Date.now();
  const lr = await capturar(() => alertarReserva('HTTP 500', ENV_ALERTA, { fetch: lento.buscar, agora: base, tempoLimiteMs: 80 }));
  checar('Resend parado: desiste no tempo limite', lr.valor === 'falha' && Date.now() - t0 < 2000 && lr.log.includes('tempo esgotado'), `(${lr.valor})`);
  checar('tempo limite do alerta <= 5 s', TEMPO_LIMITE_ALERTA_MS <= 5000);

  const ruim = mundoFalso({ abas: { Controle: [] }, crm: () => 500, sheetsFalha: 500 });
  const rr = await capturar(() => tratar(pedido(valido), ENV_ALERTA, async () => {}, { fetch: ruim.buscar }));
  checar('alerta falhando nao derruba o pedido: visitante recebe 200', rr.valor.status === 200, `(${rr.valor.status})`);
  const okCrm = mundoFalso({ abas: { Controle: [] }, crm: () => 201 });
  await capturar(() => tratar(pedido(valido), ENV_ALERTA, async () => {}, { fetch: okCrm.buscar }));
  checar('CRM confirmou: nenhum alerta', okCrm.chamadas.resend.length === 0 && okCrm.chamadas.sheets.length === 0);
}

console.log('\nRETENCAO DA PLANILHA (api/retencao-planilha.js)');
{
  const cfg = fs.readFileSync('src/config/cotacao-seguro.ts', 'utf8');
  const meses = Number(cfg.match(/retencaoMeses:\s*(\d+)/)?.[1]);
  checar('RETENCAO_MESES igual a retencaoMeses da config', meses === RETENCAO_MESES, `(${meses} x ${RETENCAO_MESES})`);
  const vercel = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  const cron = (vercel.crons ?? []).find((c) => c.path.startsWith('/api/retencao-planilha'));
  checar('vercel.json: cron da retencao com barra final (o Cron nao segue redirecionamento)', cron?.path === '/api/retencao-planilha/', `(${cron?.path})`);
  checar('vercel.json: uma vez por dia (compativel com o Hobby)', /^\d{1,2} \d{1,2} \* \* \*$/.test(cron?.schedule ?? ''), `(${cron?.schedule})`);
  checar('vercel.json: trailingSlash, redirects e headers mantidos', vercel.trailingSlash === true && vercel.redirects?.length > 0 && vercel.headers?.length > 0);
  const fonte = fs.readFileSync('api/retencao-planilha.js', 'utf8');
  checar('CRON_SECRET comparado em tempo constante (timingSafeEqual)', /timingSafeEqual\(/.test(fonte) && !/authorization'\)\s*[!=]==/.test(fonte));

  const agora = new Date('2026-10-07T12:00:00Z');
  const linha = (data, nome, status = 'Reserva') => [data, nome, '(31) 98765-4321', '', '30140-071', 'Carro', '2021', 'nao tenho', '/x/', 'h2-1', '2026-10-06', status, crypto.randomUUID()];
  const semente = () => ({
    Pedidos: [
      COLUNAS,
      linha('2025-09-01 10:00:00', 'Treze Meses'),
      linha('2025-10-06 08:59:59', 'Doze Meses e Um Dia'),
      linha('2025-11-07 10:00:00', 'Onze Meses'),
      linha('data torta', 'Sem Data'),
      linha('2025-08-01 10:00:00', '', 'Enviado ao CRM'),
      linha('2026-10-06 10:00:00', 'Ontem'),
    ],
  });
  const pedidoCron = (autorizacao, metodo = 'GET') => new Request('https://hachiroku.com.br/api/retencao-planilha/', {
    method: metodo, headers: autorizacao === undefined ? {} : { authorization: autorizacao },
  });
  const casos = [
    ['sem CRON_SECRET', { ...ENV_RETENCAO, CRON_SECRET: '' }, `Bearer ${SEGREDO_CRON}`, 503],
    ['CRON_SECRET curto (< 16)', { ...ENV_RETENCAO, CRON_SECRET: 'curto' }, 'Bearer curto', 503],
    ['sem Authorization', ENV_RETENCAO, undefined, 401],
    ['segredo errado', ENV_RETENCAO, 'Bearer segredo-errado-com-tamanho-bom!!', 401],
    ['segredo com sobra no fim', ENV_RETENCAO, `Bearer ${SEGREDO_CRON}x`, 401],
    ['so o comeco do segredo', ENV_RETENCAO, `Bearer ${SEGREDO_CRON.slice(0, 20)}`, 401],
    ['segredo sem "Bearer"', ENV_RETENCAO, SEGREDO_CRON, 401],
    ['Bearer vazio', ENV_RETENCAO, 'Bearer ', 401],
  ];
  for (const [nome, env, auth, esperado] of casos) {
    const m = mundoFalso({ abas: semente() });
    const r = await capturar(() => tratarRetencao(pedidoCron(auth), env, { fetch: m.buscar, agora }));
    checar(`retencao ${nome} -> ${esperado}, planilha intocada`, r.valor.status === esperado && m.chamadas.sheets.length === 0 && m.linhas('Pedidos').length === 7, `(${r.valor.status})`);
  }
  const post = await capturar(() => tratarRetencao(pedidoCron(`Bearer ${SEGREDO_CRON}`, 'POST'), ENV_RETENCAO, { fetch: mundoFalso().buscar }));
  checar('retencao POST -> 405', post.valor.status === 405);
  const semPlanilha = await capturar(() => tratarRetencao(pedidoCron(`Bearer ${SEGREDO_CRON}`), { CRON_SECRET: SEGREDO_CRON }, { fetch: mundoFalso().buscar }));
  checar('retencao sem planilha configurada -> 503', semPlanilha.valor.status === 503);

  const m = mundoFalso({ abas: semente() });
  const r = await capturar(async () => {
    const resp = await tratarRetencao(pedidoCron(`Bearer ${SEGREDO_CRON}`), ENV_RETENCAO, { fetch: m.buscar, agora });
    return { status: resp.status, corpo: await resp.json() };
  });
  const nomes = m.linhas('Pedidos').map((l) => l[1]);
  checar('retencao com o segredo: 200 e 3 linhas apagadas', r.valor.status === 200 && r.valor.corpo.apagadas === 3, `(${JSON.stringify(r.valor)})`);
  checar('apaga as linhas com mais de 12 meses (inclusive ja enviadas)', !nomes.includes('Treze Meses') && !nomes.includes('Doze Meses e Um Dia') && m.linhas('Pedidos').every((l) => l[11] !== 'Enviado ao CRM'), `(${nomes})`);
  checar('mantem cabecalho, linha de 11 meses, recente e sem data', nomes.join('|') === ['Nome', 'Onze Meses', 'Sem Data', 'Ontem'].join('|'), `(${nomes})`);
  checar('log da retencao so com contagem', r.log.includes('3 linha(s)') && semDadoPessoal(r.log) && !r.log.includes('Meses') && semSegredo(r.log), `(${r.log})`);

  m.planilha.get('Pedidos').linhas.splice(1, 0, linha('2024-01-01 10:00:00', 'Velha Nova'));
  const dup = await capturar(async () => (await tratarRetencao(pedidoCron(`Bearer ${SEGREDO_CRON}`), ENV_RETENCAO, { fetch: m.buscar, agora: new Date(agora.getTime() + 60_000) })).json());
  checar('chamada repetida em menos de 10 min (Cron duplicado): nao apaga nada', dup.valor.ignorada === true && m.linhas('Pedidos').some((l) => l[1] === 'Velha Nova'), `(${JSON.stringify(dup.valor)})`);
  checar('segredoConfere: certo / errado / vazio', segredoConfere(`Bearer ${SEGREDO_CRON}`, SEGREDO_CRON) && !segredoConfere(`Bearer ${SEGREDO_CRON}`, '') && !segredoConfere('Bearer ', SEGREDO_CRON));
}

console.log('\nREENVIO DA RESERVA (scripts/reenviar-planilha.mjs)');
{
  const ID_A = '11111111-1111-4111-8111-111111111111';
  const ID_B = '22222222-2222-4222-8222-222222222222';
  const ID_C = '33333333-3333-4333-8333-333333333333';
  const reserva = (id, nome, extra = {}) => {
    const l = ['2026-10-05 14:30:12', nome, '(31) 98765-4321', 'maria@exemplo.com', '30140-071', 'Hyundai HB20S', '2021', 'nao tenho',
      '/problemas/hyundai/hb20s/consumo-alto-combustivel/', 'h2-1', '2026-09-01', 'Reserva', id];
    for (const [k, v] of Object.entries(extra)) l[COLUNAS.indexOf(k)] = v;
    return l;
  };
  const semente = () => ({
    Pedidos: [
      COLUNAS,
      reserva(ID_A, "'=Maria Souza"),
      ['2026-10-01 10:00:00', '', '', '', '', '', '', '', '', '', '', 'Enviado ao CRM', '44444444-4444-4444-8444-444444444444'],
      reserva(ID_B, 'Maria Souza'),
      reserva('nao-e-uuid', 'Maria Souza'),
      reserva(ID_C, 'Maria Souza', { Status: 'Teste' }),
    ],
  });
  const ja = new Set([ID_B]);
  const env = { ...ENV_CRM, GOOGLE_SA_JSON: SA_TESTE, COTACAO_SHEET_ID: 'planilha-teste' };
  const logs = [];
  const log = (t) => logs.push(t);

  const ensaio = mundoFalso({ abas: semente() });
  const re = await reenviar(env, { fetch: ensaio.buscar, log });
  checar('ensaio: conta 3 linhas Reserva e nao envia nem altera nada', re.reserva === 3 && ensaio.chamadas.crm.length === 0 && ensaio.chamadas.sheets.every((c) => c.metodo === 'GET'), `(${JSON.stringify(re)})`);

  const m = mundoFalso({ abas: semente(), crm: (corpo) => (ja.has(corpo.id_externo) ? 200 : (ja.add(corpo.id_externo), 201)) });
  const r = await reenviar(env, { fetch: m.buscar, enviar: true, log });
  checar('envia as 2 linhas validas (201 e 200 ja recebido)', r.enviados === 2 && m.chamadas.crm.length === 2, `(${JSON.stringify(r)})`);
  checar('linha com id_externo invalido fica na reserva e e reportada', r.falhas.length === 1 && r.falhas[0].linha === 5 && m.linhas('Pedidos')[4][11] === 'Reserva', `(${JSON.stringify(r.falhas)})`);
  const a = m.chamadas.crm[0]?.corpo ?? {};
  checar('POST com a chave do CRM', m.chamadas.crm[0]?.init?.headers?.Authorization === `Bearer ${CHAVE_FALSA}` && m.chamadas.crm[0]?.url === 'https://crm.exemplo.com.br/api/v1/leads');
  checar('contrato: mesmos campos do envio direto',
    JSON.stringify(Object.keys(a).sort()) === JSON.stringify(['consentimento', 'dados', 'email', 'id_externo', 'nome', 'origem', 'telefone']), `(${Object.keys(a)})`);
  checar('id_externo da linha (idempotente no CRM)', a.id_externo === ID_A);
  checar('apostrofo anti-formula tirado antes de ir ao CRM', a.nome === '=Maria Souza', `(${a.nome})`);
  checar('consentimento: versao gravada na linha e aceito_em com -03:00',
    a.consentimento?.versao === '2026-09-01' && a.consentimento?.aceito_em === '2026-10-05T14:30:12-03:00', `(${JSON.stringify(a.consentimento)})`);
  checar('origem.url completa da pagina', a.origem?.url === 'https://hachiroku.com.br/problemas/hyundai/hb20s/consumo-alto-combustivel/');
  const linhas = m.linhas('Pedidos');
  const limpa = (l, id) => l[0] === '2026-10-05 14:30:12' && l[11] === STATUS_ENVIADO && l[12] === id && l.slice(1, 11).every((v) => v === '');
  checar('linhas enviadas: contato apagado, ficam data, "Enviado ao CRM" e id_externo', limpa(linhas[1], ID_A) && limpa(linhas[3], ID_B), `(${JSON.stringify(linhas[1])})`);
  checar('linha com status Teste intocada', linhas[5][1] === 'Maria Souza' && linhas[5][11] === 'Teste');
  checar('log do reenvio sem dado pessoal', semDadoPessoal(logs.join('\n')) && semSegredo(logs.join('\n')), `(${logs.join(' | ')})`);

  const deNovo = await reenviar(env, { fetch: m.buscar, enviar: true, log });
  checar('rodar de novo: nada reenviado (so a linha invalida segue na reserva)', deNovo.enviados === 0 && m.chamadas.crm.length === 2, `(${m.chamadas.crm.length})`);

  const cab = mundoFalso({ abas: { Pedidos: [['Data', ...COLUNAS.slice(1)], reserva(ID_A, 'Maria Souza')] } });
  let erroCab = '';
  try { await reenviar(env, { fetch: cab.buscar, enviar: true, log }); } catch (e) { erroCab = e.message; }
  checar('cabecalho diferente de COLUNAS: aborta sem enviar nem alterar', erroCab.includes('cabeçalho') && cab.chamadas.crm.length === 0 && cab.linhas('Pedidos')[1][1] === 'Maria Souza');

  const negado = mundoFalso({ abas: semente(), crm: () => 401 });
  const rn = await reenviar(env, { fetch: negado.buscar, enviar: true, log });
  checar('CRM 401: para na primeira linha e nao limpa nada', rn.interrompido && negado.chamadas.crm.length === 1 && negado.linhas('Pedidos')[1][1] === "'=Maria Souza", `(${negado.chamadas.crm.length})`);

  const mexida = mundoFalso({ abas: semente() });
  let mexeu = false;
  const buscarMexendo = async (url, init) => {
    const resp = await mexida.buscar(url, init);
    if (!mexeu && String(url).endsWith('/api/v1/leads')) { mexeu = true; mexida.planilha.get('Pedidos').linhas.splice(1, 1); }
    return resp;
  };
  const rm = await reenviar(env, { fetch: buscarMexendo, enviar: true, log });
  const comContato = mexida.linhas('Pedidos').filter((l) => l[1] === 'Maria Souza').length;
  checar('linha mudou de lugar entre o envio e a limpeza: nao limpa a linha errada', rm.falhas.some((f) => f.motivo === 'a linha mudou de lugar') && comContato === 3, `(${JSON.stringify(rm.falhas)} ${comContato})`);

  const p = pedidoDaLinha(reserva(ID_A, 'Maria Souza', { 'Recebido em': '05/10/2026' }));
  checar('linha sem data no formato nao vai ao CRM', Boolean(p.erro));
  checar('linhaEnviada deixa so as colunas mantidas', linhaEnviada(reserva(ID_A, 'X')).filter(Boolean).length === COLUNAS_MANTIDAS.length);
}

const iReal = process.argv.indexOf('--real');
if (iReal !== -1) {
  console.log('\nREAL · uma linha de teste na planilha');
  const env = {
    GOOGLE_SA_JSON: fs.readFileSync('.secrets/google-indexing.json', 'utf8'),
    COTACAO_SHEET_ID: process.argv[iReal + 1],
    COTACAO_SHEET_TAB: process.env.COTACAO_SHEET_TAB,
  };
  try {
    await gravarLinha([agoraBrasilia(), 'TESTE - pode apagar', '(00) 00000-0000', '', '00000-000', 'Teste', '2026',
      'nao informado', '/teste/', 'teste', VERSAO_AVISO, 'Teste', '00000000-0000-4000-8000-000000000000'], env);
    checar('linha de teste gravada', true);
  } catch (e) {
    checar('linha de teste gravada', false, e.message);
  }
}

console.log('\nLOG SEM SEGREDO');
{
  const tudo = todosOsLogs.join('\n');
  const trechos = [SEGREDO, SEGREDO.slice(0, 8), SEGREDO.slice(-8), 'trecho-secre', '_key', 'BEGIN PRIVATE'];
  checar(`nenhum log do gate (${todosOsLogs.length} linhas) traz o segredo ou trecho dele`, todosOsLogs.length > 20 && !trechos.some((t) => tudo.includes(t)));
}

console.log('\n' + (falhas === 0 ? 'OK: api/cotacao.js passou em todas as verificacoes.' : `FALHA: ${falhas} verificacao(oes).`));
process.exit(falhas === 0 ? 0 : 1);
