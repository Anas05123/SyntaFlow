import React, { useState } from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { PageHero } from '../../components/marketing/PageHero';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Link } from '../../components/ui/Link';
import { CTASection } from '../../components/marketing/CTASection';
import { getRouteMetadata } from '../../seo/seoConfig';

export const DocumentsPage: React.FC = () => {
  const meta = getRouteMetadata('/product/documents');
  const [showDiff, setShowDiff] = useState(false);

  const documentFeatures = [
    {
      title: '780px Typographic Paper Canvas',
      badge: 'PAPER STUDIO',
      problem: 'Generic text editors look like office software, cluttering the drafting experience with toolbar noise.',
      solution: 'A centered, distraction-free 780px typographic paper canvas with physical document proportions, designed for client readability and visual gravitas.',
      action: 'Draft client proposals, technical architectures, and scopes of work using clean Markdown headings, structured callouts, and code blocks.',
    },
    {
      title: 'Strict Version Immutability (DocVersion)',
      badge: 'VERSION CONTROL',
      problem: 'Cloud documents constantly change in place; clients review one paragraph while colleagues silently edit another.',
      solution: 'Draft revisions happen in version trees. When a document is submitted for client review, it freezes into an unalterable DocVersion snapshot with a SHA-256 hash.',
      action: 'Click "Submit Version" to seal v01.0. Subsequent edits must occur on an incremented draft (v02.0-draft), preserving the reviewed version forever.',
    },
    {
      title: 'Visual Side-by-Side Diffs',
      badge: 'DIFF ENGINE',
      problem: 'Spotting what changed between client review rounds requires tedious manual line-by-line comparison.',
      solution: 'An integrated semantic diff engine compares any two version snapshots side-by-side, clearly highlighting additions, deletions, and modified terms.',
      action: 'Toggle "Inspect Diff" to review changes between v01.0 and v02.0 before presenting the revision to the client decision-maker.',
    },
    {
      title: 'Direct Sign-Off & Review Attachment',
      badge: 'DELIVERY',
      problem: 'Document approvals end up as loose email text ("Looks good to me!") detached from the actual document file.',
      solution: 'Client reviews, annotations, and formal approval decisions bind directly to the cryptographic snapshot hash of the exact document version.',
      action: 'When the client signs off, the approved status and audit stamp attach permanently to the DocVersion snapshot and clear the delivery gate.',
    },
  ];

  return (
    <div>
      <SEOHead path="/product/documents" />

      <PageHero
        breadcrumbs={meta.breadcrumbs}
        eyebrow="Product // Document Studio"
        title="Documents that keep their history."
        description="Syntaflow combines a typographic paper studio with strict version control. Draft proposals and deliverables on a calm 780px canvas, freeze submitted versions into immutable snapshots, and track client sign-offs with cryptographic certainty."
        status="AVAILABLE NOW"
      >
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <Button href="/download" variant="primary">
            Download Syntaflow Preview &rarr;
          </Button>
          <Button href="/product/reviews-approvals" variant="secondary">
            Inspect Review & Approvals &rarr;
          </Button>
        </div>
      </PageHero>

      {/* 1. WHY IMMUTABLE DOCUMENT VERSIONS MATTER */}
      <section className="section" style={{ paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-48)' }}>
        <div className="container" style={{ maxWidth: '980px' }}>
          <Card variant="raised" style={{ padding: 'clamp(24px, 4vw, 36px)', backgroundColor: 'var(--surface-raised)', borderLeft: '4px solid #EC4899' }}>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#EC4899', textTransform: 'uppercase', marginBottom: '8px' }}>
              DOCUMENT INTEGRITY // ARCHITECTURAL GUARANTEE
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: '10px' }}>
              Submitted document versions are strictly immutable.
            </h3>
            <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', lineHeight: 1.65, margin: 0 }}>
              In client service work, the phrase &ldquo;we updated the Google Doc&rdquo; is a recipe for scope disputes, conflicting feedback, and liability risk. In Syntaflow, once a document version is submitted for client review, it becomes strictly immutable. Revisions occur on incremented drafts. When a client approves a deliverable, their decision binds to the exact byte-level snapshot hash they reviewed.
            </p>
          </Card>
        </div>
      </section>

      {/* 2. TYPOGRAPHIC PAPER CANVAS & DIFF MECHANICS */}
      <section className="section" style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-64)', paddingBottom: 'var(--space-64)', backgroundColor: 'var(--canvas)' }}>
        <div className="container" style={{ maxWidth: '1040px' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-32)' }}>
            <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              THE TYPOGRAPHIC PAPER CANVAS
            </span>
            <h2 className="heading-2" style={{ fontSize: 'clamp(26px, 3.8vw, 36px)', color: 'var(--text)', marginTop: 'var(--space-12)', marginBottom: 'var(--space-12)' }}>
              Executive paper studio with immutable snapshots.
            </h2>
            <p style={{ fontSize: '15.5px', color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto var(--space-20) auto' }}>
              Experience physical page proportions, crisp typography, and visual version diffs directly inside the workspace.
            </p>

            <button
              type="button"
              onClick={() => setShowDiff(!showDiff)}
              style={{
                padding: '6px 16px',
                borderRadius: '6px',
                fontSize: '12.5px',
                fontFamily: 'var(--font-mono)',
                backgroundColor: showDiff ? 'rgba(6, 182, 212, 0.2)' : 'var(--surface-raised)',
                border: '1px solid',
                borderColor: showDiff ? 'var(--cyan)' : 'var(--border)',
                color: showDiff ? 'var(--cyan)' : 'var(--text)',
                cursor: 'pointer',
              }}
            >
              {showDiff ? 'HIDE VERSION DIFF' : 'VIEW VERSION DIFF (v01.0 vs v02.0)'}
            </button>
          </div>

          {/* Paper Canvas Container */}
          <div
            style={{
              maxWidth: '780px',
              margin: '0 auto',
              backgroundColor: '#FFFFFF',
              color: '#0B0D0F',
              borderRadius: '8px',
              padding: 'clamp(32px, 5vw, 60px)',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.1)',
              fontFamily: 'Georgia, serif',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px', marginBottom: '28px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#64748B' }}>
              <span>DOCVERSION: v03.0 [FROZEN]</span>
              <span>SHA-256: 9c8cf98f02ba44...</span>
            </div>

            <h1 style={{ fontSize: '28px', fontWeight: 700, lineHeight: 1.2, marginBottom: '16px', color: '#0F172A', fontFamily: 'var(--font-body)' }}>
              Brand Architecture & Commercial Retainer Specification
            </h1>

            <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '24px', fontFamily: 'var(--font-mono)' }}>
              PREPARED FOR: ACME CORP · DECISION MAKER: SARAH JENKINS
            </div>

            <p style={{ fontSize: '16px', lineHeight: 1.7, marginBottom: '20px', color: '#334155' }}>
              This document establishes the commercial parameters and deliverable milestones for the Q4 Brand Architecture overhaul. Work is scheduled across three sequential milestones, each gated by formal client review.
            </p>

            {showDiff && (
              <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderLeft: '3px solid #06B6D4', borderRadius: '4px', marginBottom: '20px', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                <div style={{ color: '#0369A1', fontWeight: 600, marginBottom: '8px' }}>DIFF: v01.0 &rarr; v02.0 CHANGES</div>
                <div style={{ color: '#DC2626', textDecoration: 'line-through' }}>− SLA turnaround commitment: 72 hours from dispatch.</div>
                <div style={{ color: '#16A34A', marginTop: '4px' }}>+ SLA turnaround commitment: 48 hours with designated decision-maker sign-off.</div>
              </div>
            )}

            <div style={{ padding: '16px', backgroundColor: '#F1F5F9', borderRadius: '6px', marginTop: '32px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#475569', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>CLIENT SIGN-OFF STATUS: APPROVED</span>
              <span style={{ color: '#16A34A', fontWeight: 600 }}>SEALED FOR GATE CLEARANCE</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOUR CORE DOCUMENT CAPABILITIES */}
      <section className="section" style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-64)', paddingBottom: 'var(--space-64)' }}>
        <div className="container" style={{ maxWidth: '1080px' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-48)' }}>
            <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              DOCUMENT CAPABILITIES
            </span>
            <h2 className="heading-2" style={{ fontSize: 'clamp(26px, 3.8vw, 36px)', color: 'var(--text)', marginTop: 'var(--space-12)', marginBottom: 'var(--space-12)' }}>
              Built for precision, defensibility, and focus.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-24)' }}>
            {documentFeatures.map((f) => (
              <Card key={f.title} variant="default" style={{ padding: 'var(--space-28)', backgroundColor: 'var(--surface-raised)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {f.badge}
                  </span>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginTop: '8px', marginBottom: 'var(--space-12)' }}>
                    {f.title}
                  </h3>

                  <div style={{ marginBottom: 'var(--space-16)' }}>
                    <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#EF4444', textTransform: 'uppercase', marginBottom: '4px' }}>
                      THE PROBLEM
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                      {f.problem}
                    </p>
                  </div>

                  <div style={{ marginBottom: 'var(--space-16)' }}>
                    <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#10B981', textTransform: 'uppercase', marginBottom: '4px' }}>
                      HOW SYNTAFLOW HELPS
                    </div>
                    <p style={{ fontSize: '13.5px', color: 'var(--text)', lineHeight: 1.5, margin: 0 }}>
                      {f.solution}
                    </p>
                  </div>
                </div>

                <div style={{ padding: '12px 14px', backgroundColor: 'var(--surface-sunken)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    WHAT YOU ACTUALLY DO
                  </div>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                    {f.action}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4. NATURAL CROSS-LINKS */}
      <section className="section" style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-48)', paddingBottom: 'var(--space-48)', backgroundColor: 'var(--canvas)' }}>
        <div className="container" style={{ maxWidth: '980px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: 'var(--space-20)' }}>
            Extend your document workflow into reviews and delivery
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', fontSize: '14px' }}>
            <Link href="/product/reviews-approvals" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>
              Explore Review & Approval Governance &rarr;
            </Link>
            <Link href="/product/client-management" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>
              Command Client Accounts & Decision Authorities &rarr;
            </Link>
            <Link href="/security" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>
              Review Local-First SQLite Security &rarr;
            </Link>
            <Link href="/solutions/freelancers" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>
              Syntaflow for Solo Practitioners &rarr;
            </Link>
          </div>
        </div>
      </section>

      <CTASection
        title="Stop losing revision history in chaotic cloud documents."
        description="Draft on typographic paper and freeze submitted deliverables into immutable review snapshots."
        primaryLabel="Download Syntaflow Preview"
        primaryHref="/download"
        secondaryLabel="Inspect Reviews & Approvals"
        secondaryHref="/product/reviews-approvals"
      />
    </div>
  );
};
