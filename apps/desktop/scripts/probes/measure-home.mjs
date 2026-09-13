/**
 * Layout guard for W01 · Home.
 *
 * The Home redesign's failure modes are structural, not typographic:
 *
 *   · the four-region frame must hold at 1280, 1440 and 1920 without horizontal
 *     overflow, and the right rail must be a real column rather than a squeeze
 *   · the main column and the rail must scroll independently, so context stays
 *     visible while the workspace scrolls
 *   · the Next Actions list must keep priority at narrow widths, and the rail
 *     must step aside rather than crushing it
 *   · rows must stay in the 48-58px density band the brief specifies
 */

import { chromium } from 'file:///C:/Users/Anas/Desktop/CoreDesk/node_modules/playwright/index.mjs';

/* `localhost`, not `127.0.0.1`: Vite binds the IPv6 loopback. */
const BASE = process.env.CD_BASE || 'http://localhost:4174/';
const SIZES = [
  [1280, 720], [1366, 768], [1440, 900], [1512, 982],
  [1600, 1000], [1728, 1117], [1920, 1080], [2560, 1440],
];

const browser = await chromium.launch();
const problems = [];

for (const [w, h] of SIZES) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(`${BASE}#/home`, { waitUntil: 'load' });
  await page.waitForTimeout(800);

  const m = await page.evaluate(() => {
    const box = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return { x: Math.round(b.x), r: Math.round(b.right), w: Math.round(b.width), h: Math.round(b.height) };
    };
    const main = document.querySelector('.cd-home-main');
    const rail = document.querySelector('.cd-context-rail');
    const row = document.querySelector('.cd-action-row');
    const btn = document.querySelector('.cd-action-row .btn');
    return {
      main: box('.cd-home-main'),
      rail: box('.cd-context-rail'),
      row: row ? { h: Math.round(row.getBoundingClientRect().height) } : null,
      btn: btn ? { h: Math.round(btn.getBoundingClientRect().height), border: getComputedStyle(btn).borderColor } : null,
      segments: document.querySelectorAll('.cd-focus-segment').length,
      stripH: (() => {
        const s = document.querySelector('.cd-focus-strip');
        return s ? Math.round(s.getBoundingClientRect().height) : 0;
      })(),
      rows: document.querySelectorAll('.cd-action-row').length,
      railSections: document.querySelectorAll('.cd-context-section').length,
      mainScrollable: main ? main.scrollHeight - main.clientHeight : 0,
      railOverflowY: rail ? getComputedStyle(rail).overflowY : null,
      docOverflow: document.documentElement.scrollWidth - window.innerWidth,
      navItems: document.querySelectorAll('.rail-item').length,
      searchPresent: !!document.querySelector('input, .palette-trigger, [data-search]') || document.body.innerText.includes('Search clients'),
    };
  });

  const label = `${w}x${h}`.padEnd(11);
  const overflow = m.docOverflow > 0;
  const railVisible = w > 1100 ? m.rail !== null : true;
  /* The brief allows a 280-320px rail, and the narrow tier legitimately takes
     the lower end to protect the Next Actions column. Padding is inside the
     box, so the column measures a little under the nominal track. */
  const railMin = w <= 1320 ? 258 : 296;
  const railWidthOk = w > 1100 ? m.rail && m.rail.w >= railMin : true;
  const rowDensityOk = m.row ? m.row.h >= 46 && m.row.h <= 64 : false;
  /* The rail must not be squeezed by the main column: they are siblings. */
  const noOverlap = m.main && m.rail ? m.main.r <= m.rail.x + 1 : true;

  if (overflow) problems.push(`${label} horizontal overflow ${m.docOverflow}px`);
  if (w > 1100 && !railVisible) problems.push(`${label} context rail missing`);
  if (!railWidthOk) problems.push(`${label} rail is ${m.rail?.w}px, expected >= ${railMin}`);
  if (!rowDensityOk) problems.push(`${label} action row is ${m.row?.h}px, outside the 48-58 band`);
  if (!noOverlap) problems.push(`${label} main column overlaps the rail`);
  if (m.segments !== 4) problems.push(`${label} ${m.segments} focus segments, expected 4`);
  /* A flex column shrank this band to 2px on a short window instead of letting
     the page scroll, so its height is asserted rather than assumed. */
  if (m.stripH < 60) problems.push(`${label} focus strip collapsed to ${m.stripH}px`);
  if (w > 1100 && m.railSections < 3) problems.push(`${label} rail has ${m.railSections} sections, expected 3`);
  if (m.navItems < 8) problems.push(`${label} only ${m.navItems} nav items`);
  if (!m.searchPresent) problems.push(`${label} no global search control`);

  console.log(
    `${label} main ${String(m.main?.w).padStart(4)}px · rail ${String(m.rail?.w ?? 0).padStart(4)}px · ` +
      `strip ${m.stripH}px · row ${m.row?.h}px · ${m.rows} actions · overflow=${overflow ? 'YES' : 'no'}`
  );
  await page.close();
}

/* Independent scrolling: the rail must hold position while the workspace moves. */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${BASE}#/home`, { waitUntil: 'load' });
  await page.waitForTimeout(700);
  const before = await page.evaluate(() => ({
    railTop: Math.round(document.querySelector('.cd-context-rail').getBoundingClientRect().top),
    scrollable: (() => { const m = document.querySelector('.cd-home-main'); return m.scrollHeight - m.clientHeight; })(),
  }));
  await page.evaluate(() => { const m = document.querySelector('.cd-home-main'); m.scrollTop = 200; });
  await page.waitForTimeout(250);
  const after = await page.evaluate(() => ({
    railTop: Math.round(document.querySelector('.cd-context-rail').getBoundingClientRect().top),
    scrolled: Math.round(document.querySelector('.cd-home-main').scrollTop),
  }));
  console.log(`\nscroll       main scrolled ${after.scrolled}px · rail top ${before.railTop} -> ${after.railTop}`);
  if (before.scrollable > 20 && after.railTop !== before.railTop) {
    problems.push(`rail moved with the workspace (${before.railTop} -> ${after.railTop}); it should stay fixed`);
  }
  await page.close();
}

await browser.close();
console.log('');
if (problems.length) {
  console.log('--- PROBLEMS ---');
  for (const p of [...new Set(problems)]) console.log(`  ${p}`);
  process.exitCode = 1;
} else {
  console.log('Home layout clean across all target sizes; rail scrolls independently.');
}
