/**
 * Phase 1 re-review capture. Read-only against the running build.
 * Captures every A01 state, the Security & help modal, and the tab identity.
 */

import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:4174/';
const OUT = 'C:/Users/Anas/Desktop/CoreDesk/.phase1-review';
const findings = [];
const log = (...a) => console.log(...a);

const browser = await chromium.launch();

/* ---- 1. Every A01 state at 1440x900 ------------------------------------- */
const SHOTS = [
  { name: 'ready', route: '#/auth' },
  { name: 'loading', route: '#/auth?state=loading' },
  { name: 'unavailable', route: '#/auth?state=unavailable' },
  { name: 'returning', route: '#/auth?state=returning' },
];

for (const s of SHOTS) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
  page.on('console', (m) => m.type() === 'error' && errs.push('console: ' + m.text()));
  await page.goto(BASE + s.route, { waitUntil: 'load' });
  await page.waitForTimeout(1900);

  const m = await page.evaluate(() => {
    const t = (sel) => (document.querySelector(sel)?.textContent ?? '').trim();
    const all = (sel) => [...document.querySelectorAll(sel)].map((e) => e.textContent.trim());
    const strong = [...document.querySelectorAll('.auth-actions .btn')].map((b) => ({
      label: b.textContent.trim(),
      cls: b.className,
      disabled: b.disabled,
    }));
    return {
      state: document.querySelector('.auth-entry')?.dataset.state,
      headline: t('.auth-headline'),
      headlineH: Math.round(document.querySelector('.auth-headline')?.getBoundingClientRect().height ?? 0),
      headlineFs: getComputedStyle(document.querySelector('.auth-headline')).fontSize,
      buttons: strong,
      stations: all('.auth-station-label'),
      alerts: all('[role="alert"]').length,
      status: t('.auth-status'),
      linkBtns: all('.link-btn'),
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      metaDesc: t('meta[name="description"]') || document.querySelector('meta[name="description"]')?.content,
      title: document.title,
      icon: document.querySelector('link[rel="icon"]')?.getAttribute('href'),
    };
  });

  const lines = m.headlineH / (parseFloat(m.headlineFs) * 1.1);
  if (errs.length) findings.push(`${s.name}: console errors ${errs.join(' | ')}`);
  if (m.overflow > 2) findings.push(`${s.name}: h-overflow ${m.overflow}px`);

  log(`\n--- ${s.name} ---`);
  log(`  state=${m.state}  title="${m.title}"  icon=${m.icon}`);
  log(`  buttons: ${m.buttons.map((b) => `[${b.label}]${b.disabled ? '(disabled)' : ''}`).join(' ')}`);
  log(`  stations(${m.stations.length}): ${m.stations.join(' · ')}`);
  log(`  headline ~${lines.toFixed(2)} lines @${m.headlineFs}  alerts=${m.alerts}  status="${m.status}"`);
  log(`  link-btn: ${JSON.stringify(m.linkBtns)}`);
  log(`  overflow=${m.overflow}px`);

  await page.screenshot({ path: `${OUT}/${s.name}.png` });
  await page.close();
}

/* ---- 2. Security & help modal ------------------------------------------- */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + '#/auth', { waitUntil: 'load' });
  await page.waitForTimeout(900);
  await page.click('.auth-secure .link-btn');
  await page.waitForTimeout(500);

  const modal = await page.evaluate(() => {
    const el = document.querySelector('[role="dialog"], .modal');
    if (!el) return null;
    const txt = el.innerText;
    return {
      present: true,
      cls: el.className,
      heading: el.querySelector('h1,h2,h3')?.textContent?.trim() ?? '',
      text: txt.slice(0, 700),
      buttons: [...el.querySelectorAll('button')].map((b) => b.textContent.trim()),
      primaryCount: el.querySelectorAll('.btn-primary').length,
      hasLocalityClaim: /stays on your machine|on your machine|never leaves|stored locally/i.test(txt),
    };
  });
  if (!modal) findings.push('security-help: modal did not open');
  else {
    log('\n--- security-help modal ---');
    log(`  heading: ${modal.heading}`);
    log(`  primary buttons: ${modal.primaryCount}  all buttons: ${JSON.stringify(modal.buttons)}`);
    log(`  locality claim inside modal: ${modal.hasLocalityClaim}`);
    log(`  text: ${modal.text.replace(/\n+/g, ' | ').slice(0, 520)}`);
  }
  await page.screenshot({ path: `${OUT}/security-help.png` });

  /* Esc must close it. */
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  const closed = await page.evaluate(() => !document.querySelector('[role="dialog"], .modal'));
  log(`  Esc closes modal: ${closed}`);
  if (!closed) findings.push('security-help: Esc did not close the modal');

  /* Both triggers must work (copy link + footer link). */
  const triggers = await page.$$('.link-btn');
  log(`  link-btn triggers on page: ${triggers.length}`);
  if (triggers.length !== 2) findings.push(`security-help: expected 2 triggers, found ${triggers.length}`);
  await page.close();
}

/* ---- 3. Narrow width: headline orphan check 1080..1920 ------------------ */
{
  log('\n--- headline wrap by width (ready) ---');
  for (const w of [1024, 1152, 1280, 1366, 1440, 1600, 1920]) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    await page.goto(BASE + '#/auth', { waitUntil: 'load' });
    await page.waitForTimeout(700);
    const r = await page.evaluate(() => {
      const h1 = document.querySelector('.auth-headline');
      const cs = getComputedStyle(h1);
      const fs = parseFloat(cs.fontSize);
      const lh = fs * parseFloat(cs.lineHeight) / fs || fs * 1.1;
      const rect = h1.getBoundingClientRect();
      const lines = Math.round(rect.height / parseFloat(cs.lineHeight));
      const w = h1.getBoundingClientRect().width;
      /* last line width = text width minus full-line width, measured via Range */
      return { fs, lh, lines, w: Math.round(w), lineHeight: parseFloat(cs.lineHeight) };
    });
    const orphan = r.lines > 2 ? 'THREE-LINE' : '';
    log(`  ${String(w).padStart(4)}px  fs=${r.fs.toFixed(1)}  lines=${r.lines} ${orphan}`);
    if (r.lines > 2) findings.push(`headline orphans to ${r.lines} lines at ${w}px`);
    await page.close();
  }
}

/* ---- 4. Entry-route reachability ---------------------------------------- */
{
  log('\n--- entry routes ---');
  for (const route of ['#/signin', '#/signup', '#/terms', '#/privacy', '#/verify', '#/recover', '#/setup']) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(BASE + route, { waitUntil: 'load' });
    await page.waitForTimeout(600);
    const t = await page.evaluate(() => ({
      h: document.querySelector('h1')?.textContent?.trim() ?? '(none)',
      body: document.body.innerText.replace(/\n+/g, ' | ').slice(0, 150),
    }));
    log(`  ${route.padEnd(10)} -> h1="${t.h}"`);
    await page.close();
  }
}

await browser.close();

log('\n================ FINDINGS ================');
if (findings.length === 0) log('  none');
else findings.forEach((f) => log('  * ' + f));
