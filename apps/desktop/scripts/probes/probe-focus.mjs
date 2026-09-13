import { chromium } from 'file:///C:/Users/Anas/Desktop/CoreDesk/node_modules/playwright/index.mjs';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:4174/#/home', { waitUntil: 'load' });
await p.waitForTimeout(800);
await p.click('.rail-brand');
await p.waitForTimeout(300);
const r = await p.evaluate(() => {
  const pop = document.querySelector('.cd-popover');
  const ae = document.activeElement;
  return {
    popExists: !!pop,
    activeTag: ae ? ae.tagName : null,
    activeClass: ae ? ae.className : null,
    isBody: ae === document.body,
    activeInsidePop: pop ? pop.contains(ae) : false,
  };
});
console.log(JSON.stringify(r, null, 2));
await b.close();
