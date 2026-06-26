/**
 * Google Instant Indexing — notifica o Google sobre URLs novas/atualizadas
 * via Indexing API (urlNotifications:publish), usando a service account.
 *
 * Chave: lida de .secrets/google-indexing.json (fora do Git) ou da env
 * GOOGLE_INDEXING_KEY. NUNCA commitar a chave.
 *
 * Uso:
 *   npm run build                          # gera dist/sitemap-0.xml
 *   npm run google-index                   # envia até 200 URLs do sitemap (quota/dia)
 *   npm run google-index -- --limit 50     # limita a 50
 *   npm run google-index -- https://hachiroku.com.br/problemas/fiat/argo/correia/
 *   npm run google-index -- --type URL_DELETED https://...   # notificar remoção
 *
 * Quota padrão da Indexing API: 200 publicações/dia por projeto.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const KEY_PATH = process.env.GOOGLE_INDEXING_KEY || path.resolve('.secrets/google-indexing.json');
const SITEMAP = path.resolve('dist/sitemap-0.xml');
const SCOPE = 'https://www.googleapis.com/auth/indexing';
const TOKEN_AUD = 'https://oauth2.googleapis.com/token';
const PUBLISH = 'https://indexing.googleapis.com/v3/urlNotifications:publish';
const DAILY_QUOTA = 200;
const CONCURRENCY = 5;

const b64url = (b) => Buffer.from(b).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

function lerArgs() {
  const argv = process.argv.slice(2);
  let limit = DAILY_QUOTA, type = 'URL_UPDATED';
  const urls = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--limit') limit = parseInt(argv[++i], 10) || DAILY_QUOTA;
    else if (argv[i] === '--type') type = argv[++i];
    else if (argv[i].startsWith('http')) urls.push(argv[i]);
  }
  return { limit, type, urls };
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
    console.error(`✗ Chave não encontrada em ${KEY_PATH}\n  Defina GOOGLE_INDEXING_KEY ou coloque o JSON em .secrets/google-indexing.json`);
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

const { limit, type, urls: manuais } = lerArgs();
const todas = manuais.length ? manuais : urlsDoSitemap();
const fila = todas.slice(0, limit);
const sobra = todas.length - fila.length;

const { token, email } = await getToken();
console.log(`Google Indexing API → ${email}`);
console.log(`Tipo: ${type} | URLs: ${fila.length}${manuais.length ? ' (manuais)' : ' (do sitemap)'}${sobra > 0 ? ` | ${sobra} além da quota de hoje` : ''}\n`);

let ok = 0, fail = 0;
for (let i = 0; i < fila.length; i += CONCURRENCY) {
  const lote = fila.slice(i, i + CONCURRENCY);
  const res = await Promise.all(lote.map((u) => publicar(token, u, type)));
  for (const r of res) {
    if (r.ok) { ok++; }
    else { fail++; console.log(`✗ ${r.status} ${r.url} — ${r.msg}`); }
  }
  process.stdout.write(`\r  enviadas: ${ok + fail}/${fila.length}`);
}
console.log(`\n\nResumo: ${ok} aceitas, ${fail} com falha.${sobra > 0 ? `\nFaltaram ${sobra} URLs (quota de 200/dia). Rode amanhã para continuar.` : ''}`);
process.exit(fail ? 1 : 0);
