import { chromium } from 'file:///C:/Users/Anas/Desktop/CoreDesk/node_modules/playwright/index.mjs';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 940 } });
await p.goto('http://localhost:4174/#/home', { waitUntil: 'load' });
await p.waitForTimeout(800);
const r = await p.evaluate(() => {
  const cs = (s) => { const e = document.querySelector(s); return e ? getComputedStyle(e) : null; };
  const item = document.querySelector('.rail-item');
  const ib = item ? item.getBoundingClientRect() : null;
  const brand = document.querySelector('.rail-brand')?.getBoundingClientRect();
  return {
    railW: Math.round(document.querySelector('.rail').getBoundingClientRect().width),
    itemH: ib ? Math.round(ib.height) : null,
    itemFont: cs('.rail-item')?.fontSize,
    itemPad: cs('.rail-item')?.padding,
    itemGap: cs('.rail-nav > div')?.rowGap ?? cs('.rail-nav')?.gap,
    navGap: cs('.rail-nav')?.gap,
    groupLabelFont: cs('.rail-group-label')?.fontSize,
    groupLabelMargin: cs('.rail-group-label')?.margin,
    brandH: brand ? Math.round(brand.height) : null,
    brandPad: cs('.rail-brand')?.padding,
    topbarH: Math.round(document.querySelector('.topbar').getBoundingClientRect().height),
    searchH: Math.round(document.querySelector('.search-trigger').getBoundingClientRect().height),
  };
});
console.log(JSON.stringify(r, null, 2));
await b.close();
