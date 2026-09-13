/**
 * Motion verification for the ambient thread.
 *
 * The pulse has to actually travel the thread, the tail has to stay behind the
 * head, and reduced motion has to remove it entirely. None of that is visible in
 * a still frame: a stationary head with a correctly-rendered tail looks perfect
 * in a screenshot and is completely broken.
 *
 * Measured from getBoundingClientRect, never getScreenCTM. The CTM reflects only
 * SVG-internal transforms and ignores CSS transforms, so a CSS-driven
 * offset-path animation reads as perfectly stationary through it.
 */

import { chromium } from 'file:///C:/Users/Anas/Desktop/CoreDesk/node_modules/playwright/index.mjs';
import { mkdirSync } from 'node:fs';

/* `localhost`, not `127.0.0.1`: Vite's preview server binds the IPv6 loopback by
   default, so the IPv4 literal is refused. */
const BASE = process.env.CD_BASE || 'http://localhost:4174/';
const CYCLE_MS = 26000;
const OUT = '.shots/motion';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 940 } });
await page.goto(`${BASE}#/auth`, { waitUntil: 'load' });
await page.waitForTimeout(1500);

const shape = await page.evaluate(() => {
  const cs = (s) => { const e = document.querySelector(s); return e ? getComputedStyle(e) : null; };
  const line = cs('.cdth-line');
  const head = cs('.cdth-head');
  const tails = document.querySelectorAll('.cdth-tail');
  return {
    lineCount: document.querySelectorAll('.cdth-line').length,
    lineStroke: line?.stroke,
    lineWidth: line?.strokeWidth,
    viewBox: document.querySelector('.cd-thread-art')?.getAttribute('viewBox'),
    preserve: document.querySelector('.cd-thread-art')?.getAttribute('preserveAspectRatio'),
    headCount: document.querySelectorAll('.cdth-head').length,
    tailCount: tails.length,
    headAnim: head?.animationName,
    headDur: head?.animationDuration,
    tailDelays: [...tails].map((t) => getComputedStyle(t).animationDelay),
    /* One instance, not a row of dots: every tail must share the head's cycle. */
    tailDurs: [...new Set([...tails].map((t) => getComputedStyle(t).animationDuration))],
  };
});

console.log('── art ──');
console.log(`thread lines     ${shape.lineCount}   stroke=${shape.lineStroke}  width=${shape.lineWidth}`);
console.log(`viewBox          ${shape.viewBox}   preserveAspectRatio=${shape.preserve}`);
console.log(`head             ${shape.headCount}   anim=${shape.headAnim} dur=${shape.headDur}`);
console.log(`tail pieces      ${shape.tailCount}   durations=${shape.tailDurs.join(',')}`);
console.log(`tail delays      ${shape.tailDelays.slice(0, 4).join(', ')} …`);

/* Sample the head's screen position across the cycle. */
const SAMPLES = 14;
const points = [];
for (let i = 0; i < SAMPLES; i += 1) {
  const p = await page.evaluate(() => {
    const el = document.querySelector('.cdth-head');
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, t: performance.now() };
  });
  if (p) points.push(p);
  await page.waitForTimeout(CYCLE_MS / SAMPLES);
}

const xs = points.map((p) => p.x);
const ys = points.map((p) => p.y);
const spanX = Math.max(...xs) - Math.min(...xs);
const spanY = Math.max(...ys) - Math.min(...ys);
let travel = 0;
for (let i = 1; i < points.length; i += 1) {
  travel += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
}

console.log('\n── travel over one cycle ──');
console.log(`samples          ${points.length}`);
console.log(`x span           ${spanX.toFixed(0)}px`);
console.log(`y span           ${spanY.toFixed(0)}px`);
console.log(`path length      ${travel.toFixed(0)}px travelled`);
console.log(`direction        ${xs[xs.length - 1] > xs[0] ? 'left to right' : 'right to left'}`);

/* Reduced motion: the pulse must be absent, the thread present. */
const rm = await browser.newPage({ viewport: { width: 1440, height: 940 }, reducedMotion: 'reduce' });
await rm.goto(`${BASE}#/auth`, { waitUntil: 'load' });
await rm.waitForTimeout(900);
const rmState = await rm.evaluate(() => ({
  pulseParts: document.querySelectorAll('.cdth-head, .cdth-tail').length,
  lines: document.querySelectorAll('.cdth-line').length,
  light: document.querySelectorAll('.cd-entry-light').length,
  actions: document.querySelectorAll('.cd-action').length,
}));
await rm.screenshot({ path: `${OUT}/thread-reduced-motion.png` });
await rm.close();
await browser.close();

console.log('\n── reduced motion ──');
console.log(`pulse            ${rmState.pulseParts} parts (expected 0)`);
console.log(`thread           ${rmState.lines} line (expected 1)`);
console.log(`content          ${rmState.actions} actions, light present: ${rmState.light === 1}`);

const problems = [];
if (shape.lineCount !== 1) problems.push(`${shape.lineCount} thread lines, expected exactly 1`);
if (shape.headCount !== 1) problems.push(`${shape.headCount} heads, expected exactly 1`);
if (shape.tailCount < 4) problems.push(`only ${shape.tailCount} tail pieces — the fade will read as a stub`);
if (shape.tailDurs.length !== 1) problems.push(`tail pieces have differing durations: ${shape.tailDurs.join(',')}`);
if (!shape.tailDelays.every((d) => d.trim().startsWith('-'))) {
  problems.push('a tail piece has a positive delay — the trail will animate in from nothing');
}
if (travel < 200) problems.push(`head travelled only ${travel.toFixed(0)}px — it is not moving along the thread`);
if (spanX < 150) problems.push(`head x span is ${spanX.toFixed(0)}px — it is barely moving horizontally`);
if (rmState.pulseParts !== 0) problems.push(`reduced motion still mounts ${rmState.pulseParts} pulse parts`);
if (rmState.lines !== 1) problems.push('reduced motion lost the thread');
if (rmState.light !== 1) problems.push('reduced motion lost the environmental light');

console.log('');
if (problems.length) {
  console.log('── PROBLEMS ──');
  for (const p of problems) console.log(`  ${p}`);
  process.exitCode = 1;
} else {
  console.log('Thread verified: one line, one travelling pulse, tail locked behind it, reduced-motion twin intact.');
}
