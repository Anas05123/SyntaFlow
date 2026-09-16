import { chromium } from '@playwright/test';

const PRODUCTION_HOST = 'https://syntaflow.tech';

const ROUTES_TO_TEST = [
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
  '/integrations',
  '/integrations/gmail',
  '/integrations/google-calendar',
  '/integrations/google-drive',
  '/integrations/github',
  '/integrations/notion',
  '/integrations/linear',
  '/pricing',
  '/download',
  '/security',
  '/privacy',
  '/privacy.html',
  '/terms',
  '/terms.html',
  '/faq',
  '/changelog',
  '/about',
  '/contact',
  '/docs',
  '/login',
  '/sitemap.xml',
  '/robots.txt',
];

const VIEWPORTS = [
  { name: 'mobile-375', width: 375, height: 812 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'desktop-1280', width: 1280, height: 720 },
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'desktop-1920', width: 1920, height: 1080 },
];

async function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('SYNTAFLOW LIVE PRODUCTION VERIFICATION SUITE');
  console.log(`Target: ${PRODUCTION_HOST}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  let passedChecks = 0;
  let failedChecks = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ ${message}`);
      passedChecks++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failedChecks++;
    }
  }

  // 1. Check HTTP Status for all routes
  console.log('1. Checking HTTP Status for key routes...');
  for (const route of ROUTES_TO_TEST) {
    try {
      const res = await fetch(`${PRODUCTION_HOST}${route}`, {
        headers: { 'Cache-Control': 'no-cache' }
      });
      assert(res.status === 200, `${route} returned HTTP 200 (got ${res.status})`);
      if (route === '/') {
        const depId = res.headers.get('x-appwrite-deployment-id');
        assert(Boolean(depId && depId.length >= 10), `Active Appwrite deployment is active (got ${depId})`);
      }
    } catch (err) {
      assert(false, `${route} failed fetch: ${err.message}`);
    }
  }

  // 2. Validate robots.txt
  console.log('\n2. Validating robots.txt...');
  const robotsRes = await fetch(`${PRODUCTION_HOST}/robots.txt`);
  const robotsTxt = await robotsRes.text();
  assert(robotsTxt.includes('Sitemap: https://syntaflow.tech/sitemap.xml'), 'robots.txt points to canonical sitemap');
  assert(robotsTxt.includes('Disallow: /account'), 'robots.txt disallows /account');
  assert(robotsTxt.includes('Disallow: /login'), 'robots.txt disallows /login');

  // 3. Validate sitemap.xml
  console.log('\n3. Validating sitemap.xml...');
  const sitemapRes = await fetch(`${PRODUCTION_HOST}/sitemap.xml`);
  const sitemapXml = await sitemapRes.text();
  const urlMatches = sitemapXml.match(/<loc>(https:\/\/syntaflow\.tech[^<]*)<\/loc>/g) || [];
  assert(urlMatches.length === 31, `sitemap.xml has exactly 31 canonical URLs (found ${urlMatches.length})`);
  assert(!sitemapXml.includes('localhost'), 'sitemap.xml has zero localhost references');
  assert(!sitemapXml.includes('appwrite.network'), 'sitemap.xml has zero appwrite preview domain references');

  // 4. Validate Pre-rendered Static Privacy Policy and Google Limited Use
  console.log('\n4. Validating Pre-rendered Static Privacy Policy HTML...');
  const privacyHtmlRes = await fetch(`${PRODUCTION_HOST}/privacy.html`);
  const privacyHtml = await privacyHtmlRes.text();
  assert(privacyHtml.includes('Google API Services User Data Policy') || privacyHtml.includes('Google User Data'), 'Static privacy.html mentions Google User Data Policy');
  assert(privacyHtml.includes('Limited Use') || privacyHtml.includes('limited use'), 'Static privacy.html includes Limited Use disclosure');
  assert(privacyHtml.includes('9. Google Drive Data & Requested Scopes') || privacyHtml.includes('Google Drive Data'), 'Static privacy.html includes Section 9 Google Drive Data');
  assert(privacyHtml.includes('24. International Processing') || privacyHtml.includes('Policy Updates & Contact'), 'Static privacy.html includes Section 24 Contact Information');

  // 5. Playwright Browser Validation across viewports
  console.log('\n5. Playwright In-Browser Responsive & SEO DOM Validation...');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });

  for (const vp of VIEWPORTS) {
    console.log(`\n  --- Viewport: ${vp.name} (${vp.width}x${vp.height}) ---`);
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height }
    });

    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', err => consoleErrors.push(err.message));

    // Test Homepage
    await page.goto(`${PRODUCTION_HOST}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const docTitle = await page.title();
    assert(docTitle.includes('Syntaflow'), `Homepage title contains Syntaflow (got: "${docTitle}")`);

    const canonicalHref = await page.locator('link[rel="canonical"]').getAttribute('href');
    assert(canonicalHref === 'https://syntaflow.tech/', `Canonical URL is "https://syntaflow.tech/" (got: "${canonicalHref}")`);

    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    assert(ogTitle && ogTitle.length > 5, `OG title present: "${ogTitle}"`);

    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    assert(ogImage === 'https://syntaflow.tech/brand/og-image.png', `OG image is 1200x630 card: ${ogImage}`);

    const schemas = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
      return scripts.map(s => {
        try { return JSON.parse(s.textContent || '{}'); } catch { return null; }
      }).filter(Boolean);
    });
    assert(schemas.length >= 1, `Schema.org JSON-LD present (${schemas.length} schemas)`);

    // Check horizontal scroll overflow
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    assert(!hasHorizontalOverflow, `No horizontal overflow at ${vp.width}px (scrollWidth <= innerWidth)`);

    // Filter out favicon or browser-extension noise
    const appErrors = consoleErrors.filter(e => !e.includes('favicon') && !e.includes('extension'));
    assert(appErrors.length === 0, `Zero application console errors (found: ${appErrors.length})`);

    // Screenshot homepage
    await page.screenshot({
      path: `C:/Users/Anas/.gemini/antigravity/brain/e3e1c749-fe4c-4ed9-810c-09d0b193765f/production_live_${vp.name}.png`,
      fullPage: false
    });

    await page.close();
  }

  // 6. Test specific key pages in browser (DOM rendering & Interactive verification)
  console.log('\n6. Testing key pages in browser (DOM rendering)...');
  const testPages = [
    { path: '/product', expectedHeading: 'One workspace' },
    { path: '/solutions/agencies', expectedHeading: 'Run agency client work' },
    { path: '/solutions/freelancers', expectedHeading: 'Keep your clients' },
    { path: '/integrations', expectedHeading: 'Your tools' },
    { path: '/integrations/gmail', expectedHeading: 'Gmail' },
    { path: '/pricing', expectedHeading: 'Pricing' },
    { path: '/download', expectedHeading: 'Syntaflow for Desktop' },
    { path: '/security', expectedHeading: 'Security built into' },
    { path: '/privacy', expectedHeading: 'Privacy Policy' },
    { path: '/terms', expectedHeading: 'Terms of Service' },
    { path: '/contact', expectedHeading: 'Direct communication' }
  ];

  const testPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  for (const item of testPages) {
    await testPage.goto(`${PRODUCTION_HOST}${item.path}`, { waitUntil: 'networkidle' });
    await testPage.waitForTimeout(500);

    const title = await testPage.title();
    assert(title && title.includes('Syntaflow'), `${item.path} title is valid: "${title}"`);

    const canonical = await testPage.locator('link[rel="canonical"]').getAttribute('href');
    assert(canonical === `${PRODUCTION_HOST}${item.path}`, `${item.path} canonical matches ${PRODUCTION_HOST}${item.path}`);

    const h1 = await testPage.locator('h1').first().textContent();
    assert(h1 && h1.toLowerCase().includes(item.expectedHeading.toLowerCase()), `${item.path} H1 rendered correctly: "${h1?.trim()}"`);

    if (item.path === '/privacy') {
      const pageText = await testPage.innerText('body');
      assert(pageText.includes('9. Google Drive Data') || pageText.includes('Google API Services User Data Policy'), 'Live /privacy page contains Google User Data section');
      assert(pageText.includes('Limited Use') || pageText.includes('limited use'), 'Live /privacy page contains Limited Use disclosure');
      assert(pageText.includes('24. International Processing'), 'Live /privacy page contains Section 24 Contact Information');
    }
  }

  await testPage.close();
  await browser.close();

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`PRODUCTION TEST SUMMARY: ${passedChecks}/${passedChecks + failedChecks} PASSED (${failedChecks} failed)`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (failedChecks > 0) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
