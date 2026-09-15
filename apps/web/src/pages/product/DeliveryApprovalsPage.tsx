import React from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { PageHero } from '../../components/marketing/PageHero';
import { Card } from '../../components/ui/Card';
import { CTASection } from '../../components/marketing/CTASection';

const DELIVERY_FEATURES = [
  {
    title: 'Delivery Gate Enforcement',
    description: 'Final production packages and project handover cannot be discharged until all prerequisite document versions have recorded client approval.',
    code: 'FEATURE // 01',
  },
  {
    title: 'Immutable Sign-Off Proof',
    description: 'Every client approval captures the reviewer identity, timestamp, SLA turnaround duration, and version hash into a permanent local audit record.',
    code: 'FEATURE // 02',
  },
  {
    title: 'Zero Scope Creep Leakage',
    description: 'Changes requested after version sign-off cannot secretly alter existing deliverables. New requirements automatically generate incremented change requests.',
    code: 'FEATURE // 03',
  },
  {
    title: 'Engagement Archival Engine',
    description: 'Upon completed delivery, the engagement transitions into an immutable archived record, safely preserved in local SQLite storage for future reference.',
    code: 'FEATURE // 04',
  },
];

export const DeliveryApprovalsPage: React.FC = () => {
  return (
    <div>
      <SEOHead
        title="Delivery & Approvals — Syntaflow"
        description="Delivery gate enforcement, immutable sign-off records, and zero scope-creep handover in a high-integrity desktop operating environment."
        path="/product/delivery-approvals"
      />

      <PageHero
        eyebrow="Product // Delivery & Approvals"
        title="Deliver with verified sign-off integrity."
        description="Eliminate unpaid revisions and scope disputes. Syntaflow enforces architectural delivery gates that protect your studio from releasing work prematurely."
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
            {DELIVERY_FEATURES.map((f) => (
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

          <Card variant="raised" style={{ padding: 'var(--space-32)', borderLeft: '4px solid var(--active)' }}>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--active)', textTransform: 'uppercase', marginBottom: 'var(--space-8)' }}>
              CORE ARCHITECTURAL INVARIANT
            </div>
            <h4 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginBottom: 'var(--space-8)' }}>
              Delivery Gate Enforcement
            </h4>
            <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              In Syntaflow, final handover packages require all prerequisite deliverables to be approved. The desktop engine physically disables final asset release until all gating milestones are fulfilled.
            </p>
          </Card>
        </div>
      </section>

      <CTASection
        title="Protect your studio&apos;s revenue and boundaries."
        description="Deploy client operations designed for professional rigor and verified outcomes."
        primaryLabel="Explore Solutions for Agencies"
        primaryHref="#/solutions/agencies"
      />
    </div>
  );
};
