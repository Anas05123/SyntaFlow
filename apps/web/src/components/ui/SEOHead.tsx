import React, { useEffect } from 'react';
import {
  SITE_CONFIG,
  getRouteMetadata,
  type BreadcrumbItem,
} from '../../seo/seoConfig';
import {
  getOrganizationSchema,
  getSoftwareApplicationSchema,
  getBreadcrumbListSchema,
} from '../../seo/structuredData';

export interface SEOHeadProps {
  title?: string;
  description?: string;
  path?: string;
  indexable?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  ogImage?: string;
  ogType?: 'website' | 'article';
}

function setOrUpdateMeta(attribute: 'name' | 'property', key: string, content: string): void {
  let element = document.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function setOrUpdateCanonical(url: string): void {
  let element = document.querySelector('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.setAttribute('href', url);
}

function injectJsonLd(id: string, schema: Record<string, unknown> | null): void {
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!schema) {
    if (script) script.remove();
    return;
  }
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(schema);
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title: titleProp,
  description: descProp,
  path: pathProp,
  indexable: indexableProp,
  breadcrumbs: breadcrumbsProp,
  ogImage: ogImageProp,
  ogType: ogTypeProp,
}) => {
  useEffect(() => {
    // 1. Host invariant check: redirect www.syntaflow.tech to https://syntaflow.tech
    if (typeof window !== 'undefined' && window.location.hostname === 'www.syntaflow.tech') {
      window.location.replace(
        `https://syntaflow.tech${window.location.pathname}${window.location.search}${window.location.hash}`
      );
      return;
    }

    // 2. Resolve metadata from config and props
    const currentPath =
      pathProp ||
      (typeof window !== 'undefined'
        ? window.location.hash.replace(/^#/, '') || window.location.pathname
        : '/');
    const config = getRouteMetadata(currentPath);

    const title = titleProp || config.title;
    const fullTitle = SITE_CONFIG.titleTemplate(title);
    const description = descProp || config.description;
    const canonicalPath = config.canonicalPath;
    const canonicalUrl = `${SITE_CONFIG.canonicalHost}${canonicalPath === '/' ? '/' : canonicalPath}`;
    const isIndexable = indexableProp !== undefined ? indexableProp : config.indexable;
    const ogImage = ogImageProp || config.ogImage || SITE_CONFIG.defaultOgImage;
    const ogType = ogTypeProp || config.ogType || 'website';
    const breadcrumbs = breadcrumbsProp || config.breadcrumbs;

    // 3. Document Title
    document.title = fullTitle;

    // 4. Description
    setOrUpdateMeta('name', 'description', description);

    // 5. Canonical Link
    setOrUpdateCanonical(canonicalUrl);

    // 6. Robots Tag
    setOrUpdateMeta(
      'name',
      'robots',
      isIndexable ? 'index, follow' : 'noindex, nofollow'
    );

    // 7. OpenGraph Tags
    setOrUpdateMeta('property', 'og:site_name', SITE_CONFIG.siteName);
    setOrUpdateMeta('property', 'og:type', ogType);
    setOrUpdateMeta('property', 'og:title', fullTitle);
    setOrUpdateMeta('property', 'og:description', description);
    setOrUpdateMeta('property', 'og:url', canonicalUrl);
    setOrUpdateMeta('property', 'og:image', ogImage);
    setOrUpdateMeta('property', 'og:image:width', '1200');
    setOrUpdateMeta('property', 'og:image:height', '630');
    setOrUpdateMeta('property', 'og:image:alt', fullTitle);

    // 8. Twitter Card Tags
    setOrUpdateMeta('name', 'twitter:card', 'summary_large_image');
    setOrUpdateMeta('name', 'twitter:title', fullTitle);
    setOrUpdateMeta('name', 'twitter:description', description);
    setOrUpdateMeta('name', 'twitter:image', ogImage);

    // 9. Structured Data Injection
    // Global Organization + SoftwareApplication schema on Homepage
    if (canonicalPath === '/' || canonicalPath === '') {
      injectJsonLd('sf-schema-org', getOrganizationSchema());
      injectJsonLd('sf-schema-app', getSoftwareApplicationSchema());
    } else {
      injectJsonLd('sf-schema-org', null);
      injectJsonLd('sf-schema-app', null);
    }

    // Breadcrumbs Schema on pages with hierarchy
    if (breadcrumbs && breadcrumbs.length > 0) {
      injectJsonLd('sf-schema-breadcrumbs', getBreadcrumbListSchema(breadcrumbs));
    } else {
      injectJsonLd('sf-schema-breadcrumbs', null);
    }
  }, [
    titleProp,
    descProp,
    pathProp,
    indexableProp,
    breadcrumbsProp,
    ogImageProp,
    ogTypeProp,
  ]);

  return null;
};
