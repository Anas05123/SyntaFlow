import React from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { PageHero } from '../../components/marketing/PageHero';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Link } from '../../components/ui/Link';
import { CTASection } from '../../components/marketing/CTASection';
import { getRouteMetadata } from '../../seo/seoConfig';

export const FreelancersPage: React.FC = () => {
  const meta = getRouteMetadata('/solutions/freelancers');

  const freelancerPillars = [
    {
      title: 'Endless Tool Switching Solved',
      badge: 'UNIFIED DESK',
      problem: 'Solo operators waste hours toggling between Notion for notes, Asana for tasks, Google Docs for writing, and Dropbox for file handovers.',
      solution: 'Syntaflow replaces disconnected subscriptions with one calm local desktop workspace uniting proposals, task boards, typographic documents, and delivery gates.',
      action: 'Run your complete freelance practice from a single desktop window on your Windows machine with zero monthly SaaS fees during preview.',
    },
    {
      title: 'Proposal-to-Delivery Continuity',
      badge: 'CONTINUOUS PIPELINE',
      problem: 'When a proposal is accepted, you have to manually copy scopes into a project tracker, losing the original commercial constraints.',
      solution: 'Syntaflow moves seamlessly along the 6-stage lifecycle: Request &rarr; Proposal &rarr; Project &rarr; Review &rarr; Approval &rarr; Delivery. The signed proposal directly generates your task board.',
      action: 'Never re-type deliverables or wonder what was promised in the contract. Tasks stay anchored to the signed proposal.',
    },
    {
      title: 'Prevent Unpaid Revision Loops',
      badge: 'DEFENSIBLE REVIEWS',
      problem: 'Clients ask for "quick tweaks" on live documents, gradually expanding scope without paying for additional rounds of revisions.',
      solution: 'Submitted deliverables freeze into immutable DocVersion snapshots (v01.0, v02.0). Client review feedback binds directly to the frozen snapshot hash.',
      action: 'Send exact version review links. When a client requests changes beyond the contract, the visual diff engine proves the modification is out of scope.',
    },
    {
      title: 'Offline Independence & Zero Telemetry',
      badge: 'LOCAL FREEDOM',
      problem: 'Web apps fail on flights, slow coffee shop WiFi, and during client site visits, locking you out of your critical project data.',
      solution: 'Syntaflow is a local-first application running on an embedded SQLite database. You have full access to all client records, documents, and task boards completely offline.',
      action: 'Work anywhere without internet dependencies. Your client contracts and notes stay on your physical machine with zero cloud surveillance.',
    },
  ];

  return (
    <div>
      <SEOHead path="/solutions/freelancers" />

      <PageHero
        breadcrumbs={meta.breadcrumbs}
        eyebrow="Solutions // Freelancers & Solos"
        title="Keep your clients, work and delivery in one place."
        description="Syntaflow is client management software designed for solo practitioners and high-output freelancers. Manage multiple clients, write proposals, track tasks, freeze review snapshots, and hand over deliverables in one calm, local desktop workspace."
        status="AVAILABLE NOW"
      >
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <Button href="/download" variant="primary">
            Download Syntaflow Preview &rarr;
          </Button>
          <Button href="/product/client-management" variant="secondary">
            Inspect Client Workspace &rarr;
          </Button>
        </div>
      </PageHero>

      {/* 1. THE SOLO OPERATOR DILEMMA */}
      <section className="section" style={{ paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-48)' }}>
        <div className="container" style={{ maxWidth: '980px' }}>
          <Card variant="raised" style={{ padding: 'clamp(24px, 4vw, 36px)', backgroundColor: 'var(--surface-raised)', borderLeft: '4px solid #10B981' }}>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#10B981', textTransform: 'uppercase', marginBottom: '8px' }}>
              SOLO REALITY // CONTEXT RETENTION
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: '10px' }}>
              You don&rsquo;t need enterprise complexity. You need calm continuity.
            </h3>
            <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', lineHeight: 1.65, margin: 0 }}>
              As a solo consultant, designer, or developer, you do not have project managers or administrative staff to reconcile client discrepancies. When client feedback is scattered across email threads and cloud docs, you are the one paying the penalty in unbilled revision hours. Syntaflow provides the disciplined operating structure of a boutique studio in a lightweight local application built for your workstation.
            </p>
          </Card>
        </div>
      </section>

      {/* 2. FOUR FREELANCER CAPABILITIES */}
      <section className="section" style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-64)', paddingBottom: 'var(--space-64)', backgroundColor: 'var(--canvas)' }}>
        <div className="container" style={{ maxWidth: '1080px' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-48)' }}>
            <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              SOLO WORKSPACE SYSTEMS
            </span>
            <h2 className="heading-2" style={{ fontSize: 'clamp(26px, 3.8vw, 36px)', color: 'var(--text)', marginTop: 'var(--space-12)', marginBottom: 'var(--space-12)' }}>
              Built for high-throughput independent operators.
            </h2>
            <p style={{ fontSize: '15.5px', color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto' }}>
              Everything you need to deliver high-stakes client work with complete professional authority.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-24)' }}>
            {freelancerPillars.map((p) => (
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
                      THE FREELANCER PROBLEM
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
                    YOUR WORKFLOW
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
            Explore systems tailored for solo client management
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', fontSize: '14px' }}>
            <Link href="/product/client-management" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>
              Command Client Accounts & Retainers &rarr;
            </Link>
            <Link href="/product/documents" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>
              Inspect Typographic Document Canvas &rarr;
            </Link>
            <Link href="/pricing" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>
              Review Preview Pricing ($0) &rarr;
            </Link>
            <Link href="/download" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>
              Download Syntaflow Preview &rarr;
            </Link>
          </div>
        </div>
      </section>

      <CTASection
        title="Command your client work from one calm desk."
        description="Stop paying for disconnected subscriptions. Manage clients, documents, and reviews with local-first precision."
        primaryLabel="Download Syntaflow Preview"
        primaryHref="/download"
        secondaryLabel="Inspect Document Canvas"
        secondaryHref="/product/documents"
      />
    </div>
  );
};
