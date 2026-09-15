import React from 'react';
import { Card } from '../ui/Card';

export interface FeatureItem {
  tag: string;
  title: string;
  description: string;
  invariant?: string;
  bullets?: string[];
  visual: React.ReactNode;
  reversed?: boolean;
}

export const FeatureRail: React.FC<FeatureItem> = ({
  tag,
  title,
  description,
  invariant,
  bullets,
  visual,
  reversed = false,
}) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'var(--space-12)',
        alignItems: 'center',
        paddingTop: 'var(--space-12)',
        paddingBottom: 'var(--space-12)',
        borderBottom: '1px solid var(--color-border-subtle)',
      }}
      className={`sf-feature-rail ${reversed ? 'sf-feature-rail-reversed' : ''}`}
    >
      {/* Narrative Column */}
      <div style={{ order: reversed ? 2 : 1 }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--color-cyan)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            display: 'inline-block',
            marginBottom: 'var(--space-2)',
          }}
        >
          {tag}
        </span>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--fs-h3)',
            lineHeight: 'var(--lh-h3)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--space-3)',
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: 'var(--fs-body)',
            lineHeight: '1.65',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--space-4)',
          }}
        >
          {description}
        </p>

        {invariant && (
          <div
            style={{
              padding: 'var(--space-3) var(--space-4)',
              backgroundColor: 'rgba(37, 99, 235, 0.08)',
              borderLeft: '3px solid var(--color-cobalt)',
              borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
              marginBottom: 'var(--space-4)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                color: 'var(--color-cobalt-hover)',
                fontWeight: 600,
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '0.125rem',
              }}
            >
              System Invariant
            </span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-primary)', lineHeight: '1.45' }}>
              {invariant}
            </span>
          </div>
        )}

        {bullets && (
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            {bullets.map((b, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                <span style={{ color: 'var(--color-cyan)', fontSize: '0.75rem' }}>•</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Visual Column */}
      <div style={{ order: reversed ? 1 : 2 }}>
        <Card padding="md" style={{ backgroundColor: 'var(--color-surface)', overflow: 'hidden' }}>
          {visual}
        </Card>
      </div>

      <style>{`
        @media (max-width: 840px) {
          .sf-feature-rail {
            grid-template-columns: 1fr !important;
            gap: var(--space-6) !important;
          }
          .sf-feature-rail > div {
            order: 1 !important;
          }
        }
      `}</style>
    </div>
  );
};
