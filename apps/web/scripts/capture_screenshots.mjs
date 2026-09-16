import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { preview } from 'vite';
import { chromium } from '@playwright/test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webRoot = path.resolve(__dirname, '..');

const PAGES = [
  { name: 'home', route: '/' },
  { name: 'login', route: '/login' },
  { name: 'signup', route: '/signup' },
  { name: 'onboarding', route: '/onboarding' },
  { name: 'account_home', route: '/account' },
  { name: 'account_plan', route: '/account/plan' },
  { name: 'account_downloads', route: '/account/downloads' },
  { name: 'pricing', route: '/pricing' },
  { name: 'download', route: '/download' },
];

const VIEWPORTS = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'mobile-375', width: 375, height: 812 },
];

async function capture() {
  const outDir = path.resolve(webRoot, 'screenshots_redesign');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const server = await preview({
    root: webRoot,
    preview: { port: 5198, strictPort: true },
  });

  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    for (const vp of VIEWPORTS) {
      const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const page = await context.newPage();

      for (const p of PAGES) {
        const url = `http://localhost:5198/#${p.route}`;
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(600);
        const filePath = path.join(outDir, `${p.name}_${vp.name}.png`);
        await page.screenshot({ path: filePath, fullPage: false });
        console.log(`Saved screenshot: ${p.name}_${vp.name}.png`);
      }
      await context.close();
    }
  } finally {
    await browser.close();
    server.httpServer.close();
  }
}

capture().catch((err) => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
