import React from 'react';
import type { BreadcrumbItem } from '../../seo/seoConfig';
import { Link } from './Link';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  style?: React.CSSProperties;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '', style }) => {
  if (!items || items.length <= 1) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 0',
        fontSize: '13px',
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-body)',
        ...style,
      }}
    >
      <ol
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
          listStyle: 'none',
          padding: 0,
          margin: 0,
        }}
      >
        {items.map((crumb, idx) => {
          const isLast = idx === items.length - 1;
          const href = crumb.item.replace('https://syntaflow.tech', '') || '/';

          return (
            <li
              key={crumb.item + idx}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              {idx > 0 && (
                <span style={{ color: 'var(--border)', userSelect: 'none' }} aria-hidden="true">
                  /
                </span>
              )}
              {isLast ? (
                <span
                  aria-current="page"
                  style={{
                    color: 'var(--text)',
                    fontWeight: 500,
                  }}
                >
                  {crumb.name}
                </span>
              ) : (
                <Link
                  href={href}
                  style={{
                    color: 'var(--text-muted)',
                    textDecoration: 'none',
                    transition: 'color 0.15s ease',
                  }}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'var(--cyan)')}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'var(--text-muted)')}
                >
                  {crumb.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
