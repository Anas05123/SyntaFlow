import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ROUTES_METADATA, SITE_CONFIG } from '../src/seo/seoConfig.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getPriority(route) {
  if (route === '/') return '1.0';
  if (route.startsWith('/product') || route === '/pricing' || route === '/download' || route === '/integrations') {
    return '0.9';
  }
  if (route.startsWith('/solutions') || route === '/security' || route === '/docs' || route === '/privacy' || route === '/terms') {
    return '0.8';
  }
  return '0.7';
}

function getChangeFreq(route) {
  if (route === '/' || route.startsWith('/product') || route === '/pricing' || route === '/changelog') {
    return 'weekly';
  }
  if (route === '/about' || route === '/contact' || route === '/faq' || route === '/data-handling') {
    return 'monthly';
  }
  return 'weekly';
}

export function generateSitemap() {
  const indexableRoutes = Object.entries(ROUTES_METADATA)
    .filter(([, meta]) => meta.indexable)
    .map(([path]) => ({
      path,
      canonicalUrl: `${SITE_CONFIG.canonicalHost}${path === '/' ? '/' : path}`,
      priority: getPriority(path),
      changefreq: getChangeFreq(path),
    }));

  const xmlEntries = indexableRoutes
    .map(
      (entry) => `  <url>
    <loc>${entry.canonicalUrl}</loc>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    )
    .join('\n');

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>
`;

  const outputPath = path.resolve(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outputPath, sitemapXml, 'utf-8');
  console.log(`Successfully generated sitemap.xml with ${indexableRoutes.length} canonical routes at ${outputPath}`);
  return indexableRoutes.length;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateSitemap();
}
