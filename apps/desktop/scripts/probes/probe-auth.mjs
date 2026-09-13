import { chromium } from 'file:///C:/Users/Anas/Desktop/CoreDesk/node_modules/playwright/index.mjs';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 940 } });
const errs = [];
p.on('pageerror', e => errs.push('pageerror: ' + e.message));
p.on('console', m => m.type() === 'error' && errs.push('console: ' + m.text().slice(0,140)));
await p.goto('http://localhost:4174/#/auth', { waitUntil: 'load' });
await p.waitForTimeout(1400);
const r = await p.evaluate(() => ({
  hash: location.hash,
  text: (document.body.innerText||'').replace(/\n+/g,' | ').slice(0,160),
  hasActions: document.querySelectorAll('.cd-action').length,
  classes: [...document.querySelectorAll('#root *')].slice(0,14).map(e => typeof e.className==='string'?e.className.split(' ')[0]:e.tagName).filter(Boolean),
}));
console.log(JSON.stringify(r, null, 2));
console.log('errors:', errs.length ? errs : 'none');
await b.close();
