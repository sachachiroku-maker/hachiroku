/**
 * Busca elementos cujo próprio scrollWidth > clientWidth
 * e elementos com getBoundingClientRect incluindo scroll offset.
 */
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4321/problemas/chevrolet/onix/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);

  const info = await page.evaluate(() => {
    const docW = document.documentElement.clientWidth;
    const scrollW = document.documentElement.scrollWidth;

    // 1. Elementos com scrollWidth próprio > clientWidth
    const selfOverflow = [];
    for (const el of document.querySelectorAll('*')) {
      if (el.scrollWidth > el.clientWidth + 2 && el.scrollWidth > 200) {
        selfOverflow.push({
          tag: el.tagName.toLowerCase(),
          cls: [...el.classList].slice(0, 3).join(' '),
          scrollWidth: el.scrollWidth,
          clientWidth: el.clientWidth,
          overflow: window.getComputedStyle(el).overflow,
          overflowX: window.getComputedStyle(el).overflowX,
        });
      }
    }

    // 2. Elementos com getBoundingClientRect().right > docW (pega mesmo deslocados por scroll)
    const visOverflow = [];
    for (const el of document.querySelectorAll('*')) {
      const r = el.getBoundingClientRect();
      if (r.right > docW + 2) {
        visOverflow.push({
          tag: el.tagName.toLowerCase(),
          cls: [...el.classList].slice(0, 3).join(' '),
          right: Math.round(r.right),
          left: Math.round(r.left),
          width: Math.round(r.width),
        });
      }
    }

    return { docW, scrollW, selfOverflow: selfOverflow.slice(0, 15), visOverflow: visOverflow.slice(0, 10) };
  });

  console.log(`scrollWidth=${info.scrollW} clientWidth=${info.docW}`);
  console.log('\n--- Elementos com scrollWidth próprio excessivo ---');
  if (!info.selfOverflow.length) console.log('  nenhum');
  info.selfOverflow.forEach(e => console.log(`  ${e.tag}.${e.cls}: scrollW=${e.scrollWidth} clientW=${e.clientWidth} overflowX=${e.overflowX}`));

  console.log('\n--- Elementos visíveis além do viewport ---');
  if (!info.visOverflow.length) console.log('  nenhum');
  info.visOverflow.forEach(e => console.log(`  ${e.tag}.${e.cls}: right=${e.right} left=${e.left} width=${e.width}`));

  await browser.close();
})();
