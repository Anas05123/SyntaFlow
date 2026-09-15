import React from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { PageHero } from '../../components/marketing/PageHero';
import { Card } from '../../components/ui/Card';
import { CTASection } from '../../components/marketing/CTASection';

const AGENCY_BENEFITS = [
  {
    title: 'Designated Decision Authorities',
    description: 'Bind review transmissions to specific client executives. Stop mid-level client employees from derailing agreed project scopes with informal feedback.',
  },
  {
    title: 'SLA Turnaround Tracking',
    description: 'Set explicit review turnaround commitments (24h/48h/72h). Syntaflow highlights waiting gates in your cockpit, preventing client delays from destroying timelines.',
  },
  {
    title: 'Executive Presentation Shells',
    description: 'Deliver specs and proposals via three polished presentation shells: Executive Editorial, Modern Studio, and Enterprise Formal — complete with agency case studies.',
  },
  {
    title: 'Delivery Gate Protection',
    description: 'Protect agency margins by preventing production files or code repositories from discharging until all prerequisite milestone invoices are approved.',
  },
];

export const AgenciesPage: React.FC = () => {
  return (
    <div>
      <SEOHead
        title="Syntaflow for Agencies"
        description="Boutique agency client operations. Enforce turnaround SLAs, designated decision authorities, executive review portals, and delivery gates."
        path="/solutions/agencies"
      />

      <PageHero
        eyebrow="Solutions // Agencies"
        title="Client operations built for boutique agency margins."
        description="Agencies lose up to 20% of project revenue to scope creep and review paralysis. Syntaflow provides the operational infrastructure to keep client milestones locked and verified."
        status="AVAILABLE NOW"
      />

      <section className="section">
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'var(--space-24)',
            }}
          >
            {AGENCY_BENEFITS.map((b) => (
              <Card key={b.title} variant="default" style={{ padding: 'var(--space-28)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginBottom: 'var(--space-8)' }}>
                  {b.title}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {b.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Protect your agency&apos;s project margins."
        description="Deploy client operations designed for professional rigor, SLA enforcement, and verified sign-offs."
        primaryLabel="Explore Document Reviews"
        primaryHref="#/product/documents-reviews"
      />
    </div>
  );
};
