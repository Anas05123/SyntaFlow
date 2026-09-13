import { chromium } from 'file:///C:/Users/Anas/Desktop/CoreDesk/node_modules/playwright/index.mjs';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 940 } });
await p.goto('http://localhost:4174/#/settings/account', { waitUntil: 'load' });
await p.waitForTimeout(900);

const before = await p.evaluate(() => location.hash);
// find and click the Sign out button
const clicked = await p.evaluate(() => {
  const btn = [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Sign out');
  if (!btn) return false;
  btn.click();
  return true;
});
await p.waitForTimeout(700);
const after = await p.evaluate(() => ({
  hash: location.hash,
  toast: document.querySelector('.toast')?.innerText?.replace(/\n/g, ' | ') ?? null,
  onAuth: !!document.querySelector('.cd-scene') || !!document.querySelector('.cd-wordmark'),
  workspaceIntact: (() => { try { return !!JSON.parse(localStorage.getItem('coredesk.workspace.v1') || 'null'); } catch { return false; } })(),
}));

console.log('Sign out button found :', clicked);
console.log('hash before           :', before);
console.log('hash after            :', after.hash);
console.log('landed on Auth        :', after.onAuth);
console.log('toast                 :', after.toast);
console.log('workspace preserved   :', after.workspaceIntact);
await b.close();
