/**
 * Design audit loop — testa páginas-tipo no Hachiroku, mobile + desktop.
 * Detecta: overflow horizontal, imagens quebradas, JS errors, links 404.
 * Salva screenshots em C:\Temp\hachiroku_screenshots\
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = 'http://localhost:4321';
const SHOTS_DIR = 'C:\\Temp\\hachiroku_screenshots';

fs.mkdirSync(SHOTS_DIR, { recursive: true });

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 720 },
  { name: 'mobile',  width: 375,  height: 812,  isMobile: true },
];

// Páginas representativas de cada tipo
const PAGES = [
  { url: '/',                              label: 'home' },
  { url: '/busca/',                        label: 'busca' },
  { url: '/problemas/',                    label: 'problemas-index' },
  { url: '/problemas/chevrolet/onix/',     label: 'problemas-modelo' },
  { url: '/problemas/chevrolet/onix/motor-turbo-consumo-oleo/', label: 'problema-artigo' },
  { url: '/ficha-tecnica/',                label: 'fichas-index' },
  { url: '/ficha-tecnica/fiat/pulse-audace-1-0-turbo/', label: 'ficha-artigo' },
  { url: '/guia-de-compra/',               label: 'guias-index' },
  { url: '/guia-de-compra/comparativos/kicks-vs-creta/', label: 'guia-comparativo' },
  { url: '/guia-de-compra/jornada/estimador-custo-reparo/', label: 'guia-estimador' },
  { url: '/guia-de-compra/jornada/posso-continuar-dirigindo/', label: 'guia-posso-continuar' },
  { url: '/manutencao/',                   label: 'manutencao-index' },
  { url: '/eletricos/',                    label: 'eletricos-index' },
  { url: '/marca/chevrolet/',              label: 'marca-hub' },
  { url: '/sistema/freios/',               label: 'sistema-hub' },
  { url: '/sobre/',                        label: 'sobre' },
  { url: '/equipe/',                       label: 'equipe' },
];

const issues = [];

function addIssue(label, vp, type, detail) {
  issues.push({ label, viewport: vp.name, type, detail });
  console.log(`  ⚠ [${vp.name}] ${type}: ${detail}`);
}

async function testPage(page, url, label, vp, consoleErrors) {
  const fullUrl = BASE + url;
  let status = 200;

  try {
    const resp = await page.goto(fullUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
    status = resp ? resp.status() : 0;
    if (status >= 400) {
      addIssue(label, vp, 'HTTP_ERROR', `${status} em ${url}`);
      return;
    }
  } catch (e) {
    addIssue(label, vp, 'LOAD_ERROR', e.message.slice(0, 100));
    return;
  }

  await page.waitForTimeout(800);

  // Scroll até o fim para disparar lazy-load antes de checar imagens
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(600);
  await page.evaluate(() => window.scrollTo(0, 0));

  // 1. Overflow horizontal
  const hasHorizOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth + 2;
  });
  if (hasHorizOverflow) {
    const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientW = await page.evaluate(() => document.documentElement.clientWidth);
    addIssue(label, vp, 'HORIZ_OVERFLOW', `scrollWidth=${scrollW} > clientWidth=${clientW}`);
  }

  // 2. Imagens quebradas
  const brokenImgs = await page.evaluate(() => {
    return [...document.images]
      .filter(img => !img.complete || img.naturalWidth === 0)
      .map(img => img.src.replace(location.origin, ''));
  });
  if (brokenImgs.length > 0) {
    addIssue(label, vp, 'BROKEN_IMG', brokenImgs.slice(0, 3).join(', '));
  }

  // 3. H1 ausente
  const h1Count = await page.locator('h1').count();
  if (h1Count === 0) addIssue(label, vp, 'NO_H1', url);
  if (h1Count > 1)  addIssue(label, vp, 'MULTIPLE_H1', `${h1Count} h1 encontrados`);

  // 4. Console errors (coletados via listener)
  if (consoleErrors.length > 0) {
    const uniq = [...new Set(consoleErrors)].slice(0, 2);
    addIssue(label, vp, 'JS_ERROR', uniq.join(' | '));
    consoleErrors.length = 0;
  }

  // 5. Links internos que deveriam existir
  if (url === '/busca/') {
    await page.waitForTimeout(500);
    const input = await page.$('.pagefind-ui__search-input');
    if (!input) addIssue(label, vp, 'BUSCA_NO_INPUT', 'PagefindUI não renderizou');
    else {
      await input.fill('Onix');
      await page.waitForTimeout(2000);
      const result = await page.$('.pagefind-ui__result');
      if (!result) addIssue(label, vp, 'BUSCA_NO_RESULT', 'Busca por "Onix" não retornou resultado');
    }
  }

  // Screenshot
  const shotName = path.join(SHOTS_DIR, `${label}_${vp.name}.png`);
  await page.screenshot({ path: shotName, fullPage: false });
  console.log(`  ✓ [${vp.name}] ${label} — screenshot: ${path.basename(shotName)}`);
}

(async () => {
  const browser = await chromium.launch({ headless: true });

  for (const vp of VIEWPORTS) {
    console.log(`\n=== VIEWPORT: ${vp.name} (${vp.width}x${vp.height}) ===`);
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.isMobile ?? false,
      hasTouch: vp.isMobile ?? false,
    });
    const page = await ctx.newPage();
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text().slice(0, 120));
    });
    page.on('pageerror', err => consoleErrors.push(err.message.slice(0, 120)));

    for (const { url, label } of PAGES) {
      process.stdout.write(`→ ${label} `);
      await testPage(page, url, label, vp, consoleErrors);
    }
    await ctx.close();
  }

  await browser.close();

  // Relatório final
  console.log('\n\n========= RELATÓRIO DESIGN AUDIT =========');
  if (issues.length === 0) {
    console.log('✅ Nenhum problema encontrado!');
  } else {
    const byType = {};
    for (const i of issues) {
      byType[i.type] = byType[i.type] || [];
      byType[i.type].push(`[${i.viewport}] ${i.label}: ${i.detail}`);
    }
    for (const [type, items] of Object.entries(byType)) {
      console.log(`\n❌ ${type} (${items.length}x):`);
      items.forEach(i => console.log('   -', i));
    }
    console.log(`\nTotal: ${issues.length} problema(s) em ${PAGES.length} páginas × ${VIEWPORTS.length} viewports`);
  }

  // Salvar relatório JSON
  fs.writeFileSync('C:\\Temp\\design_audit.json', JSON.stringify(issues, null, 2));
  console.log('\nRelatório JSON: C:\\Temp\\design_audit.json');
  console.log('Screenshots: ' + SHOTS_DIR);
})();
