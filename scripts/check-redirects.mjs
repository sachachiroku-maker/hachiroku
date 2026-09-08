#!/usr/bin/env node
/**
 * Classifica os redirects declarados em astro.config.mjs por equivalência.
 *
 * Item 2.2 do diagnóstico de entidade de 2026-09-08. O critério de saída óbvio
 * ("devolve 301 com Location correto") passa mesmo quando o redirect joga uma
 * folha que casava com uma consulta específica dentro de um hub genérico, que é
 * o padrão que o Google costuma tratar como irrelevante e converter em soft 404.
 * Status prova o servidor; equivalência é o que decide se o sinal transfere.
 *
 * Uso: node scripts/check-redirects.mjs
 * Não falha o build: o veredito é editorial, e a saída é um relatório.
 */
import fs from 'node:fs';

const cfg = fs.readFileSync('astro.config.mjs', 'utf8');
const bloco = cfg.slice(cfg.indexOf('redirects: {'), cfg.indexOf('\n  },', cfg.indexOf('redirects: {')));

const pares = [...bloco.matchAll(/'([^']+)':\s*\{\s*destination:\s*'([^']+)'/g)]
  .map(([, de, para]) => ({ de, para }));

/** Profundidade da rota, em segmentos. /problemas/fiat/uno/x/ = 4 */
const prof = (u) => u.split('/').filter(Boolean).length;

/** Último segmento, que é onde mora o tema da página. */
const folha = (u) => u.split('/').filter(Boolean).pop() ?? '';

/** Palavras significativas do slug, para medir sobreposição de tema. */
const palavras = (u) =>
  new Set(folha(u).split('-').filter((p) => p.length > 2));

const jaccard = (a, b) => {
  const A = palavras(a);
  const B = palavras(b);
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const p of A) if (B.has(p)) inter += 1;
  return inter / (A.size + B.size - inter);
};

const classificar = ({ de, para }) => {
  const dDe = prof(de);
  const dPara = prof(para);
  if (dPara < dDe) {
    // subiu de nível: folha caindo em hub
    return dPara <= 1 ? 'HUB GENÉRICO' : 'SOBE DE NÍVEL';
  }
  const j = jaccard(de, para);
  if (j >= 0.4) return 'EQUIVALENTE';
  return dDe === dPara ? 'MESMO NÍVEL, TEMA DIVERGENTE' : 'REVISAR';
};

const grupos = new Map();
for (const p of pares) {
  const c = classificar(p);
  if (!grupos.has(c)) grupos.set(c, []);
  grupos.get(c).push(p);
}

const ordem = ['HUB GENÉRICO', 'SOBE DE NÍVEL', 'MESMO NÍVEL, TEMA DIVERGENTE', 'REVISAR', 'EQUIVALENTE'];
console.log(`redirects declarados: ${pares.length}\n`);
for (const c of ordem) {
  const g = grupos.get(c);
  if (!g) continue;
  console.log(`${c}: ${g.length}`);
  for (const { de, para } of g) console.log(`   ${de}\n      -> ${para}`);
  console.log('');
}

const risco = ordem.slice(0, 3).reduce((s, c) => s + (grupos.get(c)?.length ?? 0), 0);
console.log(`Sem transferência garantida de sinal: ${risco} de ${pares.length}.`);
console.log('Equivalência é julgamento editorial: a heurística acima só separa o que precisa de olho humano.');
