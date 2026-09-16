import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { preview } from 'vite';
import { chromium } from '@playwright/test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROUTES = [
  '/',
  '/product',
  '/product/client-management',
  '/product/projects',
  '/product/documents',
  '/product/reviews-approvals',
  '/product/ai-workspace',
  '/solutions',
  '/solutions/agencies',
  '/solutions/freelancers',
  '/solutions/consultants',
  '/solutions/studios',
  '/pricing',
  '/download',
  '/integrations',
  '/integrations/gmail',
  '/integrations/google-calendar',
  '/integrations/google-drive',
  '/integrations/github',
  '/integrations/notion',
  '/integrations/linear',
  '/security',
  '/docs',
  '/faq',
  '/contact',
  '/privacy',
  '/terms',
  '/login',
  '/auth/desktop',
];

const VIEWPORTS = [
  { name: 'Mobile Small (375x812)', width: 375, height: 812 },
  { name: 'Mobile Medium (390x844)', width: 390, height: 844 },
  { name: 'Mobile Large (430x932)', width: 430, height: 932 },
  { name: 'Tablet (768x1024)', width: 768, height: 1024 },
  { name: 'Laptop (1280x720)', width: 1280, height: 720 },
  { name: 'Desktop (1440x900)', width: 1440, height: 900 },
  { name: 'Ultrawide (1920x1080)', width: 1920, height: 1080 },
];

async function run() {
  console.log('--- Starting Web Verification Suite ---');

  // Start in-process vite preview server
  const server = await preview({
    root: __dirname,
    preview: {
      port: 5199,
      strictPort: true,
    },
  });

  let browser;
  try {
    browser = await chromium.launch({ channel: 'msedge', headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    let totalChecks = 0;
    let failedChecks = 0;

    // Viewport overflow and rendering audit
    for (const vp of VIEWPORTS) {
      console.log(`\nTesting Viewport: ${vp.name}`);
      await page.setViewportSize({ width: vp.width, height: vp.height });

      for (const route of ROUTES) {
        totalChecks++;
        const url = `http://localhost:5199/#${route}`;
        const errors = [];
        page.on('pageerror', (err) => errors.push(err.message));

        await page.goto(url, { waitUntil: 'domcontentloaded' });
        await page.waitForFunction(() => document.title.includes('Syntaflow'), { timeout: 4000 }).catch(() => {});

        const title = await page.title();
        const hasTitle = title.includes('Syntaflow');

        // Check horizontal overflow
        const overflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > window.innerWidth;
        });

        if (!hasTitle || overflow || errors.length > 0) {
          failedChecks++;
          console.error(`  FAIL [${route}]: title="${title}", overflow=${overflow}, errors=${errors.length}`);
        } else {
          process.stdout.write('.');
        }
      }
      console.log(` [PASSED]`);
    }

    // Interactive element verification on homepage
    console.log('\nTesting Interactive Instruments on Homepage...');
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('http://localhost:5199/#/', { waitUntil: 'domcontentloaded' });

    // Test Desktop Simulator Tab Switching
    console.log('  Testing Desktop Simulator tabs...');
    await page.click('button:has-text("Paper Canvas")');
    const paperCanvasActive = await page.isVisible('text=Typographic Paper Canvas');
    console.log(`  Simulator Paper Canvas Tab: ${paperCanvasActive ? 'PASSED' : 'FAILED'}`);

    await page.click('button:has-text("Dual-Density Tasks")');
    const tasksActive = await page.isVisible('text=Dual-Density Task Boards');
    console.log(`  Simulator Tasks Tab: ${tasksActive ? 'PASSED' : 'FAILED'}`);

    // Test Stage Pipeline Graph node switching
    console.log('  Testing Stage Pipeline Graph nodes...');
    await page.click('button:has-text("STAGE 01")');
    const stage01Active = await page.isVisible('text=STAGE 01 // CLIENT OPS');
    console.log(`  Pipeline Stage 01 Switch: ${stage01Active ? 'PASSED' : 'FAILED'}`);

    await page.click('button:has-text("STAGE 04")');
    const stage04Active = await page.isVisible('text=STAGE 04 // STUDIO DOCS');
    console.log(`  Pipeline Stage 04 Switch: ${stage04Active ? 'PASSED' : 'FAILED'}`);

    console.log(`\n--- Verification Summary ---`);
    console.log(`Total Checks: ${totalChecks}`);
    console.log(`Failed Checks: ${failedChecks}`);

    if (failedChecks === 0 && paperCanvasActive && tasksActive && stage01Active && stage04Active) {
      console.log('✓ ALL ROUTES AND 7 VIEWPORTS VERIFIED CLEANLY WITH ZERO ERRORS.\n');
    } else {
      process.exit(1);
    }
  } finally {
    if (browser) await browser.close();
    server.httpServer.close();
  }
}

run().catch((err) => {
  console.error('Test harness exception:', err);
  process.exit(1);
});
