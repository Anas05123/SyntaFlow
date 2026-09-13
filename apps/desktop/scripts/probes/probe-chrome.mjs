import { chromium } from 'file:///C:/Users/Anas/Desktop/CoreDesk/node_modules/playwright/index.mjs';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 940 } });
await p.goto('http://localhost:4174/#/home', { waitUntil: 'load' });
await p.waitForTimeout(900);
const r = await p.evaluate(() => {
  const c = document.querySelector('.cd-controls');
  const btns = c ? [...c.querySelectorAll('button')] : [];
  const drag = getComputedStyle(document.querySelector('.topbar')).webkitAppRegion;
  return {
    windowControls: btns.length,
    labels: btns.map(b => b.getAttribute('aria-label')),
    cursors: btns.map(b => getComputedStyle(b).cursor),
    topbarDragRegion: drag,
    crumbNoDrag: getComputedStyle(document.querySelector('.crumbs')).webkitAppRegion,
  };
});
console.log(JSON.stringify(r, null, 2));
await b.close();
