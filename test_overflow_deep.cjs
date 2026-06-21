/**
 * Inspetor de overflow profundo — verifica TODOS os elementos incluindo os abaixo do fold.
 * Usa offsetLeft + offsetWidth para capturar elementos fora da viewport inicial.
 */
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });

  for (const [vpName, vp] of [
    ['desktop', { width: 1280, height: 720 }],
    ['mobile', { width: 375, height: 812 }],
  ]) {
    const ctx = await browser.newContext({ viewport: vp });
    const page = await ctx.newPage();
    await page.goto('http://localhost:4321/problemas/chevrolet/onix/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const info = await page.evaluate(() => {
      const docW = document.documentElement.clientWidth;
      const scrollW = document.documentElement.scrollWidth;
      const results = [];
      const all = document.querySelectorAll('*');

      for (const el of all) {
        // offsetLeft+offsetWidth checks true document position
        const right = el.offsetLeft + el.offsetWidth;
        if (right > docW + 2) {
          const style = window.getComputedStyle(el);
          results.push({
            tag: el.tagName.toLowerCase(),
            id: el.id || '',
            cls: [...el.classList].slice(0, 3).join(' '),
            offsetLeft: el.offsetLeft,
            offsetWidth: el.offsetWidth,
            right,
            overflow: style.overflow,
            position: style.position,
            display: style.display,
            minWidth: style.minWidth,
            textSnippet: (el.textContent || '').slice(0, 40).trim().replace(/\s+/g, ' '),
          });
        }
      }
      return { docW, scrollW, results: results.slice(0, 20) };
    });

    console.log(`\n=== [${vpName}] /problemas/chevrolet/onix/ — viewport=${vp.width} scrollW=${info.scrollW} ===`);
    if (info.results.length === 0) {
      console.log('  Nenhum elemento fora do viewport');
    } else {
      for (const el of info.results) {
        console.log(`  ${el.tag}#${el.id}.${el.cls} → offsetLeft=${el.offsetLeft} + width=${el.offsetWidth} = right=${el.right} | pos=${el.position} display=${el.display} minWidth=${el.minWidth}`);
        if (el.textSnippet) console.log(`    text: "${el.textSnippet}"`);
      }
    }
    await ctx.close();
  }

  await browser.close();
})();
