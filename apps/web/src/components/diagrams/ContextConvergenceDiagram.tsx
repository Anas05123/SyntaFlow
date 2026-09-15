import React from 'react';

export const ContextConvergenceDiagram: React.FC = () => {
  return (
    <div
      role="figure"
      aria-label="Context convergence diagram showing fragmented inputs resolving into one continuous Syntaflow stream"
      style={{
        width: '100%',
        maxWidth: '960px',
        margin: '0 auto',
        padding: 'var(--space-8)',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          gap: 'var(--space-6)',
        }}
        className="sf-convergence-grid"
      >
        {/* Left Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--color-text-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '0.25rem',
            }}
          >
            DISCONNECTED INPUTS
          </div>

          {[
            { label: 'Client Inquiries & Briefs', source: 'Email / Messages' },
            { label: 'Commercial Terms & Scope', source: 'Proposals / Contracts' },
            { label: 'Working Execution Tasks', source: 'Boards & Milestones' },
            { label: 'Deliverables & Revisions', source: 'Drafts & Documents' },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                padding: 'var(--space-3) var(--space-4)',
                backgroundColor: 'var(--color-surface-raised)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                {item.label}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                {item.source}
              </span>
            </div>
          ))}
        </div>

        {/* Center Convergence / Brand Mark */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-4)',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--color-canvas)',
              border: '2px solid var(--color-cobalt)',
              boxShadow: '0 0 24px rgba(37, 99, 235, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--space-3)',
            }}
          >
            <img src="/brand/logo-icon.png" alt="Syntaflow Convergence" width="44" height="44" style={{ objectFit: 'contain' }} />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.875rem',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
            }}
          >
            SYNTA
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              color: 'var(--color-cyan)',
              letterSpacing: '0.04em',
            }}
          >
            SYNTHESIS
          </span>
        </div>

        {/* Right Output Flow */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--color-text-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '0.25rem',
            }}
          >
            CONTINUOUS OUTCOME
          </div>

          {[
            { label: 'Single Canonical Record', desc: 'No state duplication' },
            { label: 'Decoupled 3D Dimensions', desc: 'Stage, Attention, Access' },
            { label: 'Immutable DocVersions', desc: 'Exact snapshot reviews' },
            { label: 'Enforced Delivery Gates', desc: 'Guaranteed sign-off' },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                padding: 'var(--space-3) var(--space-4)',
                backgroundColor: 'rgba(37, 99, 235, 0.08)',
                border: '1px solid rgba(37, 99, 235, 0.3)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                {item.label}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-cyan)' }}>
                {item.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .sf-convergence-grid {
            grid-template-columns: 1fr !important;
            gap: var(--space-6) !important;
          }
        }
      `}</style>
    </div>
  );
};
