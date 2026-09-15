import React from 'react';
import { SEOHead } from '../components/seo/SEOHead';
import { PageHero } from '../components/marketing/PageHero';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { CTASection } from '../components/marketing/CTASection';

export const SolutionsStudiosPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Syntaflow for Studios & Professional Services — High-Craft Delivery"
        description="Coordinate design, architectural, and engineering client delivery with immutable version snapshots and prerequisite delivery gates."
      />

      <PageHero
        eyebrow="Solutions for Studios"
        title="Elevate creative craft with structural delivery discipline."
        description="Design, architecture, and engineering studios craft exceptional work. Syntaflow provides the underlying operational backbone to present, review, and deliver that work with undeniable precision."
        primaryCta={{ label: 'Get Desktop App (v0.1)', href: '/download' }}
        secondaryCta={{ label: 'Explore Delivery Gates', href: '/product/delivery-approvals' }}
      />

      <section className="sf-section">
        <Container>
          <div style={{ marginBottom: 'var(--space-12)' }}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--fs-h2)',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-3)',
              }}
            >
              Mastery in design. Precision in delivery.
            </h2>
            <p style={{ fontSize: 'var(--fs-body-lg)', color: 'var(--color-text-secondary)', maxWidth: '720px' }}>
              When creative iterations run deep, version control and gate enforcement protect your studio's profitability and reputation.
            </p>
          </div>

          <div className="sf-grid-3" style={{ gap: 'var(--space-6)', marginBottom: 'var(--space-16)' }}>
            <Card padding="lg">
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-cyan)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                VERSION CONTROL
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1875rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
                Immutable Snapshots
              </h3>
              <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: 'var(--color-text-secondary)', margin: 0 }}>
                Submitted design guidelines, architectural blueprints, and engineering specs lock into immutable DocVersion snapshots. Revisions occur only on incremented drafts.
              </p>
            </Card>

            <Card padding="lg">
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-cobalt-hover)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                GATE PROTECTION
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1875rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
                Delivery Gate Enforcement
              </h3>
              <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: 'var(--color-text-secondary)', margin: 0 }}>
                Guarantee that final creative assets and source repositories are released only after all prerequisite milestones and payments have been formally cleared.
              </p>
            </Card>

            <Card padding="lg">
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-status-active)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                SHOWCASE INTEGRATION
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1875rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
                Portfolio Attachments
              </h3>
              <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: 'var(--color-text-secondary)', margin: 0 }}>
                Attach studio case studies and verified performance metrics directly to client review transmission packages, continually validating your studio's premium tier.
              </p>
            </Card>
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  );
};
