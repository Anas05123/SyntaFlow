import React, { useRef, useState } from 'react';
import { SEOHead } from '../components/ui/SEOHead';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Link } from '../components/ui/Link';
import { DesktopSimulator } from '../components/preview/DesktopSimulator';
import { StagePipelineGraph } from '../components/preview/StagePipelineGraph';

export const HomePage: React.FC = () => {
  const simulatorRef = useRef<HTMLDivElement>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const scrollToHowItWorks = () => {
    simulatorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  const vendorIntegrations = [
    { name: 'Gmail', category: 'COMMUNICATION', status: 'AVAILABLE', statusColor: '#10B981', note: 'Correspond directly within client project threads' },
    { name: 'Google Calendar', category: 'SCHEDULING', status: 'AVAILABLE', statusColor: '#10B981', note: 'Milestone deadlines and review sessions' },
    { name: 'Google Drive', category: 'STORAGE', status: 'AVAILABLE', statusColor: '#10B981', note: 'Link deliverables directly to tasks and sign-offs' },
    { name: 'GitHub', category: 'DEVELOPMENT', status: 'AVAILABLE', statusColor: '#10B981', note: 'Trace commits and issues to client deliverables' },
    { name: 'Figma', category: 'DESIGN', status: 'TEST', statusColor: 'var(--cyan)', note: 'Embed design token snapshots into reviews' },
    { name: 'Notion', category: 'KNOWLEDGE', status: 'TEST', statusColor: 'var(--cyan)', note: 'Surface client briefs and reference wikis' },
    { name: 'Slack', category: 'MESSAGING', status: 'TEST', statusColor: 'var(--cyan)', note: 'Client dispatches and review notification webhooks' },
    { name: 'Linear', category: 'ISSUES', status: 'COMING SOON', statusColor: 'var(--text-metadata)', note: 'Synchronize technical issue tracking' },
  ];

  const homepageFaqs = [
    {
      q: 'What is Syntaflow?',
      a: 'Syntaflow is a local-first connected workspace for client work management. It unifies client records, scoping blueprints, tasks, typographic documents, client reviews, and delivery gates into one continuous desktop operating environment.',
    },
    {
      q: 'Who is it for?',
      a: 'Syntaflow is designed specifically for agencies, freelancers, consultants, and professional client service teams who manage multiple engagements and require strict version control, transparent reviews, and zero context fragmentation.',
    },
    {
      q: 'Does Syntaflow use AI?',
      a: 'Yes, but strictly with context and human oversight. Syntaflow routes requests through local models (via Ollama) or private endpoints using the context already attached to your client record. AI never auto-commits state, alters deliverables, or shares your client data with external training pipelines.',
    },
    {
      q: 'Which integrations are supported?',
      a: 'Gmail, Google Calendar, Google Drive, and GitHub are available today with local credential protection. Figma, Notion, Slack, and Linear are currently in test or planned development.',
    },
    {
      q: 'Does Syntaflow work offline?',
      a: 'Yes. Syntaflow is engineered as an offline-first desktop application powered by an embedded SQLite database. You can manage clients, write specifications, and organize tasks completely offline without network dependencies.',
    },
    {
      q: 'Is Syntaflow free?',
      a: 'Yes. The Desktop Preview is 100% free ($0) with no credit card required. All client records and project data created during preview remain stored permanently on your workstation in open, portable formats.',
    },
  ];

  return (
    <div style={{ paddingBottom: 'var(--space-64)', fontFamily: 'var(--font-body)' }}>
      <SEOHead path="/" />

      {/* 1. HERO SECTION */}
      <section className="section" style={{ paddingTop: 'var(--space-64)', paddingBottom: 'var(--space-40)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '980px' }}>
          {/* Eyebrow Pill */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 14px', borderRadius: '100px', backgroundColor: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.25)', marginBottom: 'var(--space-20)' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              DESKTOP PREVIEW // CONNECTED CLIENT WORK MANAGEMENT
            </span>
          </div>

          <h1
            className="display-hero hero-kinetic"
            style={{
              fontSize: 'clamp(36px, 5.4vw, 64px)',
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
              fontSize: 'clamp(16px, 2vw, 19.5px)',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              maxWidth: '720px',
              margin: '0 auto var(--space-32) auto',
            }}
          >
            Syntaflow is a connected workspace for agencies, freelancers and professional teams—bringing client projects, documents, reviews, integrations and AI-assisted work into one continuous workflow.
          </p>

          {/* Action CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center', marginBottom: 'var(--space-24)' }}>
            <Button variant="primary" href="/download" style={{ padding: '13px 30px', fontSize: '15px' }}>
              Download Syntaflow &rarr;
            </Button>
            <Button variant="secondary" onClick={scrollToHowItWorks} style={{ padding: '13px 24px', fontSize: '15px' }}>
              See how it works &darr;
            </Button>
          </div>

          <div style={{ fontSize: '12.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)' }}>
            Free during Desktop Preview ($0) · Local-first SQLite · Windows 10/11 x64
          </div>
        </div>
      </section>

      {/* 2. PRODUCT CLARITY (First Viewport Segment: WHO, WHAT, HOW) */}
      <section className="section" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-48)' }}>
        <div className="container" style={{ maxWidth: '1080px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'var(--space-16)',
            }}
          >
            <Card variant="default" style={{ padding: 'var(--space-24)', backgroundColor: 'var(--surface-raised)' }}>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: '6px' }}>
                WHO IT&rsquo;S FOR
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>
                Agencies, Freelancers & Teams
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                Engineered for independent practitioners, consultants, and boutique studios managing multiple client engagements simultaneously.
              </p>
            </Card>

            <Card variant="default" style={{ padding: 'var(--space-24)', backgroundColor: 'var(--surface-raised)' }}>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: '6px' }}>
                WHAT IT DOES
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>
                Connected Client Work Management
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                Keeps commercial terms, scoping blueprints, task execution, immutable document reviews, and gate handovers in a single operating record.
              </p>
            </Card>

            <Card variant="default" style={{ padding: 'var(--space-24)', backgroundColor: 'var(--surface-raised)' }}>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: '6px' }}>
                HOW IT WORKS
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>
                Clients · Projects · Reviews · AI
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                A local desktop application that pulls external tools into the engagement and uses real work context to power AI-assisted drafting.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 3. PROBLEM SECTION: Your work is connected. Your tools aren't. */}
      <section className="section" style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-64)', paddingBottom: 'var(--space-64)' }}>
        <div className="container" style={{ maxWidth: '980px' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-40)' }}>
            <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              THE FRAGMENTATION REALITY
            </span>
            <h2 className="heading-2" style={{ fontSize: 'clamp(28px, 4vw, 38px)', color: 'var(--text)', marginTop: 'var(--space-12)', marginBottom: 'var(--space-12)' }}>
              Your work is connected. Your tools aren&rsquo;t.
            </h2>
            <p style={{ fontSize: '15.5px', color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto' }}>
              Client engagements require continuous context, but standard software fragments critical decisions across isolated silos.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 'var(--space-16)',
              marginBottom: 'var(--space-28)',
            }}
          >
            <Card variant="default" style={{ padding: 'var(--space-24)' }} className="interactive-lift">
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>
                Email holds the conversation.
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Client briefs, feedback notices, and commercial adjustments stay stranded in personal inboxes.
              </div>
            </Card>

            <Card variant="default" style={{ padding: 'var(--space-24)' }} className="interactive-lift">
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>
                Drive holds the files.
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Deliverables float in folders detached from signed milestone dates and client sign-off records.
              </div>
            </Card>

            <Card variant="default" style={{ padding: 'var(--space-24)' }} className="interactive-lift">
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>
                Project tools hold the tasks.
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Generic kanban boards track cards without memory of commercial scope, retainers, or deliverables.
              </div>
            </Card>

            <Card variant="default" style={{ padding: 'var(--space-24)' }} className="interactive-lift">
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>
                AI starts without context.
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Isolated chat tabs force you to re-explain the client history and previous decisions every single time.
              </div>
            </Card>
          </div>

          <div style={{ textAlign: 'center', padding: 'var(--space-24)', backgroundColor: 'var(--surface-raised)', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--cyan)' }}>
              Syntaflow connects the thread.
            </span>
            <span style={{ fontSize: '14.5px', color: 'var(--text-muted)', marginLeft: '8px' }}>
              One continuous engagement record where client communications, files, tasks, approvals, and AI intelligence live together.
            </span>
          </div>
        </div>
      </section>

      {/* 4. CLIENT LIFECYCLE: One client. One continuous record. */}
      <section className="section" style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-64)', paddingBottom: 'var(--space-64)', backgroundColor: 'var(--canvas)' }}>
        <div className="container" style={{ maxWidth: '1120px' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-36)' }}>
            <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              SIGNATURE ENGAGEMENT ARCHITECTURE
            </span>
            <h2 className="heading-2" style={{ fontSize: 'clamp(28px, 4vw, 40px)', color: 'var(--text)', marginTop: 'var(--space-12)', marginBottom: 'var(--space-12)' }}>
              One client. One continuous record.
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--text-muted)', maxWidth: '680px', margin: '0 auto var(--space-24) auto', lineHeight: 1.6 }}>
              Every stage keeps its documents, decisions, tasks and history attached to the same engagement.
            </p>

            {/* Lifecycle Flow Breadcrumb */}
            <div style={{ display: 'inline-flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '8px 18px', backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border)', borderRadius: '100px', fontSize: '12.5px', fontFamily: 'var(--font-mono)' }}>
              <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>Request</span>
              <span style={{ color: 'var(--text-metadata)' }}>&rarr;</span>
              <span style={{ color: 'var(--text)' }}>Proposal</span>
              <span style={{ color: 'var(--text-metadata)' }}>&rarr;</span>
              <span style={{ color: 'var(--text)' }}>Project</span>
              <span style={{ color: 'var(--text-metadata)' }}>&rarr;</span>
              <span style={{ color: 'var(--text)' }}>Review</span>
              <span style={{ color: 'var(--text-metadata)' }}>&rarr;</span>
              <span style={{ color: 'var(--text)' }}>Approval</span>
              <span style={{ color: 'var(--text-metadata)' }}>&rarr;</span>
              <span style={{ color: '#10B981', fontWeight: 600 }}>Delivery</span>
            </div>
          </div>

          <StagePipelineGraph />
        </div>
      </section>

      {/* 5. INTERACTIVE SIMULATOR (See How It Works) */}
      <section ref={simulatorRef} id="how-it-works" className="section" style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-64)', paddingBottom: 'var(--space-64)' }}>
        <div className="container" style={{ maxWidth: '1160px' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-32)' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              SEE HOW IT WORKS // INTERACTIVE PREVIEW
            </span>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 600, color: 'var(--text)', marginTop: '6px', margin: 0 }}>
              Test the workspace right here.
            </h2>
            <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', marginTop: '6px', marginBottom: 'var(--space-20)', maxWidth: '640px', marginInline: 'auto' }}>
              Click through Cockpit, Scoping Blueprints, Dual-Density Tasks, Typographic Paper Canvas, Review Decisions, and Delivery Gates.
            </p>
          </div>

          <DesktopSimulator />
        </div>
      </section>

      {/* 6. PRODUCT CAPABILITIES (4 Main Concepts) */}
      <section className="section" style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-64)', paddingBottom: 'var(--space-64)' }}>
        <div className="container" style={{ maxWidth: '1080px' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-48)' }}>
            <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              CORE CAPABILITIES
            </span>
            <h2 className="heading-2" style={{ fontSize: 'clamp(28px, 4vw, 38px)', color: 'var(--text)', marginTop: 'var(--space-12)', marginBottom: 'var(--space-12)' }}>
              Built for how client work actually happens.
            </h2>
            <p style={{ fontSize: '15.5px', color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto' }}>
              Four unified capabilities designed for operational clarity, version integrity, and zero cloud lock-in.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 'var(--space-20)',
            }}
          >
            {/* Capability 1: Client Work */}
            <Card variant="default" style={{ padding: 'var(--space-28)', backgroundColor: 'var(--surface-raised)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} className="interactive-lift glow-cyan-hover">
              <div>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  01 // CLIENT WORK
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginTop: '8px', marginBottom: 'var(--space-8)' }}>
                  Keep clients and their projects connected.
                </h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 'var(--space-20)' }}>
                  Maintain commercial terms, active retainers, stakeholder contacts, and milestones anchored to a single client record. No orphaned tasks or lost agreements.
                </p>
              </div>
              <Link href="/product/client-ops" style={{ fontSize: '13px', color: 'var(--cyan)', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                Explore client operations hub &rarr;
              </Link>
            </Card>

            {/* Capability 2: Documents */}
            <Card variant="default" style={{ padding: 'var(--space-28)', backgroundColor: 'var(--surface-raised)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} className="interactive-lift glow-cyan-hover">
              <div>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  02 // DOCUMENTS
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginTop: '8px', marginBottom: 'var(--space-8)' }}>
                  Keep versions, reviews and approvals traceable.
                </h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 'var(--space-20)' }}>
                  Draft on a distraction-free 780px typographic paper canvas. When submitted, versions freeze into immutable snapshots that client sign-offs bind to directly.
                </p>
              </div>
              <Link href="/product/documents-reviews" style={{ fontSize: '13px', color: 'var(--cyan)', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                Inspect typographic documents & reviews &rarr;
              </Link>
            </Card>

            {/* Capability 3: Integrations */}
            <Card variant="default" style={{ padding: 'var(--space-28)', backgroundColor: 'var(--surface-raised)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} className="interactive-lift glow-cyan-hover">
              <div>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  03 // INTEGRATIONS
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginTop: '8px', marginBottom: 'var(--space-8)' }}>
                  Bring external tools into the engagement.
                </h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 'var(--space-20)' }}>
                  Surface communications, calendars, cloud storage, and code repositories directly in project threads with local keychain encryption and zero cloud telemetry.
                </p>
              </div>
              <Link href="/integrations" style={{ fontSize: '13px', color: 'var(--cyan)', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                Explore connected tools catalog &rarr;
              </Link>
            </Card>

            {/* Capability 4: Intelligence */}
            <Card variant="default" style={{ padding: 'var(--space-28)', backgroundColor: 'var(--surface-raised)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} className="interactive-lift glow-cyan-hover">
              <div>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  04 // INTELLIGENCE
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginTop: '8px', marginBottom: 'var(--space-8)' }}>
                  Use relevant work context with AI workflows.
                </h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 'var(--space-20)' }}>
                  Synthesize briefs, extract action items, and prepare review packages using the actual engagement history—never isolated, uninformed prompt windows.
                </p>
              </div>
              <Link href="/product" style={{ fontSize: '13px', color: 'var(--cyan)', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                Review system architecture & AI engine &rarr;
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* 7. INTEGRATIONS PREVIEW (True Vendor State Grid) */}
      <section className="section" style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-64)', paddingBottom: 'var(--space-64)', backgroundColor: 'var(--canvas)' }}>
        <div className="container" style={{ maxWidth: '1080px' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-44)' }}>
            <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              EXTERNAL TOOLS // ONE WORKING CONTEXT
            </span>
            <h2 className="heading-2" style={{ fontSize: 'clamp(28px, 4vw, 38px)', color: 'var(--text)', marginTop: 'var(--space-12)', marginBottom: 'var(--space-12)' }}>
              Your tools. One working context.
            </h2>
            <p style={{ fontSize: '15.5px', color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto' }}>
              Syntaflow integrates external communications, calendars, storage, and tickets directly into the client engagement without centralizing or compromising your credentials.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: 'var(--space-16)',
              marginBottom: 'var(--space-32)',
            }}
          >
            {vendorIntegrations.map((vendor) => (
              <Card key={vendor.name} variant="default" style={{ padding: 'var(--space-20)', backgroundColor: 'var(--surface-raised)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
                  <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)' }}>
                    {vendor.name}
                  </span>
                  <span
                    style={{
                      fontSize: '10px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      color: vendor.statusColor,
                      backgroundColor: `${vendor.statusColor}18`,
                      border: `1px solid ${vendor.statusColor}33`,
                    }}
                  >
                    {vendor.status}
                  </span>
                </div>
                <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  {vendor.category}
                </div>
                <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                  {vendor.note}
                </p>
              </Card>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Button variant="secondary" href="/integrations" style={{ padding: '10px 24px', fontSize: '14px' }}>
              Explore integrations catalog & security scopes &rarr;
            </Button>
          </div>
        </div>
      </section>

      {/* 8. AI SECTION (AI with Context) */}
      <section className="section" style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-64)', paddingBottom: 'var(--space-64)' }}>
        <div className="container" style={{ maxWidth: '980px' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-44)' }}>
            <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              CONTEXT-GROUNDED ASSISTANCE
            </span>
            <h2 className="heading-2" style={{ fontSize: 'clamp(28px, 4vw, 38px)', color: 'var(--text)', marginTop: 'var(--space-12)', marginBottom: 'var(--space-12)' }}>
              AI with context.
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--text-muted)', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6 }}>
              Syntaflow can use the context already attached to your work—projects, documents, decisions and connected services—so you do not have to rebuild the story every time.
            </p>
          </div>

          {/* Context -> Intelligence -> Action Pipeline */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 'var(--space-20)',
              marginBottom: 'var(--space-32)',
            }}
          >
            <Card variant="raised" style={{ padding: 'var(--space-24)', backgroundColor: 'var(--surface-raised)', borderTop: '3px solid var(--cyan)' }}>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: '8px' }}>
                STAGE 01 // INGESTION
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>
                Context
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                Client retainers, brief emails, scoped blueprints, and immutable document versions stay organized within the active desktop engagement.
              </p>
            </Card>

            <Card variant="raised" style={{ padding: 'var(--space-24)', backgroundColor: 'var(--surface-raised)', borderTop: '3px solid #3B82F6' }}>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#3B82F6', textTransform: 'uppercase', marginBottom: '8px' }}>
                STAGE 02 // REASONING
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>
                Intelligence
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                Syntaflow routes tasks to local LLMs (via Ollama) or private endpoints with zero generalized model training or data telemetry.
              </p>
            </Card>

            <Card variant="raised" style={{ padding: 'var(--space-24)', backgroundColor: 'var(--surface-raised)', borderTop: '3px solid #10B981' }}>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#10B981', textTransform: 'uppercase', marginBottom: '8px' }}>
                STAGE 03 // EXECUTION
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>
                Action
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                Generate proposals, extract task dependencies, and compile review briefs—ready for human confirmation before sending.
              </p>
            </Card>
          </div>

          <div style={{ padding: 'var(--space-20) var(--space-24)', backgroundColor: 'rgba(6, 182, 212, 0.06)', borderRadius: '8px', border: '1px solid rgba(6, 182, 212, 0.2)', textAlign: 'center' }}>
            <span style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--cyan)' }}>
              Operator Control Guarantee:
            </span>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)', marginLeft: '6px' }}>
              You control what integrations and actions AI can access. Syntaflow never auto-commits state or sends client communications without explicit confirmation.
            </span>
          </div>
        </div>
      </section>

      {/* 9. SECURITY / TRUST: Your work remains yours. */}
      <section className="section" style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-64)', paddingBottom: 'var(--space-64)', backgroundColor: 'var(--canvas)' }}>
        <div className="container" style={{ maxWidth: '980px' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-44)' }}>
            <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              DEFENSE IN DEPTH // VERIFIED ARCHITECTURE
            </span>
            <h2 className="heading-2" style={{ fontSize: 'clamp(28px, 4vw, 38px)', color: 'var(--text)', marginTop: 'var(--space-12)', marginBottom: 'var(--space-12)' }}>
              Your work remains yours.
            </h2>
            <p style={{ fontSize: '15.5px', color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto' }}>
              Syntaflow is built on verifiable security principles, local physical storage, and transparent permission boundaries.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 'var(--space-16)',
              marginBottom: 'var(--space-32)',
            }}
          >
            <Card variant="default" style={{ padding: 'var(--space-24)', backgroundColor: 'var(--surface-raised)' }}>
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>
                Local-first desktop design
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                All client records, notes, and task data persist on your physical machine in an embedded SQLite database. Zero cloud telemetry.
              </p>
            </Card>

            <Card variant="default" style={{ padding: 'var(--space-24)', backgroundColor: 'var(--surface-raised)' }}>
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>
                Protected credential storage
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                OAuth tokens and connection secrets are encrypted using OS-backed keychains (Windows DPAPI / Credential Manager).
              </p>
            </Card>

            <Card variant="default" style={{ padding: 'var(--space-24)', backgroundColor: 'var(--surface-raised)' }}>
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>
                Explicit integration permissions
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                Integrations operate strictly within approved scopes to query communications matching active client accounts.
              </p>
            </Card>

            <Card variant="default" style={{ padding: 'var(--space-24)', backgroundColor: 'var(--surface-raised)' }}>
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>
                Human confirmation
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                Sensitive operations—dispatching review emails, approving milestones, and clearing gates—require manual operator sign-off.
              </p>
            </Card>
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link href="/security" style={{ fontSize: '14px', color: 'var(--cyan)', fontWeight: 500, textDecoration: 'underline' }}>
              Read our complete security approach &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* 10. PRICING PREVIEW */}
      <section className="section" style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-64)', paddingBottom: 'var(--space-64)' }}>
        <div className="container" style={{ maxWidth: '1040px' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-44)' }}>
            <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              TRANSPARENT PRICING
            </span>
            <h2 className="heading-2" style={{ fontSize: 'clamp(28px, 4vw, 38px)', color: 'var(--text)', marginTop: 'var(--space-12)', marginBottom: 'var(--space-12)' }}>
              Free during Desktop Preview.
            </h2>
            <p style={{ fontSize: '15.5px', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
              Test the full desktop workspace without paywalls or credit cards. All data you create remains yours.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 'var(--space-24)',
              marginBottom: 'var(--space-32)',
            }}
          >
            {/* Desktop Preview */}
            <Card variant="raised" style={{ padding: 'var(--space-32)', backgroundColor: 'var(--surface-raised)', border: '1px solid var(--cyan)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-12)' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', margin: 0 }}>Desktop Preview</h3>
                  <span style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.12)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                    AVAILABLE NOW
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: 'var(--space-16)' }}>
                  <span style={{ fontSize: '38px', fontWeight: 700, color: 'var(--text)' }}>$0</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>during preview</span>
                </div>
                <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 'var(--space-20)' }}>
                  Full local desktop runtime for Windows 10/11 x64 with unconstrained client and project management.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 var(--space-24) 0', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#10B981' }}>✓</span> Unlimited client records & commercial terms
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#10B981' }}>✓</span> Scoping blueprints & dual-density task boards
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#10B981' }}>✓</span> 780px typographic paper canvas & DocVersion reviews
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#10B981' }}>✓</span> Delivery gate enforcement & release bundling
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#10B981' }}>✓</span> Core integrations (Gmail, Calendar, Drive, GitHub)
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#10B981' }}>✓</span> Local SQLite database with zero cloud telemetry
                  </li>
                </ul>
              </div>
              <Button variant="primary" href="/download" style={{ width: '100%', textAlign: 'center', padding: '12px' }}>
                Download Free Preview &rarr;
              </Button>
            </Card>

            {/* Syntaflow Pro (Planned) */}
            <Card variant="default" style={{ padding: 'var(--space-32)', backgroundColor: 'var(--surface-raised)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', opacity: 0.9 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-12)' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', margin: 0 }}>Syntaflow Pro</h3>
                  <span style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)', backgroundColor: 'var(--surface-sunken)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border)' }}>
                    COMING LATER
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: 'var(--space-16)' }}>
                  <span style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-muted)' }}>Pricing TBD</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-metadata)' }}>announced before GA</span>
                </div>
                <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 'var(--space-20)' }}>
                  Designed for high-throughput solo consultants and independent studio directors.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 var(--space-24) 0', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--cyan)' }}>›</span> Everything in Desktop Preview
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--cyan)' }}>›</span> Multi-device encrypted database synchronization
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--cyan)' }}>›</span> AI TaskRouter with contextual workspace synthesis
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--cyan)' }}>›</span> Extended integrations (Figma, Notion, Slack, Linear)
                  </li>
                </ul>
              </div>
              <Button variant="secondary" href="/pricing" style={{ width: '100%', textAlign: 'center', padding: '12px' }}>
                See pricing roadmap &rarr;
              </Button>
            </Card>

            {/* Syntaflow Studio / Team (Planned) */}
            <Card variant="default" style={{ padding: 'var(--space-32)', backgroundColor: 'var(--surface-raised)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', opacity: 0.9 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-12)' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', margin: 0 }}>Studio / Team</h3>
                  <span style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)', backgroundColor: 'var(--surface-sunken)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border)' }}>
                    COMING LATER
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: 'var(--space-16)' }}>
                  <span style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-muted)' }}>Pricing TBD</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-metadata)' }}>announced before GA</span>
                </div>
                <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 'var(--space-20)' }}>
                  Built for boutique agencies and advisory practices with shared client delivery standards.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 var(--space-24) 0', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--cyan)' }}>›</span> Everything in Syntaflow Pro
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--cyan)' }}>›</span> Multi-seat workspace licenses & pooled storage
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--cyan)' }}>›</span> Centralized client review portals with audit trails
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--cyan)' }}>›</span> Role-based approval authorities & delivery gates
                  </li>
                </ul>
              </div>
              <Button variant="secondary" href="/pricing" style={{ width: '100%', textAlign: 'center', padding: '12px' }}>
                See studio pilot details &rarr;
              </Button>
            </Card>
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link href="/pricing" style={{ fontSize: '14px', color: 'var(--cyan)', fontWeight: 500, textDecoration: 'underline' }}>
              See transparent pricing & commercial terms &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* 11. FAQ PREVIEW (6 High-Value Technical Questions) */}
      <section className="section" style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-64)', paddingBottom: 'var(--space-64)', backgroundColor: 'var(--canvas)' }}>
        <div className="container" style={{ maxWidth: '860px' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-44)' }}>
            <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="heading-2" style={{ fontSize: 'clamp(28px, 4vw, 38px)', color: 'var(--text)', marginTop: 'var(--space-12)', marginBottom: 'var(--space-12)' }}>
              Direct answers to common questions.
            </h2>
            <p style={{ fontSize: '15.5px', color: 'var(--text-muted)' }}>
              Concise explanations of our product model, local architecture, and roadmap.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)', marginBottom: 'var(--space-32)' }}>
            {homepageFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={faq.q}
                  style={{
                    backgroundColor: 'var(--surface-raised)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    transition: 'border-color 0.15s ease',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    style={{
                      width: '100%',
                      padding: '18px 20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: 600,
                    }}
                  >
                    <span>{faq.q}</span>
                    <span style={{ color: 'var(--cyan)', fontSize: '18px', marginLeft: '12px' }}>
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 20px 20px 20px', fontSize: '14.5px', color: 'var(--text-muted)', lineHeight: 1.6, borderTop: '1px solid var(--border)', paddingTop: '14px' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Button variant="secondary" href="/faq" style={{ padding: '10px 24px', fontSize: '14px' }}>
              Read all technical questions & answers &rarr;
            </Button>
          </div>
        </div>
      </section>

      {/* 12. FINAL CALL-TO-ACTION & INTERNAL LINKS */}
      <section className="section" style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-64)', paddingBottom: 'var(--space-64)' }}>
        <div className="container" style={{ maxWidth: '880px', textAlign: 'center' }}>
          <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            OPERATE WITH CONTINUOUS CONTEXT
          </span>
          <h2 className="heading-2" style={{ fontSize: 'clamp(28px, 4vw, 42px)', color: 'var(--text)', marginTop: 'var(--space-12)', marginBottom: 'var(--space-16)' }}>
            Work moves better when context stays connected.
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-muted)', maxWidth: '620px', margin: '0 auto var(--space-32) auto', lineHeight: 1.6 }}>
            Join the desktop preview today. Experience client operations designed for version integrity, transparent reviews, and zero SaaS lock-in.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center', marginBottom: 'var(--space-36)' }}>
            <Button variant="primary" href="/download" style={{ padding: '13px 30px', fontSize: '15px' }}>
              Download Syntaflow Preview &rarr;
            </Button>
            <Button variant="secondary" href="/product/delivery-approvals" style={{ padding: '13px 24px', fontSize: '15px' }}>
              Inspect Delivery Gate Reviews &rarr;
            </Button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px', fontSize: '13px', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: 'var(--space-24)' }}>
            <Link href="/product" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>Product Overview</Link>
            <span>·</span>
            <Link href="/integrations" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>Integrations Catalog</Link>
            <span>·</span>
            <Link href="/security" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>Security Architecture</Link>
            <span>·</span>
            <Link href="/pricing" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>Transparent Pricing</Link>
            <span>·</span>
            <Link href="/docs" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>Technical Docs</Link>
            <span>·</span>
            <Link href="/privacy" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>Privacy Policy</Link>
            <span>·</span>
            <Link href="/terms" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>Terms of Service</Link>
          </div>
        </div>
      </section>
    </div>
  );
};
