import { chromium } from 'file:///C:/Users/Anas/Desktop/CoreDesk/node_modules/playwright/index.mjs';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
p.on('pageerror', e => errs.push('pageerror: ' + e.message));
p.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text().slice(0,200)); });
await p.goto('http://localhost:4174/#/home', { waitUntil: 'load' });
await p.waitForTimeout(800);
// check the trigger exists and is clickable
const trig = await p.evaluate(() => {
  const b = document.querySelector('.create-trigger');
  if (!b) return null;
  const r = b.getBoundingClientRect();
  return { exists: true, x: r.left + r.width/2, y: r.top + r.height/2, pointer: getComputedStyle(b).pointerEvents, tag: b.tagName };
});
console.log('trigger:', JSON.stringify(trig));
await p.click('.create-trigger');
await p.waitForTimeout(500);
const after = await p.evaluate(() => ({
  popoverCount: document.querySelectorAll('.cd-popover').length,
  bodyChildren: document.body.children.length,
  hasMenuRole: !!document.querySelector('[role=menu]'),
}));
console.log('after click:', JSON.stringify(after));
console.log('errors:', errs.length ? errs : 'none');
await b.close();
