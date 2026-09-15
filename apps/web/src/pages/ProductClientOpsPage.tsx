import React from 'react';
import { SEOHead } from '../components/seo/SEOHead';
import { PageHero } from '../components/marketing/PageHero';
import { Container } from '../components/ui/Container';
import { FeatureRail } from '../components/marketing/FeatureRail';
import { CTASection } from '../components/marketing/CTASection';

export const ProductClientOpsPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Client Operations & Relationship Records — Syntaflow"
        description="Master-detail client split views, commercial onboarding drawers, decision-maker contacts, and unified communication history."
      />

      <PageHero
        eyebrow="Product Pillar"
        title="Client Operations"
        description="Structured client rosters, commercial terms, primary decision-makers, and continuous relationship records that never lose their context."
        primaryCta={{ label: 'Explore Projects & Tasks', href: '/product/projects-tasks' }}
        secondaryCta={{ label: 'Get Desktop App', href: '/download' }}
      />

      <section className="sf-section">
        <Container>
          {/* Feature 1: Master-Detail Split View */}
          <FeatureRail
            tag="CLIENT WORKSPACE"
            title="Master-detail client cockpit."
            description="View your entire client roster on the left with instant search and status chips. Select any client to reveal active projects, historical documents, financial baselines, and contact decision-makers on the right."
            invariant="Stale state is eliminated by construction using effectiveSelectedId: if a filtered list is empty, the detail pane clears safely with zero residual state."
            bullets={[
              'Quick-filter by active, waiting, or archived client relationships',
              'Immediate visibility into active projects, pending reviews, and next milestones',
              'Unified client pulse metrics: total lifetime value, open deliverables, and SLA turnaround',
            ]}
            visual={
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
                <div style={{ color: 'var(--color-cyan)', marginBottom: '0.5rem', fontWeight: 600 }}>// CLIENT ROSTER RECORD</div>
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-surface-raised)', borderRadius: 'var(--radius-sm)', marginBottom: '0.5rem' }}>
                  <div style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>Northlight Studio • Active Retainer</div>
                  <div style={{ color: 'var(--color-text-tertiary)', fontSize: '0.75rem' }}>LTV: $48,500 • SLA: 24h Turnaround • Contact: Elena Vance</div>
                </div>
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ color: 'var(--color-text-secondary)' }}>Active Projects: 2 • Documents: 8 • Pending Reviews: 1</div>
                </div>
              </div>
            }
          />

          {/* Feature 2: Client Onboarding Drawer */}
          <FeatureRail
            reversed
            tag="ONBOARDING STUDIO"
            title="Slide-over onboarding studio."
            description="Onboard new clients in an Apple-style studio slide-over drawer. Capture brand identity marks, primary decision-makers with direct contact credentials, and commercial models (Fixed Scope, Advisory Retainer, or Hourly Billing)."
            invariant="Commercial parameters are required before active project scoping can begin."
            bullets={[
              'Structured commercial models: Fixed project fee, monthly retainer, or hourly rate',
              'Designated primary decision-maker with turnaround SLA expectations',
              'Instant launchpad actions: scoping blueprint creator, initial proposal, or intake questionnaire',
            ]}
            visual={
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
                <div style={{ color: 'var(--color-cobalt-hover)', marginBottom: '0.5rem', fontWeight: 600 }}>// ONBOARDING DRAWER</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <div style={{ padding: '0.5rem', backgroundColor: 'rgba(37,99,235,0.15)', border: '1px solid var(--color-cobalt)', borderRadius: '4px', textAlign: 'center' }}>
                    <div style={{ color: '#fff', fontWeight: 600 }}>Fixed Fee</div>
                  </div>
                  <div style={{ padding: '0.5rem', backgroundColor: 'var(--color-surface-raised)', borderRadius: '4px', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
                    Retainer
                  </div>
                  <div style={{ padding: '0.5rem', backgroundColor: 'var(--color-surface-raised)', borderRadius: '4px', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
                    Hourly
                  </div>
                </div>
                <div style={{ color: 'var(--color-status-active)', fontSize: '0.75rem' }}>✓ SLA Bound: 24-hour executive review window</div>
              </div>
            }
          />

          {/* Feature 3: Client Communication UX */}
          <FeatureRail
            tag="COMMUNICATION FLOW"
            title="Truthful client communication."
            description="Syntaflow features a dedicated Client Communication UX with professional message drafting, transmission notes, and contact directories. For email delivery, it connects directly with your default desktop mail client — keeping your credentials secure on your machine."
            invariant="Zero third-party email provider sniffing. Mail connects via standard system handoff without remote access tokens."
            bullets={[
              'Draft milestone updates and revision cover notes directly in context',
              'Copy formatted transactional text or trigger your system mail application in one click',
              'Maintain an immutable internal log of all communication timestamps and decisions',
            ]}
            visual={
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
                <div style={{ color: 'var(--color-cyan)', marginBottom: '0.5rem', fontWeight: 600 }}>// MAIL HANDOFF PROTOCOL</div>
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-surface-raised)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--color-cyan)' }}>
                  <div style={{ color: 'var(--color-text-primary)' }}>To: elena@northlight.design</div>
                  <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    Subject: [Syntaflow] Deliverable v1.2 Review Snapshot
                  </div>
                </div>
                <div style={{ marginTop: '0.5rem', color: 'var(--color-text-tertiary)', fontSize: '0.75rem' }}>
                  Action: Open in default mail client (Outlook / Apple Mail / Thunderbird)
                </div>
              </div>
            }
          />
        </Container>
      </section>

      <CTASection />
    </>
  );
};
