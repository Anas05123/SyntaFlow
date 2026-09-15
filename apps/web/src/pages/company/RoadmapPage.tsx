import React from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { PageHero } from '../../components/marketing/PageHero';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/brand/StatusBadge';
import { CTASection } from '../../components/marketing/CTASection';

interface RoadmapItem {
  title: string;
  category: string;
  status: 'IN DEVELOPMENT' | 'PLANNED';
  timeline: string;
  description: string;
  plannedArchitecture: string[];
}

const ROADMAP_ITEMS: RoadmapItem[] = [
  {
    title: 'Local-First AI Engine Subsystem (TaskRouter & Ollama)',
    category: 'INTELLIGENCE & AI',
    status: 'IN DEVELOPMENT',
    timeline: 'Q4 2026',
    description: 'We have built the foundational TaskRouter package and typed contracts in the monorepo. Current work focuses on wiring local LLM inference (via Ollama at localhost:11434) to automate repetitive administrative scoping and document synthesis without cloud data leakage.',
    plannedArchitecture: [
      'TaskRouter validates and routes requests using typed Zod schemas.',
      'Local Ollama inference ensures client text never leaves the workstation.',
      'Strict operator confirmation: AI can suggest draft sections, never auto-commit state.',
    ],
  },
  {
    title: 'Cloud Guest Review Portal & Web Client Gateway',
    category: 'CLOUD EXTENSIONS',
    status: 'PLANNED',
    timeline: '2027 Direction',
    description: 'While the desktop app remains the canonical operating environment, a cloud-hosted guest portal will allow clients to review immutable DocVersion snapshots with zero software installation, complete with transactional email notifications.',
    plannedArchitecture: [
      'Cryptographic deep-link verification protocol (coredesk://auth/callback).',
      'End-to-end encrypted review payloads signed by the desktop application.',
      'Granular client access permissions table with revocable review tokens.',
    ],
  },
  {
    title: 'Public Developer Platform & Custom Blueprint SDK',
    category: 'DEVELOPER ECOSYSTEM',
    status: 'PLANNED',
    timeline: '2027 Direction',
    description: 'A planned developer platform enabling studios to build custom blueprint scoping generators, export integrations for accounting software, and lifecycle webhook listeners.',
    plannedArchitecture: [
      'Typed TypeScript SDK for custom blueprint definitions.',
      'Local SQLite migration hooks for extended metadata schemas.',
      'Zero remote telemetry: extension code executes strictly in localized worker sandbox.',
    ],
  },
  {
    title: 'macOS and Linux Desktop Builds',
    category: 'PLATFORM RUNTIME',
    status: 'PLANNED',
    timeline: '2027 Direction',
    description: 'Syntaflow is currently optimized for Windows workstations. We plan to compile signed Universal macOS (Apple Silicon & Intel) and AppImage/deb Linux binaries once the Windows desktop preview reaches general availability.',
    plannedArchitecture: [
      'Native macOS Keychain integration via safeStorage.',
      'Unified multi-platform window geometry memory.',
      'Code-signed releases for macOS Gatekeeper and Windows SmartScreen.',
    ],
  },
];

export const RoadmapPage: React.FC = () => {
  return (
    <div>
      <SEOHead
        title="Roadmap & Future Direction — Syntaflow"
        description="Planned engineering directions for Syntaflow: Local AI TaskRouter, Cloud Review Portals, Developer Blueprints, and Cross-Platform Desktop Builds."
        path="/roadmap"
      />

      <PageHero
        eyebrow="Company // What’s Next"
        title="Engineering roadmap & planned direction."
        description="We refuse to market unreleased features as current reality. Below is our honest engineering roadmap, clearly distinguishing in-progress systems from future architectural directions."
      />

      <section className="section">
        <div className="container">
          {/* Truth Disclaimer */}
          <Card variant="raised" style={{ padding: 'var(--space-28)', marginBottom: 'var(--space-48)', borderLeft: '4px solid var(--cyan)' }}>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: '6px' }}>
              ROADMAP DISCIPLINE NOTICE
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>
              Planned Direction vs. Shipped Product
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Per our operating contract, all capabilities below are tagged as `IN DEVELOPMENT` or `PLANNED DIRECTION`. You will not find fake terminal commands, fabricated API documentation, or imaginary SDK code on this website. When a feature ships, it graduates to the verified Product section.
            </p>
          </Card>

          {/* Roadmap Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-32)' }}>
            {ROADMAP_ITEMS.map((item) => (
              <Card key={item.title} variant="default" style={{ padding: 'var(--space-32)' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: 'var(--space-12)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', fontWeight: 600 }}>
                      {item.category}
                    </span>
                    <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)' }}>
                      TARGET: {item.timeline}
                    </span>
                  </div>
                  <StatusBadge status={item.status} size="sm" />
                </div>

                <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: 'var(--space-12)' }}>
                  {item.title}
                </h3>

                <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 'var(--space-20)' }}>
                  {item.description}
                </p>

                <div style={{ padding: '16px', backgroundColor: 'var(--surface-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--edge)' }}>
                  <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)', textTransform: 'uppercase', marginBottom: '8px' }}>
                    PLANNED ARCHITECTURE SPECIFICATION
                  </div>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '4px' }}>
                    {item.plannedArchitecture.map((spec) => (
                      <li key={spec} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                        <span style={{ color: 'var(--cobalt)', marginTop: '2px' }}>›</span>
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Shape the future of client operations."
        description="Share your feedback, feature requests, and workflow pain points directly with our team."
        primaryLabel="Send Feedback"
        primaryHref="#/contact"
        secondaryLabel="Read Product Overview"
        secondaryHref="#/product"
      />
    </div>
  );
};
