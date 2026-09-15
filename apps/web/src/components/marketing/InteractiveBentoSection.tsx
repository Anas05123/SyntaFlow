import React, { useState } from 'react';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { GlowCard } from '../ui/GlowCard';

export const InteractiveBentoSection: React.FC = () => {
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  const nodes = [
    { id: 0, label: 'Client Dossier', stage: 'Stage 00-01', desc: 'Single origin record' },
    { id: 1, label: 'Scoped Tasks', stage: 'Stage 02-03', desc: 'Context-linked execution' },
    { id: 2, label: 'Immutable DocVersion', stage: 'Stage 04-05', desc: 'Tamper-evident reviews' },
    { id: 3, label: 'Gated Handover', stage: 'Stage 06', desc: 'Prerequisite verification' },
  ];

  return (
    <section className="sf-section" style={{ position: 'relative' }}>
      <Container>
        <SectionHeading
          eyebrow="ARCHITECTURE OF TRUTH"
          title="Engineered to eliminate fragmentation."
          description="Four foundational systems keeping one continuous, unbroken record of every client engagement — from first contact to final delivery."
          align="center"
        />

        {/* Bento Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: 'var(--space-6)',
            marginTop: 'var(--space-12)',
          }}
        >
          {/* BENTO 1: The Continuous Thread (Spans 8 columns) */}
          <div style={{ gridColumn: 'span 8' }} className="bento-span-8">
            <GlowCard style={{ padding: 'clamp(1.5rem, 3vw, 2.5rem)', height: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      color: 'var(--color-cyan)',
                      marginBottom: 'var(--space-3)',
                    }}
                  >
                    <span className="sf-pulse-dot" />
                    <span>SYSTEM INVARIANT // 01</span>
                  </div>

                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(1.25rem, 2vw, 1.625rem)',
                      fontWeight: 700,
                      color: 'var(--color-text-primary)',
                      marginBottom: 'var(--space-3)',
                    }}
                  >
                    One continuous, unbroken engagement thread.
                  </h3>

                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6, maxWidth: '640px' }}>
                    Traditional workflows scatter client agreements in email, tasks in PM boards, drafts in Google Docs, and approvals in chat. Syntaflow binds every phase to a single persistent SQLite record that never loses context.
                  </p>
                </div>

                {/* Interactive Node Path */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '0.75rem',
                    marginTop: 'var(--space-8)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: 'rgba(8, 11, 15, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                  className="bento-nodes-grid"
                >
                  {nodes.map((node) => {
                    const isHovered = hoveredNode === node.id;
                    return (
                      <div
                        key={node.id}
                        onMouseEnter={() => setHoveredNode(node.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                        style={{
                          padding: '0.75rem',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: isHovered ? 'rgba(0, 212, 255, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                          border: `1px solid ${isHovered ? 'rgba(0, 212, 255, 0.4)' : 'rgba(255, 255, 255, 0.06)'}`,
                          transition: 'all 0.2s ease',
                          cursor: 'pointer',
                        }}
                      >
                        <div
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.6875rem',
                            color: isHovered ? 'var(--color-cyan)' : 'var(--color-text-tertiary)',
                            marginBottom: '0.25rem',
                          }}
                        >
                          {node.stage}
                        </div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                          {node.label}
                        </div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-secondary)', marginTop: '0.125rem' }}>
                          {node.desc}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </GlowCard>
          </div>

          {/* BENTO 2: Immutable DocVersion (Spans 4 columns) */}
          <div style={{ gridColumn: 'span 4' }} className="bento-span-4">
            <GlowCard style={{ padding: 'clamp(1.5rem, 3vw, 2.5rem)', height: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      color: '#A78BFA',
                      marginBottom: 'var(--space-3)',
                    }}
                  >
                    SYSTEM INVARIANT // 02
                  </div>

                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(1.125rem, 1.8vw, 1.375rem)',
                      fontWeight: 700,
                      color: 'var(--color-text-primary)',
                      marginBottom: 'var(--space-3)',
                    }}
                  >
                    Immutable version snapshots.
                  </h3>

                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                    Submitted documents become frozen <code style={{ color: 'var(--color-cyan)', fontFamily: 'var(--font-mono)' }}>DocVersion</code> snapshots. Client reviews bind to exact version state — eliminating silent edits or retro-active disputes.
                  </p>
                </div>

                {/* Simulated Hash Seal Box */}
                <div
                  style={{
                    padding: '0.875rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(8, 11, 15, 0.7)',
                    border: '1px solid rgba(139, 92, 246, 0.25)',
                    marginTop: 'var(--space-6)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#A78BFA', fontWeight: 600 }}>
                      SHA-256 SEAL LOCKED
                    </span>
                    <span style={{ fontSize: '0.6875rem', color: '#10B981', fontWeight: 600 }}>IMMUTABLE</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-secondary)', wordBreak: 'break-all' }}>
                    e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                  </div>
                </div>
              </div>
            </GlowCard>
          </div>

          {/* BENTO 3: Zero-Cloud Sovereign Storage (Spans 4 columns) */}
          <div style={{ gridColumn: 'span 4' }} className="bento-span-4">
            <GlowCard style={{ padding: 'clamp(1.5rem, 3vw, 2.5rem)', height: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      color: '#10B981',
                      marginBottom: 'var(--space-3)',
                    }}
                  >
                    SYSTEM INVARIANT // 03
                  </div>

                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(1.125rem, 1.8vw, 1.375rem)',
                      fontWeight: 700,
                      color: 'var(--color-text-primary)',
                      marginBottom: 'var(--space-3)',
                    }}
                  >
                    Local-first disk sovereignty.
                  </h3>

                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                    Zero server telemetry. 100% offline capability. Your client data, financial estimates, and review logs never traverse third-party multi-tenant servers without explicit instruction.
                  </p>
                </div>

                {/* Simulated Network Monitor */}
                <div
                  style={{
                    padding: '0.875rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(8, 11, 15, 0.7)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    marginTop: 'var(--space-6)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#10B981', fontWeight: 600 }}>
                      OUTBOUND TELEMETRY
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-primary)', fontWeight: 700 }}>
                      0 BYTES
                    </span>
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-tertiary)', marginTop: '0.25rem' }}>
                    Encrypted via OS keychain (DPAPI / safeStorage)
                  </div>
                </div>
              </div>
            </GlowCard>
          </div>

          {/* BENTO 4: Strict Delivery Gate Enforcement (Spans 8 columns) */}
          <div style={{ gridColumn: 'span 8' }} className="bento-span-8">
            <GlowCard style={{ padding: 'clamp(1.5rem, 3vw, 2.5rem)', height: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      color: 'var(--color-cobalt-hover)',
                      marginBottom: 'var(--space-3)',
                    }}
                  >
                    SYSTEM INVARIANT // 04
                  </div>

                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(1.25rem, 2vw, 1.625rem)',
                      fontWeight: 700,
                      color: 'var(--color-text-primary)',
                      marginBottom: 'var(--space-3)',
                    }}
                  >
                    Delivery gates protect client sign-off.
                  </h3>

                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6, maxWidth: '640px' }}>
                    Delivery is never an uncontrolled file drop. Syntaflow enforces programmatic prerequisite gates — verifying that every underlying milestone deliverable is formally approved before generating the tamper-evident delivery package.
                  </p>
                </div>

                {/* Gate Flow Visualizer */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    marginTop: 'var(--space-8)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: 'rgba(8, 11, 15, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    overflowX: 'auto',
                  }}
                  className="bento-gate-flow"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-primary)' }}>
                      Prerequisites Approved
                    </span>
                  </div>

                  <span style={{ color: 'var(--color-cyan)', fontFamily: 'var(--font-mono)' }}>→</span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-cobalt)' }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-primary)' }}>
                      Gate Verified
                    </span>
                  </div>

                  <span style={{ color: 'var(--color-cyan)', fontFamily: 'var(--font-mono)' }}>→</span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-cyan)' }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-cyan)', fontWeight: 700 }}>
                      Tamper-Evident Package Released
                    </span>
                  </div>
                </div>
              </div>
            </GlowCard>
          </div>
        </div>
      </Container>

      {/* Responsive media query for Bento grid */}
      <style>{`
        @media (max-width: 1024px) {
          .bento-span-8, .bento-span-4 {
            grid-column: span 12 !important;
          }
        }
        @media (max-width: 640px) {
          .bento-nodes-grid {
            grid-template-columns: 1fr !important;
          }
          .bento-gate-flow {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
        }
      `}</style>
    </section>
  );
};
