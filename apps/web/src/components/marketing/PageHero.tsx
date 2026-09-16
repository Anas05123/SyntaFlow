import React from 'react';
import { StatusBadge, type CapabilityStatus } from '../brand/StatusBadge';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import type { BreadcrumbItem } from '../../seo/seoConfig';

interface PageHeroProps {
  breadcrumbs?: BreadcrumbItem[];
  eyebrow?: string;
  title: string;
  description: string;
  status?: CapabilityStatus;
  children?: React.ReactNode;
}

export const PageHero: React.FC<PageHeroProps> = ({
  breadcrumbs,
  eyebrow,
  title,
  description,
  status,
  children,
}) => {
  return (
    <section
      style={{
        paddingTop: 'var(--space-48)',
        paddingBottom: 'var(--space-48)',
        borderBottom: '1px solid var(--edge)',
        backgroundColor: 'var(--canvas)',
      }}
    >
      <div className="container">
        <div style={{ maxWidth: '820px' }}>
          {breadcrumbs && <Breadcrumbs items={breadcrumbs} style={{ padding: '0 0 var(--space-12) 0' }} />}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-12)',
              marginBottom: 'var(--space-12)',
            }}
          >
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            {status && <StatusBadge status={status} size="sm" />}
          </div>
          <h1 className="heading-1 hero-kinetic" style={{ marginBottom: 'var(--space-20)' }}>
            {title}
          </h1>
          <p className="body-large" style={{ color: 'var(--text-muted)', marginBottom: children ? 'var(--space-32)' : 0 }}>
            {description}
          </p>
          {children && <div>{children}</div>}
        </div>
      </div>
    </section>
  );
};
