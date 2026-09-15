import React, { useState, useEffect } from 'react';

const STAGES = [
  { id: 'client', label: 'Client', sub: 'Relationship & Terms' },
  { id: 'project', label: 'Project', sub: 'Scoped Blueprint' },
  { id: 'document', label: 'Document', sub: 'Immutable Snapshot' },
  { id: 'review', label: 'Review', sub: 'SLA & Feedback' },
  { id: 'approval', label: 'Approval', sub: 'Signed Decision' },
  { id: 'delivery', label: 'Delivery', sub: 'Final Handover' },
];

export const HeroFlowDiagram: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % STAGES.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      role="figure"
      aria-label="Syntaflow continuous lifecycle flow: Client to Project, Document, Review, Approval, and Delivery"
      style={{
        width: '100%',
        maxWidth: '1080px',
        margin: '0 auto',
        padding: 'var(--space-8)',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background ambient lighting */}
      <div
        style={{
          position: 'absolute',
          top: '-50%',
          left: '20%',
          width: '60%',
          height: '100%',
          background: 'radial-gradient(ellipse at center, rgba(37, 99, 235, 0.15) 0%, rgba(0, 212, 255, 0.05) 45%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Header info */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-8)',
          borderBottom: '1px solid var(--color-border-subtle)',
          paddingBottom: 'var(--space-4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-cyan)',
              boxShadow: '0 0 8px var(--color-cyan)',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--color-text-secondary)',
            }}
          >
            Connected Execution Pipeline
          </span>
        </div>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: 'var(--color-text-tertiary)',
          }}
        >
          Single Continuous Record
        </span>
      </div>

      {/* Responsive Stages Pipeline */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: 'var(--space-3)',
          position: 'relative',
        }}
        className="sf-hero-pipeline"
      >
        {STAGES.map((stage, idx) => {
          const isActive = idx === activeIdx;
          const isPassed = idx < activeIdx;

          let borderColor = 'var(--color-border)';
          let bg = 'var(--color-surface-raised)';
          let textColor = 'var(--color-text-secondary)';

          if (isActive) {
            borderColor = 'var(--color-cyan)';
            bg = 'rgba(0, 212, 255, 0.08)';
            textColor = 'var(--color-text-primary)';
          } else if (isPassed) {
            borderColor = 'rgba(37, 99, 235, 0.4)';
            bg = 'rgba(37, 99, 235, 0.04)';
            textColor = 'var(--color-text-primary)';
          }

          return (
            <div
              key={stage.id}
              onClick={() => setActiveIdx(idx)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: 'var(--space-4)',
                backgroundColor: bg,
                border: `1px solid ${borderColor}`,
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                transition: 'all var(--duration-normal) var(--ease-spring)',
                position: 'relative',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    color: isActive ? 'var(--color-cyan)' : 'var(--color-text-tertiary)',
                  }}
                >
                  0{idx + 1}
                </span>
                {isActive && (
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-cyan)',
                    }}
                  />
                )}
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: textColor,
                  marginBottom: '0.25rem',
                }}
              >
                {stage.label}
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--color-text-tertiary)',
                  lineHeight: '1.3',
                }}
              >
                {stage.sub}
              </span>
            </div>
          );
        })}
      </div>

      {/* Active Stage Callout */}
      <div
        style={{
          marginTop: 'var(--space-6)',
          padding: 'var(--space-4) var(--space-6)',
          backgroundColor: 'rgba(8, 11, 15, 0.7)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-cyan)', fontSize: '0.8125rem' }}>
            STATUS: ACTIVE CONTEXT
          </span>
          <span style={{ color: 'var(--color-border-bright)' }}>•</span>
          <span style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>
            Stage {activeIdx + 1} of 6: <strong>{STAGES[activeIdx].label}</strong> preserves decisions for the next milestone.
          </span>
        </div>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: 'var(--color-text-tertiary)',
          }}
        >
          Zero context fragmentation
        </span>
      </div>

      <style>{`
        @media (max-width: 840px) {
          .sf-hero-pipeline {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .sf-hero-pipeline {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
