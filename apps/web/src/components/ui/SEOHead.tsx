import React, { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description?: string;
  path?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description = 'Syntaflow is a desktop-first client engagement environment that keeps one continuous, connected record of every client relationship — from first contact through final delivery.',
  path = '',
}) => {
  useEffect(() => {
    const fullTitle = title.includes('Syntaflow') ? title : `${title} — Syntaflow`;
    document.title = fullTitle;

    // Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // Canonical
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', `https://syntaflow.tech${path}`);

    // OpenGraph
    const ogTags: Record<string, string> = {
      'og:title': fullTitle,
      'og:description': description,
      'og:url': `https://syntaflow.tech${path}`,
      'og:type': 'website',
      'og:site_name': 'Syntaflow',
    };

    Object.entries(ogTags).forEach(([prop, val]) => {
      let tag = document.querySelector(`meta[property="${prop}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', prop);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', val);
    });
  }, [title, description, path]);

  return null;
};
