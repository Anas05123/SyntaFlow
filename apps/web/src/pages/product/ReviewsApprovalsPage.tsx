import React, { useState } from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { PageHero } from '../../components/marketing/PageHero';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Link } from '../../components/ui/Link';
import { CTASection } from '../../components/marketing/CTASection';
import { getRouteMetadata } from '../../seo/seoConfig';

export const ReviewsApprovalsPage: React.FC = () => {
  const meta = getRouteMetadata('/product/reviews-approvals');
  const [reviewApproved, setReviewApproved] = useState(false);

  const reviewWorkflowSteps = [
    {
      num: '01',
      title: 'Dispatch Review Request',
      badge: 'REVIEW REQUEST',
      description: 'Generate a review request directly from a frozen DocVersion snapshot (e.g., v03.0). The review payload contains a SHA-256 cryptographic snapshot hash that locks the document content against subsequent edits.',
      action: 'Select the primary client decision-maker and click "Dispatch Review". Syntaflow generates a secure, revocable review link tied to the exact version snapshot.',
    },
    {
      num: '02',
      title: 'Contextual In-Line Feedback',
      badge: 'ANNOTATIONS',
      description: 'Clients review the document in a focused reading interface. Feedback, annotations, and requested modifications anchor directly to specific paragraphs and deliverables rather than chaotic email threads.',
      action: 'Client comments appear in real-time within the desktop workspace, linked directly to the specific version text without altering the frozen snapshot.',
    },
    {
      num: '03',
      title: 'Structured Revision Cycles',
      badge: 'REVISION INTEGRITY',
      description: 'When feedback warrants changes, create an incremented draft (v04.0-draft). The previous version (v03.0) remains permanently sealed, preserving the historical trail and enabling visual side-by-side diffs.',
      action: 'Compare v03.0 and v04.0 with automated diff highlighting before re-submitting for final approval.',
    },
    {
      num: '04',
      title: 'Tamper-Proof Approval Decisions',
      badge: 'FORMAL SIGN-OFF',
      description: 'Formal sign-offs bind cryptographically to the exact snapshot reviewed. The decision record stores the timestamp, decision-maker identity, snapshot hash, and review conditions.',
      action: 'When the authorized stakeholder approves, the status updates to APPROVED and automatically clears milestone prerequisites.',
    },
    {
      num: '05',
      title: 'Delivery Gate Handover Enforcement',
      badge: 'GATE CLEARANCE',
      description: 'Delivery gates prevent production releases until 100% of prerequisite milestone approvals are locked. Junior team members cannot accidentally release raw files or invoices before formal sign-off.',
      action: 'Once all review prerequisites clear, the delivery gate unlocks and packages production assets into an unalterable delivery handover manifest.',
    },
  ];

  const comparisonPoints = [
    {
      aspect: 'Version Snapshot Binding',
      genericTools: 'Links point to live cloud documents that change while under review.',
      syntaflow: 'Reviews bind to immutable DocVersion snapshots with SHA-256 hashes.',
    },
    {
      aspect: 'Decision Authority',
      genericTools: 'Anyone with the link can leave comments or claim approval.',
      syntaflow: 'Only designated primary decision-makers can formally sign off.',
    },
    {
      aspect: 'Audit Trail',
      genericTools: 'Approvals live in loose Slack messages or casual email replies.',
      syntaflow: 'Defensible cryptographic audit log with timestamps and snapshot hashes.',
    },
    {
      aspect: 'Delivery Gate Enforcement',
      genericTools: 'No connection between approval status and actual file releases.',
      syntaflow: 'Hard logical gate blocks asset release until all prerequisite approvals clear.',
    },
  ];

  return (
    <div>
      <SEOHead path="/product/reviews-approvals" />

      <PageHero
        breadcrumbs={meta.breadcrumbs}
        eyebrow="Product // Governance & Approvals"
        title="Keep feedback attached to the exact version."
        description="Syntaflow is client review and approval software engineered for defensibility. Ensure client feedback, revision cycles, and formal sign-offs bind permanently to exact document version snapshots before delivery gates unlock."
        status="AVAILABLE NOW"
      >
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <Button href="/download" variant="primary">
            Download Syntaflow Preview &rarr;
          </Button>
          <Button href="/product/documents" variant="secondary">
            Inspect Typographic Documents &rarr;
          </Button>
        </div>
      </PageHero>

      {/* 1. WHY EXACT VERSION BINDING MATTERS */}
      <section className="section" style={{ paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-48)' }}>
        <div className="container" style={{ maxWidth: '980px' }}>
          <Card variant="raised" style={{ padding: 'clamp(24px, 4vw, 36px)', backgroundColor: 'var(--surface-raised)', borderLeft: '4px solid #F59E0B' }}>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#F59E0B', textTransform: 'uppercase', marginBottom: '8px' }}>
              THE REVIEW AMBIGUITY TRAP // WHY GENERIC TOOLS FAIL
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: '10px' }}>
              &ldquo;Looks good to me&rdquo; is not a defensible approval.
            </h3>
            <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', lineHeight: 1.65, margin: 0 }}>
              Standard client feedback workflows rely on chaotic email chains, markup tools on constantly shifting URLs, or casual chat messages. When payment disputes or scope creep debates arise, nobody can prove which exact version of the specification the client actually approved. Syntaflow ends review ambiguity by binding review requests, feedback threads, and formal approval decisions directly to immutable document snapshots.
            </p>
          </Card>
        </div>
      </section>

      {/* 2. INTERACTIVE REVIEW SIMULATION */}
      <section className="section" style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-64)', paddingBottom: 'var(--space-64)', backgroundColor: 'var(--canvas)' }}>
        <div className="container" style={{ maxWidth: '1040px' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-32)' }}>
            <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              AUTHENTIC REVIEW WORKFLOW
            </span>
            <h2 className="heading-2" style={{ fontSize: 'clamp(26px, 3.8vw, 36px)', color: 'var(--text)', marginTop: 'var(--space-12)', marginBottom: 'var(--space-12)' }}>
              Test the exact version review decision.
            </h2>
            <p style={{ fontSize: '15.5px', color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto' }}>
              Click below to simulate an authorized client decision and observe how milestone gates clear automatically.
            </p>
          </div>

          <div
            style={{
              backgroundColor: '#0B0D0F',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '10px',
              padding: '28px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              maxWidth: '820px',
              margin: '0 auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '14px', marginBottom: '18px' }}>
              <div>
                <span style={{ color: 'var(--cyan)', fontSize: '11px', textTransform: 'uppercase' }}>REVIEW PACKAGE #9C8CF98F</span>
                <div style={{ color: '#F8FAFC', fontSize: '16px', fontWeight: 600, marginTop: '2px' }}>Brand Architecture Specification v03.0</div>
              </div>
              <span style={{ padding: '4px 10px', borderRadius: '4px', backgroundColor: reviewApproved ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)', color: reviewApproved ? '#10B981' : '#F59E0B', fontWeight: 600 }}>
                {reviewApproved ? 'APPROVED & SEALED' : 'PENDING CLIENT DECISION'}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '20px' }}>
              <div style={{ padding: '12px', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ color: 'var(--text-metadata)', fontSize: '10.5px' }}>DECISION MAKER</div>
                <div style={{ color: '#F8FAFC', marginTop: '4px' }}>Sarah Jenkins (VP Brand)</div>
                <div style={{ color: '#94A3B8', fontSize: '11px' }}>sarah.jenkins@acme.com</div>
              </div>

              <div style={{ padding: '12px', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ color: 'var(--text-metadata)', fontSize: '10.5px' }}>SNAPSHOT HASH</div>
                <div style={{ color: 'var(--cyan)', marginTop: '4px' }}>SHA-256: 9c8cf98f...</div>
                <div style={{ color: '#94A3B8', fontSize: '11px' }}>Immutable DocVersion</div>
              </div>

              <div style={{ padding: '12px', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ color: 'var(--text-metadata)', fontSize: '10.5px' }}>DELIVERY GATE IMPACT</div>
                <div style={{ color: reviewApproved ? '#10B981' : '#F59E0B', marginTop: '4px' }}>
                  {reviewApproved ? 'GATE UNLOCKED (4/4 Cleared)' : 'GATE ARMED (3/4 Cleared)'}
                </div>
                <div style={{ color: '#94A3B8', fontSize: '11px' }}>Handover Prerequisite</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <span style={{ color: 'var(--text-metadata)', fontSize: '12px' }}>
                {reviewApproved ? 'Decision sealed in cryptographic audit log.' : 'Review token verified · Ready for decision.'}
              </span>
              <button
                type="button"
                onClick={() => setReviewApproved(!reviewApproved)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '6px',
                  backgroundColor: reviewApproved ? 'rgba(239, 68, 68, 0.15)' : '#10B981',
                  border: '1px solid',
                  borderColor: reviewApproved ? '#EF4444' : '#10B981',
                  color: reviewApproved ? '#EF4444' : '#000',
                  fontWeight: 600,
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {reviewApproved ? 'Reset Decision' : 'Simulate Client Approval ✓'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FIVE-STAGE REVIEW & APPROVAL WORKFLOW */}
      <section className="section" style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-64)', paddingBottom: 'var(--space-64)' }}>
        <div className="container" style={{ maxWidth: '1080px' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-48)' }}>
            <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              STEP-BY-STEP GOVERNANCE
            </span>
            <h2 className="heading-2" style={{ fontSize: 'clamp(26px, 3.8vw, 36px)', color: 'var(--text)', marginTop: 'var(--space-12)', marginBottom: 'var(--space-12)' }}>
              The end-to-end review and approval workflow.
            </h2>
            <p style={{ fontSize: '15.5px', color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto' }}>
              How Syntaflow moves client feedback from review request to final delivery gate clearance with zero ambiguity.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-20)' }}>
            {reviewWorkflowSteps.map((step) => (
              <Card key={step.num} variant="default" style={{ padding: 'var(--space-28)', backgroundColor: 'var(--surface-raised)' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-12)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', fontWeight: 600 }}>
                      PHASE {step.num}
                    </span>
                    <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)', textTransform: 'uppercase' }}>
                      {step.badge}
                    </span>
                  </div>
                </div>

                <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: 'var(--space-8)' }}>
                  {step.title}
                </h3>

                <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 'var(--space-16)' }}>
                  {step.description}
                </p>

                <div style={{ padding: '12px 16px', backgroundColor: 'var(--surface-sunken)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    OPERATIONAL MECHANICS
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text)', lineHeight: 1.5, margin: 0 }}>
                    {step.action}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4. COMPARISON: SYNTAFLOW VS GENERIC FEEDBACK TOOLS */}
      <section className="section" style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-64)', paddingBottom: 'var(--space-64)', backgroundColor: 'var(--canvas)' }}>
        <div className="container" style={{ maxWidth: '980px' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-44)' }}>
            <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              FEATURE COMPARISON
            </span>
            <h2 className="heading-2" style={{ fontSize: 'clamp(26px, 3.8vw, 36px)', color: 'var(--text)', marginTop: 'var(--space-12)' }}>
              Syntaflow exact version reviews vs. generic markup tools.
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {comparisonPoints.map((pt) => (
              <div
                key={pt.aspect}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '16px',
                  padding: '20px',
                  backgroundColor: 'var(--surface-raised)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                }}
              >
                <div>
                  <div style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    {pt.aspect}
                  </div>
                  <div style={{ fontSize: '13px', color: '#EF4444', lineHeight: 1.5 }}>
                    <strong style={{ color: '#EF4444' }}>Generic Tools:</strong> {pt.genericTools}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: '#10B981', textTransform: 'uppercase', marginBottom: '4px' }}>
                    SYNTAFLOW ARCHITECTURE
                  </div>
                  <div style={{ fontSize: '13.5px', color: 'var(--text)', lineHeight: 1.5 }}>
                    {pt.syntaflow}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. NATURAL CROSS-LINKS */}
      <section className="section" style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-48)', paddingBottom: 'var(--space-48)' }}>
        <div className="container" style={{ maxWidth: '980px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: 'var(--space-20)' }}>
            Explore connected governance and delivery systems
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', fontSize: '14px' }}>
            <Link href="/product/documents" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>
              Inspect Typographic Document Canvas &rarr;
            </Link>
            <Link href="/product/client-management" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>
              Command Client Accounts & Decision Authorities &rarr;
            </Link>
            <Link href="/security" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>
              Read Security Approach & DPAPI Vault &rarr;
            </Link>
            <Link href="/pricing" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>
              Review Preview Pricing ($0) &rarr;
            </Link>
          </div>
        </div>
      </section>

      <CTASection
        title="Protect your agency margins with defensible client sign-offs."
        description="Never argue over unverified scope changes again. Lock client feedback to exact version snapshots."
        primaryLabel="Download Syntaflow Preview"
        primaryHref="/download"
        secondaryLabel="Inspect Document Workflows"
        secondaryHref="/product/documents"
      />
    </div>
  );
};
