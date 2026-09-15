import React, { useEffect } from 'react';
import { usePath } from '../../router/routerContext';

export interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  type?: 'website' | 'article';
  schema?: Record<string, unknown>;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonical,
  ogImage = 'https://syntaflow.tech/brand/logo-full.png',
  type = 'website',
  schema,
}) => {
  const path = usePath();
  const fullCanonical = canonical || `https://syntaflow.tech${path === '/' ? '' : path}`;
  const fullTitle =
    path === '/'
      ? 'Syntaflow — Connected Intelligence That Moves Work Forward'
      : `${title} — Syntaflow`;

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('name', 'description', description);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', fullCanonical);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:image', ogImage);
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', ogImage);

    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', fullCanonical);

    // Schema.org JSON-LD
    const baseSchema = schema || {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Syntaflow',
      operatingSystem: 'Windows 10, Windows 11',
      applicationCategory: 'BusinessApplication',
      offers: {
        '@type': 'Offer',
        price: '0.00',
        priceCurrency: 'USD',
      },
      description,
      url: fullCanonical,
    };

    let script = document.querySelector('#schema-jsonld');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('id', 'schema-jsonld');
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(baseSchema);
  }, [fullTitle, description, fullCanonical, ogImage, type, schema]);

  return null;
};
