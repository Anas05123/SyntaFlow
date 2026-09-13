import { chromium } from 'file:///C:/Users/Anas/Desktop/CoreDesk/node_modules/playwright/index.mjs';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 940 } });
await p.goto('http://localhost:4174/#/home', { waitUntil: 'load' });
await p.waitForTimeout(1000);
const m = await p.evaluate(() => {
  const box = (s) => { const e = document.querySelector(s); if (!e) return null;
    const r = e.getBoundingClientRect(); return { x: Math.round(r.x), r: Math.round(r.right), w: Math.round(r.width), h: Math.round(r.height) }; };
  const btn = document.querySelector('.cd-action-row .btn');
  const btnCS = btn ? getComputedStyle(btn) : null;
  const seg = document.querySelector('.cd-focus-segment');
  return {
    main: box('.cd-home-main'),
    rail: box('.cd-context-rail'),
    panel: box('.cd-section-panel'),
    tableHead: box('.cd-table-head'),
    firstRow: box('.cd-action-row'),
    rowBtn: btn ? { w: Math.round(btn.getBoundingClientRect().width), h: Math.round(btn.getBoundingClientRect().height), fontSize: btnCS.fontSize } : null,
    segBg: seg ? getComputedStyle(seg).backgroundColor : null,
    focusStrip: box('.cd-focus-strip'),
    overflowX: document.documentElement.scrollWidth - window.innerWidth,
    work: box('.work'),
  };
});
console.log(JSON.stringify(m, null, 2));
// is the main panel clipped by the rail?
if (m.main && m.rail) {
  console.log('\nmain right edge:', m.main.r, ' rail left edge:', m.rail.x);
  console.log('overlap:', m.main.r > m.rail.x ? 'YES — main runs under the rail' : 'no');
}
await b.close();
