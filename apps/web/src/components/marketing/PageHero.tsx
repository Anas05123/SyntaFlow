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
    <section className="page-hero">
      <div className="container">
        <div className="page-hero__inner">
          {breadcrumbs && (
            <Breadcrumbs
              items={breadcrumbs}
              className="page-hero__breadcrumbs"
              style={{ padding: 0 }}
            />
          )}

          <div className="page-hero__meta">
            {eyebrow && <span className="page-hero__eyebrow">{eyebrow}</span>}
            {status && (
              <span className="page-hero__status">
                <StatusBadge status={status} size="sm" />
              </span>
            )}
          </div>
          <h1 className="hero-kinetic page-hero__title">
            {title}
          </h1>
          <p className="page-hero__description">
            {description}
          </p>
          {children && <div className="page-hero__actions">{children}</div>}
        </div>
      </div>
    </section>
  );
};
