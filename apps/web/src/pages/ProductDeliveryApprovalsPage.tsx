import React from 'react';
import { SEOHead } from '../components/seo/SEOHead';
import { PageHero } from '../components/marketing/PageHero';
import { Container } from '../components/ui/Container';
import { FeatureRail } from '../components/marketing/FeatureRail';
import { CTASection } from '../components/marketing/CTASection';

export const ProductDeliveryApprovalsPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Delivery & Approvals — Syntaflow"
        description="Delivery gate enforcement, immutable client sign-off audit trails, and prerequisite completion verification."
      />

      <PageHero
        eyebrow="Product Pillar"
        title="Delivery & Approvals"
        description="Enforced delivery gates, formal client sign-off records, and complete handover packages that guarantee commercial alignment."
        primaryCta={{ label: 'Explore Solutions', href: '/solutions/freelancers' }}
        secondaryCta={{ label: 'Get Desktop App', href: '/download' }}
      />

      <section className="sf-section">
        <Container>
          {/* Feature 1: Delivery Gate Enforcement */}
          <FeatureRail
            tag="GATE ENFORCEMENT"
            title="Prerequisite delivery gates."
            description="In professional client work, handing over incomplete or unapproved milestones creates commercial disputes. Syntaflow enforces delivery gates by construction: a project cannot be closed or marked delivered until every required milestone deliverable has been formally signed off."
            invariant="Delivery gates are non-bypassable. Incomplete deliverables flag explicit blockers."
            bullets={[
              'Automated prerequisite validation before final handover packaging',
              'Explicit warnings if dependent milestones have unreviewed revisions pending',
              'Protects your payment terms: ensures milestone completion criteria are met',
            ]}
            visual={
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
                <div style={{ color: 'var(--color-status-active)', marginBottom: '0.5rem', fontWeight: 600 }}>// DELIVERY GATE STATUS</div>
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-surface-raised)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>Final Handover Package</span>
                    <span style={{ color: 'var(--color-status-active)' }}>[GATE CLEARED]</span>
                  </div>
                  <div style={{ color: 'var(--color-text-tertiary)', fontSize: '0.75rem' }}>
                    ✓ 3/3 Deliverables Approved • Zero Open Revisions • Authorized Signer Confirmed
                  </div>
                </div>
              </div>
            }
          />

          {/* Feature 2: Client Sign-Off Audit Trail */}
          <FeatureRail
            reversed
            tag="AUDIT TRAIL"
            title="Durable client sign-off records."
            description="Preserve the exact decision history behind every milestone. When a client approves a document or requests a revision, Syntaflow records the timestamp, the authorized signer, the exact version hash, and reviewer notes directly into the continuous engagement record."
            invariant="Approvals bind to exact version snapshots and are permanently stored in the local SQLite/state store."
            bullets={[
              'Exact timestamp and decision authority verification for every deliverable',
              'Captured client feedback quotes displayed alongside internal team responses',
              'Permanent dispute resolution: proof of what was approved and when',
            ]}
            visual={
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
                <div style={{ color: 'var(--color-cyan)', marginBottom: '0.5rem', fontWeight: 600 }}>// AUDIT RECORD: #DEC-2026-089</div>
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-surface-raised)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--color-status-active)' }}>
                  <div style={{ color: 'var(--color-text-primary)' }}>Elena Vance (Northlight Studio)</div>
                  <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    Decision: APPROVED WITHOUT REVISIONS
                  </div>
                  <div style={{ color: 'var(--color-text-tertiary)', fontSize: '0.6875rem', marginTop: '0.25rem' }}>
                    DocVersion: Brand_Guidelines_v2.0 • Hash: 994a3b81 • 2026-09-14 16:42 UTC
                  </div>
                </div>
              </div>
            }
          />

          {/* Feature 3: Handover Packaging & Archiving */}
          <FeatureRail
            tag="HANDOVER PACKAGING"
            title="Clean handover packages and archive vaults."
            description="When an engagement is complete, Syntaflow consolidates all approved deliverables, signed agreements, version logs, and final review packages into an organized archive vault. Completed engagements stay read-only and searchable with instant ⌘K search."
            invariant="Archived records remain 100% accessible and can be safely restored if a client re-engages."
            bullets={[
              'Consolidated deliverable bundle ready for client handover and final invoicing',
              'One-click archiving removes active clutter while preserving permanent institutional memory',
              'Instant search across past projects, decisions, and agreements using ⌘K',
            ]}
            visual={
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
                <div style={{ color: 'var(--color-cobalt-hover)', marginBottom: '0.5rem', fontWeight: 600 }}>// ARCHIVE VAULT</div>
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-canvas)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>Vault: 2026 Completed Engagements (14)</div>
                  <div style={{ color: 'var(--color-text-tertiary)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    Read-only status • Fast ⌘K retrieval • 100% local machine storage
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
