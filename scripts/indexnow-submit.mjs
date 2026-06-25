/**
 * IndexNow — submissão instantânea de URLs (Bing, Yandex, Seznam, Naver…).
 *
 * Lê as URLs do sitemap gerado no build (dist/sitemap-0.xml) e as envia em
 * lote para a API do IndexNow. A chave é validada por api.indexnow.org contra
 * o arquivo hospedado em https://hachiroku.com.br/<KEY>.txt.
 *
 * Uso:
 *   npm run build          # gera dist/sitemap-0.xml
 *   npm run indexnow       # submete todas as URLs
 *   npm run indexnow -- https://hachiroku.com.br/problemas/fiat/argo/correia/   # 1+ URLs específicas
 *
 * Pré-requisito: o site precisa estar publicado (a chave .txt acessível na raiz).
 */
import fs from 'node:fs';
import path from 'node:path';

const HOST = 'hachiroku.com.br';
const KEY = 'd761135bfbcd47c385689a3bc8920c95';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/IndexNow';
const SITEMAP = path.resolve('dist/sitemap-0.xml');
const MAX_PER_REQUEST = 10000; // limite do protocolo IndexNow

function urlsFromSitemap() {
  if (!fs.existsSync(SITEMAP)) {
    console.error(`✗ ${SITEMAP} não encontrado. Rode "npm run build" primeiro.`);
    process.exit(1);
  }
  const xml = fs.readFileSync(SITEMAP, 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

async function submit(urlList) {
  const body = { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList };
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });
  const text = await res.text().catch(() => '');
  return { status: res.status, text };
}

const REASONS = {
  200: 'OK — URLs submetidas com sucesso',
  202: 'Aceito — chave ainda em validação',
  400: 'Bad request — formato inválido',
  403: 'Forbidden — chave inválida (arquivo .txt ausente ou não corresponde)',
  422: 'Unprocessable — URLs fora do host ou chave fora do esquema',
  429: 'Too Many Requests — possível spam, aguarde',
};

const args = process.argv.slice(2).filter((a) => a.startsWith('http'));
const urls = args.length ? args : urlsFromSitemap();

if (!urls.length) {
  console.error('✗ Nenhuma URL para submeter.');
  process.exit(1);
}

console.log(`IndexNow → ${HOST}`);
console.log(`Chave: ${KEY_LOCATION}`);
console.log(`URLs a submeter: ${urls.length}${args.length ? ' (manuais)' : ' (do sitemap)'}`);

let ok = 0, fail = 0;
for (let i = 0; i < urls.length; i += MAX_PER_REQUEST) {
  const lote = urls.slice(i, i + MAX_PER_REQUEST);
  try {
    const { status, text } = await submit(lote);
    const reason = REASONS[status] ?? 'Resposta inesperada';
    const sym = status >= 200 && status < 300 ? '✓' : '✗';
    console.log(`${sym} lote ${i / MAX_PER_REQUEST + 1}: HTTP ${status} — ${reason}${text ? ` | ${text.slice(0, 120)}` : ''}`);
    if (status >= 200 && status < 300) ok += lote.length; else fail += lote.length;
  } catch (e) {
    console.error(`✗ lote ${i / MAX_PER_REQUEST + 1}: erro de rede — ${e.message}`);
    fail += lote.length;
  }
}
console.log(`\nResumo: ${ok} submetidas, ${fail} com falha.`);
process.exit(fail ? 1 : 0);
