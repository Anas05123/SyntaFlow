import React from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { PageHero } from '../../components/marketing/PageHero';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Link } from '../../components/ui/Link';
import { CTASection } from '../../components/marketing/CTASection';
import { getRouteMetadata } from '../../seo/seoConfig';

export const AgenciesPage: React.FC = () => {
  const meta = getRouteMetadata('/solutions/agencies');

  const agencyPillars = [
    {
      title: 'Eliminate Scope Creep Margin Bleed',
      badge: 'COMMERCIAL PRESERVATION',
      problem: 'Agencies lose 15–25% of net margins when informal client requests via Slack or email get executed without commercial scope adjustments.',
      solution: 'Every project begins with a scoping blueprint bound to explicit commercial parameters. Scope revisions require an incremented blueprint version with client sign-off.',
      action: 'When a client requests out-of-scope work, create an addendum blueprint in seconds. Retainer hours and milestone fee adjustments remain visible to all project leads.',
    },
    {
      title: 'Designate Primary Decision Authorities',
      badge: 'APPROVAL GOVERNANCE',
      problem: 'A creative director gets verbal sign-off from a junior brand manager, only for the VP to reject the deliverable weeks later during final review.',
      solution: 'Explicitly anchor authorized decision-maker roles in the client record. Review requests and formal sign-offs bind strictly to primary authorities.',
      action: 'Syntaflow checks decision authority before accepting approval records, eliminating contradictory feedback and protecting agency milestones.',
    },
    {
      title: 'Delivery Gate Handover Enforcement',
      badge: 'MARGIN PROTECTION',
      problem: 'Junior developers or designers accidentally email raw files or production credentials before final accounting sign-off and milestone payment.',
      solution: 'Delivery gates enforce mandatory preconditions. Production release packages remain cryptographically locked until 100% of prerequisite approvals pass.',
      action: 'Account directors configure gate conditions (e.g., v03.0 sign-off + final invoice cleared). Gates open automatically only when all preconditions pass.',
    },
    {
      title: 'Streamline Multi-Client Handoffs',
      badge: 'TEAM VELOCITY',
      problem: 'When accounts transfer between project managers or creatives, context gets lost in fragmented Slack channels and forgotten email threads.',
      solution: 'One persistent relationship cockpit per client. All active retainers, blueprints, typographic briefs, and review decisions live in a single local workspace.',
      action: 'Onboard new team members in minutes by letting them inspect the complete chronological engagement history with full context intact.',
    },
  ];

  return (
    <div>
      <SEOHead path="/solutions/agencies" />

      <PageHero
        breadcrumbs={meta.breadcrumbs}
        eyebrow="Solutions // Boutique Agencies"
        title="Run agency client work without losing the thread."
        description="Syntaflow is client management software engineered for agency margins. Coordinate multiple concurrent client accounts, structure project handoffs between account directors and creatives, and enforce delivery gates before assets are released."
        status="AVAILABLE NOW"
      >
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <Button href="/download" variant="primary">
            Download Syntaflow Preview &rarr;
          </Button>
          <Button href="/product/reviews-approvals" variant="secondary">
            Inspect Reviews & Approvals &rarr;
          </Button>
        </div>
      </PageHero>

      {/* 1. THE AGENCY MARGIN PROBLEM */}
      <section className="section" style={{ paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-48)' }}>
        <div className="container" style={{ maxWidth: '980px' }}>
          <Card variant="raised" style={{ padding: 'clamp(24px, 4vw, 36px)', backgroundColor: 'var(--surface-raised)', borderLeft: '4px solid #3B82F6' }}>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#3B82F6', textTransform: 'uppercase', marginBottom: '8px' }}>
              AGENCY REALITY // THE MARGIN GAP
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: '10px' }}>
              Tool fragmentation costs agencies thousands in unbilled revisions.
            </h3>
            <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', lineHeight: 1.65, margin: 0 }}>
              Boutique agencies rarely fail because of poor creative work; they struggle because operational context fragments across 10 disconnected SaaS tools. Account directors manage retainers in spreadsheets, designers share Figma links with unverified clients, developers manage tickets in generic boards, and approvals happen over casual email replies. Syntaflow unites the agency thread—protecting margins, enforcing sign-off authority, and locking delivery gates.
            </p>
          </Card>
        </div>
      </section>

      {/* 2. FOUR AGENCY-SPECIFIC CAPABILITIES */}
      <section className="section" style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-64)', paddingBottom: 'var(--space-64)', backgroundColor: 'var(--canvas)' }}>
        <div className="container" style={{ maxWidth: '1080px' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-48)' }}>
            <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              AGENCY OPERATIONAL SYSTEMS
            </span>
            <h2 className="heading-2" style={{ fontSize: 'clamp(26px, 3.8vw, 36px)', color: 'var(--text)', marginTop: 'var(--space-12)', marginBottom: 'var(--space-12)' }}>
              Engineered for agency profitability and governance.
            </h2>
            <p style={{ fontSize: '15.5px', color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto' }}>
              Built specifically for boutique digital agencies, brand studios, and design engineering practices.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-24)' }}>
            {agencyPillars.map((p) => (
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
                      THE AGENCY PROBLEM
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
                    AGENCY ACTION
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
            Explore core systems built for client service delivery
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', fontSize: '14px' }}>
            <Link href="/product" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>
              Product System Overview &rarr;
            </Link>
            <Link href="/product/reviews-approvals" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>
              Reviews & Approvals Software &rarr;
            </Link>
            <Link href="/pricing" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>
              Transparent Agency Pricing &rarr;
            </Link>
            <Link href="/product/client-management" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>
              Client Management Cockpit &rarr;
            </Link>
          </div>
        </div>
      </section>

      <CTASection
        title="Stop losing agency revenue to unrecorded scope revisions."
        description="Run multiple client engagements with locked version reviews and automated delivery gate protection."
        primaryLabel="Download Syntaflow Preview"
        primaryHref="/download"
        secondaryLabel="Inspect Review Workflows"
        secondaryHref="/product/reviews-approvals"
      />
    </div>
  );
};
