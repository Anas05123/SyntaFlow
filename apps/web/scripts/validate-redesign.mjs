import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { preview } from 'vite';
import { chromium } from '@playwright/test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = process.env.VALIDATE_OUTPUT || path.resolve(root, '../../docs/product/website-validation');
await fs.mkdir(output, { recursive: true });
const server = await preview({ root, preview: { port: 5204, strictPort: true } });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const routes = process.env.VALIDATE_ROUTE ? [process.env.VALIDATE_ROUTE] : ['/', '/product', '/product/client-management', '/product/projects', '/product/documents', '/product/reviews-approvals', '/product/ai-workspace', '/solutions', '/solutions/freelancers', '/solutions/agencies', '/solutions/consultants', '/solutions/studios', '/integrations', '/integrations/gmail', '/integrations/google-calendar', '/integrations/google-drive', '/integrations/github', '/integrations/notion', '/integrations/linear', '/pricing', '/download', '/docs', '/faq', '/about', '/roadmap', '/changelog', '/contact', '/security', '/data-handling', '/privacy', '/terms', '/login', '/signup', '/forgot-password'];
let failures = 0;
try {
  for (const width of (process.env.VALIDATE_WIDTH ? [Number(process.env.VALIDATE_WIDTH)] : [390, 768, 1366, 1600])) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: width === 768 ? 'reduce' : 'no-preference', deviceScaleFactor: 1 });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    for (const route of routes) {
      errors.length = 0;
      await page.goto(`http://localhost:5204${route}`, { waitUntil: 'domcontentloaded' });
      await page.getByRole('heading', { level: 1 }).first().waitFor();
      const data = await page.evaluate(() => ({ title: document.title, h1: Boolean(document.querySelector('h1')), overflow: document.documentElement.scrollWidth > window.innerWidth + 2, wide: [...document.querySelectorAll('*')].filter((element) => element.getBoundingClientRect().right > window.innerWidth + 2).slice(0, 5).map((element) => ({ tag: element.tagName, className: element.className, right: Math.round(element.getBoundingClientRect().right) })), images: [...document.images].filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.src) }));
      if (!data.h1 || data.overflow || errors.length || data.images.length) { console.log('FAIL', width, route, JSON.stringify({ ...data, errors })); failures += 1; }
    }
    await page.goto('http://localhost:5204/', { waitUntil: 'domcontentloaded' });
    await page.locator('.story-hero__proof img').evaluate((image) => image.decode());
    await page.screenshot({ path: path.join(output, `hero-${width}.png`), fullPage: false });
    const reveals = page.locator('[data-story-reveal]');
    for (let index = 0; index < await reveals.count(); index += 1) await reveals.nth(index).scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(550);
    await page.screenshot({ path: path.join(output, `home-${width}.png`), fullPage: true });
    const stages = page.locator('.sf-play__switch button');
    const featureCards = page.locator('.story-feature');
    if (await featureCards.count() !== 4) { console.log('FAIL', width, 'four outcome blocks'); failures += 1; }
    await featureCards.first().getByRole('link').focus();
    if (!await featureCards.first().getByRole('link').evaluate((element) => document.activeElement === element)) { console.log('FAIL', width, 'outcome link keyboard focus'); failures += 1; }
    if (await stages.count() !== 3) { console.log('FAIL', width, 'screen switch count'); failures += 1; }
    await stages.filter({ hasText: 'Delivery' }).click();
    if (!await page.getByText('See the files still blocking handoff.').isVisible()) { console.log('FAIL', width, 'screen delivery'); failures += 1; }
    if (await stages.filter({ hasText: 'Delivery' }).getAttribute('aria-pressed') !== 'true') { console.log('FAIL', width, 'screen pressed state'); failures += 1; }
    await page.getByRole('button', { name: 'Next screen' }).click();
    if (await stages.filter({ hasText: 'Project' }).getAttribute('aria-pressed') !== 'true') { console.log('FAIL', width, 'gallery wraparound'); failures += 1; }
    const demo = page.locator('#brief-demo');
    await demo.getByRole('button', { name: 'Analyze sample' }).click();
    await demo.getByRole('heading', { name: 'What we know so far' }).waitFor();
    await demo.screenshot({ path: path.join(output, `client-brief-${width}.png`) });
    await demo.locator('summary').filter({ hasText: 'Budget' }).click();
    if (!await demo.getByText('No amount appears in these sample messages.').isVisible()) { console.log('FAIL', width, 'brief source'); failures += 1; }
    await demo.getByRole('button', { name: 'Scope check' }).click();
    await demo.getByText('Possible addition to scope').waitFor();
    await demo.getByText('See a suggested reply').click();
    if (!await demo.getByText('Could you confirm the formats and launch date', { exact: false }).isVisible()) { console.log('FAIL', width, 'suggested reply'); failures += 1; }
    await demo.getByRole('button', { name: 'Reset example' }).click();
    await demo.getByRole('button', { name: 'Analyze sample' }).waitFor();
    if (!await demo.getByRole('button', { name: 'Project brief' }).isDisabled()) { console.log('FAIL', width, 'example reset'); failures += 1; }
    if (!await demo.getByRole('button', { name: 'Client request' }).evaluate((element) => document.activeElement === element)) { console.log('FAIL', width, 'example reset focus'); failures += 1; }
    await page.getByLabel('Your email', { exact: true }).fill('preview@example.test');
    await page.getByRole('button', { name: 'Prepare early access request' }).click();
    const draft = await page.getByRole('link', { name: 'Open email draft' }).getAttribute('href');
    if (!draft?.startsWith('mailto:contact@syntaflow.tech?') || !draft.includes('preview%40example.test')) { console.log('FAIL', width, 'early access draft'); failures += 1; }
    if (width === 768) {
      const reduced = await page.evaluate(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches && !document.querySelector('[data-hero-enter]').style.transform && getComputedStyle(document.documentElement).scrollBehavior === 'auto');
      if (!reduced) { console.log('FAIL', width, 'reduced motion'); failures += 1; }
    }
    if (width === 390) {
      const toggle = page.getByRole('button', { name: 'Open navigation menu' });
      await toggle.focus();
      await page.keyboard.press('Enter');
      if (!await page.getByRole('navigation', { name: 'Mobile navigation' }).isVisible()) { console.log('FAIL', width, 'mobile keyboard open'); failures += 1; }
      await page.keyboard.press('Escape');
      await page.getByRole('navigation', { name: 'Mobile navigation' }).waitFor({ state: 'hidden' });
      if (!await toggle.evaluate((element) => document.activeElement === element)) { console.log('FAIL', width, 'mobile keyboard focus return'); failures += 1; }
      await page.screenshot({ path: path.join(output, 'sample-teaser-mobile.png'), fullPage: false });
    }
    if (width === 1366) {
      await page.goto('http://localhost:5204/download', { waitUntil: 'domcontentloaded' });
      await page.getByRole('link', { name: 'Try the sample project', exact: true }).click();
      await page.waitForURL('**/preview');
      const previewVisible = await page.getByRole('heading', { name: 'Try a client project before you download.' }).waitFor({ state: 'visible', timeout: 5000 }).then(() => true).catch(() => false);
      if (!previewVisible) { console.log('FAIL', width, 'preview link from download'); failures += 1; }
      await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'How it works' }).click();
      await page.waitForURL('**/#how-it-works');
      await page.getByRole('navigation', { name: 'Main navigation' }).locator('[aria-current="location"]').filter({ hasText: 'How it works' }).waitFor();
    }
    await context.close();
    console.log('viewport complete', width);
  }
} finally {
  await browser.close();
  await new Promise((resolve) => server.httpServer.close(resolve));
}
console.log(`redesign validation failures: ${failures}`);
if (failures) process.exitCode = 1;
