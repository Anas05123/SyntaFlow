/* Verify the built CoreDesk app in a real browser: every route, both themes,
   console errors, and the primary interactive flows. */

import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const PW = 'C:/Users/Anas/Desktop/CoreDesk/node_modules/playwright/index.mjs';
const { chromium } = await import(pathToFileURL(PW).href);

const defaultDist = 'C:/Users/Anas/Desktop/CoreDesk/apps/desktop/dist/index.html';
const BASE = process.env.CD_BASE || pathToFileURL(defaultDist).href;
const OUT = process.env.CD_OUT || path.join(path.dirname(fileURLToPath(import.meta.url)), '.shots');
mkdirSync(OUT, { recursive: true });

const ROUTES = [
  ['home', '#/home'],
  ['first-run', '#/first-run'],
  ['tasks', '#/tasks'],
  ['clients', '#/clients'],
  ['client-detail', '#/clients/cl-harbor'],
  ['client-prospect', '#/clients/cl-northgate'],
  ['projects', '#/projects'],
  ['project-overview', '#/projects/pr-identity'],
  ['project-work', '#/projects/pr-identity?tab=work'],
  ['project-documents', '#/projects/pr-identity?tab=documents'],
  ['project-reviews', '#/projects/pr-identity?tab=reviews'],
  ['project-delivery', '#/projects/pr-identity?tab=delivery'],
  ['documents', '#/documents'],
  ['document-write', '#/documents/doc-guidelines'],
  ['document-preview', '#/documents/doc-guidelines?view=preview'],
  ['document-history', '#/documents/doc-guidelines?view=history'],
  ['document-guest-preview', '#/documents/doc-guidelines?view=guest-preview&review=rv-1'],
  ['owner-preview', '#/preview/review?id=rv-1'],
  ['activity', '#/activity'],
  ['archive', '#/archive'],
  ['settings-account', '#/settings/account'],
  ['settings-defaults', '#/settings/defaults'],
  ['settings-access', '#/settings/access'],
  ['create-project', '#/new-project'],
  ['share-setup', '#/share'],
  ['auth', '#/auth'],
  ['onboarding', '#/onboarding'],
  ['terms', '#/terms'],
  ['guest-invite', '#/guest/invite'],
  ['guest-shared', '#/guest/shared'],
  ['guest-review', '#/guest/review'],
  ['guest-delivery', '#/guest/delivery'],
  ['guest-unavailable', '#/guest/unavailable'],
  ['guest-wrong-account', '#/guest/wrong-account'],
  ['not-found', '#/does-not-exist'],
];

const browser = await chromium.launch({
  headless: true,
  args: ['--allow-file-access-from-files', '--disable-web-security'],
});
const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
const page = await ctx.newPage();

const problems = [];
const consoleErrors = [];
page.on('pageerror', (e) => problems.push('pageerror: ' + e.message));
page.on('console', (m) => {
  if (m.type() === 'error') {
    // Filter out expected file protocol resource warnings if any
    const txt = m.text();
    if (!txt.includes('favicon.ico')) {
      consoleErrors.push(txt);
    }
  }
});

function getRouteUrl(hash) {
  const baseClean = BASE.split('#')[0];
  return `${baseClean}${hash}`;
}

let rendered = 0;
for (const [name, hash] of ROUTES) {
  try {
    await page.goto(getRouteUrl(hash), { waitUntil: 'load' });
    await page.waitForTimeout(250);

    const info = await page.evaluate(() => {
      const root = document.getElementById('root');
      const text = root ? root.innerText : '';
      return {
        len: text.length,
        docW: document.documentElement.scrollWidth,
        winW: window.innerWidth,
        hasTheme: document.documentElement.getAttribute('data-theme'),
      };
    });

    rendered += 1;

    if (info.len < 40) problems.push(`${name}: barely any text (${info.len} chars)`);
    if (info.docW > info.winW + 2) problems.push(`${name}: horizontal overflow ${info.docW} > ${info.winW}`);
    const bodyText = await page.evaluate(() => document.body.innerText);
    if (/undefined|NaN|\[object Object\]/.test(bodyText)) {
      const hits = ['undefined', 'NaN', '[object Object]'].filter((s) => bodyText.includes(s));
      problems.push(`${name}: contains ${hits.join(', ')}`);
    }
    if (name === 'home') await page.screenshot({ path: `${OUT}/app-home.png` });
    if (name === 'client-detail') await page.screenshot({ path: `${OUT}/app-client.png` });
    if (name === 'project-delivery') await page.screenshot({ path: `${OUT}/app-delivery.png` });
    if (name === 'document-write') await page.screenshot({ path: `${OUT}/app-document.png` });
    if (name === 'guest-review') await page.screenshot({ path: `${OUT}/app-guest.png` });
  } catch (e) {
    problems.push(`${name}: THREW ${e.message}`);
  }
}

/* ---- interactive flows ---- */
async function step(label, fn) {
  try {
    await fn();
  } catch (e) {
    problems.push(`interaction ${label}: ${e.message}`);
  }
}

await step('open task panel', async () => {
  await page.goto(getRouteUrl('#/tasks'), { waitUntil: 'load' });
  await page.waitForTimeout(300);
  const firstCard = page.locator('.cd-board-card').first();
  if ((await firstCard.count()) === 0) throw new Error('no task cards rendered on board');
  await firstCard.click();
  await page.waitForTimeout(400);
  const panel = page.locator('.task-inspector, .panel');
  if ((await panel.count()) === 0) throw new Error('task inspector panel did not open');
  await page.screenshot({ path: `${OUT}/app-task-panel.png` });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
});

await step('search palette', async () => {
  await page.goto(getRouteUrl('#/home'), { waitUntil: 'load' });
  await page.waitForTimeout(300);
  await page.keyboard.press('Control+k');
  await page.waitForTimeout(300);
  const palette = page.locator('.search-palette, .palette, .search-modal');
  if ((await palette.count()) === 0) throw new Error('search palette did not open on Ctrl+K');
  await page.keyboard.type('Northlight');
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/app-search.png` });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
});

await step('client onboarding drawer', async () => {
  await page.goto(getRouteUrl('#/clients'), { waitUntil: 'load' });
  await page.waitForTimeout(300);
  const addBtn = page.locator('button:has-text("New Client"), button:has-text("Add client")').first();
  if ((await addBtn.count()) === 0) throw new Error('no New Client button found');
  await addBtn.click();
  await page.waitForTimeout(400);
  const drawer = page.locator('.cd-studio-drawer, .client-studio-drawer, .panel, .modal');
  if ((await drawer.count()) === 0) throw new Error('client studio drawer did not open');
  await page.screenshot({ path: `${OUT}/app-new-client.png` });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
});

await step('task view switcher parity', async () => {
  await page.goto(getRouteUrl('#/tasks'), { waitUntil: 'load' });
  await page.waitForTimeout(300);
  await page.locator('button:has-text("List")').click();
  await page.waitForTimeout(300);
  const rows = await page.locator('.cd-tasks-list-row').count();
  if (rows === 0) throw new Error('no list rows rendered in List view');
  await page.locator('button:has-text("Board")').click();
  await page.waitForTimeout(300);
  const cols = await page.locator('.cd-board-column').count();
  if (cols === 0) throw new Error('no columns rendered in Board view');
});

await step('create project step 1 -> 2', async () => {
  await page.goto(getRouteUrl('#/new-project'), { waitUntil: 'load' });
  await page.waitForTimeout(300);
  const continueBtn = page.locator('button:has-text("Continue")');
  if ((await continueBtn.count()) > 0) {
    await continueBtn.click();
    await page.waitForTimeout(350);
    const body = await page.evaluate(() => document.body.innerText);
    if (!/Blueprint|Engagement|Scope/i.test(body)) throw new Error('blueprint scoping step did not open');
  }
});

await step('guest review flow', async () => {
  await page.goto(getRouteUrl('#/guest/review'), { waitUntil: 'load' });
  await page.waitForTimeout(300);
  const body = await page.evaluate(() => document.body.innerText);
  if (!/Review|Document|Sign-off|Approved/i.test(body)) {
    throw new Error('guest review screen did not render valid content');
  }
});

await step('light theme', async () => {
  await page.goto(getRouteUrl('#/clients'), { waitUntil: 'load' });
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
  await page.waitForTimeout(250);
  await page.screenshot({ path: `${OUT}/app-light.png` });
});

await browser.close();

/* ---- report ---- */
const lines = [];
lines.push(`routes rendered  : ${rendered}/${ROUTES.length}`);
lines.push(`console errors   : ${consoleErrors.length}`);
lines.push(`problems         : ${problems.length}`);
if (problems.length || consoleErrors.length) {
  lines.push('');
  lines.push('--- PROBLEMS ---');
  for (const p of [...new Set(problems)]) lines.push(' * ' + p);
  lines.push('--- CONSOLE ERRORS ---');
  for (const c of [...new Set(consoleErrors)].slice(0, 12)) lines.push(' * ' + c);
} else {
  lines.push('');
  lines.push('Every route rendered, every flow behaved.');
}
const report = lines.join('\n');
console.log(report);
process.exitCode = problems.length || consoleErrors.length ? 1 : 0;
