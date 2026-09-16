import React from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { PageHero } from '../../components/marketing/PageHero';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Link } from '../../components/ui/Link';
import { CTASection } from '../../components/marketing/CTASection';
import { getRouteMetadata } from '../../seo/seoConfig';

export const SolutionsOverviewPage: React.FC = () => {
  const meta = getRouteMetadata('/solutions');

  const solutionProfiles = [
    {
      role: 'Agencies',
      badge: 'MULTI-SEAT & MARGINS',
      title: 'Run agency client work without losing the thread.',
      summary: 'Coordinate multiple concurrent client accounts, structure project handoffs between account directors and creatives, and enforce delivery gates before assets are released.',
      highlights: [
        'Multi-client cockpit with zero latency',
        'Designated primary decision-maker authorities',
        'Delivery gate protection against premature file handovers',
        'Standardized scoping blueprints for design and engineering',
      ],
      href: '/solutions/agencies',
      cta: 'Explore agency workflows →',
    },
    {
      role: 'Freelancers & Solos',
      badge: 'HIGH-VELOCITY FOCUS',
      title: 'Keep your clients, work and delivery in one place.',
      summary: 'Manage several client engagements simultaneously without paying for multiple SaaS subscriptions. Move seamlessly from proposal to execution, review, and paid delivery.',
      highlights: [
        'Continuous proposal-to-delivery operating pipeline',
        'Frozen DocVersion review snapshots that prevent unpaid revision loops',
        'Offline-first independence powered by local SQLite',
        '$0 desktop preview with complete commercial capabilities',
      ],
      href: '/solutions/freelancers',
      cta: 'Explore freelancer workflows →',
    },
    {
      role: 'Consultants & Advisors',
      badge: 'CONFIDENTIAL ADVISORY',
      title: 'Keep client context connected from meeting to delivery.',
      summary: 'Retain deep advisory context from meetings to board presentations. Draft typographic deliverables, track retainer burn rates, and store sensitive client data locally with zero cloud telemetry.',
      highlights: [
        'Confidential local-first storage protecting client NDAs',
        'Meeting notes and decisions connected to typographic deliverables',
        'Real-time retainer runway and SLA turnaround tracking',
        'Defensible cryptographic sign-offs on advisory recommendations',
      ],
      href: '/solutions/consultants',
      cta: 'Explore consultant workflows →',
    },
    {
      role: 'Creative Studios',
      badge: 'DESIGN SYSTEMS & ASSETS',
      title: 'Align creative vision with immutable delivery gates.',
      summary: 'Built for independent design studios and specialized engineering practices that require typographic presentation, exact version review snapshots, and structured handovers.',
      highlights: [
        'Typographic paper canvas formatted for client review',
        'Side-by-side visual version diffing across iterations',
        'Integration with Figma tokens and GitHub repositories',
        'Sealed production delivery manifests',
      ],
      href: '/solutions/studios',
      cta: 'Explore creative studio workflows →',
    },
  ];

  return (
    <div>
      <SEOHead path="/solutions" />

      <PageHero
        breadcrumbs={meta.breadcrumbs}
        eyebrow="Solutions // Tailored Workspaces"
        title="Built for client-facing work."
        description="Whether you run a boutique agency, operate as an independent consultant, or deliver specialized creative services, Syntaflow eliminates tool fragmentation and keeps your client context unified."
        status="AVAILABLE NOW"
      >
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <Button href="/download" variant="primary">
            Download Syntaflow Preview &rarr;
          </Button>
          <Button href="/product" variant="secondary">
            Inspect Product Overview &rarr;
          </Button>
        </div>
      </PageHero>

      {/* 1. WHY CLIENT-FACING WORK DEMANDS A DEDICATED WORKSPACE */}
      <section className="section" style={{ paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-48)' }}>
        <div className="container" style={{ maxWidth: '980px' }}>
          <Card variant="raised" style={{ padding: 'clamp(24px, 4vw, 36px)', backgroundColor: 'var(--surface-raised)', borderLeft: '4px solid var(--cyan)' }}>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: '8px' }}>
              THE CLIENT-FACING REALITY
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: '10px' }}>
              Internal project trackers ignore the client boundary.
            </h3>
            <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', lineHeight: 1.65, margin: 0 }}>
              Generic project tools are designed for internal product development teams where everyone has an account and changes happen continuously. But in client services, work crosses a critical contractual boundary: proposals must be signed, deliverables must freeze for review, feedback must bind to exact versions, and handovers must be formal. Syntaflow is engineered specifically around this client-facing reality.
            </p>
          </Card>
        </div>
      </section>

      {/* 2. DEDICATED AUDIENCE PROFILES */}
      <section className="section" style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-64)', paddingBottom: 'var(--space-64)', backgroundColor: 'var(--canvas)' }}>
        <div className="container" style={{ maxWidth: '1080px' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-48)' }}>
            <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              ROLE-SPECIFIC ARCHITECTURES
            </span>
            <h2 className="heading-2" style={{ fontSize: 'clamp(26px, 3.8vw, 36px)', color: 'var(--text)', marginTop: 'var(--space-12)', marginBottom: 'var(--space-12)' }}>
              Choose your operating profile.
            </h2>
            <p style={{ fontSize: '15.5px', color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto' }}>
              Explore how Syntaflow adapts to your specific commercial model and client delivery standards.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-24)' }}>
            {solutionProfiles.map((p) => (
              <Card key={p.role} variant="default" style={{ padding: 'var(--space-28)', backgroundColor: 'var(--surface-raised)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} className="interactive-lift glow-cyan-hover">
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
                    <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)' }}>{p.role}</span>
                    <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', padding: '2px 8px', backgroundColor: 'rgba(6, 182, 212, 0.1)', borderRadius: '4px', border: '1px solid rgba(6, 182, 212, 0.25)' }}>
                      {p.badge}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text)', marginTop: '8px', marginBottom: 'var(--space-12)' }}>
                    {p.title}
                  </h3>

                  <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 'var(--space-20)' }}>
                    {p.summary}
                  </p>

                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-16)', marginBottom: 'var(--space-20)' }}>
                    <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)', textTransform: 'uppercase', marginBottom: '8px' }}>
                      KEY SYSTEM ADVANTAGES
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {p.highlights.map((h, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                          <span style={{ color: 'var(--cyan)' }}>›</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Link
                  href={p.href}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13.5px',
                    color: 'var(--cyan)',
                    fontWeight: 600,
                    textDecoration: 'none',
                    borderTop: '1px solid var(--border)',
                    paddingTop: 'var(--space-16)',
                  }}
                >
                  {p.cta}
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CROSS-LINKS */}
      <section className="section" style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-48)', paddingBottom: 'var(--space-48)' }}>
        <div className="container" style={{ maxWidth: '980px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: 'var(--space-20)' }}>
            Deep dive into product systems and commercial terms
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', fontSize: '14px' }}>
            <Link href="/product" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>
              Product System Overview &rarr;
            </Link>
            <Link href="/product/reviews-approvals" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>
              Client Reviews & Approvals &rarr;
            </Link>
            <Link href="/pricing" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>
              Transparent Pricing & Roadmaps &rarr;
            </Link>
            <Link href="/security" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>
              Security Architecture & Privacy &rarr;
            </Link>
          </div>
        </div>
      </section>

      <CTASection
        title="Operate with continuous client context."
        description="Download Syntaflow Preview and see how grounded client work management transforms your delivery."
        primaryLabel="Download Syntaflow Preview"
        primaryHref="/download"
        secondaryLabel="Inspect Product Overview"
        secondaryHref="/product"
      />
    </div>
  );
};
