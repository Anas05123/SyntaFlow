import React from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { PageHero } from '../../components/marketing/PageHero';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Link } from '../../components/ui/Link';
import { CTASection } from '../../components/marketing/CTASection';
import { getRouteMetadata } from '../../seo/seoConfig';

export const ClientManagementPage: React.FC = () => {
  const meta = getRouteMetadata('/product/client-management');

  const capabilities = [
    {
      title: 'Designated Decision Authorities',
      badge: 'GOVERNANCE',
      problem: 'Conflicting client feedback from multiple unauthorized contacts stalls milestones.',
      solution: 'Designate specific primary and secondary sign-off contacts per client account. Review transmissions bind strictly to authorized stakeholders.',
      action: 'Set decision authority roles in the Client Drawer. Review notifications and sign-off requests route exclusively to validated decision-makers.',
    },
    {
      title: 'Commercial Terms & Retainer Retaining',
      badge: 'COMMERCIAL',
      problem: 'Contract scopes and billing structures live in buried PDF agreements, forgotten during task execution.',
      solution: 'Anchor commercial models (fixed fee with milestone gates, monthly retainer allocations, or hourly advisory) directly in the client relationship record.',
      action: 'Track retainer hour burn rates, milestone billing clearance, and SLA turnaround commitments alongside active project boards.',
    },
    {
      title: 'Complete Engagement History',
      badge: 'TIMELINE',
      problem: 'Past proposals, closed sprints, and signed review packages get scattered across old folders.',
      solution: 'Every proposal, scoping blueprint, task board, typographic specification, and approved delivery manifest stays attached to the client record.',
      action: 'Filter the client cockpit by Active, Review, and Archived to inspect every historical decision and deliverable with exact timestamps.',
    },
    {
      title: 'Secure Client Review Access',
      badge: 'SECURITY',
      problem: 'Sharing draft links invites unauthorized forwarding and accidental edits on unfinished work.',
      solution: 'Issue cryptographic, time-limited review tokens that allow clients to inspect frozen DocVersion snapshots with zero software installation.',
      action: 'Generate revocable client access links with granular permissions. Client annotations bind immutably to the snapshot hash without giving cloud access to your local SQLite store.',
    },
  ];

  return (
    <div>
      <SEOHead path="/product/client-management" />

      <PageHero
        breadcrumbs={meta.breadcrumbs}
        eyebrow="Product // Client Operations"
        title="Keep every client engagement connected."
        description="Syntaflow is a client management workspace built for delivery, not sales pipelines. Keep contacts, commercial terms, scoping blueprints, documents, decisions, and delivery handovers anchored to a single operational source of truth."
        status="AVAILABLE NOW"
      >
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <Button href="/download" variant="primary">
            Download Syntaflow Preview &rarr;
          </Button>
          <Button href="/product/projects" variant="secondary">
            Explore Project Scoping &rarr;
          </Button>
        </div>
      </PageHero>

      {/* 1. NOT A SALES CRM: A WORKSPACE FOR ACTIVE DELIVERY */}
      <section className="section" style={{ paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-48)' }}>
        <div className="container" style={{ maxWidth: '980px' }}>
          <Card variant="raised" style={{ padding: 'clamp(24px, 4vw, 36px)', backgroundColor: 'var(--surface-raised)', borderLeft: '4px solid var(--cyan)' }}>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: '8px' }}>
              OPERATIONAL DISTINCTION // BUILT FOR DELIVERY
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: '10px' }}>
              Why Syntaflow is not a traditional sales CRM.
            </h3>
            <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', lineHeight: 1.65, margin: 0 }}>
              Traditional CRMs are lead-tracking databases designed for sales reps logging calls and pipeline stages. Once a contract is signed, traditional CRMs abandon you. Syntaflow is engineered for the operational reality of running client work: keeping commercial agreements, contacts, active tasks, typographic documents, client feedback, and gate sign-offs in one unalterable engagement record.
            </p>
          </Card>
        </div>
      </section>

      {/* 2. CORE CLIENT MANAGEMENT CAPABILITIES */}
      <section className="section" style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-64)', paddingBottom: 'var(--space-64)', backgroundColor: 'var(--canvas)' }}>
        <div className="container" style={{ maxWidth: '1080px' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-48)' }}>
            <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              ACCOUNT CAPABILITIES
            </span>
            <h2 className="heading-2" style={{ fontSize: 'clamp(26px, 3.8vw, 36px)', color: 'var(--text)', marginTop: 'var(--space-12)', marginBottom: 'var(--space-12)' }}>
              Built for how professional client engagements unfold.
            </h2>
            <p style={{ fontSize: '15.5px', color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto' }}>
              Four core systems designed to eliminate context loss, ambiguous scope, and review paralysis across client relationships.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'var(--space-24)',
            }}
          >
            {capabilities.map((cap) => (
              <Card key={cap.title} variant="default" style={{ padding: 'var(--space-28)', backgroundColor: 'var(--surface-raised)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {cap.badge}
                  </span>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginTop: '8px', marginBottom: 'var(--space-12)' }}>
                    {cap.title}
                  </h3>

                  <div style={{ marginBottom: 'var(--space-16)' }}>
                    <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#EF4444', textTransform: 'uppercase', marginBottom: '4px' }}>
                      THE PROBLEM
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                      {cap.problem}
                    </p>
                  </div>

                  <div style={{ marginBottom: 'var(--space-16)' }}>
                    <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#10B981', textTransform: 'uppercase', marginBottom: '4px' }}>
                      HOW SYNTAFLOW HELPS
                    </div>
                    <p style={{ fontSize: '13.5px', color: 'var(--text)', lineHeight: 1.5, margin: 0 }}>
                      {cap.solution}
                    </p>
                  </div>
                </div>

                <div style={{ padding: '12px 14px', backgroundColor: 'var(--surface-sunken)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    WHAT YOU ACTUALLY DO
                  </div>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                    {cap.action}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 3. MOCKUP INTERFACE: CLIENT COCKPIT & DRAWER */}
      <section className="section" style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-64)', paddingBottom: 'var(--space-64)' }}>
        <div className="container" style={{ maxWidth: '1040px' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-40)' }}>
            <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              AUTHENTIC WORKSPACE MECHANICS
            </span>
            <h2 className="heading-2" style={{ fontSize: 'clamp(26px, 3.5vw, 34px)', color: 'var(--text)', marginTop: 'var(--space-12)' }}>
              Client Cockpit & Engagement Drawer
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
              Zero-latency master-detail split interface displaying relationship health, commercial retainers, and deliverable pipelines.
            </p>
          </div>

          <div
            style={{
              backgroundColor: '#0B0D0F',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '10px',
              padding: '24px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                <span style={{ color: '#F8FAFC', fontWeight: 600, fontSize: '14px' }}>ACME CORP // ACTIVE COMMERCIAL ENGAGEMENT</span>
              </div>
              <span style={{ color: 'var(--cyan)', fontSize: '12px' }}>RETAINER: 60 HRS / MO (42 REMAINING)</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              <div style={{ padding: '12px', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ color: 'var(--text-metadata)', fontSize: '11px', textTransform: 'uppercase' }}>DECISION AUTHORITY</div>
                <div style={{ color: '#F8FAFC', marginTop: '4px', fontSize: '13px' }}>Sarah Jenkins (VP Brand)</div>
                <div style={{ color: '#94A3B8', fontSize: '11px' }}>sarah.jenkins@acme.com</div>
              </div>

              <div style={{ padding: '12px', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ color: 'var(--text-metadata)', fontSize: '11px', textTransform: 'uppercase' }}>COMMERCIAL AGREEMENT</div>
                <div style={{ color: '#F8FAFC', marginTop: '4px', fontSize: '13px' }}>Retainer Q4 + Milestone SLA</div>
                <div style={{ color: '#94A3B8', fontSize: '11px' }}>48h Turnaround Commitment</div>
              </div>

              <div style={{ padding: '12px', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ color: 'var(--text-metadata)', fontSize: '11px', textTransform: 'uppercase' }}>DELIVERY GATE PRECONDITIONS</div>
                <div style={{ color: '#10B981', marginTop: '4px', fontSize: '13px' }}>3/4 Approvals Cleared</div>
                <div style={{ color: '#94A3B8', fontSize: '11px' }}>Gate Status: ARMED</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '12px', color: 'var(--text-metadata)' }}>
              <span>PERSISTED LOCALLY IN SQLITE (WAL MODE)</span>
              <span style={{ color: 'var(--cyan)' }}>REVOCABLE REVIEW TOKEN: sf_live_9c8cf98f</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. NATURAL CROSS-LINKS */}
      <section className="section" style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-48)', paddingBottom: 'var(--space-48)' }}>
        <div className="container" style={{ maxWidth: '980px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: 'var(--space-20)' }}>
            Continue exploring the Syntaflow operating environment
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', fontSize: '14px' }}>
            <Link href="/product/projects" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>
              Explore Project Blueprints & Tasks &rarr;
            </Link>
            <Link href="/product/documents" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>
              Inspect Typographic Document Canvas &rarr;
            </Link>
            <Link href="/product/reviews-approvals" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>
              Review Exact Snapshot Approvals &rarr;
            </Link>
            <Link href="/solutions/agencies" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>
              Syntaflow for Boutique Agencies &rarr;
            </Link>
          </div>
        </div>
      </section>

      <CTASection
        title="Ready to anchor your client operations in one persistent record?"
        description="Download Syntaflow Preview today and manage client accounts with local-first clarity."
        primaryLabel="Download Syntaflow Preview"
        primaryHref="/download"
        secondaryLabel="Inspect Project Systems"
        secondaryHref="/product/projects"
      />
    </div>
  );
};
