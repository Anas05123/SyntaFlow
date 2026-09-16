import React, { useRef } from 'react';
import { SEOHead } from '../components/ui/SEOHead';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { DesktopSimulator } from '../components/preview/DesktopSimulator';
import { StagePipelineGraph } from '../components/preview/StagePipelineGraph';
import { FeedbackSection } from '../components/feedback/FeedbackSection';
import { PRICING_PLANS } from '../content/pricing';

export const HomePage: React.FC = () => {
  const simulatorRef = useRef<HTMLDivElement>(null);

  const scrollToSimulator = () => {
    simulatorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const productPillars = [
    {
      title: 'Client Operations',
      headline: 'Commercial terms and client pulse remain connected.',
      desc: 'No orphaned tasks or forgotten agreements. Retainers, commercial rates, blueprints, and milestones live within the single client relationship record.',
      badge: 'CLIENT OPS',
    },
    {
      title: 'Typographic Paper Canvas',
      headline: 'Versions, reviews, and sign-offs stay defensible.',
      desc: 'Compose on a physical 780px typographic paper canvas. When submitted, document versions freeze into immutable snapshots that client feedback binds to directly.',
      badge: 'STUDIO CANVAS',
    },
    {
      title: 'Local-First OAuth Vault',
      headline: 'External tools connect without cloud surveillance.',
      desc: 'Connect Gmail, Google Calendar, Google Drive, GitHub, and Slack directly into the project thread with OS-level keychain encryption and zero cloud telemetry.',
      badge: 'LOCAL VAULT',
    },
    {
      title: 'Contextual Intelligence',
      headline: 'AI works from active briefs instead of isolated prompts.',
      desc: 'Synthesize briefs, correspondence, and project blueprints so you never have to re-explain the client context to start work.',
      badge: 'CONTEXT ENGINE',
    },
  ];

  return (
    <div style={{ paddingBottom: 'var(--space-64)', fontFamily: 'var(--font-body)' }}>
      <SEOHead
        title="Syntaflow — Intelligent Operating Environment for Connected Work"
        description="Syntaflow brings client operations, blueprint scoping, dual-density tasks, typographic paper documents, review sign-offs, and delivery gates into one continuous desktop workspace."
        path="/"
      />

      {/* 1. HERO SECTION */}
      <section className="section" style={{ paddingTop: 'var(--space-64)', paddingBottom: 'var(--space-36)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          {/* Eyebrow Pill */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 14px', borderRadius: '100px', backgroundColor: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.3)', marginBottom: 'var(--space-20)' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              DESKTOP PREVIEW v0.1.0-PREVIEW.4 // WINDOWS 64-BIT
            </span>
          </div>

          <h1
            className="display-hero hero-kinetic"
            style={{
              fontSize: 'clamp(36px, 5.2vw, 62px)',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: 'var(--text)',
              marginBottom: 'var(--space-20)',
            }}
          >
            Work moves better when context stays connected.
          </h1>

          <p
            style={{
              fontSize: 'clamp(16px, 2vw, 19px)',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              maxWidth: '680px',
              margin: '0 auto var(--space-32) auto',
            }}
          >
            Syntaflow brings client operations, scoping blueprints, dual-density tasks, typographic documents, client reviews, and delivery gates into one continuous desktop operating environment.
          </p>

          {/* Action CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center', marginBottom: 'var(--space-20)' }}>
            <Button variant="primary" href="#/download" style={{ padding: '12px 28px', fontSize: '15px' }}>
              Download Free Preview &rarr;
            </Button>
            <Button variant="secondary" onClick={scrollToSimulator} style={{ padding: '12px 24px', fontSize: '15px' }}>
              Try Interactive Simulator ↓
            </Button>
          </div>

          <div style={{ fontSize: '12.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)' }}>
            Free during Desktop Preview ($0) · Local-first SQLite · Windows 10/11
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE APP SIMULATOR (Try the App) */}
      <section ref={simulatorRef} className="section" style={{ paddingTop: 'var(--space-12)', paddingBottom: 'var(--space-64)' }}>
        <div className="container" style={{ maxWidth: '1160px' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-24)' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              INTERACTIVE PREVIEW // TRY THE APP DIRECTLY
            </span>
            <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text)', marginTop: '6px', margin: 0 }}>
              Test the workspace right here.
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px', marginBottom: 'var(--space-24)' }}>
              Click tabs to explore Cockpit, Blueprints, Kanban/List Tasks, Typographic Paper Canvas, Review Decisions, and Delivery Gates.
            </p>
          </div>

          <DesktopSimulator />
        </div>
      </section>

      {/* 3. THE FRAGMENTATION PROBLEM */}
      <section className="section" style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-64)', paddingBottom: 'var(--space-64)' }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-44)' }}>
            <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              THE FRAGMENTATION REALITY
            </span>
            <h2 className="heading-2" style={{ fontSize: 'clamp(28px, 4vw, 38px)', color: 'var(--text)', marginTop: 'var(--space-12)' }}>
              Your work is connected. Your software isn&rsquo;t.
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 'var(--space-16)',
              marginBottom: 'var(--space-32)',
            }}
          >
            {[
              { tool: 'Email & Gmail', problem: 'Holds conversations in fragmented threads away from tasks.' },
              { tool: 'Storage & Drive', problem: 'Holds deliverables isolated from commercial sign-off records.' },
              { tool: 'Generic Trackers', problem: 'Hold arbitrary task cards detached from client agreements.' },
              { tool: 'Isolated AI', problem: 'Operates with zero background knowledge of the client engagement.' },
            ].map((item) => (
              <Card key={item.tool} variant="default" style={{ padding: 'var(--space-20)' }} className="interactive-lift">
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>
                  {item.tool}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {item.problem}
                </div>
              </Card>
            ))}
          </div>

          <div style={{ textAlign: 'center', padding: 'var(--space-20)', backgroundColor: 'var(--surface-raised)', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '15.5px', fontWeight: 600, color: 'var(--cyan)' }}>
              Syntaflow unites the thread.
            </span>
            <span style={{ fontSize: '14.5px', color: 'var(--text-muted)', marginLeft: '8px' }}>
              Context flows seamlessly between briefing, commercial scoping, task execution, and client sign-offs.
            </span>
          </div>
        </div>
      </section>

      {/* 4. CONNECTED STAGE PIPELINE GRAPH */}
      <section className="section" style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-64)', paddingBottom: 'var(--space-64)', backgroundColor: 'var(--canvas)' }}>
        <div className="container" style={{ maxWidth: '1120px' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-40)' }}>
            <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              CONTINUOUS LIFECYCLE // PIPELINE ARCHITECTURE
            </span>
            <h2 className="heading-2" style={{ fontSize: 'clamp(28px, 4vw, 38px)', color: 'var(--text)', marginTop: 'var(--space-12)', marginBottom: 'var(--space-12)' }}>
              One client. One continuous pipeline.
            </h2>
            <p style={{ fontSize: '15.5px', color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto' }}>
              Signal and artifacts flow smoothly from initial brief to sealed delivery handover without data loss.
            </p>
          </div>

          <StagePipelineGraph />
        </div>
      </section>

      {/* 5. PRIMARY OPERATING PILLARS */}
      <section className="section" style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-64)', paddingBottom: 'var(--space-64)' }}>
        <div className="container" style={{ maxWidth: '1080px' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-48)' }}>
            <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              CORE PILLARS
            </span>
            <h2 className="heading-2" style={{ fontSize: 'clamp(28px, 4vw, 38px)', color: 'var(--text)', marginTop: 'var(--space-12)' }}>
              Engineered for professional accountability.
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 'var(--space-20)',
            }}
          >
            {productPillars.map((p) => (
              <Card key={p.title} variant="default" style={{ padding: 'var(--space-24)', backgroundColor: 'var(--surface-raised)' }} className="interactive-lift glow-cyan-hover">
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {p.badge}
                </span>
                <h3 style={{ fontSize: '17.5px', fontWeight: 600, color: 'var(--text)', marginTop: '8px', marginBottom: 'var(--space-8)' }}>
                  {p.headline}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                  {p.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 6. COMMUNITY & PREVIEW FEEDBACK STUDIO */}
      <FeedbackSection />

      {/* 7. TRANSPARENT PRICING PREVIEW & FINAL CTA */}
      <section className="section" style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-64)', paddingBottom: 'var(--space-64)' }}>
        <div className="container" style={{ maxWidth: '880px', textAlign: 'center' }}>
          <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            TRANSPARENT PRICING
          </span>
          <h2 className="heading-2" style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', color: 'var(--text)', marginTop: 'var(--space-12)', marginBottom: 'var(--space-16)' }}>
            Free during Desktop Preview.
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', maxWidth: '580px', margin: '0 auto var(--space-32) auto', lineHeight: 1.6 }}>
            {PRICING_PLANS[0].description} No credit card required. Keep all data created during preview.
          </p>

          <Card variant="raised" style={{ padding: 'var(--space-32)', backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border)', maxWidth: '620px', margin: '0 auto var(--space-36) auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-16)' }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', margin: 0 }}>{PRICING_PLANS[0].name}</h3>
                <div style={{ fontSize: '13px', color: 'var(--cyan)', marginTop: '2px' }}>Windows 64-bit Desktop Runtime</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '36px', fontWeight: 700, color: 'var(--text)' }}>$0</span>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}> / preview</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', textAlign: 'left', fontSize: '13px', color: 'var(--text-muted)', marginBottom: 'var(--space-24)', borderTop: '1px solid var(--border)', paddingTop: 'var(--space-16)' }}>
              {PRICING_PLANS[0].features.map((f: string, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: '#10B981' }}>✓</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>

            <Button variant="primary" href="#/download" style={{ width: '100%', padding: '12px', textAlign: 'center' }}>
              Download Preview for Windows &rarr;
            </Button>
          </Card>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
            <a href="#/docs" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>Read Documentation</a>
            <span>·</span>
            <a href="#/privacy" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>Privacy Policy</a>
            <span>·</span>
            <a href="#/terms" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>Terms of Service</a>
          </div>
        </div>
      </section>
    </div>
  );
};
