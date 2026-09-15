import React from 'react';
import { SEOHead } from '../components/seo/SEOHead';
import { PageHero } from '../components/marketing/PageHero';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ROADMAP_ITEMS } from '../content/roadmapData';
import { CTASection } from '../components/marketing/CTASection';

export const RoadmapPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Roadmap & Product Direction — Syntaflow"
        description="Our transparent technical direction: from our current local-first desktop foundation to planned AI TaskRouter pipelines, autonomous agents, and developer APIs."
      />

      <PageHero
        eyebrow="Product Horizon"
        title="What's Next: Direction & Architecture"
        description="Software fragmented work. AI made intelligence available. But AI without context still starts from zero. Here is how Syntaflow connects context with future execution."
        badge="PLANNED DIRECTION"
      />

      <section className="sf-section">
        <Container>
          {/* Narrative introduction */}
          <div
            style={{
              padding: 'var(--space-8)',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              marginBottom: 'var(--space-16)',
            }}
          >
            <div style={{ maxWidth: '820px' }}>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8125rem',
                  color: 'var(--color-cyan)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: 'var(--space-2)',
                }}
              >
                THE ARCHITECTURAL SHIFT
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--fs-h2)',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--space-4)',
                }}
              >
                From isolated chatbots to continuous context pipelines.
              </h2>
              <p style={{ fontSize: '1rem', lineHeight: '1.65', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                Every popular AI assistant today operates inside an ephemeral chat window. You copy a prompt, paste a messy wall of background notes, and ask for an output. If you close the tab, the context disappears. If you start a new task tomorrow, you start from zero.
              </p>
              <p style={{ fontSize: '1rem', lineHeight: '1.65', color: 'var(--color-text-secondary)', margin: 0 }}>
                Syntaflow is taking a fundamentally different path: <strong>build the structured operating environment first</strong>. Today, Syntaflow preserves your clients, tasks, proposals, and approvals in one living record. As we connect local AI models (Ollama TaskRouter), the intelligence will already have the complete, verified context of your engagement. Below is our phased technical progression.
              </p>
            </div>
          </div>

          {/* Roadmap Phase Timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)', marginBottom: 'var(--space-16)' }}>
            {ROADMAP_ITEMS.map((item, idx) => (
              <Card key={idx} padding="lg">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        color: 'var(--color-cyan)',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                      }}
                    >
                      {item.stage}
                    </span>
                    <span style={{ color: 'var(--color-border-bright)' }}>•</span>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-tertiary)' }}>{item.tagline}</span>
                  </div>
                  <StatusBadge status={item.status} />
                </div>

                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.375rem',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--space-3)',
                  }}
                >
                  {item.title}
                </h3>

                <p
                  style={{
                    fontSize: '0.9375rem',
                    lineHeight: '1.65',
                    color: 'var(--color-text-secondary)',
                    marginBottom: 'var(--space-6)',
                    maxWidth: '880px',
                  }}
                >
                  {item.narrative}
                </p>

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
                  Architectural Deliverables
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '0.5rem',
                  }}
                >
                  {item.deliverables.map((deliv, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '0.5rem 0.75rem',
                        backgroundColor: 'var(--color-surface-raised)',
                        border: '1px solid var(--color-border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8125rem',
                        color: 'var(--color-text-secondary)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.5rem',
                      }}
                    >
                      <span style={{ color: item.status === 'AVAILABLE NOW' ? 'var(--color-status-active)' : 'var(--color-cyan)' }}>
                        {item.status === 'AVAILABLE NOW' ? '✓' : '○'}
                      </span>
                      <span>{deliv}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          {/* Planned Architecture Diagram (Prose & Technical Invariant) */}
          <div
            style={{
              padding: 'var(--space-8)',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--color-status-planned)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 'var(--space-2)',
              }}
            >
              FUTURE PIPELINE SPECIFICATION
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-4)',
              }}
            >
              Planned AI Architecture: TaskRouter & PromptRegistry
            </h3>
            <p style={{ fontSize: '0.9375rem', lineHeight: '1.65', color: 'var(--color-text-secondary)', maxWidth: '840px', marginBottom: 'var(--space-6)' }}>
              In packages/ai-engine, we have specified the technical contracts for future AI execution. Unlike conversational wrappers, requests route through a deterministic TaskRouter that validates schemas with Zod, constructs isolated context from verified project records, and runs against local-first models via Ollama.
            </p>

            <div
              style={{
                padding: 'var(--space-4)',
                backgroundColor: 'var(--color-canvas)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8125rem',
                color: 'var(--color-text-secondary)',
                lineHeight: '1.8',
              }}
            >
              [User Intent] → [TaskRouter Validation] → [ContextBuilder Snapshot] → [PromptRegistry: coredesk.foundation.*] → [Local Ollama Inference] → [Validated Schema Output] → [User Explicit Review]
            </div>
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  );
};
