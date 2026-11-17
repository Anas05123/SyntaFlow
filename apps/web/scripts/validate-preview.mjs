import path from 'node:path';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { preview } from 'vite';
import { chromium } from '@playwright/test';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../..');
const server = await preview({ root: path.join(root, 'apps/web'), preview: { port: 5208, strictPort: true } });
const base = 'http://localhost:5208';
const output = process.env.VALIDATE_OUTPUT || path.join(root, 'docs/product/website-validation');
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const failures = [];

for (const width of [390, 768, 1366, 1600]) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  for (const route of ['/', '/preview', '/product', '/integrations', '/pricing', '/download', '/docs', '/login']) {
    await page.goto(`${base}${route}`, { waitUntil: 'domcontentloaded' });
    await page.locator('h1').first().waitFor({ timeout: 15000 });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    const heading = await page.locator('h1').first().textContent().catch(() => '');
    if (overflow) failures.push(`${width}px ${route}: horizontal overflow`);
    if (!heading?.trim()) failures.push(`${width}px ${route}: missing heading`);
    if (pageErrors.length) failures.push(`${width}px ${route}: ${pageErrors.splice(0).join('; ')}`);
    if (route === '/') {
      await page.locator('.story-hero h1').waitFor({ timeout: 3000 });
      await page.locator('.story-hero__proof img').evaluate((image) => image.decode());
      await page.waitForFunction(() => Number(getComputedStyle(document.querySelector('[data-hero-proof]')).opacity) > 0.99);
    }
    if (route === '/' || route === '/preview') await page.screenshot({ path: path.join(output, `${route === '/' ? 'renovated-home' : 'playable-preview'}-${width}.png`), fullPage: route === '/preview' });
  }
  await context.close();
}

const context = await browser.newContext({ viewport: { width: 1366, height: 900 } });
const page = await context.newPage();
await page.goto(`${base}/preview`, { waitUntil: 'domcontentloaded' });
await page.getByRole('heading', { name: 'Try a client project before you download.' }).waitFor();
await page.getByRole('button', { name: 'Open project' }).click();
if (!await page.getByRole('heading', { name: 'Brand identity system', exact: true }).count()) failures.push('project navigation failed');
await page.getByRole('button', { name: 'Open work' }).click();
await page.getByRole('checkbox').check();
if (!await page.getByText('3 of 4 done').count()) failures.push('sample task update failed');
await page.getByRole('button', { name: 'Continue to the submitted review' }).click();
await page.getByLabel('Add a sample note').fill('Please check the wordmark contrast.');
await page.getByRole('button', { name: 'Add note' }).click();
if (!await page.getByText('Sample note: Please check the wordmark contrast.').count()) failures.push('sample comment failed');
await page.getByRole('button', { name: 'Approve sample version' }).click();
await page.getByText('Approved in this sample').waitFor({ timeout: 3000 }).catch(() => failures.push('sample approval failed'));
await page.getByRole('button', { name: 'Check the handoff gate' }).click();
await page.getByText('Two files still need approval').waitFor({ timeout: 3000 }).catch(() => failures.push('delivery gate failed'));
await page.getByRole('button', { name: 'Reset sample' }).click();
await page.getByRole('heading', { name: 'Harbor & Finch' }).waitFor({ timeout: 3000 }).catch(() => failures.push('reset failed'));
await context.close();

const reduced = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
const reducedPage = await reduced.newPage();
await reducedPage.goto(`${base}/preview`, { waitUntil: 'domcontentloaded' });
await reducedPage.getByRole('heading', { name: 'Try a client project before you download.' }).waitFor();
await reducedPage.getByRole('button', { name: 'Review', exact: true }).click();
await reducedPage.locator('.preview-view h3').filter({ hasText: 'Brand guidelines' }).waitFor({ timeout: 3000 }).catch(() => failures.push('reduced-motion navigation failed'));
await reduced.close();
await browser.close();
await new Promise((resolve) => server.httpServer.close(resolve));
if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1; }
else console.log('Preview interaction and responsive browser checks passed at 390, 768, 1366, and 1600px.');
