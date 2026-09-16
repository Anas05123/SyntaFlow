import React from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { PageHero } from '../../components/marketing/PageHero';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Link } from '../../components/ui/Link';
import { CTASection } from '../../components/marketing/CTASection';
import { getRouteMetadata } from '../../seo/seoConfig';

export const AIWorkspacePage: React.FC = () => {
  const meta = getRouteMetadata('/product/ai-workspace');

  const aiPillars = [
    {
      title: 'Context Already Attached',
      badge: 'GROUNDING',
      problem: 'Generic AI tools force you to copy-paste client background, scopes, and email threads into a blank chat box every single session.',
      solution: 'Syntaflow AI operates with direct access to the active client record: signed proposals, commercial retainers, recent Gmail correspondence, and past DocVersion snapshots.',
      action: 'Ask AI to draft a project scope or summarize a client meeting—it uses the active engagement context automatically without manual prompt priming.',
    },
    {
      title: 'Local-First TaskRouter Engine',
      badge: 'ARCHITECTURE',
      problem: 'Sending sensitive client contracts and proprietary briefs to public cloud LLMs creates data leakage risks and violation of client NDAs.',
      solution: 'Syntaflow features a modular TaskRouter engine that prioritizes local inference (via Ollama at localhost:11434) running directly on your workstation hardware.',
      action: 'Process client text, extract action items, and synthesize specifications entirely offline on your physical CPU/GPU with zero cloud telemetry.',
    },
    {
      title: 'Strict Operator Confirmation',
      badge: 'GOVERNANCE',
      problem: 'Over-autonomous AI agents make unauthorized changes, send hallucinated emails, or modify project state silently.',
      solution: 'Syntaflow strictly prohibits unverified autonomy. AI operates as a suggestion engine: it drafts text, suggests task breakdowns, and flags scope risks, but cannot commit state.',
      action: 'Every AI suggestion requires manual human confirmation before saving to SQLite, dispatching a review package, or emailing a client.',
    },
    {
      title: 'Granular Integration Access Scopes',
      badge: 'SECURITY',
      problem: 'Connecting AI to email or storage often requires granting unrestricted access to entire personal inboxes and drives.',
      solution: 'Syntaflow filters data ingestion strictly by client email address and project identifiers. The AI never indexes unrelated personal correspondence.',
      action: 'Inspect and control exactly what integrations and data sources the AI engine can access in the Security & Permissions drawer.',
    },
  ];

  return (
    <div>
      <SEOHead path="/product/ai-workspace" />

      <PageHero
        breadcrumbs={meta.breadcrumbs}
        eyebrow="Product // Contextual Intelligence"
        title="AI that starts with context."
        description="Syntaflow grounds AI assistance in your active client records, scoping blueprints, and connected services. Draft specifications, extract task dependencies, and prepare review summaries without re-explaining the client background or leaking proprietary data."
        status="AVAILABLE NOW"
      >
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <Button href="/download" variant="primary">
            Download Syntaflow Preview &rarr;
          </Button>
          <Button href="/security" variant="secondary">
            View Security Architecture &rarr;
          </Button>
        </div>
      </PageHero>

      {/* 1. ARCHITECTURAL COMMITMENT: NO UNRESTRICTED AUTONOMY */}
      <section className="section" style={{ paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-48)' }}>
        <div className="container" style={{ maxWidth: '980px' }}>
          <Card variant="raised" style={{ padding: 'clamp(24px, 4vw, 36px)', backgroundColor: 'var(--surface-raised)', borderLeft: '4px solid var(--cyan)' }}>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: '8px' }}>
              OUR ENGINEERING COMMITMENT // OPERATOR INTEGRITY
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: '10px' }}>
              We do not market magical autonomy. We build grounded leverage.
            </h3>
            <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', lineHeight: 1.65, margin: 0 }}>
              Syntaflow rejects the hype of &ldquo;fully autonomous AI agents&rdquo; running client engagements unsupervised. In professional client services, silent mistakes ruin client trust and destroy margins. Syntaflow uses AI where it genuinely excels: digesting complex correspondence, preparing first-draft scoping blueprints, synthesizing version diffs, and formatting deliverables—always subject to explicit human verification before action.
            </p>
          </Card>
        </div>
      </section>

      {/* 2. THE THREE-STEP PIPELINE: CONTEXT -> INTELLIGENCE -> ACTION */}
      <section className="section" style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-64)', paddingBottom: 'var(--space-64)', backgroundColor: 'var(--canvas)' }}>
        <div className="container" style={{ maxWidth: '1080px' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-44)' }}>
            <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              THREE-STAGE PIPELINE
            </span>
            <h2 className="heading-2" style={{ fontSize: 'clamp(26px, 3.8vw, 36px)', color: 'var(--text)', marginTop: 'var(--space-12)', marginBottom: 'var(--space-12)' }}>
              How context turns into verified action.
            </h2>
            <p style={{ fontSize: '15.5px', color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto' }}>
              A deterministic pipeline that keeps your client data strictly protected while accelerating administrative work.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 'var(--space-24)',
            }}
          >
            <Card variant="raised" style={{ padding: 'var(--space-32)', backgroundColor: 'var(--surface-raised)', borderTop: '3px solid var(--cyan)' }}>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: '8px' }}>
                STAGE 01 // CONTEXT
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: '10px' }}>
                Active Engagement Grounding
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 'var(--space-16)' }}>
                The AI engine queries only data attached to the active client record: signed retainer budgets, email threads with designated contacts, and frozen document snapshots.
              </p>
              <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)' }}>
                Zero cross-client data contamination.
              </div>
            </Card>

            <Card variant="raised" style={{ padding: 'var(--space-32)', backgroundColor: 'var(--surface-raised)', borderTop: '3px solid #3B82F6' }}>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#3B82F6', textTransform: 'uppercase', marginBottom: '8px' }}>
                STAGE 02 // INTELLIGENCE
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: '10px' }}>
                Local TaskRouter Inference
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 'var(--space-16)' }}>
                Inference executes via local Ollama models (e.g., Llama 3, Mistral) on your machine or private encrypted APIs. Typed Zod schemas validate output formats strictly.
              </p>
              <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)' }}>
                Zero training on client correspondence.
              </div>
            </Card>

            <Card variant="raised" style={{ padding: 'var(--space-32)', backgroundColor: 'var(--surface-raised)', borderTop: '3px solid #10B981' }}>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#10B981', textTransform: 'uppercase', marginBottom: '8px' }}>
                STAGE 03 // ACTION
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: '10px' }}>
                Human Confirmation & Release
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 'var(--space-16)' }}>
                Outputs appear as suggested draft sections, proposed task boards, or review package summaries. The operator reviews, edits, and explicitly commits the changes.
              </p>
              <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)' }}>
                Operator retains 100% executive authority.
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 3. FOUR CORE AI WORKSPACE CAPABILITIES */}
      <section className="section" style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-64)', paddingBottom: 'var(--space-64)' }}>
        <div className="container" style={{ maxWidth: '1080px' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-48)' }}>
            <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              ENGINE SPECIFICATIONS
            </span>
            <h2 className="heading-2" style={{ fontSize: 'clamp(26px, 3.8vw, 36px)', color: 'var(--text)', marginTop: 'var(--space-12)', marginBottom: 'var(--space-12)' }}>
              Built for privacy, precision, and verification.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-24)' }}>
            {aiPillars.map((p) => (
              <Card key={p.title} variant="default" style={{ padding: 'var(--space-28)', backgroundColor: 'var(--surface-raised)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {p.badge}
                  </span>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginTop: '8px', marginBottom: 'var(--space-12)' }}>
                    {p.title}
                  </h3>

                  <div style={{ marginBottom: 'var(--space-16)' }}>
                    <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#EF4444', textTransform: 'uppercase', marginBottom: '4px' }}>
                      THE PROBLEM
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                      {p.problem}
                    </p>
                  </div>

                  <div style={{ marginBottom: 'var(--space-16)' }}>
                    <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#10B981', textTransform: 'uppercase', marginBottom: '4px' }}>
                      HOW SYNTAFLOW HELPS
                    </div>
                    <p style={{ fontSize: '13.5px', color: 'var(--text)', lineHeight: 1.5, margin: 0 }}>
                      {p.solution}
                    </p>
                  </div>
                </div>

                <div style={{ padding: '12px 14px', backgroundColor: 'var(--surface-sunken)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    WHAT YOU ACTUALLY DO
                  </div>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                    {p.action}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4. NATURAL CROSS-LINKS */}
      <section className="section" style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-48)', paddingBottom: 'var(--space-48)', backgroundColor: 'var(--canvas)' }}>
        <div className="container" style={{ maxWidth: '980px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: 'var(--space-20)' }}>
            Explore how contextual AI connects across the workspace
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', fontSize: '14px' }}>
            <Link href="/product" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>
              Product System Architecture &rarr;
            </Link>
            <Link href="/product/projects" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>
              Scoping Blueprints & Task Boards &rarr;
            </Link>
            <Link href="/security" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>
              Local SQLite Security & Privacy Charter &rarr;
            </Link>
            <Link href="/integrations" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>
              Connected Tools & OAuth Scopes &rarr;
            </Link>
          </div>
        </div>
      </section>

      <CTASection
        title="Stop copy-pasting client context into isolated chat bots."
        description="Experience AI assistance with active project memory, local inference, and full operator control."
        primaryLabel="Download Syntaflow Preview"
        primaryHref="/download"
        secondaryLabel="Inspect Product Overview"
        secondaryHref="/product"
      />
    </div>
  );
};
