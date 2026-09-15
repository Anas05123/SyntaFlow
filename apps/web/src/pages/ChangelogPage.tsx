import React from 'react';
import { SEOHead } from '../components/seo/SEOHead';
import { PageHero } from '../components/marketing/PageHero';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { CHANGELOG_RELEASES } from '../content/changelogData';
import { CTASection } from '../components/marketing/CTASection';

export const ChangelogPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Changelog & Desktop Release Notes — Syntaflow"
        description="Chronological record of verified Syntaflow desktop releases, architecture updates, and engine enhancements."
      />

      <PageHero
        eyebrow="Resources"
        title="Product Changelog"
        description="A transparent, verifiable record of desktop releases, architecture updates, and performance improvements."
      />

      <section className="sf-section">
        <Container size="narrow">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            {CHANGELOG_RELEASES.map((rel) => (
              <Card key={rel.version} padding="lg">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '1.125rem',
                        fontWeight: 700,
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      {rel.version}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        padding: '0.125rem 0.5rem',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'rgba(37, 99, 235, 0.15)',
                        color: 'var(--color-cobalt-hover)',
                        border: '1px solid rgba(37, 99, 235, 0.3)',
                      }}
                    >
                      {rel.badge}
                    </span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--color-text-tertiary)' }}>
                    {rel.date}
                  </span>
                </div>

                <p style={{ fontSize: '0.9375rem', lineHeight: '1.6', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
                  {rel.summary}
                </p>

                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: 'var(--color-cyan)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: 'var(--space-2)',
                  }}
                >
                  Key Highlights
                </div>

                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  {rel.highlights.map((h, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>
                      <span style={{ color: 'var(--color-cyan)', marginTop: '0.125rem' }}>•</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  );
};
