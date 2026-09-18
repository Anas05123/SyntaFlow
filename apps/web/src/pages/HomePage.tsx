import React, { useRef, useState } from 'react';
import { SEOHead } from '../components/ui/SEOHead';
import { Button } from '../components/ui/Button';
import { Link } from '../components/ui/Link';
import { LivingEngagementPreview } from '../components/preview/LivingEngagementPreview';
import { DesktopSimulator } from '../components/preview/DesktopSimulator';
import { FlowCanvas } from '../components/visual/FlowCanvas';
import { PRICING_TIERS } from '../content/pricingConfig';

interface LifecycleStage {
  id: string;
  step: string;
  title: string;
  subtitle: string;
  description: string;
  guarantee: string;
  badge: string;
}

const LIFECYCLE_STAGES: LifecycleStage[] = [
  {
    id: 'intake',
    step: '01',
    title: 'Client Intake & Commercial Terms',
    subtitle: 'Commercial Foundation',
    description: 'Set up client accounts with authorized decision-makers, billing models (fixed fee, retainer, or hourly rate), and SLA schedules directly in the project context.',
    guarantee: 'Commercial terms remain permanently attached to every subsequent project milestone.',
    badge: 'COMMERCIAL CONTEXT',
  },
  {
    id: 'blueprint',
    step: '02',
    title: 'Scoping Blueprint & Milestones',
    subtitle: 'Scope Definition',
    description: 'Structure deliverables into explicit milestones before execution starts. Lock down resource requirements and revision allocations to prevent scope creep.',
    guarantee: 'Scope drift is detected before hours are burned on unauthorized revisions.',
    badge: 'SCOPE INTEGRITY',
  },
  {
    id: 'tasks',
    step: '03',
    title: 'Task Execution & Attention Radar',
    subtitle: 'Dual-Density Work',
    description: 'Track execution with lifecycle stage, operational attention, and security access completely decoupled. Board view for flow, list view for density.',
    guarantee: 'You always know what is blocked on you vs. what is waiting on client feedback.',
    badge: 'RADAR TRACKING',
  },
  {
    id: 'documents',
    step: '04',
    title: 'Typographic Document Studio',
    subtitle: 'Continuous Paper Canvas',
    description: 'Draft proposals, creative briefs, and technical specs on a distraction-free typographic canvas. Every saved version creates an immutable DocVersion snapshot.',
    guarantee: 'Submitted document versions cannot be retroactively modified without an audit trail.',
    badge: 'IMMUTABLE DRAFTS',
  },
  {
    id: 'reviews',
    step: '05',
    title: 'Cryptographic Client Reviews',
    subtitle: 'Version-Locked Sign-Off',
    description: 'Transmit review packages with explicit presentation templates, SLA response timers, and tokenized client links. Feedback binds to exact version snapshots.',
    guarantee: 'Client feedback binds to the exact version reviewed, preventing revision confusion.',
    badge: 'AUDITED FEEDBACK',
  },
  {
    id: 'gate',
    step: '06',
    title: 'Delivery Gate Enforcement',
    subtitle: 'Handover Protection',
    description: 'Final delivery archives cannot be generated until every prerequisite deliverable is formally signed off by the authorized client stakeholder.',
    guarantee: 'Zero premature or unapproved deliverables leave your studio.',
    badge: 'DELIVERY GATE',
  },
];

export const HomePage: React.FC = () => {
  const lifecycleRef = useRef<HTMLDivElement>(null);
  const simulatorRef = useRef<HTMLDivElement>(null);
  const [activeStageId, setActiveStageId] = useState<string>('reviews');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const scrollToLifecycle = () => {
    lifecycleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  const currentStage = LIFECYCLE_STAGES.find((s) => s.id === activeStageId) || LIFECYCLE_STAGES[4];

  const vendorIntegrations = [
    { name: 'Gmail', category: 'COMMUNICATION', note: 'Correspond directly within client project threads without leaving desktop.' },
    { name: 'Google Calendar', category: 'SCHEDULING', note: 'Milestone deadlines, review check-ins, and delivery dates.' },
    { name: 'Google Drive', category: 'STORAGE', note: 'Link asset folders and collateral directly to verified deliverables.' },
    { name: 'GitHub', category: 'DEVELOPMENT', note: 'Trace commits and pull requests to client scoping milestones.' },
    { name: 'Linear', category: 'ISSUES', note: 'Synchronize technical issues into high-level client status reports.' },
    { name: 'Notion', category: 'KNOWLEDGE', note: 'Surface client reference briefs and wiki notes locally in context.' },
    { name: 'Figma', category: 'DESIGN', note: 'Embed live design token snapshots into client review transmission bundles.' },
  ];

  const homepageFaqs = [
    {
      q: 'What makes Syntaflow different from standard project management tools?',
      a: 'Standard tools track tasks as generic disconnected checkboxes across noisy browser tabs. Syntaflow is a high-density desktop operating environment that couples commercial billing terms, scoping blueprints, tasks, typographic documents, client reviews, and delivery gates into one continuous, tamper-evident operating record stored in an encrypted local SQLite database.',
    },
    {
      q: 'Who is Syntaflow engineered for?',
      a: 'Syntaflow is designed for solo practitioners, freelancers, consultants, boutique agencies, and independent studios managing multiple client relationships who value craftsmanship, privacy, and clear scope boundaries.',
    },
    {
      q: 'Where is my client data stored?',
      a: '100% on your local machine. Syntaflow runs on a local-first SQLite architecture with zero cloud telemetry. Your client rosters, contract amounts, document drafts, and private credentials never touch third-party servers.',
    },
    {
      q: 'Does Syntaflow work completely offline?',
      a: 'Yes. Every feature — from drafting documents and checking blueprints to organizing tasks and inspecting delivery gates — operates 100% offline without requiring an active internet connection.',
    },
    {
      q: 'What is the pricing model during and after preview?',
      a: 'Syntaflow Desktop is currently 100% free ($0) with full local-first capabilities during our public preview phase. For GA, Syntaflow will offer a straightforward perpetual desktop license with an optional encrypted sync subscription. No forced subscriptions or artificial paywalls on your local files.',
    },
  ];

  return (
    <div style={{ fontFamily: 'var(--font-body)', color: 'var(--text)', backgroundColor: 'var(--canvas)' }}>
      <SEOHead path="/" />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          01. ASYMMETRIC EDITORIAL HERO SECTION
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        style={{
          paddingTop: 'clamp(3rem, 6vw, 5.5rem)',
          paddingBottom: 'clamp(3.5rem, 6vw, 6rem)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container" style={{ maxWidth: '1200px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              alignItems: 'center',
              gap: 'clamp(2.5rem, 5vw, 4.5rem)',
            }}
          >
            {/* Left Column: Confident Editorial Typography */}
            <div style={{ maxWidth: '620px' }}>
              {/* Eyebrow Pill */}
              <div className="editorial-eyebrow" style={{ marginBottom: '1.5rem' }}>
                <span className="dot" />
                <span>CLIENT WORK, CONNECTED</span>
              </div>

              {/* Display Headline */}
              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.5rem, 5.2vw, 4.25rem)',
                  fontWeight: 700,
                  lineHeight: 1.08,
                  letterSpacing: '-0.035em',
                  color: 'var(--text)',
                  marginBottom: '1.5rem',
                }}
              >
                Your client work should remember what happened.
              </h1>

              {/* Supporting Copy */}
              <p
                style={{
                  fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)',
                  color: 'var(--text-muted)',
                  lineHeight: 1.62,
                  marginBottom: '2.25rem',
                }}
              >
                Syntaflow connects agreement terms, scoping blueprints, tasks, immutable document versions, and client reviews into one living desktop record — from first proposal to final delivery.
              </p>

              {/* CTAs */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', marginBottom: '2rem' }}>
                <Button href="/login" variant="primary" size="lg">
                  Get Free Preview →
                </Button>
                <Button variant="secondary" size="lg" onClick={scrollToLifecycle}>
                  See how it works ↓
                </Button>
              </div>

              {/* Micro Trust Line */}
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: 'var(--text-metadata)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flexWrap: 'wrap',
                }}
              >
                <span>Free during Desktop Preview ($0)</span>
                <span>·</span>
                <span>Local SQLite</span>
                <span>·</span>
                <span>Windows 10/11 x64</span>
                <span>·</span>
                <span>Zero Telemetry</span>
              </div>
            </div>

            {/* Right Column: Living Client Engagement Preview Widget */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <LivingEngagementPreview />
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          02. THE CONTEXT FRAGMENTATION PROBLEM (Anti-card)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        style={{
          padding: 'clamp(4rem, 7vw, 6.5rem) 0',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
          backgroundColor: 'var(--surface)',
        }}
      >
        <div className="container" style={{ maxWidth: '1080px' }}>
          {/* Section Header */}
          <div style={{ maxWidth: '780px', marginBottom: '3.5rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11.5px',
                color: 'var(--cobalt)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: 600,
                display: 'block',
                marginBottom: '0.75rem',
              }}
            >
              02 // The Context Fragmentation Problem
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 3.8vw, 3rem)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                color: 'var(--text)',
                lineHeight: 1.18,
                marginBottom: '1.25rem',
              }}
            >
              Client work breaks when context gets scattered.
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.65, margin: 0 }}>
              Proposals in email, tasks on a disconnected board, specs in loose docs, reviews in chat DMs, and sign-offs in invoices. When information lives across 8 disconnected SaaS tabs, scope drift is inevitable.
            </p>
          </div>

          {/* Asymmetric Problem vs Solution Contrast Block */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px',
            }}
          >
            {/* The Old Way: Fragmented SaaS Stack */}
            <div
              style={{
                padding: '2.25rem',
                borderRadius: 'var(--radius-card)',
                backgroundColor: 'rgba(240, 109, 102, 0.04)',
                border: '1px solid rgba(240, 109, 102, 0.22)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--risk)', fontWeight: 650, fontSize: '15px', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '18px' }}>✕</span>
                <span>The Fragmented SaaS Sprawl</span>
              </div>
              <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px', color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>
                <li style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ color: 'var(--risk)' }}>—</span>
                  <span>Scope discussions buried in multi-recipient Gmail threads</span>
                </li>
                <li style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ color: 'var(--risk)' }}>—</span>
                  <span>Tasks decoupled from commercial fee schedules and revision limits</span>
                </li>
                <li style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ color: 'var(--risk)' }}>—</span>
                  <span>Document drafts altered after the client reviewed them</span>
                </li>
                <li style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ color: 'var(--risk)' }}>—</span>
                  <span>Deliverables handed over before formal sign-off was recorded</span>
                </li>
              </ul>
            </div>

            {/* The Syntaflow Way: One Connected Record */}
            <div
              style={{
                padding: '2.25rem',
                borderRadius: 'var(--radius-card)',
                backgroundColor: 'rgba(47, 107, 250, 0.04)',
                border: '1px solid var(--cobalt-border)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--cobalt)', fontWeight: 650, fontSize: '15px', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '18px' }}>✓</span>
                <span>The Syntaflow Connected System</span>
              </div>
              <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px', color: 'var(--text)', fontSize: '14px', lineHeight: 1.6 }}>
                <li style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ color: 'var(--cobalt)', fontWeight: 700 }}>+</span>
                  <span>Every deliverable binds back to the signed scoping blueprint</span>
                </li>
                <li style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ color: 'var(--cobalt)', fontWeight: 700 }}>+</span>
                  <span>Dual-density task boards with decoupled lifecycle stage and attention</span>
                </li>
                <li style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ color: 'var(--cobalt)', fontWeight: 700 }}>+</span>
                  <span>Immutable DocVersion snapshots hashed and locked upon submission</span>
                </li>
                <li style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ color: 'var(--cobalt)', fontWeight: 700 }}>+</span>
                  <span>Delivery gates enforced automatically before release packages unlock</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          03. THE CONNECTED CLIENT LIFECYCLE (The 6 Milestones)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        ref={lifecycleRef}
        style={{
          padding: 'clamp(4.5rem, 7vw, 7rem) 0',
          backgroundColor: 'var(--canvas)',
        }}
      >
        <div className="container" style={{ maxWidth: '1120px' }}>
          {/* Section Header */}
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3.5rem auto' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11.5px',
                color: 'var(--cobalt)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: 600,
                display: 'block',
                marginBottom: '0.75rem',
              }}
            >
              03 // The Connected Client Lifecycle
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 3.8vw, 3rem)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                color: 'var(--text)',
                lineHeight: 1.18,
                marginBottom: '1rem',
              }}
            >
              One continuous record from first contact to delivery.
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.62 }}>
              Syntaflow preserves the decision trail across all 6 critical milestones of professional client engagements.
            </p>
          </div>

          {/* Stepper Grid (Clickable interactive stages) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '12px',
              marginBottom: '2rem',
            }}
          >
            {LIFECYCLE_STAGES.map((st) => {
              const isSelected = st.id === activeStageId;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setActiveStageId(st.id)}
                  style={{
                    padding: '16px 14px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isSelected ? 'var(--surface)' : 'var(--surface-subtle)',
                    border: isSelected ? '2px solid var(--cobalt)' : '1px solid var(--border)',
                    boxShadow: isSelected ? 'var(--shadow-md)' : 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        color: isSelected ? 'var(--cobalt)' : 'var(--text-tertiary)',
                      }}
                    >
                      {st.step}
                    </span>
                    {isSelected && (
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--cobalt)',
                        }}
                      />
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: '13px',
                      fontWeight: 650,
                      color: isSelected ? 'var(--text)' : 'var(--text-muted)',
                      lineHeight: 1.3,
                    }}
                  >
                    {st.subtitle}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Stage Detail Card */}
          <div
            className="paper-card"
            style={{
              padding: 'clamp(2rem, 4vw, 3rem)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'clamp(1.5rem, 3vw, 3rem)',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <span className="status-chip status-chip-cobalt">{currentStage.badge}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-metadata)' }}>
                  STAGE {currentStage.step} OF 06
                </span>
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.025em',
                  color: 'var(--text)',
                  lineHeight: 1.25,
                  marginBottom: '1rem',
                }}
              >
                {currentStage.title}
              </h3>

              <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: '1.5rem' }}>
                {currentStage.description}
              </p>

              <div
                style={{
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--surface-subtle)',
                  borderLeft: '3px solid var(--mint)',
                  fontSize: '13.5px',
                  color: 'var(--text)',
                  lineHeight: 1.5,
                }}
              >
                <strong style={{ color: '#15803D' }}>Architectural Guarantee:</strong> {currentStage.guarantee}
              </div>
            </div>

            {/* Visual Stage Snapshot Block */}
            <div
              style={{
                backgroundColor: 'var(--surface-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '24px',
                border: '1px solid var(--border)',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
              }}
            >
              <div style={{ color: 'var(--text-tertiary)', marginBottom: '12px' }}>
                // Canonical Record Snapshot
              </div>
              <div style={{ color: 'var(--cobalt)', marginBottom: '6px' }}>
                record: &quot;{currentStage.title}&quot;
              </div>
              <div style={{ color: 'var(--text-muted)', marginBottom: '6px' }}>
                persistence: &quot;local_sqlite_encrypted&quot;
              </div>
              <div style={{ color: 'var(--text-muted)', marginBottom: '6px' }}>
                immutability_rule: &quot;ENFORCED&quot;
              </div>
              <div style={{ color: 'var(--mint)', marginTop: '12px' }}>
                status: &quot;VERIFIED_AUDIT_TRAIL&quot;
              </div>
            </div>
          </div>

          {/* Live Workspace Context Flow Instrument */}
          <div style={{ marginTop: '3.5rem' }}>
            <FlowCanvas />
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          04. TIERED FEATURE HIERARCHY (Varied Modular Rhythm)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        style={{
          padding: 'clamp(4.5rem, 7vw, 7rem) 0',
          borderTop: '1px solid var(--border)',
          backgroundColor: 'var(--surface)',
        }}
      >
        <div className="container" style={{ maxWidth: '1120px' }}>
          {/* Section Header */}
          <div style={{ maxWidth: '750px', marginBottom: '3.5rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11.5px',
                color: 'var(--cobalt)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: 600,
                display: 'block',
                marginBottom: '0.75rem',
              }}
            >
              04 // High-Precision Desktop Capabilities
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 3.8vw, 3rem)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                color: 'var(--text)',
                lineHeight: 1.18,
                marginBottom: '1rem',
              }}
            >
              Built for operators who care about precision.
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.62 }}>
              Everything in Syntaflow is crafted around the physical realities of running client engagements.
            </p>
          </div>

          {/* Wide Feature Stage: Attention Radar */}
          <div
            className="paper-card"
            style={{
              padding: 'clamp(2rem, 4vw, 3.5rem)',
              marginBottom: '24px',
              border: '1px solid var(--border)',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', alignItems: 'center' }}>
              <div>
                <span className="status-chip status-chip-amber" style={{ marginBottom: '1rem' }}>
                  OPERATOR COCKPIT
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.5rem, 2.5vw, 2.1rem)',
                    fontWeight: 700,
                    letterSpacing: '-0.025em',
                    color: 'var(--text)',
                    lineHeight: 1.25,
                    marginBottom: '1rem',
                  }}
                >
                  The Attention Radar: Never lose track of waiting client feedback.
                </h3>
                <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: '1.5rem' }}>
                  Client work stalls when items fall into review limbo. Syntaflow decouples lifecycle stage from operator attention, instantly categorizing tasks as &ldquo;Blocked on Operator&rdquo; vs &ldquo;Waiting on Client Review&rdquo; with SLA response countdowns.
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{ padding: '8px 14px', backgroundColor: 'var(--surface-subtle)', borderRadius: 'var(--radius-sm)', fontSize: '13px', fontWeight: 600 }}>
                    ⚡ 3D Status Decoupling
                  </div>
                  <div style={{ padding: '8px 14px', backgroundColor: 'var(--surface-subtle)', borderRadius: 'var(--radius-sm)', fontSize: '13px', fontWeight: 600 }}>
                    ⏱ SLA Response Timers
                  </div>
                </div>
              </div>

              {/* Visual Radar Card */}
              <div
                style={{
                  backgroundColor: 'var(--surface-subtle)',
                  borderRadius: 'var(--radius-card)',
                  padding: '24px',
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)', marginBottom: '14px', textTransform: 'uppercase' }}>
                  Active Operator Attention Radar
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ padding: '12px 14px', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>Brand System v2 Draft</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Northstar Studio · Waiting on Client</div>
                    </div>
                    <span className="status-chip status-chip-amber">SLA: 6h left</span>
                  </div>

                  <div style={{ padding: '12px 14px', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>Scoping Blueprint Sign-off</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Acme Corp · Operator Action Needed</div>
                    </div>
                    <span className="status-chip status-chip-cobalt">Needs Review</span>
                  </div>

                  <div style={{ padding: '12px 14px', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>Final Handover Package</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Vertex Labs · Gate Complete</div>
                    </div>
                    <span className="status-chip status-chip-mint">✓ Ready to Ship</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Two Split Feature Blocks */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {/* Split Block 1: Immutable DocVersions */}
            <div
              className="paper-card"
              style={{
                padding: '2.5rem',
                border: '1px solid var(--border)',
              }}
            >
              <span className="status-chip status-chip-cobalt" style={{ marginBottom: '1rem' }}>
                IMMUTABLE VERSIONS
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: 'var(--text)',
                  lineHeight: 1.3,
                  marginBottom: '0.75rem',
                }}
              >
                DocVersions are strictly immutable.
              </h3>
              <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                Once a document version is submitted for client review, it cannot be silently altered. Comments bind strictly to exact cryptographic snapshots, ensuring complete auditability during disputes.
              </p>
            </div>

            {/* Split Block 2: Local SQLite Sovereignty */}
            <div
              className="paper-card"
              style={{
                padding: '2.5rem',
                border: '1px solid var(--border)',
              }}
            >
              <span className="status-chip status-chip-mint" style={{ marginBottom: '1rem' }}>
                LOCAL-FIRST SOVEREIGNTY
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: 'var(--text)',
                  lineHeight: 1.3,
                  marginBottom: '0.75rem',
                }}
              >
                100% Local SQLite Persistence.
              </h3>
              <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                Your client contracts, hourly billing records, and sensitive design briefs are stored locally on your physical hardware. Zero cloud lock-in, zero telemetry, and instant sub-millisecond query speed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          05. PRODUCT EXPERIENCE (Real Desktop Simulator)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        ref={simulatorRef}
        style={{
          padding: 'clamp(4.5rem, 7vw, 7rem) 0',
          borderTop: '1px solid var(--border)',
          backgroundColor: 'var(--canvas)',
        }}
      >
        <div className="container" style={{ maxWidth: '1120px' }}>
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3.5rem auto' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11.5px',
                color: 'var(--cobalt)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: 600,
                display: 'block',
                marginBottom: '0.75rem',
              }}
            >
              05 // The Desktop Simulator
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 3.8vw, 3rem)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                color: 'var(--text)',
                lineHeight: 1.18,
                marginBottom: '1rem',
              }}
            >
              Engineered for focus. Built for desktop.
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.62 }}>
              Interact directly with the live cockpit simulator below to experience the dual task board, immutable review transmission, and delivery gate mechanics.
            </p>
          </div>

          {/* Desktop Simulator Container */}
          <div
            className="contrast-stage"
            style={{
              borderRadius: 'var(--radius-large)',
              padding: 'clamp(1rem, 2vw, 1.5rem)',
              backgroundColor: 'var(--surface-contrast)',
            }}
          >
            <DesktopSimulator />
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          06. ZERO-FRICTION CONNECTIVITY (Calm Integrations)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        style={{
          padding: 'clamp(4.5rem, 7vw, 6.5rem) 0',
          borderTop: '1px solid var(--border)',
          backgroundColor: 'var(--surface)',
        }}
      >
        <div className="container" style={{ maxWidth: '1080px' }}>
          <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem auto' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11.5px',
                color: 'var(--cobalt)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: 600,
                display: 'block',
                marginBottom: '0.75rem',
              }}
            >
              06 // Zero-Friction Connectivity
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 3.8vw, 3rem)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                color: 'var(--text)',
                lineHeight: 1.18,
                marginBottom: '1rem',
              }}
            >
              Connect external tools without losing focus.
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.62 }}>
              Credentials stay encrypted in your local OS vault. Context is surfaced directly into the active client engagement.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px',
              marginBottom: '2.5rem',
            }}
          >
            {vendorIntegrations.map((vendor) => (
              <div
                key={vendor.name}
                style={{
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--surface-subtle)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '15px', fontWeight: 650, color: 'var(--text)' }}>{vendor.name}</div>
                    <span style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: 'var(--cobalt)', fontWeight: 600 }}>
                      {vendor.category}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    {vendor.note}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link
              href="/integrations"
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--cobalt)',
                textDecoration: 'none',
              }}
            >
              Explore all supported vendor integrations →
            </Link>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          07. TRANSPARENT PRICING & HONEST TERMS
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        style={{
          padding: 'clamp(4.5rem, 7vw, 7rem) 0',
          borderTop: '1px solid var(--border)',
          backgroundColor: 'var(--canvas)',
        }}
      >
        <div className="container" style={{ maxWidth: '1080px' }}>
          <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem auto' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11.5px',
                color: 'var(--cobalt)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: 600,
                display: 'block',
                marginBottom: '0.75rem',
              }}
            >
              07 // Transparent Pricing
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 3.8vw, 3rem)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                color: 'var(--text)',
                lineHeight: 1.18,
                marginBottom: '1rem',
              }}
            >
              Free during Desktop Preview. Honest thereafter.
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.62 }}>
              No surprise paywalls. No subscription trap for your local files. Your data remains on your hardware forever.
            </p>
          </div>

          {/* Pricing Tiers Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px',
              marginBottom: '3rem',
            }}
          >
            {PRICING_TIERS.map((tier) => {
              const isPreview = tier.id === 'preview';
              return (
                <div
                  key={tier.id}
                  className="paper-card"
                  style={{
                    padding: '2.25rem',
                    borderRadius: 'var(--radius-card)',
                    backgroundColor: 'var(--surface)',
                    border: isPreview ? '2px solid var(--cobalt)' : '1px solid var(--border)',
                    boxShadow: isPreview ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span
                      className={isPreview ? 'status-chip status-chip-cobalt' : 'status-chip'}
                      style={{
                        backgroundColor: isPreview ? 'var(--cobalt-subtle)' : 'var(--surface-subtle)',
                        color: isPreview ? 'var(--cobalt)' : 'var(--text-metadata)',
                      }}
                    >
                      {tier.badge}
                    </span>
                  </div>

                  <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>
                    {tier.name}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                      {tier.priceLabel}
                    </span>
                    <span style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>/ {tier.periodLabel}</span>
                  </div>

                  <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: '1.5rem' }}>
                    {tier.description}
                  </p>

                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', marginBottom: '2rem', flexGrow: 1 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {tier.features.slice(0, 5).map((f, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: 'var(--text)' }}>
                          <span style={{ color: isPreview ? 'var(--cobalt)' : 'var(--text-tertiary)', fontWeight: 700 }}>✓</span>
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    {isPreview ? (
                      <Link
                        href="/login"
                        style={{
                          display: 'block',
                          textAlign: 'center',
                          padding: '12px',
                          borderRadius: 'var(--radius-button)',
                          backgroundColor: 'var(--cobalt)',
                          color: '#ffffff',
                          fontSize: '14px',
                          fontWeight: 600,
                          textDecoration: 'none',
                          boxShadow: '0 2px 8px rgba(47, 107, 250, 0.25)',
                        }}
                      >
                        Get Free Preview →
                      </Link>
                    ) : (
                      <div
                        style={{
                          textAlign: 'center',
                          padding: '12px',
                          borderRadius: 'var(--radius-button)',
                          backgroundColor: 'var(--surface-subtle)',
                          color: 'var(--text-tertiary)',
                          fontSize: '13px',
                          border: '1px solid var(--border)',
                        }}
                      >
                        Announced before GA
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* FAQ Sub-section */}
          <div style={{ maxWidth: '820px', margin: '0 auto' }}>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.75rem',
                fontWeight: 700,
                color: 'var(--text)',
                textAlign: 'center',
                marginBottom: '2rem',
                letterSpacing: '-0.025em',
              }}
            >
              Frequently Asked Questions
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {homepageFaqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="paper-card"
                    style={{
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--surface)',
                      border: '1px solid var(--border)',
                      overflow: 'hidden',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      style={{
                        width: '100%',
                        padding: '1.25rem 1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text)',
                        fontSize: '15px',
                        fontWeight: 600,
                        textAlign: 'left',
                      }}
                    >
                      <span>{faq.q}</span>
                      <span style={{ color: 'var(--cobalt)', fontSize: '18px', marginLeft: '1rem', fontWeight: 700 }}>
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>

                    {isOpen && (
                      <div style={{ padding: '0 1.5rem 1.25rem', fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.65 }}>
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          08. FINAL INVITATION CTA
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        style={{
          padding: 'clamp(5rem, 8vw, 7.5rem) 0',
          borderTop: '1px solid var(--border)',
          backgroundColor: 'var(--surface)',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '740px' }}>
          <span className="editorial-eyebrow" style={{ marginBottom: '1.5rem' }}>
            <span className="dot" />
            <span>START TODAY</span>
          </span>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.2rem, 4.5vw, 3.25rem)',
              fontWeight: 700,
              color: 'var(--text)',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              marginBottom: '1.25rem',
            }}
          >
            Ready to connect your client workspace?
          </h2>

          <p
            style={{
              fontSize: '1.15rem',
              color: 'var(--text-muted)',
              lineHeight: 1.65,
              marginBottom: '2.5rem',
            }}
          >
            Join the Syntaflow Desktop Preview. Free during preview with full local-first SQLite persistence and zero telemetry.
          </p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button href="/login" variant="primary" size="lg">
              Sign In to Syntaflow →
            </Button>
            <Button href="/download" variant="secondary" size="lg">
              Explore Desktop Runtime
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
