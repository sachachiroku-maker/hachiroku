#!/usr/bin/env node
/**
 * Gate de conformidade do banner de cookies (LGPD / Guia Orientativo da ANPD, out/2022).
 *
 * A afirmação que a política de cookies faz ao visitante é verificável, e por isso é
 * verificada aqui: nenhuma requisição sai deste site para o Google antes de o titular
 * escolher. Este script confere isso de duas formas complementares.
 *
 *   1. Estática, sobre o HTML gerado: não pode existir tag de script carregando o
 *      googletagmanager no parse inicial, em nenhuma das páginas.
 *   2. Funcional: extrai o script real do build e o executa contra um DOM mínimo,
 *      observando se algum <script> do Google é anexado em cada cenário.
 *
 * Uso: node scripts/check-consent.mjs   (depois de `npm run build`)
 * Sai com código 1 em qualquer falha.
 */
import fs from 'node:fs';
import path from 'node:path';

const DIST = 'dist';
let falhas = 0;

const checar = (nome, condicao, detalhe = '') => {
  console.log((condicao ? '  OK    ' : '  FALHA ') + nome + (detalhe ? '  ' + detalhe : ''));
  if (!condicao) falhas += 1;
};

/** @param {string} dir @param {(f: string) => void} cb */
function walk(dir, cb) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, cb);
    else cb(full);
  }
}

// ---------------------------------------------------------------- 1. estático
console.log('ESTATICO · sobre as paginas geradas');

const comTagGoogle = [];
const semBanner = [];
const comCheckedIndevido = [];
let paginas = 0;

walk(DIST, (f) => {
  if (!f.endsWith('.html')) return;
  const html = fs.readFileSync(f, 'utf8');
  // Stubs de redirect ficam de fora, e o motivo é substantivo, não conveniência:
  // eles não gravam armazenamento, não carregam script de terceiro e encaminham
  // para a página real, que tem o banner. Onde não há tratamento de dado pessoal,
  // não há o que consentir.
  const ehStub = /http-equiv="refresh"/i.test(html) && /name="robots"[^>]*noindex/i.test(html);
  if (ehStub || !html.includes('</body>')) return;
  paginas += 1;
  if (/<script[^>]+src=["']https:\/\/www\.googletagmanager\.com/.test(html)) comTagGoogle.push(f);
  if (!html.includes('id="hk-cookies"')) semBanner.push(f);
  if (/id="hk-analytics"[^>]*\schecked/.test(html)) comCheckedIndevido.push(f);
});

checar('paginas analisadas', paginas > 0, `(${paginas})`);
checar('nenhuma tag de script do Google no parse inicial', comTagGoogle.length === 0, `(${comTagGoogle.length})`);
checar('banner presente em todas as paginas', semBanner.length === 0, `(${semBanner.length} sem)`);
checar('cookie nao necessario nunca pre-marcado', comCheckedIndevido.length === 0, `(${comCheckedIndevido.length})`);

// -------------------------------------------------------------- 2. funcional
const home = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
const m = [...home.matchAll(/<script type="module">([\s\S]*?)<\/script>/g)]
  .map((x) => x[1])
  .find((s) => s.includes('hk-consent'));

if (!m) {
  console.log('  FALHA script do banner nao encontrado no build');
  process.exit(1);
}

function ambiente(consentGravado) {
  const anexados = [];
  const cookiesApagados = [];
  const ouvintes = [];
  const criar = () => ({ hidden: false, checked: false, setAttribute() {}, getAttribute: () => null,
    addEventListener: (_t, fn) => ouvintes.push(fn) });
  const els = { 'hk-cookies': criar(), 'hk-nivel1': criar(), 'hk-nivel2': criar(), 'hk-analytics': criar() };
  // Estado inicial igual ao HTML servido: a raiz e o segundo nivel nascem ocultos.
  els['hk-cookies'].hidden = true;
  els['hk-nivel2'].hidden = true;
  const loja = new Map();
  if (consentGravado) loja.set('hk-consent', JSON.stringify(consentGravado));
  const doc = {
    getElementById: (id) => els[id] ?? null,
    createElement: () => {
      const s = { async: false, _src: '' };
      Object.defineProperty(s, 'src', { get: () => s._src, set: (v) => { s._src = v; anexados.push(v); } });
      return s;
    },
    head: { appendChild() {} },
    addEventListener() {},
    get cookie() { return '_ga=GA1.1.1; _ga_QM1MYBRVD7=GS1.1.2; outro=x'; },
    set cookie(v) { cookiesApagados.push(v); },
  };
  const win = { document: doc, localStorage: { getItem: (k) => loja.get(k) ?? null, setItem: (k, v) => loja.set(k, v) } };
  win.window = win;
  return { win, doc, loja, anexados, cookiesApagados, ouvintes, els,
    location: { hostname: 'hachiroku.com.br' } };
}

function rodar(consentGravado) {
  const ctx = ambiente(consentGravado);
  new Function('window', 'document', 'localStorage', 'location', m)(
    ctx.win, ctx.doc, ctx.win.localStorage, ctx.location,
  );
  return ctx;
}

const clicar = (ctx, acao) => {
  const alvo = { getAttribute: (a) => (a === 'data-hk' ? acao : null) };
  ctx.ouvintes.forEach((fn) => fn({ target: { closest: (s) => (s === '[data-hk]' ? alvo : null) } }));
};
const aoGoogle = (ctx) => ctx.anexados.filter((u) => u.includes('googletagmanager')).length;

console.log('\nFUNCIONAL · visitante novo, sem decisao');
{
  const c = rodar(null);
  checar('zero requisicao ao Google', aoGoogle(c) === 0, `(${aoGoogle(c)})`);
  checar('banner aberto', c.els['hk-cookies'].hidden === false);
  checar('analitico desmarcado', c.els['hk-analytics'].checked === false);
  checar('nada gravado antes da escolha', !c.loja.has('hk-consent'));
}

console.log('\nFUNCIONAL · rejeita');
{
  const c = rodar(null);
  clicar(c, 'rejeitar');
  checar('zero requisicao ao Google', aoGoogle(c) === 0, `(${aoGoogle(c)})`);
  checar('decisao gravada como negada', JSON.parse(c.loja.get('hk-consent')).analytics === false);
  checar('cookies _ga apagados', c.cookiesApagados.some((x) => x.startsWith('_ga')));
}

console.log('\nFUNCIONAL · aceita');
{
  const c = rodar(null);
  clicar(c, 'aceitar');
  checar('gtag carregado uma vez', aoGoogle(c) === 1, `(${aoGoogle(c)})`);
  checar('decisao gravada com data', !!JSON.parse(c.loja.get('hk-consent')).data);
}

console.log('\nFUNCIONAL · retorno');
{
  const rejeitou = rodar({ v: 1, analytics: false, data: '2026-01-01T00:00:00.000Z' });
  checar('quem rejeitou continua sem Google', aoGoogle(rejeitou) === 0, `(${aoGoogle(rejeitou)})`);
  checar('banner nao reaparece para quem decidiu', rejeitou.els['hk-cookies'].hidden === true);
  const aceitou = rodar({ v: 1, analytics: true, data: '2026-01-01T00:00:00.000Z' });
  checar('quem aceitou carrega o gtag', aoGoogle(aceitou) === 1, `(${aoGoogle(aceitou)})`);
  const antigo = rodar({ v: 0, analytics: true, data: '2026-01-01T00:00:00.000Z' });
  checar('consentimento de versao antiga nao vale', aoGoogle(antigo) === 0, `(${aoGoogle(antigo)})`);
  checar('e a escolha e pedida de novo', antigo.els['hk-cookies'].hidden === false);
}

console.log('\n' + (falhas === 0
  ? 'OK: o consentimento e obtido antes de qualquer carga de terceiro.'
  : `FALHA: ${falhas} verificacao(oes) de conformidade nao passaram.`));
process.exit(falhas === 0 ? 0 : 1);
