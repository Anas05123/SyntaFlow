import React from 'react';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { LifecycleStepper } from '../diagrams/LifecycleStepper';

export const ProductWorkflowSection: React.FC = () => {
  return (
    <section id="workflow" className="sf-section" style={{ backgroundColor: 'var(--color-canvas-subtle)' }}>
      <Container>
        <SectionHeading
          eyebrow="The Full Lifecycle"
          title="From first contact through final delivery."
          description="Syntaflow connects every stage of client engagement into one continuous, living record. Never restart context between tools."
        />

        <LifecycleStepper />
      </Container>
    </section>
  );
};
