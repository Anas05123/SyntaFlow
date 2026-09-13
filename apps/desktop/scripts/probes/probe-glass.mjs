import { chromium } from 'file:///C:/Users/Anas/Desktop/CoreDesk/node_modules/playwright/index.mjs';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 940 } });
await p.goto('http://localhost:4174/#/settings/account', { waitUntil: 'load' });
await p.waitForTimeout(600);
await p.evaluate(() => { [...document.querySelectorAll('.ap-seg button')].find(x=>x.textContent.trim()==='Glass')?.click(); });
await p.waitForTimeout(400);
const r = await p.evaluate(() => {
  const rail = document.querySelector('.rail');
  const cs = getComputedStyle(rail);
  // walk the actual matching rules
  const matching = [];
  for (const sheet of document.styleSheets) {
    let rules; try { rules = sheet.cssRules; } catch { continue; }
    for (const rule of rules) {
      if (rule.selectorText && rule.selectorText.includes('data-surface') && rule.selectorText.includes('rail')) {
        matching.push({ sel: rule.selectorText, bf: rule.style.getPropertyValue('backdrop-filter'),
          wbf: rule.style.getPropertyValue('-webkit-backdrop-filter'),
          bg: rule.style.getPropertyValue('background') });
      }
    }
  }
  return {
    attr: document.documentElement.getAttribute('data-surface'),
    computedBackdrop: cs.backdropFilter,
    computedWebkit: cs.webkitBackdropFilter ?? cs.getPropertyValue('-webkit-backdrop-filter'),
    supportsStandard: CSS.supports('backdrop-filter', 'blur(4px)'),
    supportsWebkit: CSS.supports('-webkit-backdrop-filter', 'blur(4px)'),
    matchedRules: matching,
  };
});
console.log(JSON.stringify(r, null, 2));
await b.close();
