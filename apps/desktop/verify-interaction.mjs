/**
 * Interaction-surface audit for A01.
 *
 * Checks the things a screenshot cannot show: the cursor each control presents,
 * and the hit-target sizes. A button that does not advertise itself as clickable
 * is a usability defect that is completely invisible in a still frame.
 */

import { chromium } from 'file:///C:/Users/Anas/Desktop/CoreDesk/node_modules/playwright/index.mjs';

const BASE = process.env.CD_BASE || 'http://localhost:4174/';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 940 } });
await page.goto(`${BASE}#/auth`, { waitUntil: 'load' });
await page.waitForTimeout(1400);

const audit = await page.evaluate(() => {
  const seen = [];
  const els = [...document.querySelectorAll('button, a[href], [role="button"]')];
  for (const el of els) {
    if (el.offsetParent === null) continue;
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    seen.push({
      label: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 22),
      cls: typeof el.className === 'string' ? el.className.split(' ')[0] : el.tagName,
      cursor: cs.cursor,
      w: Math.round(r.width),
      h: Math.round(r.height),
      disabled: el.disabled === true,
    });
  }
  return seen;
});

console.log('control                 cursor        size      state');
console.log('-'.repeat(64));
const problems = [];
for (const c of audit) {
  console.log(
    `${c.label.padEnd(22)}  ${c.cursor.padEnd(11)} ${String(c.w).padStart(4)}x${String(c.h).padEnd(4)} ${c.disabled ? 'disabled' : ''}`
  );
  /* Window controls are chrome: native title-bar buttons show the default arrow,
     so they are the one permitted exception. */
  const isChrome = c.cls === 'cd-control';
  if (c.disabled) {
    if (c.cursor !== 'not-allowed') problems.push(`${c.label}: disabled control shows "${c.cursor}"`);
  } else if (!isChrome && c.cursor !== 'pointer') {
    problems.push(`${c.label} (${c.cls}): cursor is "${c.cursor}", expected pointer`);
  }
  if (!isChrome && (c.h < 28 || c.w < 28)) {
    problems.push(`${c.label}: hit target ${c.w}x${c.h} is below the comfortable minimum`);
  }
}

/* Measured sizes of the elements that carry the composition. */
const sizes = await page.evaluate(() => {
  const box = (s) => { const e = document.querySelector(s); if (!e) return null;
    const r = e.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height) }; };
  const fs = (s) => { const e = document.querySelector(s); return e ? getComputedStyle(e).fontSize : null; };
  const primary = document.querySelector('.cd-action-primary');
  const secondary = document.querySelector('.cd-action-secondary');
  const bg = (el) => (el ? getComputedStyle(el).backgroundColor : null);
  const border = (el) => (el ? getComputedStyle(el).borderTopColor : null);
  return {
    wordmark: { ...box('.cd-brand-word'), font: fs('.cd-brand-word') },
    tagline: { ...box('.cd-tagline'), font: fs('.cd-tagline') },
    primary: box('.cd-action-primary'),
    secondary: box('.cd-action-secondary'),
    /* The secondary must read as clearly lower weight: no fill, and a border
       rather than the primary's solid ground. */
    primaryBg: bg(primary),
    secondaryBg: bg(secondary),
    secondaryBorder: border(secondary),
    art: box('.cd-thread-art'),
  };
});

console.log('\ncomposition');
console.log(`  wordmark       ${sizes.wordmark.font}  ${sizes.wordmark.w}x${sizes.wordmark.h}`);
console.log(`  tagline        ${sizes.tagline.font}  ${sizes.tagline.w}x${sizes.tagline.h}`);
console.log(`  Sign in        ${sizes.primary.w}x${sizes.primary.h}  bg=${sizes.primaryBg}`);
console.log(`  Create account ${sizes.secondary.w}x${sizes.secondary.h}  bg=${sizes.secondaryBg}  border=${sizes.secondaryBorder}`);
console.log(`  thread art     ${sizes.art.w}x${sizes.art.h} (full-bleed)`);

await browser.close();

console.log('');
if (problems.length) {
  console.log('--- PROBLEMS ---');
  for (const p of problems) console.log(`  ${p}`);
  process.exitCode = 1;
} else {
  console.log('Every interactive control advertises itself; no undersized hit targets.');
}
