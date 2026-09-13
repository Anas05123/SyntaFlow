import { chromium } from 'file:///C:/Users/Anas/Desktop/CoreDesk/node_modules/playwright/index.mjs';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 940 } });
const failed = [];
p.on('requestfailed', r => failed.push(r.url() + ' :: ' + (r.failure()?.errorText || '')));
p.on('response', r => { if (r.url().includes('mark') || r.url().includes('logo')) console.log('RESP', r.status(), r.url()); });
await p.goto('http://localhost:4174/#/auth', { waitUntil: 'load' });
await p.waitForTimeout(1600);
const r = await p.evaluate(() => {
  const imgs = [...document.querySelectorAll('img')].map(i => ({
    src: i.getAttribute('src'),
    currentSrc: i.currentSrc,
    complete: i.complete,
    natW: i.naturalWidth, natH: i.naturalHeight,
    cls: i.className,
    box: (() => { const b = i.getBoundingClientRect(); return [Math.round(b.width), Math.round(b.height)]; })(),
  }));
  const centre = document.querySelector('.cd-hero-orbit-centre, .cd-auth-core, .cd-orbit-centre');
  return { imgs, centreHtml: centre ? centre.innerHTML.slice(0, 300) : null };
});
console.log(JSON.stringify(r, null, 2));
console.log('failed requests:', failed.length ? failed : 'none');
await b.close();
