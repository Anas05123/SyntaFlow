import React from 'react';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';

const PROBLEMS = [
  {
    num: '01',
    title: 'Messages live in email.',
    detail: 'Client constraints, budget approvals, and urgent feedback get scattered across individual inboxes and chat threads, isolated from the active work.',
  },
  {
    num: '02',
    title: 'Tasks live in project tools.',
    detail: 'Task boards track checkboxes without the commercial agreements, client briefs, or underlying context that explains why the work exists.',
  },
  {
    num: '03',
    title: 'Documents lose their decisions.',
    detail: 'Proposals and deliverables are stored as static files. The reasoning, reviewer commentary, and revision context vanish the moment a draft is saved.',
  },
  {
    num: '04',
    title: 'Reviews lose their versions.',
    detail: 'Clients provide feedback on outdated PDF attachments while your team edits newer drafts, causing revision loops and misaligned deliverables.',
  },
];

export const ProblemSection: React.FC = () => {
  return (
    <section
      className="sf-section"
      style={{
        backgroundColor: 'var(--color-canvas-subtle)',
        borderTop: '1px solid var(--color-border-subtle)',
        borderBottom: '1px solid var(--color-border-subtle)',
      }}
    >
      <Container>
        <SectionHeading
          eyebrow="The Problem"
          title="Work became fragmented."
          description="Every engagement starts with high intention. Then the tools take over, dividing context across six different silos."
        />

        <div className="sf-grid-2" style={{ gap: 'var(--space-6)', marginBottom: 'var(--space-12)' }}>
          {PROBLEMS.map((prob) => (
            <Card key={prob.num} padding="lg">
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: 'var(--color-cobalt)',
                  marginBottom: 'var(--space-3)',
                }}
              >
                PROBLEM {prob.num}
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--space-3)',
                }}
              >
                {prob.title}
              </h3>
              <p
                style={{
                  fontSize: '0.9375rem',
                  lineHeight: '1.6',
                  color: 'var(--color-text-secondary)',
                  margin: 0,
                }}
              >
                {prob.detail}
              </p>
            </Card>
          ))}
        </div>

        {/* The Toll Callout */}
        <div
          style={{
            maxWidth: '820px',
            margin: '0 auto',
            textAlign: 'center',
            padding: 'var(--space-6) var(--space-8)',
            backgroundColor: 'rgba(37, 99, 235, 0.06)',
            border: '1px solid rgba(37, 99, 235, 0.25)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.125rem',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              lineHeight: '1.5',
              margin: 0,
            }}
          >
            Time gets spent reconnecting information instead of moving work forward.
          </p>
        </div>
      </Container>
    </section>
  );
};
