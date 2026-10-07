#!/usr/bin/env node
/**
 * Leva ao CRM os pedidos de cotação que ficaram na planilha de reserva (status "Reserva")
 * e, depois de cada envio confirmado, apaga o contato da linha: ficam só "Recebido em",
 * o id_externo e o status "Enviado ao CRM". Fonte: crm-leads/docs/PLANO-CRM.md §5.
 *
 * Idempotente: cada linha vai com o id_externo gravado por api/cotacao.js, e o CRM
 * responde 200 sem criar card novo para um id_externo que já recebeu. Rodar de novo
 * depois de uma falha no meio não duplica nada.
 *
 *   node scripts/reenviar-planilha.mjs              ensaio: conta as linhas "Reserva", não envia
 *   node scripts/reenviar-planilha.mjs --enviar     envia e limpa as linhas confirmadas
 *
 * Variáveis (as mesmas da Vercel; ex.: `vercel env pull` para um .env e `node --env-file=.env`):
 *   CRM_URL, CRM_CHAVE                  destino (obrigatórias com --enviar)
 *   COTACAO_SHEET_ID (ou --planilha <id>), COTACAO_SHEET_TAB (default Pedidos)
 *   GOOGLE_SA_JSON, ou o arquivo de --sa <caminho> (default .secrets/google-indexing.json)
 *
 * Segurança: confere o cabeçalho da aba contra COLUNAS antes de mexer em qualquer célula;
 * relê a linha antes de limpar e só limpa se o id_externo ainda for o mesmo (a retenção
 * pode ter apagado linhas no meio do caminho). Para no primeiro 401 ou 429.
 * O console mostra só número de linha, id_externo (não é dado pessoal) e o motivo.
 */
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import {
  clientePlanilha, enviarAoCrm, corpoCrm, faixa, COLUNAS, STATUS_RESERVA,
} from '../api/cotacao.js';

export const STATUS_ENVIADO = 'Enviado ao CRM';
/** Colunas que sobram numa linha já enviada; todas as outras são apagadas. */
export const COLUNAS_MANTIDAS = ['Recebido em', 'Status', 'id_externo'];
const ORIGEM_SITE = 'https://hachiroku.com.br';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const RECEBIDO_EM = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
/** Respostas que valem para todas as linhas: parar em vez de insistir. */
const PARA_TUDO = ['HTTP 401', 'HTTP 429', 'CRM_URL inválida', 'CRM_CHAVE fora do formato'];

const ULTIMA = String.fromCharCode(64 + COLUNAS.length); // 13 colunas: M
const col = (nome) => COLUNAS.indexOf(nome);
/** api/cotacao.js põe apóstrofo antes de = + - @ (fórmula no Excel); o CRM recebe o texto original. */
const semApostrofo = (v) => (/^'[=+\-@]/.test(v) ? v.slice(1) : v);
const celulaDe = (linha, nome) => semApostrofo(String(linha?.[col(nome)] ?? '').trim());

/** Cabeçalho da aba igual a COLUNAS, na mesma ordem. */
export function cabecalhoConfere(cabecalho) {
  return Array.isArray(cabecalho) && COLUNAS.every((nome, i) => String(cabecalho[i] ?? '').trim() === nome);
}

/**
 * Corpo do POST /api/v1/leads a partir de uma linha da reserva. Usa a versão do aviso
 * gravada na linha (a que a pessoa aceitou) e "Recebido em" como aceito_em, com o fuso
 * de Brasília (-03:00, sem horário de verão desde 2019). Devolve { erro } ou { corpo, idExterno }.
 */
export function pedidoDaLinha(linha) {
  const recebido = celulaDe(linha, 'Recebido em');
  if (!RECEBIDO_EM.test(recebido)) return { erro: '"Recebido em" fora do formato' };
  const idExterno = celulaDe(linha, 'id_externo').toLowerCase();
  if (!UUID.test(idExterno)) return { erro: 'id_externo ausente ou inválido' };
  const versao = celulaDe(linha, 'Versão do aviso');
  if (!versao) return { erro: 'versão do aviso ausente' };
  const campos = {
    nome: celulaDe(linha, 'Nome'),
    whatsapp: celulaDe(linha, 'WhatsApp'),
    email: celulaDe(linha, 'E-mail'),
    cep: celulaDe(linha, 'CEP'),
    carro: celulaDe(linha, 'Carro'),
    ano: celulaDe(linha, 'Ano'),
    seguro: celulaDe(linha, 'Já tem seguro'),
    pagina: celulaDe(linha, 'Página'),
    posicao: celulaDe(linha, 'Posição do banner'),
  };
  const corpo = corpoCrm(campos, { idExterno, aceitoEm: `${recebido.replace(' ', 'T')}-03:00`, origem: ORIGEM_SITE });
  corpo.consentimento = { ...corpo.consentimento, versao };
  return { corpo, idExterno };
}

/** Linha depois do envio: sem contato; só data, status "Enviado ao CRM" e id_externo. */
export function linhaEnviada(linha) {
  return COLUNAS.map((nome) => {
    if (nome === 'Status') return STATUS_ENVIADO;
    return COLUNAS_MANTIDAS.includes(nome) ? String(linha?.[col(nome)] ?? '') : '';
  });
}

/**
 * Faz o reenvio. Devolve { reserva, enviados, falhas: [{ linha, motivo }], interrompido }.
 * `fetch` é injetável (o gate usa um Google e um CRM falsos). `log` recebe só textos sem dado pessoal.
 */
export async function reenviar(env, { fetch: buscar = fetch, enviar = false, log = console.log } = {}) {
  const planilha = clientePlanilha(env, { fetch: buscar });
  const aba = env.COTACAO_SHEET_TAB || 'Pedidos';
  const valores = await planilha.ler(faixa(aba, `A:${ULTIMA}`));
  if (!cabecalhoConfere(valores[0])) {
    throw Object.assign(new Error(`o cabeçalho da aba "${aba}" não confere com COLUNAS de api/cotacao.js; nada foi alterado`), { publico: true });
  }
  const candidatas = [];
  valores.forEach((linha, i) => {
    if (i > 0 && celulaDe(linha, 'Status') === STATUS_RESERVA) candidatas.push({ numero: i + 1, linha });
  });
  const resultado = { reserva: candidatas.length, enviados: 0, falhas: [], interrompido: false };
  if (!enviar) return resultado;

  for (const { numero, linha } of candidatas) {
    const p = pedidoDaLinha(linha);
    if (p.erro) {
      resultado.falhas.push({ linha: numero, motivo: p.erro });
      log(`  linha ${numero}: mantida (${p.erro})`);
      continue;
    }
    const r = await enviarAoCrm(p.corpo, env, { fetch: buscar });
    if (!r.ok) {
      resultado.falhas.push({ linha: numero, motivo: r.motivo });
      log(`  linha ${numero} (${p.idExterno}): mantida, CRM não confirmou (${r.motivo})`);
      if (PARA_TUDO.includes(r.motivo)) {
        resultado.interrompido = true;
        log(`  parado: ${r.motivo} vale para todas as linhas. Corrija e rode de novo.`);
        break;
      }
      continue;
    }
    // Relê a linha antes de limpar: só limpa se ainda for o mesmo pedido.
    const intervalo = faixa(aba, `A${numero}:${ULTIMA}${numero}`);
    const atual = (await planilha.ler(intervalo))[0];
    if (celulaDe(atual, 'id_externo').toLowerCase() !== p.idExterno) {
      resultado.falhas.push({ linha: numero, motivo: 'a linha mudou de lugar' });
      log(`  linha ${numero} (${p.idExterno}): entregue ao CRM, mas a linha mudou de lugar; rode de novo para limpar`);
      continue;
    }
    await planilha.escrever(intervalo, [linhaEnviada(atual)]);
    resultado.enviados += 1;
    log(`  linha ${numero} (${p.idExterno}): ${r.status === 201 ? 'criado no CRM' : 'já estava no CRM'}; contato apagado da planilha`);
  }
  return resultado;
}

function argumento(nome) {
  const i = process.argv.indexOf(nome);
  return i !== -1 ? process.argv[i + 1] : undefined;
}

async function principal() {
  const enviar = process.argv.includes('--enviar');
  const env = { ...process.env };
  const planilhaArg = argumento('--planilha');
  if (planilhaArg) env.COTACAO_SHEET_ID = planilhaArg;
  if (!env.GOOGLE_SA_JSON) {
    const caminho = argumento('--sa') ?? '.secrets/google-indexing.json';
    try {
      env.GOOGLE_SA_JSON = fs.readFileSync(caminho, 'utf8');
    } catch {
      console.error(`Sem GOOGLE_SA_JSON e sem o arquivo ${caminho}.`);
      process.exit(2);
    }
  }
  if (!env.COTACAO_SHEET_ID) {
    console.error('Informe a planilha: COTACAO_SHEET_ID ou --planilha <id>.');
    process.exit(2);
  }
  if (enviar && (!env.CRM_URL || !env.CRM_CHAVE)) {
    console.error('Com --enviar, CRM_URL e CRM_CHAVE são obrigatórias.');
    process.exit(2);
  }
  console.log(enviar ? 'REENVIO da planilha de reserva ao CRM' : 'ENSAIO (nada é enviado; use --enviar)');
  let r;
  try {
    r = await reenviar(env, { enviar });
  } catch (e) {
    // Só mensagem própria: a de JSON.parse, por exemplo, ecoaria trecho da chave da service account.
    console.error(`FALHA: ${e?.publico ? e.message : e?.status ? `Sheets HTTP ${e.status}` : `erro inesperado (${e?.name ?? 'desconhecido'})`}`);
    process.exit(1);
  }
  console.log(`\nLinhas "Reserva": ${r.reserva}`);
  if (enviar) {
    console.log(`Enviadas e limpas: ${r.enviados}`);
    console.log(`Mantidas na reserva: ${r.falhas.length}${r.interrompido ? ' (parou antes do fim)' : ''}`);
  }
  process.exit(r.falhas.length > 0 || r.interrompido ? 1 : 0);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await principal();
