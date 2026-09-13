/**
 * Layout guard for A01 — "Signature".
 *
 * The composition is a scene plus one column, so the failure modes are
 * geometric rather than about content wrapping:
 *
 *   · the mark must stay partially cropped (that is the design) without
 *     swallowing the column
 *   · the column must never be overlapped by the mark at desktop widths
 *   · both actions must read as a pair and stay wholly on screen
 *   · short windows must not clip anything
 */

import { chromium } from 'file:///C:/Users/Anas/Desktop/CoreDesk/node_modules/playwright/index.mjs';

/* `localhost`, not `127.0.0.1`: Vite binds the IPv6 loopback. */
const BASE = process.env.CD_BASE || 'http://localhost:4174/';
const SIZES = [
  [1024, 640], [1024, 700], [1152, 720], [1280, 720], [1280, 800], [1366, 768],
  [1440, 900], [1512, 982], [1600, 1000], [1728, 1117], [1920, 1080], [2560, 1440],
];

const browser = await chromium.launch();
const problems = [];

for (const [w, h] of SIZES) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(`${BASE}#/auth`, { waitUntil: 'load' });
  await page.waitForTimeout(700);

  const m = await page.evaluate(() => {
    const box = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)];
    };
    const art = document.querySelector('.cd-scene-art');
    return {
      mark: box('.cd-scene-mark'),
      stack: box('.cd-stack'),
      primary: box('.cd-action-primary'),
      secondary: box('.cd-action-secondary'),
      tagline: box('.cd-tagline'),
      sceneMarks: document.querySelectorAll('.cd-scene-mark').length,
      sweeps: document.querySelectorAll('.cd-scene-light').length,
      markLoaded: art ? art.complete && art.naturalWidth > 0 : false,
      scrollW: document.documentElement.scrollWidth,
      scrollH: document.documentElement.scrollHeight,
      winW: window.innerWidth,
      winH: window.innerHeight,
    };
  });

  const label = `${w}x${h}`.padEnd(11);
  const overflowX = m.scrollW > m.winW + 2;
  const overflowY = m.scrollH > m.winH + 2;
  const clipped = m.stack ? m.stack[1] < -1 || m.stack[1] + m.stack[3] > m.winH + 1 : true;
  const pairWidth = m.primary && m.secondary ? m.primary[2] === m.secondary[2] : false;
  const pairHeight = m.primary && m.secondary ? m.primary[3] === m.secondary[3] : false;
  /* The mark must be cropped by at least one edge — that is the whole device. */
  const cropped = m.mark
    ? m.mark[0] + m.mark[2] > m.winW + 4 || m.mark[1] + m.mark[3] > m.winH + 4
    : false;
  /* At desktop widths the column must not sit under the mark. */
  const overlaps = w > 900 && m.mark && m.stack ? m.mark[0] < m.stack[0] + m.stack[2] - 40 : false;

  if (overflowX) problems.push(`${label} horizontal overflow ${m.scrollW} > ${m.winW}`);
  if (overflowY) problems.push(`${label} vertical overflow ${m.scrollH} > ${m.winH}`);
  if (clipped) problems.push(`${label} stack clipped: ${JSON.stringify(m.stack)}`);
  if (!pairWidth || !pairHeight) problems.push(`${label} actions are not a matched pair`);
  if (m.sceneMarks !== 1) problems.push(`${label} ${m.sceneMarks} scene marks, expected 1`);
  if (!m.markLoaded) problems.push(`${label} the mark image did not load`);
  if (!cropped) problems.push(`${label} the mark is not cropped by any edge`);
  if (overlaps) problems.push(`${label} the mark runs under the content column`);

  console.log(
    `${label} mark ${String(m.mark?.[2]).padStart(4)}px  stack x=${String(m.stack?.[0]).padStart(4)} w=${m.stack?.[2]}  ` +
      `actions ${m.primary?.[2]}x${m.primary?.[3]}  sweep=${m.sweeps}  overflow=${overflowX || overflowY ? 'YES' : 'no'}`
  );
  await page.close();
}

await browser.close();
console.log('');
if (problems.length) {
  console.log('--- PROBLEMS ---');
  for (const p of [...new Set(problems)]) console.log(`  ${p}`);
  process.exitCode = 1;
} else {
  console.log('Layout clean across all target sizes.');
}
