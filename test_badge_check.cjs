/**
 * Tira screenshot full-page e checa badges problemáticas.
 */
const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4321/problemas/chevrolet/onix/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Screenshot full-page
  await page.screenshot({ path: 'C:\\Temp\\modelo_fullpage.png', fullPage: true });
  console.log('Screenshot: C:\\Temp\\modelo_fullpage.png');

  // Info sobre badges
  const badges = await page.evaluate(() => {
    const spans = [...document.querySelectorAll('span.badge')];
    return spans.map(s => ({
      text: s.textContent.trim().slice(0, 60),
      cls: [...s.classList].join(' '),
      scrollW: s.scrollWidth,
      clientW: s.clientWidth,
      computedWS: window.getComputedStyle(s).whiteSpace,
    }));
  });

  console.log('\nBadges na página:');
  badges.forEach(b => console.log(`  "${b.text}" → scrollW=${b.scrollW} clientW=${b.clientW} ws="${b.computedWS}" cls="${b.cls}"`));

  // Ver se o scroll horizontal é real ou apenas DOM quirk
  const pageInfo = await page.evaluate(() => ({
    htmlScrollW: document.documentElement.scrollWidth,
    bodyScrollW: document.body.scrollWidth,
    htmlClientW: document.documentElement.clientWidth,
    bodyOverflowX: window.getComputedStyle(document.body).overflowX,
    htmlOverflowX: window.getComputedStyle(document.documentElement).overflowX,
  }));
  console.log('\nPage info:', JSON.stringify(pageInfo, null, 2));

  await browser.close();
})();
