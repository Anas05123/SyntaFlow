import React from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { PageHero } from '../../components/marketing/PageHero';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CTASection } from '../../components/marketing/CTASection';

const CORE_MODULES = [
  {
    href: '#/product/client-ops',
    title: 'Client Operations',
    tagline: 'Relationships, Commercial Terms & Studio Onboarding',
    description: 'Keep organizational structure, primary decision-makers, contract terms (fixed, retainer, hourly), and project launchpads in one place.',
    tag: 'AVAILABLE NOW' as const,
  },
  {
    href: '#/product/projects-tasks',
    title: 'Projects & Tasks',
    tagline: 'Blueprints, Scope Tracking & Dual-Density Views',
    description: 'Deploy battle-tested scoping blueprints for brand systems, web platforms, and advisory retainers with responsive List and Board density modes.',
    tag: 'AVAILABLE NOW' as const,
  },
  {
    href: '#/product/documents-reviews',
    title: 'Documents & Reviews',
    tagline: 'Paper Studio & Immutable Version Transmissions',
    description: 'Draft proposals, agreements, and deliverables on an executive paper canvas. Freeze submissions into immutable DocVersion snapshots with guest reviews.',
    tag: 'AVAILABLE NOW' as const,
  },
  {
    href: '#/product/delivery-approvals',
    title: 'Delivery & Approvals',
    tagline: 'Gate Enforcement & Audit-Proof Sign-Offs',
    description: 'Guarantee that no final deliverables or invoices leave your workstation until all prerequisite document milestones have been approved by authorized contacts.',
    tag: 'AVAILABLE NOW' as const,
  },
];

export const ProductOverviewPage: React.FC = () => {
  return (
    <div>
      <SEOHead
        title="Product Overview — Syntaflow"
        description="Explore the desktop-first client engagement operating environment. Five unified systems connecting client context, project execution, immutable documents, and delivery gates."
        path="/product"
      />

      <PageHero
        eyebrow="Architecture & Systems"
        title="The client operations operating environment."
        description="Syntaflow consolidates the five critical layers of professional service engagements into one calm, local desktop application with zero cloud surveillance."
        status="AVAILABLE NOW"
      >
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Button href="#/product/client-ops" variant="primary">
            Explore Client Operations →
          </Button>
          <Button href="#/security" variant="secondary">
            View Security Architecture
          </Button>
        </div>
      </PageHero>

      {/* Core Systems Grid */}
      <section className="section">
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: 'var(--space-24)',
            }}
          >
            {CORE_MODULES.map((m) => (
              <Card key={m.title} variant="default" interactive style={{ padding: 'var(--space-32)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-16)' }}>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)' }}>
                    SYSTEM MODULE
                  </span>
                  <span style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: 'var(--active)', backgroundColor: 'var(--active-subtle)', padding: '2px 6px', borderRadius: '3px' }}>
                    {m.tag}
                  </span>
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: 'var(--space-8)' }}>
                  {m.title}
                </h3>
                <div style={{ fontSize: '13.5px', color: 'var(--cobalt)', fontWeight: 550, marginBottom: 'var(--space-12)' }}>
                  {m.tagline}
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 'var(--space-24)' }}>
                  {m.description}
                </p>
                <Button href={m.href} variant="secondary" size="sm">
                  Deep Dive →
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Ready to run client engagements with architectural rigor?"
        description="Experience client operations designed for clarity, version integrity, and zero cloud lock-in."
        primaryLabel="Download Desktop Preview"
        primaryHref="#/product/client-ops"
      />
    </div>
  );
};
