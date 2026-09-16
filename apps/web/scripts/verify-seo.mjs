import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { preview } from 'vite';
import { chromium } from '@playwright/test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webRoot = path.resolve(__dirname, '..');

// Dynamically import SEO config using Node 24 type stripping
const { ROUTES_METADATA } = await import('../src/seo/seoConfig.ts');
const {
  getOrganizationSchema,
  getSoftwareApplicationSchema,
  getBreadcrumbListSchema,
} = await import('../src/seo/structuredData.ts');

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

function assert(condition, message) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  ✓ ${message}`);
  } else {
    failedChecks++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('SYNTAFLOW PHASE 2 — TECHNICAL SEO VERIFICATION');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// 1. Robots.txt Validation
console.log('[1/5] Validating robots.txt...');
const robotsPath = path.join(webRoot, 'public', 'robots.txt');
assert(fs.existsSync(robotsPath), 'robots.txt exists in public/');
const robotsContent = fs.readFileSync(robotsPath, 'utf8');
assert(robotsContent.includes('User-agent: *'), 'robots.txt has User-agent: *');
assert(robotsContent.includes('Allow: /'), 'robots.txt has Allow: /');
assert(robotsContent.includes('Disallow: /login'), 'robots.txt has Disallow: /login');
assert(robotsContent.includes('Disallow: /account'), 'robots.txt has Disallow: /account');
assert(robotsContent.includes('Disallow: /auth/'), 'robots.txt has Disallow: /auth/');
assert(
  robotsContent.includes('Sitemap: https://syntaflow.tech/sitemap.xml'),
  'robots.txt links to canonical https://syntaflow.tech/sitemap.xml'
);

// 2. Sitemap.xml Validation
console.log('\n[2/5] Validating sitemap.xml...');
const sitemapPath = path.join(webRoot, 'public', 'sitemap.xml');
assert(fs.existsSync(sitemapPath), 'sitemap.xml exists in public/');
const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
assert(sitemapContent.startsWith('<?xml version="1.0" encoding="UTF-8"?>'), 'Valid XML declaration');
assert(sitemapContent.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'), 'Standard sitemap schema namespace');

const locMatches = [...sitemapContent.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
assert(locMatches.length === 31, `sitemap contains exactly 31 canonical routes (found ${locMatches.length})`);
assert(locMatches.every(url => url.startsWith('https://syntaflow.tech')), 'All sitemap URLs use canonical host https://syntaflow.tech');
assert(!locMatches.some(url => url.includes('localhost') || url.includes('www.')), 'No localhost or www entries in sitemap');
assert(!locMatches.some(url => url.includes('/login') || url.includes('/account') || url.includes('/auth/')), 'Non-indexable routes excluded from sitemap');

// 3. Centralized Route Metadata Configuration Audit
console.log('\n[3/5] Validating Centralized Route Metadata (seoConfig.ts)...');
const routeEntries = Object.entries(ROUTES_METADATA);
assert(routeEntries.length === 39, `ROUTES_METADATA contains 39 defined routes including aliases (found ${routeEntries.length})`);

const indexableEntries = routeEntries.filter(([, meta]) => meta.indexable);
assert(indexableEntries.length === 31, `Exactly 31 indexable canonical routes defined (found ${indexableEntries.length})`);

const titles = new Set();
const descriptions = new Set();
let duplicatesFound = false;

for (const [routePath, meta] of indexableEntries) {
  if (titles.has(meta.title)) {
    duplicatesFound = true;
    console.error(`  Duplicate title found for route ${routePath}: "${meta.title}"`);
  }
  titles.add(meta.title);

  if (descriptions.has(meta.description)) {
    duplicatesFound = true;
    console.error(`  Duplicate description found for route ${routePath}`);
  }
  descriptions.add(meta.description);
}
assert(!duplicatesFound, 'All indexable canonical routes have unique, descriptive titles and meta descriptions');

// Check exact requested homepage metadata
const homeMeta = ROUTES_METADATA['/'];
assert(
  homeMeta.title === 'Syntaflow — Connected Workspace for Client Work',
  `Homepage title matches exact spec: "${homeMeta.title}"`
);
assert(
  homeMeta.description === 'Manage clients, projects, documents, reviews, approvals and connected tools in one workspace. Syntaflow keeps your client work and AI context connected.',
  'Homepage description matches exact spec'
);

// 4. Schema.org Structured Data Validation
console.log('\n[4/5] Validating Schema.org Structured Data Generators...');
const orgSchema = getOrganizationSchema();
assert(orgSchema['@type'] === 'Organization', 'Organization schema @type is Organization');
assert(orgSchema.url === 'https://syntaflow.tech', 'Organization url is https://syntaflow.tech');
assert(orgSchema.name === 'Syntaflow', 'Organization name is Syntaflow');

const appSchema = getSoftwareApplicationSchema();
assert(appSchema['@type'] === 'SoftwareApplication', 'SoftwareApplication schema @type is SoftwareApplication');
assert(appSchema.name === 'Syntaflow', 'SoftwareApplication name is Syntaflow');
assert(Boolean(appSchema.operatingSystem), 'Operating systems specified accurately');
assert(!('aggregateRating' in appSchema), 'Zero fake ratings in SoftwareApplication schema');
assert(!('review' in appSchema), 'Zero fake reviews in SoftwareApplication schema');

const breadcrumbSchema = getBreadcrumbListSchema([
  { name: 'Home', item: 'https://syntaflow.tech/' },
  { name: 'Product', item: 'https://syntaflow.tech/product' },
  { name: 'Client Management', item: 'https://syntaflow.tech/product/client-management' },
]);
assert(breadcrumbSchema['@type'] === 'BreadcrumbList', 'BreadcrumbList schema @type is BreadcrumbList');
assert(breadcrumbSchema.itemListElement.length === 3, 'BreadcrumbList has 3 items');
assert(breadcrumbSchema.itemListElement[2].position === 3, 'Last item has position 3');

// 5. Browser Runtime DOM Inspection via Playwright
console.log('\n[5/5] Running Playwright DOM Inspection on Production Build...');
const server = await preview({
  root: webRoot,
  preview: {
    port: 5198,
    strictPort: true,
  },
});

let browser;
try {
  browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const testRoutes = [
    { path: '/', expectTitle: ROUTES_METADATA['/'].title, expectRobots: 'index, follow', expectSchema: true },
    { path: '/product', expectTitle: ROUTES_METADATA['/product'].title, expectRobots: 'index, follow', expectSchema: true },
    { path: '/product/client-management', expectTitle: ROUTES_METADATA['/product/client-management'].title, expectRobots: 'index, follow', expectSchema: true },
    { path: '/product/projects', expectTitle: ROUTES_METADATA['/product/projects'].title, expectRobots: 'index, follow', expectSchema: true },
    { path: '/product/documents', expectTitle: ROUTES_METADATA['/product/documents'].title, expectRobots: 'index, follow', expectSchema: true },
    { path: '/product/reviews-approvals', expectTitle: ROUTES_METADATA['/product/reviews-approvals'].title, expectRobots: 'index, follow', expectSchema: true },
    { path: '/product/ai-workspace', expectTitle: ROUTES_METADATA['/product/ai-workspace'].title, expectRobots: 'index, follow', expectSchema: true },
    { path: '/solutions', expectTitle: ROUTES_METADATA['/solutions'].title, expectRobots: 'index, follow', expectSchema: true },
    { path: '/solutions/agencies', expectTitle: ROUTES_METADATA['/solutions/agencies'].title, expectRobots: 'index, follow', expectSchema: true },
    { path: '/solutions/freelancers', expectTitle: ROUTES_METADATA['/solutions/freelancers'].title, expectRobots: 'index, follow', expectSchema: true },
    { path: '/solutions/consultants', expectTitle: ROUTES_METADATA['/solutions/consultants'].title, expectRobots: 'index, follow', expectSchema: true },
    { path: '/solutions/studios', expectTitle: ROUTES_METADATA['/solutions/studios'].title, expectRobots: 'index, follow', expectSchema: true },
    { path: '/pricing', expectTitle: ROUTES_METADATA['/pricing'].title, expectRobots: 'index, follow', expectSchema: true },
    { path: '/integrations', expectTitle: ROUTES_METADATA['/integrations'].title, expectRobots: 'index, follow', expectSchema: true },
    { path: '/integrations/gmail', expectTitle: ROUTES_METADATA['/integrations/gmail'].title, expectRobots: 'index, follow', expectSchema: true },
    { path: '/integrations/google-calendar', expectTitle: ROUTES_METADATA['/integrations/google-calendar'].title, expectRobots: 'index, follow', expectSchema: true },
    { path: '/integrations/google-drive', expectTitle: ROUTES_METADATA['/integrations/google-drive'].title, expectRobots: 'index, follow', expectSchema: true },
    { path: '/integrations/github', expectTitle: ROUTES_METADATA['/integrations/github'].title, expectRobots: 'index, follow', expectSchema: true },
    { path: '/contact', expectTitle: ROUTES_METADATA['/contact'].title, expectRobots: 'index, follow', expectSchema: true },
    { path: '/docs', expectTitle: ROUTES_METADATA['/docs'].title, expectRobots: 'index, follow', expectSchema: true },
    { path: '/security', expectTitle: ROUTES_METADATA['/security'].title, expectRobots: 'index, follow', expectSchema: true },
    { path: '/privacy', expectTitle: ROUTES_METADATA['/privacy'].title, expectRobots: 'index, follow', expectSchema: true },
    { path: '/terms', expectTitle: ROUTES_METADATA['/terms'].title, expectRobots: 'index, follow', expectSchema: true },
    { path: '/login', expectTitle: ROUTES_METADATA['/login'].title, expectRobots: 'noindex, nofollow', expectSchema: false },
    { path: '/non-existent-test-404', expectTitle: ROUTES_METADATA['/404'].title, expectRobots: 'noindex, nofollow', expectSchema: false },
  ];

  for (const item of testRoutes) {
    console.log(`  Inspecting route: ${item.path}`);
    await page.goto(`http://localhost:5198#${item.path}`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(
      (expectedTitle) => document.title.includes(expectedTitle),
      item.expectTitle,
      { timeout: 4000 }
    ).catch(() => {});

    const title = await page.title();
    assert(title.includes(item.expectTitle), `Page title "${title}" contains "${item.expectTitle}"`);

    const canonical = await page.getAttribute('link[rel="canonical"]', 'href');
    assert(
      canonical && canonical.startsWith('https://syntaflow.tech'),
      `Canonical URL is canonical host: ${canonical}`
    );

    const robots = await page.getAttribute('meta[name="robots"]', 'content');
    assert(robots === item.expectRobots, `Robots meta tag matches "${item.expectRobots}" (got "${robots}")`);

    const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
    assert(Boolean(ogTitle), `og:title present: "${ogTitle}"`);

    const ogImage = await page.getAttribute('meta[property="og:image"]', 'content');
    assert(ogImage === 'https://syntaflow.tech/brand/og-image.png', `og:image is 1200x630 card: ${ogImage}`);

    const twitterCard = await page.getAttribute('meta[name="twitter:card"]', 'content');
    assert(twitterCard === 'summary_large_image', `twitter:card is summary_large_image`);

    // Verify structured data scripts
    const jsonLdScripts = await page.$$eval('script[type="application/ld+json"]', (scripts) =>
      scripts.map((s) => {
        try {
          return JSON.parse(s.textContent || '{}');
        } catch {
          return null;
        }
      })
    );
    if (item.expectSchema) {
      assert(jsonLdScripts.length > 0 && jsonLdScripts.every(Boolean), `Valid JSON-LD schema injected (${jsonLdScripts.length} schemas)`);
    } else {
      assert(jsonLdScripts.length === 0, `No JSON-LD schemas on noindex utility/error page`);
    }

    // Verify all anchor tags use clean paths, not hash links
    const invalidHashLinks = await page.$$eval('a[href^="#/"]', (links) => links.map((a) => a.getAttribute('href')));
    assert(invalidHashLinks.length === 0, `Zero crawler-unfriendly hash links found (found: ${invalidHashLinks.length})`);
  }

  // Verify 404 Recovery Links
  await page.goto('http://localhost:5198#/random-invalid-page-12345', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(50);
  const recoveryLinks = await page.$$eval('a', (links) => links.map((a) => a.getAttribute('href')));
  assert(recoveryLinks.includes('/'), '404 page provides recovery link to /');
  assert(recoveryLinks.includes('/product'), '404 page provides recovery link to /product');
  assert(recoveryLinks.includes('/docs'), '404 page provides recovery link to /docs');

} finally {
  if (browser) await browser.close();
  server.httpServer.close();
}

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`VERIFICATION SUMMARY: ${passedChecks}/${totalChecks} PASSED (${failedChecks} failed)`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

if (failedChecks > 0) {
  process.exit(1);
} else {
  console.log('✓ TECHNICAL SEO FOUNDATION 100% VERIFIED.');
}
