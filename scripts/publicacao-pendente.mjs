#!/usr/bin/env node
/**
 * Publicação agendada: existe guia cuja pubDate já venceu e que ainda não está no ar?
 *
 * Usado por .github/workflows/publicacao-agendada.yml. Para cada guia com pubDate nos
 * últimos 21 dias (e não rascunho), consulta a URL publicada. Se alguma ainda responde
 * 404, o site precisa de um novo build para ela entrar (ver src/lib/publicacao.ts).
 *
 * É idempotente e se corrige sozinho: se um build falhar, a URL continua 404 e a
 * próxima execução tenta de novo; se já estiver no ar, não faz nada.
 *
 * Saída no formato do $GITHUB_OUTPUT:  pendente=sim|nao  e  urls=<lista separada por espaço>
 * Log legível vai para stderr.
 *
 * Uso: node scripts/publicacao-pendente.mjs [--agora=2026-10-19T12:00:00Z]
 */
import fs from 'node:fs';
import path from 'node:path';

const SITE = 'https://hachiroku.com.br';
const JANELA_DIAS = 21;
const BASE = path.resolve('src/content/guias');

const arg = process.argv.find((a) => a.startsWith('--agora='));
const agora = arg ? new Date(arg.slice('--agora='.length)).getTime() : Date.now();

/** @param {string} dir @param {(f: string) => void} cb */
function walk(dir, cb) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, cb);
    else cb(full);
  }
}

const vencidos = [];
walk(BASE, (file) => {
  if (!/\.mdx?$/.test(file)) return;
  const fm = fs.readFileSync(file, 'utf8').match(/^﻿?---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
  if (/^draft:\s*true\b/m.test(fm)) return;
  const pub = fm.match(/^pubDate:\s*["']?([^"'\r\n]+)/m)?.[1]?.trim();
  if (!pub) return;
  const t = new Date(pub).getTime();
  if (Number.isNaN(t) || t > agora || t < agora - JANELA_DIAS * 86400e3) return;
  const slug = path.relative(BASE, file).split(path.sep).join('/').replace(/\.mdx?$/, '').toLowerCase();
  vencidos.push(`${SITE}/guia-de-compra/${slug}/`);
});

const pendentes = [];
for (const url of vencidos) {
  let status = 0;
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'manual' });
    status = res.status;
  } catch (e) {
    status = -1; // rede falhou: trata como pendente, o commit vazio é inofensivo
  }
  console.error(`${status === 200 ? 'no ar   ' : 'PENDENTE'} ${status} ${url}`);
  if (status !== 200) pendentes.push(url);
}

if (vencidos.length === 0) console.error(`nenhum guia com pubDate nos últimos ${JANELA_DIAS} dias`);
console.log(`pendente=${pendentes.length ? 'sim' : 'nao'}`);
console.log(`urls=${pendentes.join(' ')}`);
