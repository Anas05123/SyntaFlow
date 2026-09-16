import React from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { PageHero } from '../../components/marketing/PageHero';
import { Card } from '../../components/ui/Card';
import { StatusBadge, type CapabilityStatus } from '../../components/brand/StatusBadge';
import { CTASection } from '../../components/marketing/CTASection';
import { getRouteMetadata } from '../../seo/seoConfig';

interface SecurityDomain {
  title: string;
  status: CapabilityStatus;
  description: string;
  details: string[];
}

const SECURITY_DOMAINS: SecurityDomain[] = [
  {
    title: '1. Architecture & Sandbox Boundary',
    status: 'AVAILABLE NOW',
    description: 'Syntaflow runs as a sandboxed Electron desktop application with strict multi-process isolation.',
    details: [
      'The renderer UI process has zero Node.js access and no direct filesystem access.',
      'All persistence and OS interactions traverse a strictly typed IPC preload bridge.',
      'Context isolation (contextIsolation: true) and sandboxing (sandbox: true) are strictly enforced.',
    ],
  },
  {
    title: '2. Authentication & Session Protection (OAuth PKCE)',
    status: 'AVAILABLE NOW',
    description: 'Local authentication and external service connections built with modern cryptographic standards.',
    details: [
      'External tool integrations (Google, GitHub) use OAuth 2.0 with PKCE (Proof Key for Code Exchange) via system browser.',
      'Integration credentials and OAuth refresh tokens are encrypted at rest using native OS keychain (Electron safeStorage / DPAPI on Windows).',
      'Local authentication uses memory-hard scrypt hashing with timing-safe comparisons to prevent side-channel attacks.',
    ],
  },
  {
    title: '3. Application Isolation & Window Memory',
    status: 'AVAILABLE NOW',
    description: 'Strict runtime bounds preventing memory leaks, window clipping, and unauthorized reload behaviors.',
    details: [
      'Multi-monitor safe window bounds persistence prevents off-screen launch traps.',
      'Production reload keys (F5, Ctrl+R, Ctrl+Shift+R) disabled in production build.',
      'Single-instance desktop lock prevents database race conditions from concurrent launches.',
    ],
  },
  {
    title: '4. Permissions & Filesystem Access',
    status: 'AVAILABLE NOW',
    description: 'Least-privilege filesystem operations managed strictly through designated OS directories.',
    details: [
      'Workspace data confined to standard user data directories (userData/store.json and database/).',
      'No arbitrary filesystem traversal allowed outside designated project directories.',
      'Local asset links strictly validated before rendering in application surfaces.',
    ],
  },
  {
    title: '5. Local-First SQLite & Data Protection at Rest',
    status: 'AVAILABLE NOW',
    description: 'Client records, proposals, and commercial contracts are stored locally in SQLite on your machine.',
    details: [
      'Local SQLite database serves as the canonical source of truth for all client records, tasks, and deliverables.',
      'Zero outbound cloud telemetry beacons, keystroke logging, or background marketing trackers.',
      'Local database schemas prepared for AES-256 database-level encryption with zero external cloud replication.',
    ],
  },
  {
    title: '6. AI Boundaries & Human Confirmation Gate',
    status: 'AVAILABLE NOW',
    description: 'Assistive intelligence strictly sandboxed behind backend TaskRouter with mandatory human review.',
    details: [
      'UI components never invoke remote LLM endpoints directly; all requests route through typed backend contracts.',
      'Zero autonomous destructive execution: AI drafts cannot send emails, commit code, or approve milestones without explicit human approval.',
      'Zero model training: customer project records and client communications are NEVER used to train foundation models.',
    ],
  },
  {
    title: '7. Auditability & Cryptographic Sign-Off',
    status: 'AVAILABLE NOW',
    description: 'Document review decisions bind to exact byte-level snapshots.',
    details: [
      'Every transmitted DocVersion generates an immutable SHA-256 state hash.',
      'Client approvals record decision-maker identity, timestamp, and turnaround SLA.',
      'Chronological activity log records all state changes, preventing retroactive dispute tampering.',
    ],
  },
  {
    title: '8. Secure Development & Dependency Management',
    status: 'AVAILABLE NOW',
    description: 'Rigorous engineering standards enforced across the repository.',
    details: [
      'Automated linting enforcing strict React and TypeScript security rules.',
      'Zero untyped any variables across IPC contract layers.',
      'Continuous dependency scanning and vulnerability audits via npm and pnpm security checks.',
    ],
  },
  {
    title: '9. Vulnerability Reporting & Responsible Disclosure',
    status: 'AVAILABLE NOW',
    description: 'Coordinated disclosure process for security researchers and developers.',
    details: [
      'Security inquiries and vulnerability reports: security@syntaflow.tech.',
      'Commitment to acknowledging reports within 48 business hours.',
      'Standard 90-day coordinated disclosure policy before public advisories.',
    ],
  },
  {
    title: '10. Availability & Offline Resilience',
    status: 'AVAILABLE NOW',
    description: 'Full functionality without internet dependency.',
    details: [
      'Core workspace operations require zero internet connection.',
      'No SaaS downtime, cloud outages, or maintenance windows can block your client work.',
      '100% operational sovereignty on your physical machine.',
    ],
  },
];

export const SecurityPage: React.FC = () => {
  const meta = getRouteMetadata('/security');

  return (
    <div>
      <SEOHead path="/security" />

      <PageHero
        breadcrumbs={meta.breadcrumbs}
        eyebrow="Trust & Security Architecture"
        title="Security built into the architecture."
        description="We believe in verifiable architecture over marketing claims. Below is the exact, unvarnished state of Syntaflow's security controls, isolation boundaries, and disclosure policies."
        status="AVAILABLE NOW"
      />

      <section className="section">
        <div className="container">
          {/* Transparency Disclaimer */}
          <Card variant="raised" style={{ padding: 'var(--space-28)', marginBottom: 'var(--space-48)', borderLeft: '4px solid var(--cobalt)' }}>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cobalt)', textTransform: 'uppercase', marginBottom: '6px' }}>
              TRANSPARENCY NOTICE
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>
              No Fabricated Compliance Claims
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Syntaflow does not claim formal third-party certifications (such as SOC 2 Type II, ISO 27001, or HIPAA) that have not been formally audited by accredited assessors. Our security guarantee is architectural: your client records never leave your physical workstation.
            </p>
          </Card>

          {/* Security Domains Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
            {SECURITY_DOMAINS.map((domain) => (
              <Card key={domain.title} variant="default" style={{ padding: 'var(--space-32)' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: 'var(--space-12)' }}>
                  <h3 style={{ fontSize: '19px', fontWeight: 600, color: 'var(--text)' }}>
                    {domain.title}
                  </h3>
                  <StatusBadge status={domain.status} size="sm" />
                </div>
                <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 'var(--space-16)' }}>
                  {domain.description}
                </p>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '4px' }}>
                  {domain.details.map((detail) => (
                    <li key={detail} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13.5px', color: 'var(--text-muted)' }}>
                      <span style={{ color: 'var(--cyan)', marginTop: '2px' }}>•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Have a security inquiry or vulnerability report?"
        description="Our team takes security disclosures seriously. Reach out to our engineering team directly."
        primaryLabel="Contact Security Team"
        primaryHref="/contact"
        secondaryLabel="Review Privacy Policy"
        secondaryHref="/privacy"
      />
    </div>
  );
};
