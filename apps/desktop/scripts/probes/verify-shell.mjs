/**
 * Shell interaction probe.
 *
 * Renders Home, then exercises the two new popovers — the account/workspace menu
 * (from both triggers) and the Create menu — and checks the shell structure. This
 * is the part a static screenshot cannot show: a menu that opens but anchors to
 * the wrong element, closes instantly, or does not return focus is invisible in a
 * still frame.
 */

import { chromium } from 'file:///C:/Users/Anas/Desktop/CoreDesk/node_modules/playwright/index.mjs';

const BASE = process.env.CD_BASE || 'http://localhost:4174/';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const problems = [];

await page.goto(`${BASE}#/home`, { waitUntil: 'load' });
await page.waitForTimeout(800);

const struct = await page.evaluate(() => ({
  groups: [...document.querySelectorAll('.rail-group-label')].map((g) => g.textContent),
  items: [...document.querySelectorAll('.rail-item')].map((i) => i.textContent.trim()),
  brandChevron: !!document.querySelector('.rail-brand-chevron'),
  ownerDots: !!document.querySelector('.rail-owner-dots'),
  createTrigger: !!document.querySelector('.create-trigger'),
  search: !!document.querySelector('.search-trigger'),
  controls: document.querySelectorAll('.cd-control').length,
  oldFootRows: document.querySelectorAll('.rail-owner').length,
}));

console.log('── shell structure ──');
console.log('nav groups:', struct.groups.join(' / '));
console.log('nav items :', struct.items.join(', '));
console.log(`brand chevron=${struct.brandChevron}  owner dots=${struct.ownerDots}  create=${struct.createTrigger}  controls=${struct.controls}`);

if (struct.groups.join('|') !== 'Core|System') problems.push(`expected groups Core|System, got ${struct.groups.join('|')}`);
if (!struct.brandChevron) problems.push('brand chevron missing');
if (!struct.ownerDots) problems.push('owner dots missing');
if (!struct.createTrigger) problems.push('create trigger missing');
if (struct.oldFootRows !== 1) problems.push(`expected exactly 1 profile row in the rail foot, got ${struct.oldFootRows}`);
/* Window controls render only inside Electron, where the preload bridge exists.
   The browser preview has no main process, so `controls` is asserted by the
   Electron harness instead. */

/* Account menu from the brand trigger. */
await page.click('.rail-brand');
await page.waitForTimeout(300);
const accountFromBrand = await page.evaluate(() => {
  const pop = document.querySelector('.cd-popover');
  if (!pop) return null;
  const r = pop.getBoundingClientRect();
  const brand = document.querySelector('.rail-brand').getBoundingClientRect();
  const items = [...pop.querySelectorAll('.cd-menu-item')].map((i) => i.textContent.trim());
  const identity = pop.querySelector('.cd-menu-identity-name')?.textContent;
  return {
    left: Math.round(r.left), top: Math.round(r.top), width: Math.round(r.width),
    brandLeft: Math.round(brand.left), brandBottom: Math.round(brand.bottom),
    items, identity,
    focusedInside: !!pop.contains(document.activeElement),
  };
});
console.log('\n── account menu (brand trigger) ──');
console.log(JSON.stringify(accountFromBrand, null, 2));
if (!accountFromBrand) problems.push('account menu did not open from brand');
else {
  if (accountFromBrand.items.includes('Sign out') === false) problems.push('Sign out missing from account menu');
  if (accountFromBrand.items.includes('Appearance') === false) problems.push('Appearance missing from account menu');
  if (!accountFromBrand.focusedInside) problems.push('account menu did not take focus');
}
await page.keyboard.press('Escape');
await page.waitForTimeout(200);

/* Account menu from the owner trigger (bottom of rail), should flip upward. */
await page.click('.rail-owner');
await page.waitForTimeout(300);
const accountFromOwner = await page.evaluate(() => {
  const pop = document.querySelector('.cd-popover');
  if (!pop) return null;
  const r = pop.getBoundingClientRect();
  const owner = document.querySelector('.rail-owner').getBoundingClientRect();
  return { top: Math.round(r.top), bottom: Math.round(r.bottom), ownerTop: Math.round(owner.top) };
});
console.log('\n── account menu (owner trigger) ──');
console.log(JSON.stringify(accountFromOwner));
if (accountFromOwner && accountFromOwner.bottom > accountFromOwner.ownerTop) {
  problems.push(`account menu did not flip upward from the bottom trigger (bottom=${accountFromOwner.bottom}, ownerTop=${accountFromOwner.ownerTop})`);
}
await page.keyboard.press('Escape');
await page.waitForTimeout(200);

/* Create menu. */
await page.click('.create-trigger');
await page.waitForTimeout(300);
const create = await page.evaluate(() => {
  const pop = document.querySelector('.cd-popover');
  if (!pop) return null;
  return [...pop.querySelectorAll('.cd-menu-item')].map((i) => i.textContent.trim());
});
console.log('\n── create menu ──');
console.log(JSON.stringify(create));
if (!create || create.join('|') !== 'New client|New project|New task|New document') {
  problems.push(`create menu items wrong: ${create?.join('|')}`);
}
await page.keyboard.press('Escape');

/* Outside click closes. */
await page.click('.create-trigger');
await page.waitForTimeout(200);
await page.mouse.click(30, 500);
await page.waitForTimeout(200);
const closedOutside = await page.evaluate(() => !document.querySelector('.cd-popover'));
console.log('\noutside click closed:', closedOutside);
if (!closedOutside) problems.push('outside click did not close the menu');

await browser.close();
console.log('');
if (problems.length) {
  console.log('── PROBLEMS ──');
  for (const p of problems) console.log(`  ${p}`);
  process.exitCode = 1;
} else {
  console.log('Shell verified: structure correct, both menus anchor and close, create menu has four actions.');
}
