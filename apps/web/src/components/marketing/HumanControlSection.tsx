import React from 'react';
import { Card } from '../ui/Card';

const PRINCIPLES = [
  {
    number: '01',
    title: 'Understand Before Acting',
    description: 'The system never initiates state changes, sends emails, or alters records without explicit operator review and initiation.',
  },
  {
    number: '02',
    title: 'Keep Actions Explicit',
    description: 'No black-box automations silently failing in the background. Every operational state transition is visible in your cockpit.',
  },
  {
    number: '03',
    title: 'Preserve History',
    description: 'Working drafts increment forward. Submitted document versions are immutable. You always have cryptographic proof of past agreements.',
  },
  {
    number: '04',
    title: 'Respect Approval Boundaries',
    description: 'Client review spaces only see what you explicitly transmit. Internal scratchpads, private notes, and raw files remain isolated.',
  },
  {
    number: '05',
    title: 'Keep People in Control',
    description: 'Technology should amplify human discernment and domain craft — not obscure work behind synthetic generic wrappers.',
  },
];

export const HumanControlSection: React.FC = () => {
  return (
    <section className="section scroll-reveal" style={{ borderTop: '1px solid var(--edge)', backgroundColor: 'var(--canvas)' }}>
      <div className="container">
        <div style={{ maxWidth: '820px', marginBottom: 'var(--space-48)' }}>
          <div className="eyebrow">Design Philosophy</div>
          <h2 className="heading-1" style={{ marginBottom: 'var(--space-16)' }}>
            Software that preserves human agency.
          </h2>
          <p className="body-large">
            We reject the dogma that professional craft should be delegated to autonomous marketing wrappers. Syntaflow is engineered around five strict agency principles.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--space-20)',
          }}
        >
          {PRINCIPLES.map((p) => (
            <Card key={p.number} variant="default" style={{ padding: 'var(--space-24)' }}>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12.5px',
                  color: 'var(--cyan)',
                  marginBottom: 'var(--space-12)',
                  fontWeight: 600,
                }}
              >
                PRINCIPLE // {p.number}
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text)', marginBottom: 'var(--space-8)' }}>
                {p.title}
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                {p.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
