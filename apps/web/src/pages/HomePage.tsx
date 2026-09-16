import React, { useRef, useState } from 'react';
import { SEOHead } from '../components/ui/SEOHead';
import { Button } from '../components/ui/Button';
import { Link } from '../components/ui/Link';
import { FlowCanvas } from '../components/visual/FlowCanvas';
import { DesktopSimulator } from '../components/preview/DesktopSimulator';
import { PRICING_TIERS } from '../content/pricingConfig';

export const HomePage: React.FC = () => {
  const flowRef = useRef<HTMLDivElement>(null);
  const productRef = useRef<HTMLDivElement>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const scrollToFlow = () => {
    flowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToProduct = () => {
    productRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    { name: 'Linear', category: 'ISSUES', status: 'COMING SOON', statusColor: 'var(--text-metadata)', note: 'Synchronize technical issue tracking' },
  ];

  const homepageFaqs = [
    {
      q: 'What makes Syntaflow different from standard project management tools?',
      a: 'Syntaflow is a local-first connected workspace, not another siloed browser tab. It couples commercial billing terms, scoping blueprints, tasks, typographic documents, client reviews, and delivery gates into one continuous desktop operating record stored in an encrypted local SQLite database.',
    },
    {
      q: 'Who is Syntaflow designed for?',
      a: 'Syntaflow is engineered specifically for agencies, freelancers, consultants, and boutique studios managing multiple client engagements who need strict version control, transparent client review sign-offs, and zero context fragmentation.',
    },
    {
      q: 'How does AI work in Syntaflow?',
      a: 'AI in Syntaflow operates strictly through contextual assistance with human sign-off. It routes tasks through local models (via Ollama) or private endpoints using the context already attached to your client record. AI never mutates deliverables autonomously or sends client data to external training models.',
    },
    {
      q: 'Does Syntaflow work offline?',
      a: 'Yes. Syntaflow is built from the ground up as an offline-first desktop application with an embedded SQLite database. You can manage clients, scope projects, and write specifications completely offline without any internet connection.',
    },
    {
      q: 'What is the pricing model?',
      a: 'The Desktop Preview is 100% free ($0) with no credit card required. When GA launches, Syntaflow will offer a transparent choice between a perpetual license for local desktop use and an optional subscription for multi-device encrypted synchronization.',
    },
  ];

  return (
    <div style={{ paddingBottom: '5rem', fontFamily: 'var(--font-sans, -apple-system, sans-serif)', color: 'var(--text-primary)' }}>
      <SEOHead path="/" />

      {/* 01. HERO SECTION */}
      <section
        style={{
          paddingTop: '4.5rem',
          paddingBottom: '3.5rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background ambient lighting */}
        <div
          style={{
            position: 'absolute',
            top: '0%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '800px',
            height: '400px',
            background: 'radial-gradient(ellipse at top, rgba(0, 242, 254, 0.09) 0%, rgba(37, 99, 235, 0.05) 50%, transparent 80%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
          aria-hidden="true"
        />

        <div className="container" style={{ maxWidth: '960px', position: 'relative', zIndex: 1 }}>
          {/* Eyebrow Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '5px 16px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(0, 242, 254, 0.08)',
              border: '1px solid rgba(0, 242, 254, 0.25)',
              marginBottom: '1.75rem',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#00f2fe',
                boxShadow: '0 0 8px #00f2fe',
              }}
            />
            <span
              style={{
                fontSize: '11.5px',
                fontFamily: 'monospace',
                color: '#00f2fe',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: 600,
              }}
            >
              Desktop Preview // Connected Client Workspace
            </span>
          </div>

          {/* Exact H1 requested */}
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5.5vw, 4.25rem)',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.035em',
              color: '#ffffff',
              marginBottom: '1.5rem',
            }}
          >
            Work moves better when context stays connected.
          </h1>

          {/* Exact Supporting text requested */}
          <p
            style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              maxWidth: '720px',
              margin: '0 auto 2.25rem auto',
            }}
          >
            Syntaflow brings client projects, documents, reviews, integrations and AI-assisted work into one connected workspace.
          </p>

          {/* Exact Preferred Actions: Explore Syntaflow & See how it works */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center', marginBottom: '2.5rem' }}>
            <Button
              variant="primary"
              onClick={scrollToProduct}
              style={{
                padding: '12px 28px',
                fontSize: '14.5px',
                fontWeight: 600,
                backgroundColor: 'var(--cobalt)',
                borderRadius: '9999px',
                boxShadow: '0 8px 24px rgba(37, 99, 235, 0.35)',
              }}
            >
              Explore Syntaflow ↓
            </Button>
            <Button
              variant="secondary"
              onClick={scrollToFlow}
              style={{
                padding: '12px 26px',
                fontSize: '14.5px',
                fontWeight: 500,
                borderRadius: '9999px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
              }}
            >
              See how it works →
            </Button>
          </div>

          <div style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-tertiary)' }}>
            Free during Desktop Preview ($0) · Local-first SQLite · Windows 10/11 x64
          </div>
        </div>

        {/* 05. HERO VISUAL: Live Interactive Pipeline Diagram */}
        <div style={{ marginTop: '3.5rem', padding: '0 1rem' }} ref={flowRef}>
          <FlowCanvas />
        </div>
      </section>

      {/* 02. WHY SYNTAFLOW (Broken SaaS sprawl vs Connected Workspace) */}
      <section style={{ padding: '5rem 0', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <div className="container" style={{ maxWidth: '1080px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#00f2fe', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              02 // The Context Problem
            </span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.025em', color: '#ffffff', marginTop: '0.5rem', marginBottom: '1rem' }}>
              Client work gets messy when context scatters.
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto', lineHeight: 1.6 }}>
              Proposals in email, tasks in one board, specifications in docs, reviews in chat, and sign-offs in invoices. Syntaflow binds them into a single operating chain.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {/* The Old Way */}
            <div
              style={{
                padding: '2rem',
                borderRadius: '16px',
                backgroundColor: 'rgba(239, 68, 68, 0.03)',
                border: '1px solid rgba(239, 68, 68, 0.15)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171', fontWeight: 600, fontSize: '14px', marginBottom: '1rem' }}>
                <span>✕</span>
                <span>The Fragmented Agency Stack</span>
              </div>
              <ul style={{ paddingLeft: '1.25rem', margin: 0, color: 'var(--text-secondary)', fontSize: '13.5px', lineHeight: 1.8 }}>
                <li>Lost client email threads and unconfirmed scope changes</li>
                <li>Tasks decoupled from legal agreements and budgets</li>
                <li>Deliverables handed over before formal client approval</li>
                <li>Client data uploaded to centralized third-party servers</li>
              </ul>
            </div>

            {/* The Syntaflow Way */}
            <div
              style={{
                padding: '2rem',
                borderRadius: '16px',
                backgroundColor: 'rgba(0, 242, 254, 0.03)',
                border: '1px solid rgba(0, 242, 254, 0.3)',
                boxShadow: '0 10px 30px rgba(0, 242, 254, 0.05)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00f2fe', fontWeight: 600, fontSize: '14px', marginBottom: '1rem' }}>
                <span>✓</span>
                <span>The Syntaflow Operating System</span>
              </div>
              <ul style={{ paddingLeft: '1.25rem', margin: 0, color: '#e2e8f0', fontSize: '13.5px', lineHeight: 1.8 }}>
                <li>Connected workspace tying commercial terms to every deliverable</li>
                <li>Dual-density task execution informed by real project blueprints</li>
                <li>Cryptographically locked reviews binding client sign-offs</li>
                <li>100% local-first SQLite persistence with zero cloud telemetry</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 04. PRODUCT EXPERIENCE (Real Desktop Simulator) */}
      <section style={{ padding: '5rem 0', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }} ref={productRef}>
        <div className="container" style={{ maxWidth: '1100px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#00f2fe', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              04 // The Desktop Environment
            </span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.025em', color: '#ffffff', marginTop: '0.5rem', marginBottom: '1rem' }}>
              Engineered for focus. Built for desktop.
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
              Interact with the live simulator below to experience the Operator Cockpit, Blueprint Studio, and Typographic Paper Canvas.
            </p>
          </div>

          <DesktopSimulator />
        </div>
      </section>

      {/* 05. INTEGRATIONS */}
      <section style={{ padding: '5rem 0', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <div className="container" style={{ maxWidth: '1080px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#00f2fe', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              05 // Zero-Friction Connectivity
            </span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.025em', color: '#ffffff', marginTop: '0.5rem', marginBottom: '1rem' }}>
              Connect external tools without losing focus.
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
              Credentials stay encrypted in your local OS vault. Only the context you need is surfaced into the active project.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {vendorIntegrations.map((vendor) => (
              <div
                key={vendor.name}
                style={{
                  padding: '1.25rem',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(17, 20, 26, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '14.5px', fontWeight: 600, color: '#ffffff' }}>{vendor.name}</div>
                  <span style={{ fontSize: '10.5px', color: vendor.statusColor, fontWeight: 600, textTransform: 'uppercase' }}>
                    {vendor.status}
                  </span>
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {vendor.note}
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link
              href="/integrations"
              style={{ fontSize: '13.5px', color: '#00f2fe', textDecoration: 'none', fontWeight: 500 }}
            >
              Explore all 12 supported vendor integrations →
            </Link>
          </div>
        </div>
      </section>

      {/* 06. AI WITH CONTEXT */}
      <section style={{ padding: '5rem 0', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <div className="container" style={{ maxWidth: '980px' }}>
          <div
            style={{
              padding: '3rem',
              borderRadius: '20px',
              backgroundColor: 'rgba(17, 20, 26, 0.8)',
              border: '1px solid rgba(0, 242, 254, 0.25)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'relative', zIndex: 1 }}>
              <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#00f2fe', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                06 // Local-First Intelligence
              </span>
              <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.025em', color: '#ffffff', marginTop: '0.5rem', marginBottom: '1rem' }}>
                AI that understands your client context.
              </h2>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '750px' }}>
                Syntaflow routes tasks through local models (via Ollama) or private endpoints using the commercial terms, briefs, and milestones already present in your project. It assists with document drafting and scope synthesis without leaking secrets to third-party clouds.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#ffffff' }}>
                  <span style={{ color: '#00f2fe' }}>✓</span>
                  <span>Zero public model training</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#ffffff' }}>
                  <span style={{ color: '#00f2fe' }}>✓</span>
                  <span>Offline model routing</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#ffffff' }}>
                  <span style={{ color: '#00f2fe' }}>✓</span>
                  <span>Human sign-off requirement</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 08. PRICING PREVIEW */}
      <section style={{ padding: '5rem 0', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <div className="container" style={{ maxWidth: '1080px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#00f2fe', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              08 // Transparent Pricing
            </span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.025em', color: '#ffffff', marginTop: '0.5rem', marginBottom: '1rem' }}>
              Free during Desktop Preview. Honest thereafter.
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
              No forced subscriptions. No artificial lock-in. Your data remains on your workstation forever.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
            {PRICING_TIERS.map((tier) => {
              const isPreview = tier.id === 'preview';
              return (
                <div
                  key={tier.id}
                  style={{
                    padding: '2rem',
                    borderRadius: '16px',
                    backgroundColor: isPreview ? 'rgba(17, 20, 26, 0.95)' : 'rgba(17, 20, 26, 0.6)',
                    border: isPreview ? '1px solid rgba(0, 242, 254, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: isPreview ? '0 12px 35px rgba(0, 242, 254, 0.08)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: '12px',
                        backgroundColor: isPreview ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                        color: isPreview ? '#00f2fe' : 'var(--text-tertiary)',
                        fontSize: '11px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {tier.badge}
                    </span>
                  </div>

                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>
                    {tier.name}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>{tier.priceLabel}</span>
                    <span style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>/ {tier.periodLabel}</span>
                  </div>

                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                    {tier.description}
                  </p>

                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.25rem', marginBottom: '1.5rem', flexGrow: 1 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {tier.features.slice(0, 5).map((f, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                          <span style={{ color: isPreview ? '#00f2fe' : 'var(--text-tertiary)' }}>✓</span>
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
                          padding: '10px',
                          borderRadius: '8px',
                          backgroundColor: 'var(--cobalt)',
                          color: '#ffffff',
                          fontSize: '13.5px',
                          fontWeight: 600,
                          textDecoration: 'none',
                        }}
                      >
                        Get Free Preview →
                      </Link>
                    ) : (
                      <div
                        style={{
                          textAlign: 'center',
                          padding: '10px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(255, 255, 255, 0.04)',
                          color: 'var(--text-tertiary)',
                          fontSize: '13px',
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

          <div style={{ textAlign: 'center' }}>
            <Link href="/pricing" style={{ fontSize: '13.5px', color: '#00f2fe', textDecoration: 'none', fontWeight: 500 }}>
              View complete pricing breakdown and feature matrix →
            </Link>
          </div>
        </div>
      </section>

      {/* 09. FAQ SECTION */}
      <section style={{ padding: '5rem 0', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <div className="container" style={{ maxWidth: '820px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#00f2fe', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              09 // Frequently Asked Questions
            </span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.025em', color: '#ffffff', marginTop: '0.5rem', marginBottom: '1rem' }}>
              Everything you need to know.
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {homepageFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  style={{
                    borderRadius: '12px',
                    backgroundColor: 'rgba(17, 20, 26, 0.65)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
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
                      color: '#ffffff',
                      fontSize: '15px',
                      fontWeight: 600,
                      textAlign: 'left',
                    }}
                  >
                    <span>{faq.q}</span>
                    <span style={{ color: '#00f2fe', fontSize: '18px', marginLeft: '1rem' }}>
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  {isOpen && (
                    <div style={{ padding: '0 1.5rem 1.25rem', fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. FINAL INVITATION CTA */}
      <section style={{ padding: '5rem 0', borderTop: '1px solid rgba(255, 255, 255, 0.06)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '700px' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.025em', marginBottom: '1rem' }}>
            Ready to connect your client workspace?
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
            Join the Syntaflow Desktop Preview today. Free during preview with full local-first capabilities.
          </p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/login"
              style={{
                padding: '12px 28px',
                borderRadius: '9999px',
                backgroundColor: 'var(--cobalt)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '14.5px',
                textDecoration: 'none',
                boxShadow: '0 8px 25px rgba(37, 99, 235, 0.3)',
              }}
            >
              Sign In to Syntaflow →
            </Link>
            <Link
              href="/download"
              style={{
                padding: '12px 24px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                fontWeight: 500,
                fontSize: '14.5px',
                textDecoration: 'none',
              }}
            >
              Learn about Desktop Runtime
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
