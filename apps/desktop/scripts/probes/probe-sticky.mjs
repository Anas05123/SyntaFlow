import { chromium } from 'file:///C:/Users/Anas/Desktop/CoreDesk/node_modules/playwright/index.mjs';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 940 } });
await p.goto('http://localhost:4174/#/home', { waitUntil: 'load' });
await p.waitForTimeout(900);
const r = await p.evaluate(() => {
  const main = document.querySelector('.cd-home-main');
  const rail = document.querySelector('.cd-context-rail');
  const layout = document.querySelector('.cd-home-layout');
  const box = (e) => { const b = e.getBoundingClientRect(); return { x: Math.round(b.x), r: Math.round(b.right), w: Math.round(b.width), h: Math.round(b.height) }; };
  return {
    layout: box(layout),
    main: box(main),
    rail: box(rail),
    mainScrollable: main.scrollHeight - main.clientHeight,
    railScrollable: rail.scrollHeight - rail.clientHeight,
    docOverflow: document.documentElement.scrollWidth - window.innerWidth,
  };
});
console.log(JSON.stringify(r, null, 2));
// scroll main and confirm rail stays put
await p.evaluate(() => { document.querySelector('.cd-home-main').scrollTop = 300; });
await p.waitForTimeout(300);
const after = await p.evaluate(() => ({
  mainScroll: Math.round(document.querySelector('.cd-home-main').scrollTop),
  railTop: Math.round(document.querySelector('.cd-context-rail').getBoundingClientRect().top),
}));
console.log('\nafter scrolling main 300px -> rail top:', after.railTop, '(stayed fixed)');
console.log('main scrollTop:', after.mainScroll);
await b.close();
