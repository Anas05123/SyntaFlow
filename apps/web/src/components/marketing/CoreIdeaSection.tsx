import React from 'react';
import { Card } from '../ui/Card';

const CONTEXT_PILLARS = [
  {
    title: 'Single Canonical Record',
    description: 'One persistent record exists for every engagement. Cockpit, boards, and document studios are projections of the exact same data.',
  },
  {
    title: 'Immutable Version Snapshots',
    description: 'Submitted documents (DocVersion) are strictly immutable. Further edits occur only on incremented working drafts.',
  },
  {
    title: 'Decoupled 3D Status Model',
    description: 'Production stage, operational attention, and security access are tracked independently — never collapsed into a single status field.',
  },
];

export const CoreIdeaSection: React.FC = () => {
  return (
    <section className="section scroll-reveal" style={{ backgroundColor: 'var(--surface-subtle)', borderTop: '1px solid var(--edge)' }}>
      <div className="container">
        <div style={{ maxWidth: '820px', marginBottom: 'var(--space-48)' }}>
          <div className="eyebrow">The Operating Principle</div>
          <h2 className="heading-1" style={{ marginBottom: 'var(--space-16)' }}>
            One continuous working context.
          </h2>
          <p className="body-large">
            Instead of synchronizing five SaaS tools with fragile webhooks, Syntaflow keeps the full thread of client intent, agreed terms, execution tasks, and approved deliverables in a single local workspace.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'var(--space-24)',
          }}
        >
          {CONTEXT_PILLARS.map((pillar, idx) => (
            <Card key={pillar.title} variant="default" style={{ padding: 'var(--space-32)' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--cobalt-subtle)',
                  color: 'var(--cobalt)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  fontWeight: 700,
                  marginBottom: 'var(--space-16)',
                }}
              >
                0{idx + 1}
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginBottom: 'var(--space-8)' }}>
                {pillar.title}
              </h3>
              <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                {pillar.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
