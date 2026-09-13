import { chromium } from 'file:///C:/Users/Anas/Desktop/CoreDesk/node_modules/playwright/index.mjs';
const b = await chromium.launch();
for (const [w,h,name] of [[1280,720,'home-1280'],[1920,1080,'home-1920']]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto('http://localhost:4174/#/home', { waitUntil: 'load' });
  await p.waitForTimeout(900);
  await p.screenshot({ path: `.shots/electron/${name}.png` });
  await p.close();
}
await b.close();
console.log('captured');
