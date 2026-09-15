import React from 'react';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { ContextConvergenceDiagram } from '../diagrams/ContextConvergenceDiagram';

export const CoreIdeaSection: React.FC = () => {
  return (
    <section className="sf-section">
      <Container>
        <SectionHeading
          eyebrow="The Core Idea"
          title="One continuous working context."
          description="People, information, documents, decisions, and actions converging into Syntaflow — and continuing toward outcome."
        />

        {/* Brand Name Explanation & Convergence Diagram */}
        <ContextConvergenceDiagram />

        {/* 3 Core Architecture Pillars */}
        <div
          className="sf-grid-3"
          style={{
            marginTop: 'var(--space-12)',
            gap: 'var(--space-6)',
          }}
        >
          <div
            style={{
              padding: 'var(--space-6)',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--color-cyan)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 'var(--space-3)',
              }}
            >
              SYNTHESIS
            </div>
            <h4
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.125rem',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-2)',
              }}
            >
              Single Canonical Record
            </h4>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: 'var(--color-text-secondary)', margin: 0 }}>
              One living file anchors each client relationship. Tasks, documents, reviews, and agreements are projections of this record — eliminating duplicate data entry.
            </p>
          </div>

          <div
            style={{
              padding: 'var(--space-6)',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--color-cobalt-hover)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 'var(--space-3)',
              }}
            >
              CONTINUITY
            </div>
            <h4
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.125rem',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-2)',
              }}
            >
              Decoupled 3D Dimensions
            </h4>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: 'var(--color-text-secondary)', margin: 0 }}>
              Production stage (To Do / In Progress / Done), operational attention (Waiting / Blocked / Overdue), and security access remain strictly decoupled.
            </p>
          </div>

          <div
            style={{
              padding: 'var(--space-6)',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--color-status-active)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 'var(--space-3)',
              }}
            >
              OUTCOME
            </div>
            <h4
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.125rem',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-2)',
              }}
            >
              Immutable Audit Trails
            </h4>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: 'var(--color-text-secondary)', margin: 0 }}>
              Submitted document versions are immutable. Client reviews and approvals bind to exact snapshot states, providing an indisputable delivery record.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};
