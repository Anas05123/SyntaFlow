import { chromium } from 'file:///C:/Users/Anas/Desktop/CoreDesk/node_modules/playwright/index.mjs';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
await p.goto('http://localhost:4174/#/home', { waitUntil: 'load' });
await p.waitForTimeout(800);
const r = await p.evaluate(() => {
  const box = (s) => { const e = document.querySelector(s); if (!e) return null;
    const b = e.getBoundingClientRect(); return { x: Math.round(b.x), r: Math.round(b.right), w: Math.round(b.width) }; };
  const layout = document.querySelector('.cd-home-layout');
  return {
    work: box('.work'),
    layout: box('.cd-home-layout'),
    main: box('.cd-home-main'),
    rail: box('.cd-context-rail'),
    cols: getComputedStyle(layout).gridTemplateColumns,
    gap: getComputedStyle(layout).gap,
    railPad: getComputedStyle(document.querySelector('.cd-context-rail')).paddingLeft,
    railMargin: getComputedStyle(document.querySelector('.cd-context-rail')).marginLeft,
  };
});
console.log(JSON.stringify(r, null, 2));
await b.close();
