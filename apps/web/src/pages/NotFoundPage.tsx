import React from 'react';
import { SEOHead } from '../components/ui/SEOHead';
import { Link } from '../utils/router';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - var(--header-height) - 300px)',
        padding: 'var(--space-64) var(--space-24)',
        textAlign: 'center',
      }}
    >
      <SEOHead
        title="Page Not Found | Syntaflow"
        description="The requested page could not be found. Return to Syntaflow Home, explore our Product, browse Integrations, or read Documentation."
        path="/404"
        indexable={false}
      />

      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Eyebrow Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 12px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            marginBottom: 'var(--space-20)',
          }}
        >
          <span
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              color: '#f87171',
              letterSpacing: '0.06em',
            }}
          >
            404 // RESOURCE NOT FOUND
          </span>
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: 'var(--text)',
            lineHeight: 1.15,
            marginBottom: 'var(--space-16)',
          }}
        >
          Page Not Found
        </h1>

        <p
          style={{
            fontSize: '16px',
            lineHeight: 1.6,
            color: 'var(--text-muted)',
            marginBottom: 'var(--space-32)',
          }}
        >
          The page you requested does not exist, has moved to a new permanent location, or the link may have been mistyped.
        </p>

        {/* Quick Recovery Navigation Links */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '12px',
            marginBottom: 'var(--space-32)',
            textAlign: 'left',
          }}
        >
          <Link
            href="/"
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--cyan)';
              (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface-hover)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
              (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface)';
            }}
          >
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>
              Home →
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Connected workspace
            </div>
          </Link>

          <Link
            href="/product"
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--cyan)';
              (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface-hover)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
              (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface)';
            }}
          >
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>
              Product →
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Core operating suites
            </div>
          </Link>

          <Link
            href="/integrations"
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--cyan)';
              (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface-hover)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
              (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface)';
            }}
          >
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>
              Integrations →
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Connected work tools
            </div>
          </Link>

          <Link
            href="/docs"
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--cyan)';
              (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface-hover)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
              (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface)';
            }}
          >
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>
              Docs →
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Guides & references
            </div>
          </Link>
        </div>

        <div>
          <Button variant="primary" href="/">
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};
