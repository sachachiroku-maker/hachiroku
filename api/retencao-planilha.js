/**
 * GET /api/retencao-planilha/ (com barra: vercel.json tem trailingSlash true e o Cron da
 * Vercel não segue redirecionamento). Chamada uma vez por dia pela entrada `crons` do
 * vercel.json, compatível com o plano Hobby (no máximo uma execução diária).
 *
 * Apaga da planilha de reserva (aba COTACAO_SHEET_TAB, default "Pedidos") as linhas com
 * "Recebido em" mais velho que RETENCAO_MESES (12, igual a COTACAO_SEGURO.retencaoMeses em
 * src/config/cotacao-seguro.ts; o gate confere). Vale para todas as linhas, reenviadas
 * ao CRM ou não: a retenção não depende de alguém rodar scripts/reenviar-planilha.mjs.
 * Fonte: crm-leads/docs/PLANO-CRM.md §5 ("Retenção da planilha") e §8.
 *
 * Proteção: a Vercel manda `Authorization: Bearer <CRON_SECRET>` em cada chamada do Cron.
 * O segredo é comparado em tempo constante (sha256 dos dois lados + timingSafeEqual). Sem
 * CRON_SECRET, ou com menos de 16 caracteres, a função recusa tudo (503) e não apaga nada.
 *
 * O Cron pode chamar a mesma execução duas vezes. Apagar por número de linha com uma
 * leitura velha apagaria linhas erradas, então cada execução marca a linha 2 da aba
 * "Controle" (mesma trava do alerta de reserva) e uma segunda chamada em menos de
 * 10 minutos não faz nada.
 *
 * Log só com contagem e códigos: nada de célula, nem do segredo.
 */
import crypto from 'node:crypto';
import { clientePlanilha, reservarMarca, faixa } from './cotacao.js';

/** Manter igual a COTACAO_SEGURO.retencaoMeses (src/config/cotacao-seguro.ts); o gate confere. */
export const RETENCAO_MESES = 12;
export const TAMANHO_MINIMO_SEGREDO = 16;
export const VALIDADE_TRAVA_RETENCAO_MS = 10 * 60 * 1000;
const LINHA_TRAVA = 2;
const ROTULO_TRAVA = 'Última retenção';
const DATA_DA_LINHA = /^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})$/;

const json = (status, corpo) => Response.json(corpo, { status, headers: { 'Cache-Control': 'no-store' } });

/**
 * Confere `Authorization: Bearer <segredo>` em tempo constante. Os dois lados passam por
 * sha256 antes do timingSafeEqual, para a comparação não vazar nem o tamanho do segredo.
 * Segredo esperado vazio sempre nega.
 */
export function segredoConfere(cabecalho, esperado) {
  if (typeof esperado !== 'string' || esperado.length === 0) return false;
  const m = /^Bearer (.+)$/.exec(String(cabecalho ?? ''));
  const recebido = m ? m[1] : '';
  const a = crypto.createHash('sha256').update(recebido, 'utf8').digest();
  const b = crypto.createHash('sha256').update(esperado, 'utf8').digest();
  return crypto.timingSafeEqual(a, b) && recebido.length > 0;
}

/** Data de corte: linhas recebidas antes dela estão vencidas. */
export function dataDeCorte(agora = new Date(), meses = RETENCAO_MESES) {
  const corte = new Date(agora.getTime());
  corte.setUTCMonth(corte.getUTCMonth() - meses);
  return corte;
}

/**
 * "2026-10-05 14:30:12" (horário de Brasília, como agoraBrasilia() grava) em Date.
 * Brasília não tem horário de verão desde 2019: o fuso é sempre -03:00.
 * Texto fora do formato (cabeçalho, linha vazia) devolve null e a linha é mantida.
 */
export function dataDaLinha(valor) {
  const m = DATA_DA_LINHA.exec(String(valor ?? '').trim());
  if (!m) return null;
  const t = Date.parse(`${m[1]}T${m[2]}-03:00`);
  return Number.isFinite(t) ? new Date(t) : null;
}

/**
 * Índices (base 0, como a API usa em deleteDimension) das linhas vencidas, a partir da
 * coluna A lida desde A1. Agrupa índices seguidos em faixas e devolve as faixas em ordem
 * decrescente, para apagar de baixo para cima sem deslocar as que ainda faltam.
 */
export function faixasVencidas(colunaA, agora = new Date(), meses = RETENCAO_MESES) {
  const corte = dataDeCorte(agora, meses).getTime();
  const indices = [];
  colunaA.forEach((linha, i) => {
    const d = dataDaLinha(linha?.[0]);
    if (d && d.getTime() < corte) indices.push(i);
  });
  const faixas = [];
  for (const i of indices) {
    const ultima = faixas[faixas.length - 1];
    if (ultima && ultima.fim === i) ultima.fim = i + 1;
    else faixas.push({ inicio: i, fim: i + 1 });
  }
  return { faixas: faixas.reverse(), total: indices.length };
}

/** Lê, decide e apaga. Devolve { apagadas, ignorada }. Lança erro com `status` só de código. */
export async function aplicarRetencao(env, { fetch: buscar = fetch, agora = new Date() } = {}) {
  const planilha = clientePlanilha(env, { fetch: buscar });
  const trava = await reservarMarca(planilha, LINHA_TRAVA, ROTULO_TRAVA, { agora, validadeMs: VALIDADE_TRAVA_RETENCAO_MS });
  if (!trava.ok) return { apagadas: 0, ignorada: true };
  const aba = env.COTACAO_SHEET_TAB || 'Pedidos';
  const propriedades = (await planilha.abas()).find((p) => p.title === aba);
  if (!propriedades || typeof propriedades.sheetId !== 'number') {
    throw Object.assign(new Error('aba de pedidos não encontrada'), { status: 404 });
  }
  const { faixas, total } = faixasVencidas(await planilha.ler(faixa(aba, 'A:A')), agora);
  if (total === 0) return { apagadas: 0, ignorada: false };
  await planilha.lote(faixas.map((f) => ({
    deleteDimension: { range: { sheetId: propriedades.sheetId, dimension: 'ROWS', startIndex: f.inicio, endIndex: f.fim } },
  })));
  return { apagadas: total, ignorada: false };
}

export async function tratarRetencao(request, env = process.env, opcoes = {}) {
  if (request.method !== 'GET') return json(405, { ok: false });
  const segredo = String(env.CRON_SECRET ?? '');
  if (segredo.length < TAMANHO_MINIMO_SEGREDO) {
    console.error('retencao-planilha: CRON_SECRET ausente ou curto demais; nada foi apagado');
    return json(503, { ok: false });
  }
  if (!segredoConfere(request.headers.get('authorization'), segredo)) return json(401, { ok: false });
  if (!env.GOOGLE_SA_JSON || !env.COTACAO_SHEET_ID) {
    console.error('retencao-planilha: GOOGLE_SA_JSON/COTACAO_SHEET_ID ausentes; nada foi apagado');
    return json(503, { ok: false });
  }
  try {
    const r = await aplicarRetencao(env, opcoes);
    console.log(r.ignorada
      ? 'retencao-planilha: outra execução rodou há menos de 10 minutos; nada a fazer'
      : `retencao-planilha: ${r.apagadas} linha(s) com mais de ${RETENCAO_MESES} meses apagada(s)`);
    return json(200, { ok: true, apagadas: r.apagadas, ignorada: r.ignorada });
  } catch (e) {
    console.error(`retencao-planilha: falha (${e?.status ? `HTTP ${e.status}` : e?.name === 'SyntaxError' ? 'GOOGLE_SA_JSON inválido' : 'falha de rede'})`);
    return json(502, { ok: false });
  }
}

export default {
  fetch: (request) => tratarRetencao(request),
};
