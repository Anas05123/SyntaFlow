import React from 'react';
import { SEOHead } from '../components/seo/SEOHead';
import { PageHero } from '../components/marketing/PageHero';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { CTASection } from '../components/marketing/CTASection';

export const AboutPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="About Syntaflow — Mission, Philosophy, and Craft"
        description="Our mission is to reduce the distance between intention and execution by building intelligent, connected software that keeps context in flow."
      />

      <PageHero
        eyebrow="Company"
        title="We think work should remember."
        description="Syntaflow was founded on a simple observation: modern software fragmented human attention into six disconnected silos. We are building technology that connects context with execution."
      />

      <section className="sf-section">
        <Container size="narrow">
          {/* Narrative Story */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)', marginBottom: 'var(--space-16)' }}>
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--fs-h2)',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--space-4)',
                }}
              >
                The Origin of Syntaflow
              </h2>
              <p style={{ fontSize: '1.0625rem', lineHeight: '1.7', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                Over the past decade, software promised to streamline business. Instead, it atomized work. Messages ended up in email. Tasks migrated to kanban boards. Documents lived in cloud drives. Commercial terms stayed buried in PDFs. Every time an operator sat down to deliver a client project, they had to spend the first twenty minutes reconnecting what was decided, who approved it, and what version was real.
              </p>
              <p style={{ fontSize: '1.0625rem', lineHeight: '1.7', color: 'var(--color-text-secondary)' }}>
                We believe connected context is the prerequisite for intelligent execution. When context stays intact, momentum builds naturally. That is why we built Syntaflow — from <strong>SYNTA</strong> (synthesis: uniting people, terms, and records) and <strong>FLOW</strong> (continuous motion toward an outcome).
              </p>
            </div>

            {/* Mission & Purpose */}
            <div className="sf-grid-2" style={{ gap: 'var(--space-6)' }}>
              <Card padding="lg">
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-cyan)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                  OUR MISSION
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>
                  Reduce the distance between intention and execution.
                </h3>
                <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: 'var(--color-text-secondary)', margin: 0 }}>
                  We eliminate the operational friction of switching tools, recovering lost decisions, and reconstructing historical briefs so professionals can focus entirely on craft.
                </p>
              </Card>

              <Card padding="lg">
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-cobalt-hover)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                  OUR PURPOSE
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>
                  Increase human agency through intelligent software.
                </h3>
                <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: 'var(--color-text-secondary)', margin: 0 }}>
                  We do not build software to replace human judgment or obscure operations behind automated black boxes. We build structured systems that give operators complete control.
                </p>
              </Card>
            </div>

            {/* Core Values */}
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>
                Core Values
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
                {[
                  { title: 'Continuity', desc: 'Preserve state across sessions, views, and project stages.' },
                  { title: 'Clarity', desc: 'Explicit boundaries and decoupled dimensions over ambiguous status.' },
                  { title: 'Agency', desc: 'Operators remain sovereign over their records, files, and actions.' },
                  { title: 'Craft', desc: 'High typographic hierarchy, dense information architecture, and zero fluff.' },
                ].map((v, idx) => (
                  <div key={idx} style={{ padding: 'var(--space-4)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-cyan)', marginBottom: '0.25rem' }}>{v.title}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>{v.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  );
};
