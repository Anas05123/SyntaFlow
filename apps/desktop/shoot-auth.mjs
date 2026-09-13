/**
 * Phase 1 review harness — captures A01 Auth Entry at 1440x900 in every state,
 * at two window sizes, plus reduced-motion. Not part of verify-app.mjs.
 */

import { chromium } from 'file:///C:/Users/Anas/Desktop/CoreDesk/node_modules/playwright/index.mjs';

const BASE = process.env.CD_BASE || 'http://127.0.0.1:4174/';
const OUT = '.shots/phase1';

const SHOTS = [
  { name: 'a01-ready-1440', route: '#/auth', w: 1440, h: 900 },
  { name: 'a01-loading-1440', route: '#/auth?state=loading', w: 1440, h: 900 },
  { name: 'a01-unavailable-1440', route: '#/auth?state=unavailable', w: 1440, h: 900 },
  { name: 'a01-returning-1440', route: '#/auth?state=returning', w: 1440, h: 900 },
  { name: 'a01-ready-1920', route: '#/auth', w: 1920, h: 1080 },
  { name: 'a01-ready-1280', route: '#/auth', w: 1280, h: 800 },
  { name: 'a01-stub-signin', route: '#/signin', w: 1440, h: 900 },
  { name: 'a01-rail-mark-home', route: '#/home', w: 1440, h: 900 },
];

const browser = await chromium.launch();
const problems = [];

for (const shot of SHOTS) {
  const page = await browser.newPage({ viewport: { width: shot.w, height: shot.h } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => m.type() === 'error' && errors.push(`console: ${m.text()}`));

  await page.goto(`${BASE}${shot.route}`, { waitUntil: 'load' });
  await page.waitForTimeout(1900); // let the thread draw settle

  const info = await page.evaluate(() => ({
    len: document.body.innerText.length,
    docW: document.documentElement.scrollWidth,
    winW: window.innerWidth,
    docH: document.documentElement.scrollHeight,
    winH: window.innerHeight,
    bad: (document.body.innerText.match(/undefined|NaN|\[object Object\]/g) || []).slice(0, 4),
    stations: document.querySelectorAll('.auth-station').length,
    pathLen: document.querySelector('.auth-thread-path')?.getTotalLength?.() ?? 0,
  }));

  if (info.bad.length) problems.push(`${shot.name}: leaked ${info.bad.join(', ')}`);
  if (info.docW > info.winW + 2) problems.push(`${shot.name}: horizontal overflow ${info.docW}>${info.winW}`);
  if (errors.length) problems.push(`${shot.name}: ${errors.join(' | ')}`);
  if (shot.route.includes('/auth') && info.stations !== 6) problems.push(`${shot.name}: ${info.stations} stations, expected 6`);
  if (shot.route.includes('/auth') && info.pathLen < 100) problems.push(`${shot.name}: thread path length ${info.pathLen}`);

  await page.screenshot({ path: `${OUT}/${shot.name}.png` });
  console.log(
    `${shot.name.padEnd(24)} ${shot.w}x${shot.h}  text=${String(info.len).padStart(5)}  ` +
      `scroll=${info.docW}x${info.docH}  stations=${info.stations}  pathLen=${Math.round(info.pathLen)}`
  );
  await page.close();
}

/* Reduced motion must render the thread whole, with no animation. */
const rm = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
await rm.goto(`${BASE}#/auth`, { waitUntil: 'load' });
await rm.waitForTimeout(400);
const rmInfo = await rm.evaluate(() => {
  const p = document.querySelector('.auth-thread-path');
  const cs = p ? getComputedStyle(p) : null;
  return { dash: cs?.strokeDasharray ?? 'none', anim: cs?.animationName ?? 'none', dashoffset: cs?.strokeDashoffset ?? '' };
});
console.log(`reduced-motion           dasharray=${rmInfo.dash} animation=${rmInfo.anim} offset=${rmInfo.dashoffset}`);
if (rmInfo.anim !== 'none') problems.push(`reduced-motion: animation still ${rmInfo.anim}`);
await rm.screenshot({ path: `${OUT}/a01-ready-reduced-motion.png` });
await rm.close();

/* ---- Security & help, and the keyboard path to it ------------------------ */

const kb = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const kbErrors = [];
kb.on('pageerror', (e) => kbErrors.push(`pageerror: ${e.message}`));
kb.on('console', (m) => m.type() === 'error' && kbErrors.push(`console: ${m.text()}`));
await kb.goto(`${BASE}#/auth`, { waitUntil: 'load' });
await kb.waitForTimeout(1900);

/* Tab order: the two entry actions come first, then the overlay trigger. */
const order = [];
for (let i = 0; i < 5; i += 1) {
  await kb.keyboard.press('Tab');
  order.push(
    await kb.evaluate(() => {
      const el = document.activeElement;
      if (!el) return 'none';
      const cs = getComputedStyle(el);
      return `${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ')[0] || '-'}|focusVisible=${el.matches(':focus-visible')}|outline=${cs.outlineStyle} ${cs.outlineWidth}`;
    })
  );
}
console.log('tab order                ' + order.map((o) => o.split('|')[0]).join(' -> '));
if (!order.every((o) => o.includes('focusVisible=true'))) {
  problems.push(`tab order: a stop was not focus-visible — ${order.join(' ; ')}`);
}
if (!order.every((o) => o.includes('outline=solid'))) {
  problems.push(`tab order: a stop had no focus ring — ${order.join(' ; ')}`);
}

/* The third stop is "Security & help" in the footer; activate it with Enter. */
await kb.evaluate(() => {
  const btn = [...document.querySelectorAll('.auth-strip-links .link-btn')][0];
  if (btn) btn.focus();
});
await kb.keyboard.press('Enter');
await kb.waitForTimeout(350);

const help = await kb.evaluate(() => {
  const modal = document.querySelector('.modal');
  if (!modal) return { open: false };
  const shell = modal.querySelector('.modal-shell');
  const b = shell.getBoundingClientRect();
  return {
    open: true,
    role: modal.getAttribute('role'),
    ariaModal: modal.getAttribute('aria-modal'),
    label: modal.getAttribute('aria-label'),
    rows: shell.querySelectorAll('.def').length,
    box: [Math.round(b.width), Math.round(b.height)],
    viewport: [window.innerWidth, window.innerHeight],
    /* The route must not have changed: this is an overlay, not a navigation. */
    hash: window.location.hash,
    bodyText: document.body.innerText,
  };
});

if (!help.open) problems.push('security & help: modal did not open');
else {
  if (help.role !== 'dialog' || help.ariaModal !== 'true') problems.push('security & help: not a modal dialog');
  if (help.rows < 4) problems.push(`security & help: only ${help.rows} definition rows`);
  if (help.box[1] > help.viewport[1] - 40) problems.push(`security & help: modal ${help.box[1]}px tall in ${help.viewport[1]}px`);
  if (help.hash !== '#/auth') problems.push(`security & help: navigation changed to ${help.hash}`);
  if (!/Security & help/.test(help.bodyText)) problems.push('security & help: title missing');
}
console.log(`security & help          open=${help.open} role=${help.role} rows=${help.rows} box=${help.box?.join('x')} hash=${help.hash}`);
await kb.screenshot({ path: `${OUT}/a01-security-help-1440.png` });

/* Esc unwinds the modal and returns the link, not the page, to rest. */
await kb.keyboard.press('Escape');
await kb.waitForTimeout(300);
const closed = await kb.evaluate(() => ({
  modal: document.querySelectorAll('.modal').length,
  hash: window.location.hash,
}));
console.log(`esc closes               modal=${closed.modal} hash=${closed.hash}`);
if (closed.modal !== 0) problems.push('security & help: Esc did not close the modal');
if (closed.hash !== '#/auth') problems.push(`security & help: Esc changed route to ${closed.hash}`);
if (kbErrors.length) problems.push(`security & help: ${kbErrors.join(' | ')}`);
await kb.close();

await browser.close();

console.log('');
if (problems.length) {
  console.log('--- PROBLEMS ---');
  for (const p of [...new Set(problems)]) console.log('  ' + p);
  process.exitCode = 1;
} else {
  console.log('All Auth Entry states rendered clean at every size.');
}

