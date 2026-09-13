import { chromium } from 'file:///C:/Users/Anas/Desktop/CoreDesk/node_modules/playwright/index.mjs';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
await p.goto('http://localhost:4174/#/home', { waitUntil: 'load' });
await p.waitForTimeout(900);
const r = await p.evaluate(() => {
  const s = document.querySelector('.cd-focus-strip');
  const out = { exists: !!s };
  if (s) {
    const b = s.getBoundingClientRect();
    const cs = getComputedStyle(s);
    out.box = { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) };
    out.display = cs.display; out.visibility = cs.visibility; out.opacity = cs.opacity;
    out.segments = s.querySelectorAll('.cd-focus-segment').length;
    out.firstSegText = s.querySelector('.cd-focus-segment')?.innerText?.replace(/\n/g,' | ');
  }
  const main = document.querySelector('.cd-home-main');
  out.mainScrollHeight = main.scrollHeight; out.mainClientHeight = main.clientHeight;
  out.mainScrollTop = Math.round(main.scrollTop);
  return out;
});
console.log(JSON.stringify(r, null, 2));
await b.close();
