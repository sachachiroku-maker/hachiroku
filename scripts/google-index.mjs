/**
 * Google Instant Indexing — notifica o Google sobre URLs novas/atualizadas
 * via Indexing API (urlNotifications:publish), usando a service account.
 *
 * Mantém ESTADO local (.secrets/google-index-sent.json) das URLs já enviadas
 * para nunca repetir: a cada execução pega as próximas N ainda não enviadas.
 *
 * Chave: .secrets/google-indexing.json (fora do Git) ou env GOOGLE_INDEXING_KEY.
 *
 * Uso:
 *   npm run build                          # gera dist/sitemap-0.xml
 *   npm run google-index                   # próximas 200 URLs NÃO enviadas (quota/dia)
 *   npm run google-index -- --limit 50     # limita a 50
 *   npm run google-index -- --all          # ignora o estado (reenvia)
 *   npm run google-index -- --reset        # zera o estado e sai
 *   npm run google-index -- https://hachiroku.com.br/algo/   # URLs avulsas (registra no estado)
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const KEY_PATH = process.env.GOOGLE_INDEXING_KEY || path.resolve('.secrets/google-indexing.json');
const STATE_PATH = path.resolve('.secrets/google-index-sent.json');
const SITEMAP = path.resolve('dist/sitemap-0.xml');
const SCOPE = 'https://www.googleapis.com/auth/indexing';
const TOKEN_AUD = 'https://oauth2.googleapis.com/token';
const PUBLISH = 'https://indexing.googleapis.com/v3/urlNotifications:publish';
const DAILY_QUOTA = 200;
const CONCURRENCY = 5;

const b64url = (b) => Buffer.from(b).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

function lerArgs() {
  const argv = process.argv.slice(2);
  let limit = parseInt(process.env.GOOGLE_INDEX_LIMIT, 10) || DAILY_QUOTA, type = 'URL_UPDATED', all = false, reset = false;
  const urls = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--limit') limit = parseInt(argv[++i], 10) || DAILY_QUOTA;
    else if (argv[i] === '--type') type = argv[++i];
    else if (argv[i] === '--all') all = true;
    else if (argv[i] === '--reset') reset = true;
    else if (argv[i].startsWith('http')) urls.push(argv[i]);
  }
  return { limit, type, all, reset, urls };
}

function carregarEstado() {
  try { return JSON.parse(fs.readFileSync(STATE_PATH, 'utf8')); } catch { return {}; }
}
function salvarEstado(estado) {
  fs.mkdirSync(path.dirname(STATE_PATH), { recursive: true });
  fs.writeFileSync(STATE_PATH, JSON.stringify(estado, null, 0));
}

function urlsDoSitemap() {
  if (!fs.existsSync(SITEMAP)) {
    console.error(`✗ ${SITEMAP} não encontrado. Rode "npm run build" primeiro.`);
    process.exit(1);
  }
  const xml = fs.readFileSync(SITEMAP, 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

async function getToken() {
  if (!fs.existsSync(KEY_PATH)) {
    console.error(`✗ Chave não encontrada em ${KEY_PATH}`);
    process.exit(1);
  }
  const j = JSON.parse(fs.readFileSync(KEY_PATH, 'utf8'));
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = b64url(JSON.stringify({ iss: j.client_email, scope: SCOPE, aud: TOKEN_AUD, exp: now + 3600, iat: now }));
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(`${header}.${claim}`);
  const jwt = `${header}.${claim}.${b64url(signer.sign(j.private_key))}`;
  const res = await fetch(TOKEN_AUD, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }),
  });
  const data = await res.json();
  if (!data.access_token) { console.error('✗ Falha ao autenticar:', data.error_description || data.error); process.exit(1); }
  return { token: data.access_token, email: j.client_email };
}

async function publicar(token, url, type) {
  try {
    const res = await fetch(PUBLISH, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, type }),
    });
    if (res.status === 200) return { url, ok: true };
    const data = await res.json().catch(() => ({}));
    return { url, ok: false, status: res.status, msg: data.error?.message || res.statusText };
  } catch (e) {
    return { url, ok: false, status: 0, msg: e.message };
  }
}

const { limit, type, all, reset, urls: manuais } = lerArgs();

if (reset) { salvarEstado({}); console.log('Estado zerado (.secrets/google-index-sent.json).'); process.exit(0); }

const estado = carregarEstado();
const enviadas = new Set(Object.keys(estado));
const todas = manuais.length ? manuais : urlsDoSitemap();

// Filtra as já enviadas (a menos que --all), preservando ordem do sitemap.
const candidatas = all ? todas : todas.filter((u) => !enviadas.has(u));
const fila = candidatas.slice(0, limit);
const sobra = candidatas.length - fila.length;

if (!fila.length) {
  console.log(`Nada a enviar: todas as ${todas.length} URLs do sitemap já foram notificadas (estado em .secrets/google-index-sent.json).`);
  console.log('Use --all para reenviar tudo, ou --reset para zerar o histórico.');
  process.exit(0);
}

const { token, email } = await getToken();
const carimbo = new Date().toISOString().slice(0, 19).replace('T', ' ');
console.log(`Google Indexing API → ${email}  [${carimbo}]`);
console.log(`Tipo: ${type} | enviando: ${fila.length}${manuais.length ? ' (manuais)' : ''} | já enviadas antes: ${enviadas.size} | restam após hoje: ${sobra}\n`);

let ok = 0, fail = 0;
for (let i = 0; i < fila.length; i += CONCURRENCY) {
  const lote = fila.slice(i, i + CONCURRENCY);
  const res = await Promise.all(lote.map((u) => publicar(token, u, type)));
  for (const r of res) {
    if (r.ok) { ok++; estado[r.url] = carimbo; }
    else { fail++; console.log(`✗ ${r.status} ${r.url} — ${r.msg}`); }
  }
  process.stdout.write(`\r  enviadas: ${ok + fail}/${fila.length}`);
}
salvarEstado(estado);
console.log(`\n\nResumo: ${ok} aceitas, ${fail} com falha. Total acumulado no estado: ${Object.keys(estado).length}/${todas.length}.`);
if (sobra > 0) console.log(`Restam ${sobra} URLs novas para os próximos dias (quota de ${DAILY_QUOTA}/dia).`);
else console.log('✅ Todas as URLs do sitemap já foram cobertas.');
process.exit(fail ? 1 : 0);
