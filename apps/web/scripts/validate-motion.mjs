import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { preview } from 'vite';
import { chromium } from '@playwright/test';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = process.env.VALIDATE_OUTPUT || path.resolve(root, '../../../website-motion-review');
await fs.mkdir(output, { recursive: true });
const server = await preview({ root, preview: { port: 5212, strictPort: true } });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const sections = ['product', 'problem', 'features', 'community', 'guided-preview', 'how-it-works', 'questions', 'early-access'];
try {
  for (const width of [390, 768, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, ...(width === 1440 ? { recordVideo: { dir: output, size: { width, height: 900 } } } : {}) });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.addInitScript(() => {
      window.motionEvidence = { shown: 0, hidden: 0, cls: 0 };
      new PerformanceObserver((list) => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.motionEvidence.cls += entry.value; }).observe({ type: 'layout-shift', buffered: true });
      new MutationObserver(() => {
        const evidence = window.motionEvidence;
        if (document.querySelector('.page-curtain')) evidence.shown ||= performance.now();
        else if (evidence.shown) evidence.hidden ||= performance.now();
      }).observe(document, { subtree: true, childList: true });
    });
    await page.goto('http://localhost:5212', { waitUntil: 'domcontentloaded' });
    if (width === 390) await page.getByRole('button', { name: 'Skip intro' }).click();
    await page.waitForFunction(() => document.documentElement.dataset.pageReveal === 'ready');
    await page.waitForFunction(() => {
      const line = document.querySelector('[data-hero-line]');
      return line && [...document.querySelectorAll('[data-hero-line]')].every((element) => Math.abs(new DOMMatrix(getComputedStyle(element).transform).m42) < 1) && [...document.querySelectorAll('[data-hero-enter]')].every((element) => getComputedStyle(element).opacity === '1');
    });
    const intro = await page.evaluate(() => window.motionEvidence);
    assert(intro.shown > 0);
    assert(intro.hidden - intro.shown < 1200);
    await page.screenshot({ path: path.join(output, `hero-${width}.png`) });
    assert.equal(await page.locator('.story-dots').isVisible(), width > 1000);
    const hues = [];
    for (const id of sections) {
      await page.locator(`#${id}`).evaluate((element) => element.scrollIntoView({ behavior: 'instant', block: 'start' }));
      await page.waitForFunction((id) => document.querySelector(`.story-dots a[href="#${id}"]`)?.getAttribute('aria-current') === 'location', id);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2), false, `${width}/${id} overflow`);
      hues.push(await page.locator('.story-aurora').evaluate((element) => getComputedStyle(element).filter));
      await page.waitForTimeout(850);
      if (width === 1440 && ['features', 'community', 'guided-preview'].includes(id)) await page.screenshot({ path: path.join(output, `${id}-${width}.png`) });
    }
    assert(new Set(hues).size > 3);
    assert(await page.locator('.story-progress').evaluate((element) => new DOMMatrix(getComputedStyle(element).transform).m11 > .7));
    if (width === 1440) {
      await page.getByRole('navigation', { name: 'Page sections' }).getByRole('link', { name: 'The people', exact: true }).click();
      await page.waitForFunction(() => Math.abs(document.getElementById('community').getBoundingClientRect().top - 90) < 8);
    }
    await page.locator('#features').evaluate((element) => element.scrollIntoView({ behavior: 'instant' }));
    await page.getByRole('button', { name: 'Pause rotating text' }).click();
    const phrase = await page.locator('.story-sentence strong').innerText();
    await page.waitForTimeout(4100);
    assert.equal(await page.locator('.story-sentence strong').innerText(), phrase);
    await page.locator('.sf-play__switch button').filter({ hasText: 'Review' }).click();
    const slot = page.locator('.sf-play__media .product-image');
    const before = await slot.boundingBox();
    await page.getByRole('button', { name: 'Next screen' }).click();
    const after = await slot.boundingBox();
    assert(Math.abs(before.height - after.height) < 1);
    await page.locator('.story-questions summary').first().press('Enter');
    assert.equal(await page.locator('.story-questions details').first().evaluate((element) => element.open), true);
    await page.screenshot({ path: path.join(output, `full-${width}.png`), fullPage: true });
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await page.locator('.page-curtain').count(), 0);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await page.locator('.page-curtain').count(), 0);
    assert.equal(await page.locator('.story-aurora span').first().evaluate((element) => getComputedStyle(element).animationName), 'none');
    assert.equal(await page.getByRole('button', { name: 'Pause rotating text' }).count(), 0);
    assert.equal(await page.locator('[data-hero-line]').first().evaluate((element) => getComputedStyle(element).transform), 'none');
    assert.deepEqual(errors, []);
    const video = page.video();
    await context.close();
    if (video) await fs.rename(await video.path(), path.join(output, 'website-motion.webm'));
    console.log(`PASS ${width}px: intro <1.2s, session, section navigation, mood, progress, stable images, keyboard, reduced motion; initial CLS ${intro.cls}`);
  }
  const reduced = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await reduced.newPage();
  await page.goto('http://localhost:5212', { waitUntil: 'networkidle' });
  assert.equal(await page.locator('.page-curtain').count(), 0);
  await reduced.close();
} finally { await browser.close(); await new Promise((resolve) => server.httpServer.close(resolve)); }
