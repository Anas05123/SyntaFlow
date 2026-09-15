import React from 'react';
import { SEOHead } from '../components/seo/SEOHead';
import { PageHero } from '../components/marketing/PageHero';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { LEGAL_DOCS } from '../content/legalData';
import { Link } from '../router/Router';
import { usePath } from '../router/routerContext';

interface LegalPageProps {
  docId?: 'terms' | 'privacy' | 'cookies' | 'acceptable-use';
}

export const LegalPage: React.FC<LegalPageProps> = ({ docId }) => {
  const path = usePath();

  let resolvedId = docId;
  if (!resolvedId) {
    if (path === '/terms') resolvedId = 'terms';
    else if (path === '/legal/privacy' || path === '/privacy-policy') resolvedId = 'privacy';
    else if (path === '/cookies') resolvedId = 'cookies';
    else if (path === '/acceptable-use') resolvedId = 'acceptable-use';
    else resolvedId = 'terms';
  }

  const doc = LEGAL_DOCS[resolvedId] || LEGAL_DOCS.terms;

  return (
    <>
      <SEOHead
        title={`${doc.title} — Syntaflow Legal`}
        description={`Official ${doc.title.toLowerCase()} for Syntaflow desktop application and web services.`}
      />

      <PageHero
        eyebrow="Legal & Governance"
        title={doc.title}
        description={`Last updated: ${doc.lastUpdated}. Structural draft prepared for preview distribution.`}
      />

      <section className="sf-section">
        <Container size="narrow">
          {/* Draft Notice Alert */}
          <div
            style={{
              padding: 'var(--space-4) var(--space-6)',
              backgroundColor: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: 'var(--radius-md)',
              marginBottom: 'var(--space-8)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <span style={{ color: 'var(--color-status-waiting)', fontSize: '1.25rem' }}>⚠</span>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>
              <strong>DRAFT STRUCTURE NOTICE:</strong> This text represents an internal architectural draft structure for the Syntaflow website preview. It is not finalized legal counsel and will be replaced by formal legal documentation prior to general commercial release.
            </div>
          </div>

          {/* Tab Navigation for Legal Documents */}
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              overflowX: 'auto',
              paddingBottom: 'var(--space-4)',
              marginBottom: 'var(--space-8)',
              borderBottom: '1px solid var(--color-border)',
            }}
          >
            {[
              { id: 'terms', label: 'Terms of Service', href: '/terms' },
              { id: 'privacy', label: 'Privacy Policy', href: '/legal/privacy' },
              { id: 'cookies', label: 'Cookie Policy', href: '/cookies' },
              { id: 'acceptable-use', label: 'Acceptable Use', href: '/acceptable-use' },
            ].map((item) => {
              const isActive = resolvedId === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  style={{
                    padding: '0.5rem 0.875rem',
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                    backgroundColor: isActive ? 'var(--color-surface-raised)' : 'transparent',
                    borderRadius: 'var(--radius-sm)',
                    border: isActive ? '1px solid var(--color-border-bright)' : '1px solid transparent',
                    whiteSpace: 'nowrap',
                    textDecoration: 'none',
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Legal Document Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {doc.sections.map((sec: { heading: string; content: string }, i: number) => (
              <Card key={i} padding="lg">
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--space-2)',
                  }}
                >
                  {sec.heading}
                </h3>
                <p
                  style={{
                    fontSize: '0.9375rem',
                    lineHeight: '1.7',
                    color: 'var(--color-text-secondary)',
                    margin: 0,
                  }}
                >
                  {sec.content}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
};
