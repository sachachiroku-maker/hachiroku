#!/usr/bin/env node
/**
 * Verifica os links internos do build contra as rotas realmente geradas.
 *
 * Item 2.5 do diagnóstico de entidade de 2026-09-08: links internos apontando
 * para rota inexistente, e links escritos sem barra final, que geram um 308 de
 * normalização antes de resolver. Cada rota inexistente é um 404 que o Googlebot
 * busca dentro do mesmo orçamento de rastreio.
 *
 * Uso: node scripts/check-links.mjs   (depois de `npm run build`)
 * Sai com código 1 se houver link para rota inexistente.
 */
import fs from 'node:fs';
import path from 'node:path';

const DIST = 'dist';
const IGNORAR = /^(https?:|mailto:|tel:|#|\/\/|javascript:)/i;

/** Caminho de arquivo do dist para rota de URL, sem depender do separador do SO. */
const paraRota = (f) =>
  '/' + path.relative(DIST, f).split(path.sep).join('/').replace(/index\.html$/, '');

/** @param {string} dir @param {(f: string) => void} cb */
function walk(dir, cb) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, cb);
    else cb(full);
  }
}

// 1. rotas geradas, e quais delas são stub de redirect servido como 200
const rotas = new Set();
const stubs = new Set();
walk(DIST, (f) => {
  if (!f.endsWith('.html')) return;
  const rota = paraRota(f);
  rotas.add(rota);
  const html = fs.readFileSync(f, 'utf8');
  if (/http-equiv="refresh"/i.test(html) && /name="robots"[^>]*noindex/i.test(html)) stubs.add(rota);
});

// 2. links de cada página
const acumula = (mapa, chave, valor) => {
  if (!mapa.has(chave)) mapa.set(chave, new Set());
  mapa.get(chave).add(valor);
};

const quebrados = new Map();
const paraStub = new Map();
const semBarra = new Map();

walk(DIST, (f) => {
  if (!f.endsWith('.html')) return;
  const origem = paraRota(f);
  if (stubs.has(origem)) return;                    // stub só aponta para o próprio destino
  const html = fs.readFileSync(f, 'utf8');
  for (const m of html.matchAll(/<a\b[^>]*\shref="([^"]+)"/gi)) {
    let href = m[1];
    if (IGNORAR.test(href)) continue;
    href = href.split('#')[0].split('?')[0];
    if (!href.startsWith('/')) continue;
    if (/\.(xml|json|txt|png|jpe?g|webp|svg|ico|pdf|webmanifest)$/i.test(href)) continue;
    if (href === '') continue;
    const norm = href.endsWith('/') ? href : href + '/';
    if (!href.endsWith('/')) acumula(semBarra, norm, origem);
    if (!rotas.has(norm)) acumula(quebrados, norm, origem);
    else if (stubs.has(norm)) acumula(paraStub, norm, origem);
  }
});

const relatorio = (titulo, mapa) => {
  console.log(`\n${titulo}: ${mapa.size} alvo(s)`);
  const ordenado = [...mapa].sort((a, b) => b[1].size - a[1].size);
  for (const [alvo, origens] of ordenado) {
    console.log(`  ${alvo}   (${origens.size} origem/origens)`);
    for (const o of [...origens].slice(0, 3)) console.log(`      de ${o}`);
    if (origens.size > 3) console.log(`      e mais ${origens.size - 3}`);
  }
};

console.log(`rotas geradas: ${rotas.size} | stubs de redirect: ${stubs.size}`);
relatorio('LINKS PARA ROTA INEXISTENTE', quebrados);
relatorio('LINKS PARA STUB DE REDIRECT', paraStub);
relatorio('LINKS SEM BARRA FINAL (308 antes de resolver)', semBarra);

if (quebrados.size > 0) {
  console.error(`\nFALHA: ${quebrados.size} alvo(s) inexistente(s).`);
  process.exit(1);
}
console.log('\nOK: nenhum link interno para rota inexistente.');
