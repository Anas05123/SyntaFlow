import { preview } from 'vite';
import { chromium } from '@playwright/test';

const ROUTES = [
  '/',
  '/product',
  '/product/client-ops',
  '/product/projects-tasks',
  '/product/documents-reviews',
  '/product/delivery-approvals',
  '/solutions/freelancers',
  '/solutions/agencies',
  '/solutions/consultants',
  '/solutions/studios',
  '/security',
  '/privacy',
  '/data-handling',
  '/faq',
  '/changelog',
  '/about',
  '/roadmap',
  '/contact',
  '/terms',
  '/privacy-policy',
  '/cookies',
  '/acceptable-use',
];

const VIEWPORTS = [
  { name: 'Mobile (375x812)', width: 375, height: 812 },
  { name: 'Tablet (768x1024)', width: 768, height: 1024 },
  { name: 'Laptop (1280x720)', width: 1280, height: 720 },
  { name: 'Desktop (1440x900)', width: 1440, height: 900 },
  { name: 'Ultrawide (1920x1080)', width: 1920, height: 1080 },
];

async function run() {
  console.log('--- Starting Web Verification Suite ---');

  // Start in-process vite preview server
  const server = await preview({
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
        await page.waitForTimeout(40);

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

    // Test Hero Product Mockup tabs
    await page.click('text=Dual-Density Tasks');
    const tasksVisible = await page.isVisible('text=Sign-off on localized SQLite persistence schema');
    console.log(`  Hero Mockup Tasks Tab: ${tasksVisible ? 'PASSED' : 'FAILED'}`);

    await page.click('text=Delivery Gate');
    const gateVisible = await page.isVisible('text=CANONICAL INVARIANT: DELIVERY GATE ENFORCEMENT');
    console.log(`  Hero Mockup Delivery Gate Tab: ${gateVisible ? 'PASSED' : 'FAILED'}`);

    // Test Product Workflow stage switching
    await page.click('[data-stage-id="review"]');
    const stage5Visible = await page.isVisible('text=STAGE 05 OF 07');
    console.log(`  Product Workflow Stage 05 Switch: ${stage5Visible ? 'PASSED' : 'FAILED'}`);

    console.log(`\n--- Verification Summary ---`);
    console.log(`Total Checks: ${totalChecks}`);
    console.log(`Failed Checks: ${failedChecks}`);

    if (failedChecks === 0 && tasksVisible && gateVisible && stage5Visible) {
      console.log('✓ ALL 22 ROUTES AND 5 VIEWPORTS VERIFIED CLEANLY WITH ZERO ERRORS.\n');
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
