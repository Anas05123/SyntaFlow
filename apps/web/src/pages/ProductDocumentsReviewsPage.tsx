import React from 'react';
import { SEOHead } from '../components/seo/SEOHead';
import { PageHero } from '../components/marketing/PageHero';
import { Container } from '../components/ui/Container';
import { FeatureRail } from '../components/marketing/FeatureRail';
import { CTASection } from '../components/marketing/CTASection';

export const ProductDocumentsReviewsPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Document Studio & Review Transmission — Syntaflow"
        description="Unified 3-column document studio, continuous executive paper canvas, immutable DocVersion snapshots, and 5-step review transmission studio."
      />

      <PageHero
        eyebrow="Product Pillar"
        title="Documents & Reviews"
        description="Continuous editorial drafting on an executive paper canvas, strictly immutable version snapshots, and formal review transmission packages."
        primaryCta={{ label: 'Explore Delivery & Approvals', href: '/product/delivery-approvals' }}
        secondaryCta={{ label: 'Get Desktop App', href: '/download' }}
      />

      <section className="sf-section">
        <Container>
          {/* Feature 1: Document Studio */}
          <FeatureRail
            tag="DOCUMENT STUDIO"
            title="Unified 3-column executive drafting."
            description="Draft proposals, briefs, and client deliverables in a focused desktop studio. Left rail shows your structured section outline with live completion indicators. Center canvas renders an executive paper layout with continuous reading hierarchy. Right rail hosts review intelligence and private notes."
            invariant="Live dirty/clean/saving state contract with Ctrl+S keyboard shortcut support and zero lost keystrokes."
            bullets={[
              'Continuous typographic reading canvas calibrated between 720px and 850px',
              'Section outline with instant click-to-edit inline workflows and completion status dots',
              'Right review intelligence rail displaying client feedback quotes beside internal notes',
            ]}
            visual={
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
                <div style={{ color: 'var(--color-cyan)', marginBottom: '0.5rem', fontWeight: 600 }}>// 3-COLUMN STUDIO CONTRACT</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '0.5rem', minHeight: '120px' }}>
                  <div style={{ padding: '0.5rem', backgroundColor: 'var(--color-surface-raised)', borderRadius: '4px', fontSize: '0.6875rem' }}>
                    <div style={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}>Outline</div>
                    <div style={{ color: 'var(--color-status-active)', marginTop: '0.25rem' }}>● 01 Intro</div>
                    <div style={{ color: 'var(--color-status-waiting)', marginTop: '0.25rem' }}>○ 02 Scope</div>
                  </div>
                  <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-canvas)', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Executive Paper Canvas</div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-tertiary)', marginTop: '0.25rem' }}>
                      Typography scale: Display 30px / Page Title 24px / Body 14px (Inter)
                    </div>
                  </div>
                  <div style={{ padding: '0.5rem', backgroundColor: 'var(--color-surface-raised)', borderRadius: '4px', fontSize: '0.6875rem' }}>
                    <div style={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}>Intelligence</div>
                    <div style={{ color: 'var(--color-cyan)', marginTop: '0.25rem' }}>Feedback SLA: 24h</div>
                  </div>
                </div>
              </div>
            }
          />

          {/* Feature 2: Immutable Version Snapshots */}
          <FeatureRail
            reversed
            tag="VERSION IMMUTABILITY"
            title="Submitted document versions are strictly immutable."
            description="The moment a proposal or deliverable is submitted to a client for review, it locks permanently as a cryptographic DocVersion snapshot (v1.0, v1.1). Revisions occur exclusively on incremented working drafts."
            invariant="Review decisions bind strictly to exact version snapshots, eliminating delivery ambiguity."
            bullets={[
              'No silent overwriting: submitted documents can never be modified in-place',
              'Clear revision genealogy: trace changes across v1.0, v1.1, and approved v2.0',
              'Permanent snapshot export: download or print exact historical records at any time',
            ]}
            visual={
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
                <div style={{ color: 'var(--color-cobalt-hover)', marginBottom: '0.5rem', fontWeight: 600 }}>// SNAPSHOT IMMUTABILITY RULE</div>
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-surface-raised)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>Proposal_Acme_v1.0</span>
                    <span style={{ color: 'var(--color-status-active)' }}>[LOCKED SNAPSHOT]</span>
                  </div>
                  <div style={{ color: 'var(--color-text-tertiary)', fontSize: '0.75rem' }}>
                    Submitted Sep 12, 14:30 • Hash: 8f2c91b4 • Review Decision: Approved
                  </div>
                  <div style={{ marginTop: '0.5rem', color: 'var(--color-cyan)', fontSize: '0.75rem' }}>
                    Working Draft: Proposal_Acme_v1.1 (Draft in Progress)
                  </div>
                </div>
              </div>
            }
          />

          {/* Feature 3: Review Transmission Studio */}
          <FeatureRail
            tag="TRANSMISSION STUDIO"
            title="5-step review transmission studio."
            description="Syntaflow elevates deliverable handover from an afterthought into a high-craft executive experience. The Review Transmission Studio guides you through snapshot confirmation, turnaround SLA chips, cover note presets, and presentation styling."
            invariant="Three distinct presentation templates: Executive Editorial, Modern Studio, and Enterprise Formal."
            bullets={[
              'Step 1: Snapshot verification — confirm exact immutable version binding',
              'Step 2: Turnaround SLA chips — set explicit client decision deadlines',
              'Step 3: Cover letter presets — executive summary, turnaround urgency, and notes',
              'Step 4: Template selection — Executive Editorial, Modern Studio, Enterprise Formal',
              'Step 5: Live client transactional preview before transmission',
            ]}
            visual={
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
                <div style={{ color: 'var(--color-cyan)', marginBottom: '0.5rem', fontWeight: 600 }}>// PRESENTATION TEMPLATES</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  <div style={{ padding: '0.5rem', backgroundColor: 'rgba(37,99,235,0.15)', border: '1px solid var(--color-cobalt)', borderRadius: '4px', textAlign: 'center' }}>
                    <div style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 600 }}>Editorial</div>
                  </div>
                  <div style={{ padding: '0.5rem', backgroundColor: 'var(--color-surface-raised)', borderRadius: '4px', textAlign: 'center', color: 'var(--color-text-tertiary)', fontSize: '0.75rem' }}>
                    Modern
                  </div>
                  <div style={{ padding: '0.5rem', backgroundColor: 'var(--color-surface-raised)', borderRadius: '4px', textAlign: 'center', color: 'var(--color-text-tertiary)', fontSize: '0.75rem' }}>
                    Enterprise
                  </div>
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
