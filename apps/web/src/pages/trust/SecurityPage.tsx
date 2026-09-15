import React from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { PageHero } from '../../components/marketing/PageHero';
import { Card } from '../../components/ui/Card';
import { StatusBadge, type CapabilityStatus } from '../../components/brand/StatusBadge';
import { CTASection } from '../../components/marketing/CTASection';

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
    title: '2. Authentication & Session Protection',
    status: 'AVAILABLE NOW',
    description: 'Local authentication built with industry-standard cryptographic algorithms.',
    details: [
      'Passwords hashed using memory-hard scrypt with unique salt per user.',
      'Timing-safe cryptographic comparison prevents side-channel timing attacks.',
      'Active session tokens encrypted at rest via native OS keychain (Electron safeStorage / DPAPI on Windows).',
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
    title: '5. Data Protection & Encryption at Rest',
    status: 'AVAILABLE NOW',
    description: 'Client records, proposals, and commercial contracts are stored locally on your machine.',
    details: [
      'Zero outbound cloud telemetry beacons or marketing tracking scripts.',
      'Local SQLite schemas prepared for AES-256 database-level encryption.',
      'Sensitive session keys protected by operating system hardware/DPAPI encryption.',
    ],
  },
  {
    title: '6. AI Boundaries & TaskRouter Isolation',
    status: 'PLANNED',
    description: 'Forward-looking AI integration strictly sandboxed behind the backend TaskRouter.',
    details: [
      'UI components never invoke remote LLM endpoints directly.',
      'All AI requests route through typed Zod contracts in @coredesk/contracts.',
      'Designed for local-first Ollama runtime (http://localhost:11434) with zero cloud model leakage.',
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
      'Automated linting via Oxlint enforcing React and TypeScript security rules.',
      'Zero untyped any variables across IPC contract layers.',
      'Regular automated dependency vulnerability audits via pnpm audit.',
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
  return (
    <div>
      <SEOHead
        title="Security & Trust Architecture — Syntaflow"
        description="Detailed security architecture, authentication cryptography, application sandboxing, and responsible disclosure for Syntaflow."
        path="/security"
      />

      <PageHero
        eyebrow="Trust & Security Architecture"
        title="Security engineered into the runtime."
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
        primaryHref="#/contact"
        secondaryLabel="Review Privacy Policy"
        secondaryHref="#/privacy"
      />
    </div>
  );
};
