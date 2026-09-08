#!/usr/bin/env node
/**
 * Valida todos os alvos de src/lib/wikis.ts contra a API da Wikipedia PT.
 *
 * Por que existe: `sameAs` de modelo e a ponte direta do site para o Knowledge Graph.
 * Um alvo errado nao quebra o build nem aparece no HTML — ele so afirma, em silencio,
 * que a pagina fala de outro carro. Foi o que aconteceu com o Jeep Commander, que
 * apontava para o SUV norte-americano de 2006-2010.
 *
 * Reprova (exit 1) quando um titulo nao existe ou quando passou a redirecionar sem
 * estar na lista de redirects ja conferidos abaixo.
 *
 * Uso:  node scripts/check-wikis.mjs        (ou: npm run check:wikis)
 *
 * Nao entra no `npm run build` de proposito: o build da Vercel nao deve depender de
 * uma API externa estar no ar. Rode antes de publicar mudanca em wikis.ts.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ARQUIVO = path.join(RAIZ, 'src', 'lib', 'wikis.ts');
const API = 'https://pt.wikipedia.org/w/api.php';
const UA = 'Hachiroku-wikis-check/1.0 (https://hachiroku.com.br)';

/**
 * Redirects ja conferidos um a um: a Wikipedia PT consolidou o verbete sob outro
 * nome, mas o destino e o MESMO veiculo. Nao sao defeito.
 * Qualquer redirect fora desta lista reprova, porque pode ser troca de carro.
 */
const REDIRECTS_CONFERIDOS = new Map([
  ['renault/duster', 'Dacia Duster'],   // Wikipedia PT trata a linha sob a marca Dacia
  ['renault/logan', 'Dacia Logan'],     // idem
  ['renault/oroch', 'Renault Oroch'],   // titulo encurtado, mesmo verbete
  ['toyota/yaris', 'Toyota Vitz'],      // Vitz e o nome do mesmo carro no verbete PT
]);

function lerPares() {
  const src = fs.readFileSync(ARQUIVO, 'utf8');
  const re = /'([^']+)':\s*'https:\/\/pt\.wikipedia\.org\/wiki\/([^']+)'/g;
  const pares = [];
  let m;
  while ((m = re.exec(src))) {
    pares.push({ chave: m[1], titulo: decodeURIComponent(m[2]).replace(/_/g, ' ') });
  }
  return pares;
}

async function consultar(lote) {
  const titles = lote.map((p) => p.titulo).join('|');
  const url = `${API}?action=query&format=json&redirects=1&prop=info&titles=${encodeURIComponent(titles)}`;
  const r = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!r.ok) throw new Error(`Wikipedia respondeu HTTP ${r.status}`);
  return (await r.json()).query;
}

const pares = lerPares();
if (pares.length === 0) {
  console.error('FALHA: nenhuma entrada lida de src/lib/wikis.ts');
  process.exit(1);
}

const ausentes = [];
const redirectsNovos = [];

for (let i = 0; i < pares.length; i += 40) {
  const lote = pares.slice(i, i + 40);
  const q = await consultar(lote);
  const normalizados = new Map((q.normalized || []).map((n) => [n.from, n.to]));
  const redirecionados = new Map((q.redirects || []).map((n) => [n.from, n.to]));

  for (const par of lote) {
    const normalizado = normalizados.get(par.titulo) ?? par.titulo;
    const destino = redirecionados.get(normalizado);
    const final = destino ?? normalizado;
    const pagina = Object.values(q.pages).find((x) => x.title === final);

    if (!pagina || pagina.missing !== undefined) {
      ausentes.push({ ...par, final });
    } else if (destino && REDIRECTS_CONFERIDOS.get(par.chave) !== destino) {
      redirectsNovos.push({ ...par, final });
    }
  }
}

console.log(`verificados: ${pares.length} alvos de wikis.ts`);

for (const a of ausentes) {
  console.error(`  AUSENTE          ${a.chave}  ->  "${a.titulo}" nao existe na Wikipedia PT`);
}
for (const r of redirectsNovos) {
  console.error(`  REDIRECT NOVO    ${r.chave}  ->  "${r.titulo}" agora redireciona para "${r.final}"`);
  console.error('                   Confira se o destino e o MESMO veiculo. Se for, adicione a');
  console.error('                   REDIRECTS_CONFERIDOS neste arquivo. Se nao for, troque o alvo.');
}

if (ausentes.length || redirectsNovos.length) {
  console.error(`\nREPROVADO: ${ausentes.length} ausente(s), ${redirectsNovos.length} redirect(s) nao conferido(s).`);
  process.exit(1);
}

console.log(`OK: nenhum alvo ausente, ${REDIRECTS_CONFERIDOS.size} redirect(s) conferido(s) e esperado(s).`);
