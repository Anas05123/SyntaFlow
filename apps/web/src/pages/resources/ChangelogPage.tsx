import React from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { PageHero } from '../../components/marketing/PageHero';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/brand/StatusBadge';
import { CTASection } from '../../components/marketing/CTASection';

const RELEASES = [
  {
    version: '0.1.0-preview.4',
    date: 'September 2026',
    title: 'Review Transmission Studio & Presentation Templates',
    status: 'AVAILABLE NOW' as const,
    highlights: [
      '5-step executive submission studio (ShareSetupScreen) with version snapshot confirmation and decision authority chips.',
      'Three presentation templates: Executive Editorial, Modern Studio, and Enterprise Formal.',
      'One Presentation, Two Shells architecture with token-bound Guest Review portal.',
      'Northlight Studio showcase attachment support with real case studies and metrics.',
    ],
  },
  {
    version: '0.1.0-preview.3',
    date: 'September 2026',
    title: 'Document Studio & Continuous Paper Canvas',
    status: 'AVAILABLE NOW' as const,
    highlights: [
      'Continuous 3-column desktop studio with left outline dots, center paper canvas, and right review rail.',
      'Immutable DocVersion snapshot generation with SHA-256 state hashing.',
      'Live clean/dirty/saving state management with Ctrl+S keyboard shortcut support.',
      'Decoupled document types: Proposal, Brief, Agreement, Scope, Notes, and Deliverable.',
    ],
  },
  {
    version: '0.1.0-preview.2',
    date: 'August 2026',
    title: 'Dual-Density Task Engine & Scoping Blueprints',
    status: 'AVAILABLE NOW' as const,
    highlights: [
      'Dual task views with instant [ Board ] and [ List ] switching.',
      'Responsive density thresholds (compact, regular, and wide modes) preventing column clipping.',
      'Multi-step Blueprint Scoping Studio with Brand Identity, Web Experience, and Retainer templates.',
      'Decoupled 3D status: Production stage and operational attention tracked independently.',
    ],
  },
  {
    version: '0.1.0-preview.1',
    date: 'August 2026',
    title: 'Desktop Shell, Local Auth & Foundation',
    status: 'AVAILABLE NOW' as const,
    highlights: [
      'Frameless Electron desktop runtime with multi-monitor window geometry memory.',
      'Local authentication provider with memory-hard scrypt hashing and timing-safe verification.',
      'Operating system level session encryption via Electron safeStorage (DPAPI).',
      'Operator Cockpit (Home) with 3-column priority hierarchy.',
    ],
  },
];

export const ChangelogPage: React.FC = () => {
  return (
    <div>
      <SEOHead
        title="Changelog & Release Notes — Syntaflow"
        description="Chronological record of verified desktop engine milestones, architectural upgrades, and feature releases for Syntaflow."
        path="/changelog"
      />

      <PageHero
        eyebrow="Resources // Changelog"
        title="Engineering log & releases."
        description="Track the evolution of the Syntaflow desktop operating environment. Every entry represents verified functionality running in our production build."
        status="AVAILABLE NOW"
      />

      <section className="section">
        <div className="container" style={{ maxWidth: '860px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-32)' }}>
            {RELEASES.map((rel) => (
              <Card key={rel.version} variant="default" style={{ padding: 'var(--space-32)' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: 'var(--space-12)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '16px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text)' }}>
                      {rel.version}
                    </span>
                    <span style={{ fontSize: '12.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)' }}>
                      {rel.date}
                    </span>
                  </div>
                  <StatusBadge status={rel.status} size="sm" />
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--cyan)', marginBottom: 'var(--space-16)' }}>
                  {rel.title}
                </h3>

                <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {rel.highlights.map((h) => (
                    <li key={h} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                      <span style={{ color: 'var(--cobalt)', marginTop: '2px' }}>•</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Experience the latest desktop release."
        description="Download the Syntaflow preview for Windows."
        primaryLabel="Explore Desktop Preview"
        primaryHref="#/product"
      />
    </div>
  );
};
