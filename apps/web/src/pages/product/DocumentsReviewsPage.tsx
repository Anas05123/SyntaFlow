import React from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { PageHero } from '../../components/marketing/PageHero';
import { Card } from '../../components/ui/Card';
import { CTASection } from '../../components/marketing/CTASection';

const DOC_FEATURES = [
  {
    title: 'Executive Typographic Paper Canvas',
    description: 'Write proposals, technical specs, and briefs in a 3-column studio with section completion dots, continuous typography, and clean keyboard ergonomics (Ctrl+S).',
    code: 'FEATURE // 01',
  },
  {
    title: 'Immutable DocVersion Snapshots',
    description: 'When submitting work for client review, Syntaflow creates an unalterable DocVersion record bound to a SHA-256 state hash. Edits occur only on subsequent numbered drafts.',
    code: 'FEATURE // 02',
  },
  {
    title: 'Review Transmission Studio',
    description: 'Configure submissions with decision-maker assignments, SLA turnaround windows (24h/48h/72h), executive cover notes, and presentation template styling.',
    code: 'FEATURE // 03',
  },
  {
    title: 'One Presentation, Two Shells',
    description: 'Preview exact client presentation inside your desktop workspace, or transmit a secure token-bound guest link where clients review without installing software.',
    code: 'FEATURE // 04',
  },
];

export const DocumentsReviewsPage: React.FC = () => {
  return (
    <div>
      <SEOHead
        title="Documents & Reviews — Syntaflow"
        description="Write on an executive paper canvas, freeze immutable document versions, and transmit client review presentations with cryptographic audit proof."
        path="/product/documents-reviews"
      />

      <PageHero
        eyebrow="Product // Documents & Reviews"
        title="Documents that preserve decisions and proof."
        description="Stop sending Google Docs links that get edited mid-review. Syntaflow packages work into unalterable version snapshots with clear decision-maker sign-offs."
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
            {DOC_FEATURES.map((f) => (
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

          <Card variant="raised" style={{ padding: 'var(--space-32)', borderLeft: '4px solid var(--cobalt)' }}>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cobalt)', textTransform: 'uppercase', marginBottom: 'var(--space-8)' }}>
              CORE ARCHITECTURAL INVARIANT
            </div>
            <h4 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginBottom: 'var(--space-8)' }}>
              Strict Document Version Immutability & Exact Version Review
            </h4>
            <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              A submitted `DocVersion` is permanently frozen in local storage. Client comments and approval decisions bind to the exact byte-level snapshot transmitted. If revisions are required, Syntaflow increments a new working draft (`v2.1`) while preserving `v2.0` in the audit log.
            </p>
          </Card>
        </div>
      </section>

      <CTASection
        title="Never lose proof of client approval."
        description="See how approved document versions unlock final handover gates."
        primaryLabel="Explore Delivery & Approvals"
        primaryHref="#/product/delivery-approvals"
      />
    </div>
  );
};
