import React from 'react';
import { SEOHead } from '../components/seo/SEOHead';
import { PageHero } from '../components/marketing/PageHero';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { PRODUCT_NAV } from '../content/navData';
import { CTASection } from '../components/marketing/CTASection';

export const ProductOverviewPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Product Overview — Connected Operating Environment"
        description="Syntaflow connects clients, projects, tasks, documents, reviews, and delivery into a calm, continuous desktop operating environment."
      />

      <PageHero
        eyebrow="Syntaflow Architecture"
        title="The connected operating environment for client work."
        description="Run the complete client engagement lifecycle — from initial request and scoping, through milestone execution and version review, to approved delivery — in one unified, high-density desktop workspace."
        primaryCta={{ label: 'Get Desktop App (v0.1)', href: '/download' }}
        secondaryCta={{ label: 'View 7-Stage Workflow', href: '/#workflow' }}
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
              Four operational pillars. One continuous record.
            </h2>
            <p style={{ fontSize: 'var(--fs-body-lg)', color: 'var(--color-text-secondary)', maxWidth: '720px' }}>
              Every engagement evolves through distinct phases. Syntaflow provides specialized, high-density surfaces while maintaining a single source of truth.
            </p>
          </div>

          <div className="sf-grid-2" style={{ gap: 'var(--space-6)', marginBottom: 'var(--space-16)' }}>
            {PRODUCT_NAV.filter((p) => p.href !== '/product').map((pillar) => (
              <Card key={pillar.href} padding="lg" interactive>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    {pillar.label}
                  </h3>
                  {pillar.badge && <StatusBadge status={pillar.badge} size="sm" />}
                </div>
                <p style={{ fontSize: '0.9375rem', lineHeight: '1.6', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
                  {pillar.description}
                </p>
                <Button href={pillar.href} variant="outline" size="sm">
                  Explore {pillar.label} →
                </Button>
              </Card>
            ))}
          </div>

          {/* 5 Acceptance Gates Section */}
          <div
            style={{
              padding: 'var(--space-8)',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8125rem',
                color: 'var(--color-cyan)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 'var(--space-2)',
              }}
            >
              DOMAIN INTEGRITY
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--fs-h3)',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-4)',
              }}
            >
              The Five Acceptance Gates
            </h3>
            <p style={{ fontSize: '0.9375rem', lineHeight: '1.6', color: 'var(--color-text-secondary)', maxWidth: '800px', marginBottom: 'var(--space-6)' }}>
              Syntaflow prevents operational drift by enforcing five rigorous gates. Work cannot silently bypass quality boundaries.
            </p>

            <div className="sf-grid-2" style={{ gap: 'var(--space-4)' }}>
              {[
                { gate: 'Gate 1: Commercial Alignment', desc: 'Client engagement parameters, primary decision-makers, and commercial terms are explicitly registered before scoping activates.' },
                { gate: 'Gate 2: Scoping Baseline', desc: 'Milestone schedules, target due dates, and deliverable commitments are bound to a verified project blueprint.' },
                { gate: 'Gate 3: Snapshot Immutability', desc: 'Draft documents transition into immutable DocVersion snapshots prior to client review transmission.' },
                { gate: 'Gate 4: Review Decision Binding', desc: 'Client approvals and revision requests bind to exact version snapshots, preventing disputes over modified drafts.' },
                { gate: 'Gate 5: Delivery Completeness', desc: 'Final delivery packages enforce 100% prerequisite deliverable sign-off before handover completion.' },
              ].map((g, i) => (
                <div
                  key={i}
                  style={{
                    padding: 'var(--space-4)',
                    backgroundColor: 'var(--color-surface-raised)',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>
                    {g.gate}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>
                    {g.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  );
};
