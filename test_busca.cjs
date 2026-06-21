const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const BASE = 'http://localhost:4321';
  const results = [];

  async function test(name, fn) {
    try { await fn(); results.push({ name, ok: true }); }
    catch (e) { results.push({ name, ok: false, error: e.message.slice(0, 200) }); }
  }

  await test('Página /busca/ carrega', async () => {
    await page.goto(`${BASE}/busca/`, { waitUntil: 'networkidle' });
    const h1 = await page.textContent('h1');
    if (!h1.includes('procura')) throw new Error('H1 inesperado: ' + h1);
  });

  await test('Input de busca existe (PagefindUI)', async () => {
    await page.waitForSelector('.pagefind-ui__search-input', { timeout: 5000 });
  });

  await test('Busca "Onix" retorna resultados', async () => {
    await page.fill('.pagefind-ui__search-input', 'Onix');
    await page.waitForTimeout(2500);
    const msg = await page.textContent('.pagefind-ui__message').catch(() => '');
    console.log('  Msg Onix:', msg);
    const hasResults = await page.$('.pagefind-ui__result');
    if (!hasResults) throw new Error('Sem resultado. Mensagem: ' + msg);
  });

  await test('?q=freio pré-popula o input', async () => {
    await page.goto(`${BASE}/busca/?q=freio`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.pagefind-ui__search-input', { timeout: 5000 });
    await page.waitForTimeout(2500);
    const val = await page.inputValue('.pagefind-ui__search-input');
    console.log('  Input value após ?q=freio:', '"' + val + '"');
    if (!val.toLowerCase().includes('freio')) throw new Error('Input não pré-populado: "' + val + '"');
    const hasResults = await page.$('.pagefind-ui__result');
    if (!hasResults) throw new Error('Sem resultado com ?q=freio');
  });

  await test('Busca "consumo óleo" tem resultado', async () => {
    await page.goto(`${BASE}/busca/`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.pagefind-ui__search-input', { timeout: 5000 });
    await page.fill('.pagefind-ui__search-input', 'consumo óleo');
    await page.waitForTimeout(2500);
    const hasResults = await page.$('.pagefind-ui__result');
    if (!hasResults) throw new Error('Sem resultado para "consumo óleo"');
  });

  await test('Zero resultado: mensagem sem placeholder literal', async () => {
    await page.fill('.pagefind-ui__search-input', 'xyzabc123naoexiste');
    await page.waitForTimeout(2500);
    const msg = await page.textContent('.pagefind-ui__message').catch(() => '');
    console.log('  Msg zero resultado:', msg);
    if (msg.includes('[SEARCH_TERM]')) throw new Error('Placeholder não substituído: ' + msg);
  });

  await page.fill('.pagefind-ui__search-input', 'Onix motor');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'C:\\Temp\\busca_test.png' });
  console.log('  Screenshot: C:\\Temp\\busca_test.png');

  await browser.close();

  console.log('\n=== BUSCA HACHIROKU ===');
  for (const r of results) {
    console.log(r.ok ? 'PASS' : 'FAIL', r.name);
    if (!r.ok) console.log('     ->', r.error);
  }
  const fail = results.filter(r => !r.ok).length;
  console.log(`\n${results.length - fail}/${results.length} passaram`);
  if (fail > 0) process.exit(1);
})();
