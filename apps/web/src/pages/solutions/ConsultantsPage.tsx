import React from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { PageHero } from '../../components/marketing/PageHero';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Link } from '../../components/ui/Link';
import { CTASection } from '../../components/marketing/CTASection';
import { getRouteMetadata } from '../../seo/seoConfig';

export const ConsultantsPage: React.FC = () => {
  const meta = getRouteMetadata('/solutions/consultants');

  const consultantPillars = [
    {
      title: 'Connecting Meetings to Deliverables',
      badge: 'ADVISORY THREAD',
      problem: 'Strategic decisions made during executive client meetings get lost in notepad apps, disconnected from the final report deliverables.',
      solution: 'Syntaflow attaches meeting agendas and key decisions directly into the active engagement record alongside draft specifications and retainer hours.',
      action: 'Sync Google Calendar milestones into your project workspace. Meeting notes flow directly into the typographic briefing canvas without re-typing.',
    },
    {
      title: 'Confidential Local Storage',
      badge: 'CLIENT NDA PROTECTION',
      problem: 'Storing proprietary corporate strategy, M&A audit notes, or financial terms on public multi-tenant cloud platforms creates compliance and confidentiality risks.',
      solution: 'Syntaflow is a local-first application where all advisory briefs, financial models, and strategic notes persist in an encrypted local SQLite database.',
      action: 'Honor strict enterprise NDAs with complete confidence. Your advisory records stay physically on your workstation with zero telemetry.',
    },
    {
      title: 'Defensible Executive Sign-Offs',
      badge: 'BOARD INTEGRITY',
      problem: 'Executive recommendations and strategic pivots need formal board approval, but verbal or casual email agreements create liability exposure.',
      solution: 'Advisory reports freeze into immutable DocVersion snapshots with SHA-256 hashes. Approvals record the exact decision-maker identity, timestamp, and terms.',
      action: 'Dispatch executive review packages with cryptographic verification. Produce an audit-proof sign-off log for board committees and leadership stakeholders.',
    },
    {
      title: 'Retainer Runway & SLA Accountability',
      badge: 'COMMERCIAL REPUTATION',
      problem: 'Advisory retainers are difficult to track accurately, resulting in either unbilled scope creep or disputes over remaining advisory hours.',
      solution: 'The client relationship cockpit tracks commercial retainer allocations, burn rates, and SLA response commitments in real-time.',
      action: 'Inspect remaining retainer runway instantly. Share transparent milestone progress logs that demonstrate clear return on investment to client sponsors.',
    },
  ];

  return (
    <div>
      <SEOHead path="/solutions/consultants" />

      <PageHero
        breadcrumbs={meta.breadcrumbs}
        eyebrow="Solutions // Strategic Consultants"
        title="Keep client context connected from meeting to delivery."
        description="Syntaflow is client management software designed for independent consultants and strategic advisors. Keep executive meeting notes, strategic deliverables, retainer allocations, and client sign-offs bound to a single unalterable operational record."
        status="AVAILABLE NOW"
      >
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <Button href="/download" variant="primary">
            Download Syntaflow Preview &rarr;
          </Button>
          <Button href="/security" variant="secondary">
            Inspect Security & NDA Protection &rarr;
          </Button>
        </div>
      </PageHero>

      {/* 1. THE ADVISORY CONTEXT PROBLEM */}
      <section className="section" style={{ paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-48)' }}>
        <div className="container" style={{ maxWidth: '980px' }}>
          <Card variant="raised" style={{ padding: 'clamp(24px, 4vw, 36px)', backgroundColor: 'var(--surface-raised)', borderLeft: '4px solid #8B5CF6' }}>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#8B5CF6', textTransform: 'uppercase', marginBottom: '8px' }}>
              CONSULTING REALITY // RIGOR AND DEFICIT
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: '10px' }}>
              Advisory value lives in the continuity of strategic decisions.
            </h3>
            <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', lineHeight: 1.65, margin: 0 }}>
              Management consultants and specialized advisors do not produce disposable code or design mocks; they deliver high-stakes recommendations that impact corporate direction. When previous advisory notes, board feedback, and contract terms are scattered across personal files and buried emails, the credibility of the entire engagement suffers. Syntaflow provides the executive rigor, version defensibility, and confidential storage that strategic consulting demands.
            </p>
          </Card>
        </div>
      </section>

      {/* 2. FOUR CONSULTANT-SPECIFIC CAPABILITIES */}
      <section className="section" style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-64)', paddingBottom: 'var(--space-64)', backgroundColor: 'var(--canvas)' }}>
        <div className="container" style={{ maxWidth: '1080px' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-48)' }}>
            <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              STRATEGIC ADVISORY SYSTEMS
            </span>
            <h2 className="heading-2" style={{ fontSize: 'clamp(26px, 3.8vw, 36px)', color: 'var(--text)', marginTop: 'var(--space-12)', marginBottom: 'var(--space-12)' }}>
              Engineered for high-stakes advisory delivery.
            </h2>
            <p style={{ fontSize: '15.5px', color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto' }}>
              From initial executive briefing to final board sign-off, every decision stays attached to the client engagement.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-24)' }}>
            {consultantPillars.map((p) => (
              <Card key={p.title} variant="default" style={{ padding: 'var(--space-28)', backgroundColor: 'var(--surface-raised)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {p.badge}
                  </span>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginTop: '8px', marginBottom: 'var(--space-12)' }}>
                    {p.title}
                  </h3>

                  <div style={{ marginBottom: 'var(--space-16)' }}>
                    <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#EF4444', textTransform: 'uppercase', marginBottom: '4px' }}>
                      THE CONSULTANT PROBLEM
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                      {p.problem}
                    </p>
                  </div>

                  <div style={{ marginBottom: 'var(--space-16)' }}>
                    <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#10B981', textTransform: 'uppercase', marginBottom: '4px' }}>
                      HOW SYNTAFLOW HELPS
                    </div>
                    <p style={{ fontSize: '13.5px', color: 'var(--text)', lineHeight: 1.5, margin: 0 }}>
                      {p.solution}
                    </p>
                  </div>
                </div>

                <div style={{ padding: '12px 14px', backgroundColor: 'var(--surface-sunken)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    ADVISORY PRACTICE
                  </div>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                    {p.action}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 3. NATURAL CROSS-LINKS */}
      <section className="section" style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-48)', paddingBottom: 'var(--space-48)' }}>
        <div className="container" style={{ maxWidth: '980px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: 'var(--space-20)' }}>
            Explore systems built for high-stakes client engagements
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', fontSize: '14px' }}>
            <Link href="/product/client-management" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>
              Command Client Accounts & Retainers &rarr;
            </Link>
            <Link href="/product/documents" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>
              Inspect Typographic Document Canvas &rarr;
            </Link>
            <Link href="/security" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>
              Local-First Security & NDA Protection &rarr;
            </Link>
            <Link href="/download" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>
              Download Syntaflow Preview &rarr;
            </Link>
          </div>
        </div>
      </section>

      <CTASection
        title="Deliver strategic recommendations with absolute continuity."
        description="Experience local-first consulting software designed for confidential clarity and defensible client sign-offs."
        primaryLabel="Download Syntaflow Preview"
        primaryHref="/download"
        secondaryLabel="Inspect Security Model"
        secondaryHref="/security"
      />
    </div>
  );
};
