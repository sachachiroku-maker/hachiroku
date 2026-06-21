/**
 * Identifica exatamente qual elemento causa overflow horizontal.
 */
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });

  for (const [vpName, vp] of [
    ['mobile', { width: 375, height: 812 }],
    ['desktop', { width: 1280, height: 720 }],
  ]) {
    const ctx = await browser.newContext({ viewport: vp });
    const page = await ctx.newPage();

    const pages = vpName === 'mobile'
      ? [{ url: 'http://localhost:4321/', label: 'home' }]
      : [{ url: 'http://localhost:4321/problemas/chevrolet/onix/', label: 'problemas-modelo' }];

    for (const { url, label } of pages) {
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(500);

      const overflowers = await page.evaluate(() => {
        const docW = document.documentElement.clientWidth;
        const results = [];
        const all = document.querySelectorAll('*');
        for (const el of all) {
          const rect = el.getBoundingClientRect();
          if (rect.right > docW + 1 || rect.width > docW + 1) {
            const style = window.getComputedStyle(el);
            results.push({
              tag: el.tagName.toLowerCase(),
              id: el.id || '',
              cls: [...el.classList].slice(0, 3).join(' '),
              right: Math.round(rect.right),
              width: Math.round(rect.width),
              docW,
              overflow: style.overflow,
              position: style.position,
            });
          }
        }
        return results.slice(0, 15);
      });

      console.log(`\n=== [${vpName}] ${label} — viewport=${vp.width} ===`);
      if (overflowers.length === 0) {
        console.log('  Nenhum elemento visível além do viewport');
      } else {
        for (const el of overflowers) {
          console.log(`  ${el.tag}#${el.id}.${el.cls} → right=${el.right}px width=${el.width}px pos=${el.position} overflow=${el.overflow}`);
        }
      }
    }
    await ctx.close();
  }

  await browser.close();
})();
