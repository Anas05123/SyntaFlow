import { SITE_CONFIG, type BreadcrumbItem } from './seoConfig.ts';

/**
 * Generate Schema.org Organization schema
 */
export function getOrganizationSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.organization.name,
    url: SITE_CONFIG.organization.url,
    logo: SITE_CONFIG.organization.logo,
    sameAs: SITE_CONFIG.organization.sameAs,
  };
}

/**
 * Generate Schema.org SoftwareApplication schema
 */
export function getSoftwareApplicationSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE_CONFIG.softwareApplication.name,
    operatingSystem: SITE_CONFIG.softwareApplication.operatingSystem,
    applicationCategory: SITE_CONFIG.softwareApplication.applicationCategory,
    offers: {
      '@type': 'Offer',
      price: SITE_CONFIG.softwareApplication.offers.price,
      priceCurrency: SITE_CONFIG.softwareApplication.offers.priceCurrency,
    },
    url: SITE_CONFIG.softwareApplication.url,
    downloadUrl: SITE_CONFIG.softwareApplication.downloadUrl,
  };
}

/**
 * Generate Schema.org BreadcrumbList schema
 */
export function getBreadcrumbListSchema(items: BreadcrumbItem[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((crumb, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  };
}
