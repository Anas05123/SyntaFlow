/**
 * Browser-vs-desktop parity check for CoreDesk.
 *
 * CoreDesk is an Electron application, so the browser preview is a convenience,
 * not the target. This compares the same screens in both and reports where they
 * genuinely differ. Differences are expected in two places and must be
 * understood rather than ignored:
 *
 *   1. CONTENT AREA. Electron reserves window chrome, so a 1440x940 window has a
 *      1424x901 content area — every layout that keys off width lands ~1% narrower.
 *   2. ASSET LOADING. The desktop build loads over file://, where root-absolute
 *      URLs ("/assets/x.js") resolve to the drive root and 404. Anything absolute
 *      that works in the browser is broken in the app.
 *
 * Run:  node compare-runtimes.mjs
 * Needs the browser preview on :4174 and a completed `node electron/start.mjs`.
 */

import { chromium } from 'file:///C:/Users/Anas/Desktop/CoreDesk/node_modules/playwright/index.mjs';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const shots = path.join(here, '.shots');
const electronDir = path.join(shots, 'electron');
const reportPath = path.join(electronDir, 'last-report.json');

const BASE = process.env.CD_BASE || 'http://127.0.0.1:4174/';

/** Electron's content area for the default 1440x940 request. */
const CONTENT = { width: 1424, height: 901 };

const PAIRS = [
  { name: 'a01-ready', electron: 'a01-ready', route: '#/auth' },
  { name: 'a01-loading', electron: 'a01-loading', route: '#/auth?state=loading' },
  { name: 'a01-unavailable', electron: 'a01-unavailable', route: '#/auth?state=unavailable' },
  { name: 'a01-returning', electron: 'a01-returning', route: '#/auth?state=returning' },
  { name: 'a03-stub', electron: 'a03-stub', route: '#/signup' },
  { name: 'rail-mark-home', electron: 'rail-mark-home', route: '#/home' },
];

if (!existsSync(reportPath)) {
  console.error(`No desktop report at ${reportPath}\nRun: node electron/start.mjs`);
  process.exit(2);
}
const desktop = JSON.parse(readFileSync(reportPath, 'utf8'));

const PROBE = `(() => {
  const h1 = document.querySelector('h1, .auth-headline');
  const cs = h1 ? getComputedStyle(h1) : null;
  const mark = document.querySelector('.brand-mark');
  const markImg = mark ? mark.querySelector('img') : null;
  const box = el => { if (!el) return null; const b = el.getBoundingClientRect();
    return [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)]; };
  return {
    headlineFont: cs ? cs.fontSize : null,
    headlineFamily: cs ? cs.fontFamily.split(',')[0] : null,
    headlineBox: box(h1),
    markNatural: markImg ? [markImg.naturalWidth, markImg.naturalHeight] : null,
    /* The wrapper is the laid-out box; the image fills it, and the glow sits
       outside both, so the wrapper is what both runtimes must agree on. */
    markBox: box(mark),
    markWrapBox: mark ? [box(mark)[0], box(mark)[2], box(mark)[3]] : null,
    band: box(document.querySelector('.auth-band')),
    thread: box(document.querySelector('.auth-thread')),
    actions: box(document.querySelector('.auth-actions')),
    scrollW: document.documentElement.scrollWidth,
    canvasBg: getComputedStyle(document.documentElement).getPropertyValue('--canvas').trim(),
    stations: document.querySelectorAll('.auth-station').length,
    interLoaded: [...document.fonts].some(f => f.family.includes('Inter') && f.status === 'loaded'),
  };
})()`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: CONTENT });

const findings = [];
console.log(`browser   ${CONTENT.width}x${CONTENT.height} (chromium via playwright)`);
console.log(`desktop   ${desktop[0].observed.inner.join('x')} (content area inside an Electron frame)`);
console.log('');

const header = 'screen'.padEnd(18) + 'headline'.padEnd(24) + 'mark'.padEnd(18) + 'stations';
console.log(header);
console.log('-'.repeat(header.length + 6));

for (const pair of PAIRS) {
  await page.goto(`${BASE}${pair.route}`, { waitUntil: 'load' });
  await page.waitForTimeout(1700);
  const b = await page.evaluate(PROBE);

  const d = desktop.find((x) => x.shot === pair.electron);
  const e = d ? d.observed : null;

  const mark = b.markNatural ? `${b.markNatural.join('x')}→${b.markWrapBox[1]}px` : 'none';
  console.log(
    pair.name.padEnd(18) +
      `${b.headlineFamily} ${b.headlineFont}`.padEnd(24) +
      mark.padEnd(18) +
      `${b.stations}`
  );

  if (!e) {
    findings.push(`${pair.name}: no desktop capture`);
    continue;
  }

  /* Type must be identical: same family, same computed size. A difference here
     means the layout is being measured against different metrics. */
  if (e.headlineFamily !== b.headlineFamily) {
    findings.push(`${pair.name}: family ${b.headlineFamily} vs ${e.headlineFamily}`);
  }
  if (Math.abs(parseFloat(e.headlineFont) - parseFloat(b.headlineFont)) > 0.5) {
    findings.push(`${pair.name}: headline ${b.headlineFont} vs ${e.headlineFont}`);
  }

  /* Assets must resolve in both. This is the file:// trap. */
  if (!e.markNatural || e.markNatural[0] === 0) {
    findings.push(`${pair.name}: brand mark broken in desktop (${e.markSrc})`);
  }
  if (b.markNatural && e.markNatural && b.markNatural[0] !== e.markNatural[0]) {
    findings.push(`${pair.name}: mark ${b.markNatural[0]}px vs ${e.markNatural[0]}px`);
  }

  if (e.canvasBg !== b.canvasBg) findings.push(`${pair.name}: canvas ${b.canvasBg} vs ${e.canvasBg}`);
  if (e.stations !== b.stations) findings.push(`${pair.name}: stations ${b.stations} vs ${e.stations}`);
  if (e.scrollW > e.inner[0] + 2) findings.push(`${pair.name}: desktop overflow ${e.scrollW} > ${e.inner[0]}`);
  if (!e.interLoaded) findings.push(`${pair.name}: Inter not loaded in desktop`);

  /* Geometry: element widths must match exactly — they are laid out from the
     same content width. Y positions may shift if window height differs. */
  if (b.band && e.band) {
    const [bx, , bw] = b.band;
    const [ex, , ew] = e.band;
    if (Math.abs(bw - ew) > 1) findings.push(`${pair.name}: band width ${bw} vs ${ew}`);
    const dx = Math.abs(bx - ex);
    if (dx > 1) findings.push(`${pair.name}: band x offset ${bx} vs ${ex}`);
  }
  if (b.markWrapBox && e.markWrapBox) {
    if (b.markWrapBox[1] !== e.markWrapBox[1] || b.markWrapBox[2] !== e.markWrapBox[2]) {
      findings.push(
        `${pair.name}: mark wrapper ${b.markWrapBox[1]}x${b.markWrapBox[2]} vs ${e.markWrapBox[1]}x${e.markWrapBox[2]}`
      );
    }
    if (Math.abs(b.markWrapBox[0] - e.markWrapBox[0]) > 1) {
      findings.push(`${pair.name}: mark x ${b.markWrapBox[0]} vs ${e.markWrapBox[0]}`);
    }
  }
}

await browser.close();

console.log('');
console.log('Expected difference — desktop content area is 16px narrower and 1px taller');
console.log('than the 1440x900 browser viewport, because Electron frames the window.');
console.log('');

if (findings.length) {
  console.log('--- PARITY PROBLEMS ---');
  for (const f of findings) console.log(`  ${f}`);
  process.exit(1);
}
console.log('Browser and desktop agree on type, assets, geometry and state.');
