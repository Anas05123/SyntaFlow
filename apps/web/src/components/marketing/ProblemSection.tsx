import React from 'react';
import { Card } from '../ui/Card';

const PROBLEMS = [
  {
    code: '01',
    title: 'Ephemeral Client Messages',
    detail: 'Scope shifts, commercial agreements, and critical approvals get lost across email chains and chat channels with no persistent audit anchor.',
  },
  {
    code: '02',
    title: 'Disconnected Task Boards',
    detail: 'Tasks live in generic project trackers separated from the underlying proposal, signed brief, and real deliverable requirements.',
  },
  {
    code: '03',
    title: 'Mutating Cloud Documents',
    detail: 'Shared live documents get edited in place, destroying historical context. When disputes arise, no one has proof of what was actually agreed upon.',
  },
  {
    code: '04',
    title: 'Ungated Delivery Handovers',
    detail: 'Final files get sent before prerequisite reviews are signed off, exposing studios to scope creep and unpaid revisions.',
  },
];

export const ProblemSection: React.FC = () => {
  return (
    <section className="section scroll-reveal" style={{ borderTop: '1px solid var(--edge)' }}>
      <div className="container">
        <div style={{ maxWidth: '780px', marginBottom: 'var(--space-48)' }}>
          <div className="eyebrow">The Structural Flaw</div>
          <h2 className="heading-1" style={{ marginBottom: 'var(--space-16)' }}>
            Work became fragmented.
          </h2>
          <p className="body-large">
            Professional services are trapped across five disconnected browser tabs. Every context switch between email, tasks, docs, and storage leaks decisions, time, and revenue.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 'var(--space-20)',
          }}
        >
          {PROBLEMS.map((item) => (
            <Card key={item.code} variant="default" style={{ padding: 'var(--space-24)' }}>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  color: 'var(--cyan)',
                  marginBottom: 'var(--space-12)',
                  fontWeight: 600,
                }}
              >
                FAULT // {item.code}
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text)', marginBottom: 'var(--space-8)' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                {item.detail}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
