import React from 'react';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';

const PRINCIPLES = [
  {
    num: '01',
    title: 'Understand before acting.',
    description: 'The system renders dependencies, prerequisite blockers, and commercial terms explicitly before actions are executed. No silent assumptions.',
  },
  {
    num: '02',
    title: 'Keep actions explicit.',
    description: 'Transitions — such as submitting a proposal, closing a milestone, or delivering a package — require deliberate operator confirmation with visual previews.',
  },
  {
    num: '03',
    title: 'Preserve exact history.',
    description: 'Submitted document versions (DocVersion) are strictly immutable. Decisions made by clients remain bound to the exact snapshot reviewed.',
  },
  {
    num: '04',
    title: 'Respect approval boundaries.',
    description: 'Final delivery packages enforce prerequisite deliverable approval gates. The system protects your commercial integrity by preventing premature delivery.',
  },
  {
    num: '05',
    title: 'Keep people in control.',
    description: 'Software should augment human agency, not displace it. Operators retain full sovereignty over their records, files, clients, and execution flow.',
  },
];

export const HumanControlSection: React.FC = () => {
  return (
    <section className="sf-section">
      <Container>
        <SectionHeading
          eyebrow="Design Philosophy"
          title="Engineered for human control."
          description="Syntaflow is designed to increase human agency through structured software — providing radical clarity without automation theater."
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'var(--space-6)',
          }}
        >
          {PRINCIPLES.map((p) => (
            <Card key={p.num} padding="lg">
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: 'var(--color-cyan)',
                  marginBottom: 'var(--space-3)',
                }}
              >
                PRINCIPLE {p.num}
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.1875rem',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--space-3)',
                }}
              >
                {p.title}
              </h3>
              <p
                style={{
                  fontSize: '0.9375rem',
                  lineHeight: '1.6',
                  color: 'var(--color-text-secondary)',
                  margin: 0,
                }}
              >
                {p.description}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};
