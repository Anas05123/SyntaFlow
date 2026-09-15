import React from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { PageHero } from '../../components/marketing/PageHero';
import { Card } from '../../components/ui/Card';
import { CTASection } from '../../components/marketing/CTASection';

const CLIENT_FEATURES = [
  {
    title: 'Master-Detail Split Workspace',
    description: 'Instantly toggle between client profiles with an zero-latency master-detail split view. Filter by active engagements, pending proposals, and archived relationships.',
    code: 'FEATURE // 01',
  },
  {
    title: 'Client Studio Slide-Over Drawer',
    description: 'Onboard new clients in an Apple-style slide-over studio. Collect brand marks, primary decision-maker email/role, commercial terms, and initial project blueprints.',
    code: 'FEATURE // 02',
  },
  {
    title: 'Commercial Terms Configuration',
    description: 'Specify commercial engagements: Fixed fee with milestone gates, monthly retainer allocations, or hourly advisory billing with SLA turnaround commitments.',
    code: 'FEATURE // 03',
  },
  {
    title: 'Decision Authority Anchoring',
    description: 'Explicitly designate authorized client reviewers. Review transmissions bind strictly to primary decision-makers, eliminating conflicting stakeholder edits.',
    code: 'FEATURE // 04',
  },
];

export const ClientOpsPage: React.FC = () => {
  return (
    <div>
      <SEOHead
        title="Client Operations — Syntaflow"
        description="Maintain client relationships, commercial agreements, decision-maker profiles, and onboarding studios in one local desktop environment."
        path="/product/client-ops"
      />

      <PageHero
        eyebrow="Product // Client Operations"
        title="Anchor every engagement to real client context."
        description="Never search through old email threads to remember who signs the checks or what commercial terms were agreed upon. Syntaflow keeps relationship context permanently tied to work."
        status="AVAILABLE NOW"
      />

      <section className="section">
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'var(--space-24)',
              marginBottom: 'var(--space-64)',
            }}
          >
            {CLIENT_FEATURES.map((f) => (
              <Card key={f.title} variant="default" style={{ padding: 'var(--space-28)' }}>
                <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', marginBottom: 'var(--space-12)' }}>
                  {f.code}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginBottom: 'var(--space-8)' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {f.description}
                </p>
              </Card>
            ))}
          </div>

          {/* Operational Invariant Callout */}
          <Card variant="raised" style={{ padding: 'var(--space-32)', borderLeft: '4px solid var(--cobalt)' }}>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cobalt)', textTransform: 'uppercase', marginBottom: 'var(--space-8)' }}>
              CORE ARCHITECTURAL INVARIANT
            </div>
            <h4 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginBottom: 'var(--space-8)' }}>
              Single Canonical Record for Client Identity
            </h4>
            <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              A client profile is created once in local SQLite storage. When you generate a proposal, open a task board, or transmit a review version, all components reference this canonical identity record. Client details never duplicate or drift out of sync.
            </p>
          </Card>
        </div>
      </section>

      <CTASection
        title="Eliminate relationship fragmentation."
        description="Keep every client engagement anchored to verified terms, contacts, and milestones."
        primaryLabel="Explore Projects & Tasks"
        primaryHref="#/product/projects-tasks"
      />
    </div>
  );
};
