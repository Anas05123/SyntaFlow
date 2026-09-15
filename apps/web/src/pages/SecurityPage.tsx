import React from 'react';
import { SEOHead } from '../components/seo/SEOHead';
import { PageHero } from '../components/marketing/PageHero';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { CTASection } from '../components/marketing/CTASection';

const SECURITY_SECTIONS = [
  {
    title: '1. Architecture & Process Isolation',
    status: 'AVAILABLE NOW' as const,
    points: [
      'Frameless Electron BrowserWindow with strict sandboxing enabled: contextIsolation: true, nodeIntegration: false, sandbox: true.',
      'Renderer process has zero direct access to Node.js, the local filesystem, or system sockets.',
      'All interaction traverses a strictly typed, schema-validated IPC bridge (@coredesk/contracts).',
    ],
  },
  {
    title: '2. Local Authentication & Session Encryption',
    status: 'AVAILABLE NOW' as const,
    points: [
      'Local authentication (LocalAuthProvider) uses scrypt key derivation for password hashing with timing-safe comparison.',
      'Session tokens and credentials are encrypted using OS-native encryption via Electron safeStorage (Windows DPAPI).',
      'Session restore validates stored workspace record existence before routing to prevent stale context injection.',
    ],
  },
  {
    title: '3. Application Sandboxing & Permissions',
    status: 'AVAILABLE NOW' as const,
    points: [
      'External web links open exclusively in the system default browser via validated shell.openExternal calls; external protocols are strictly filtered.',
      'Guest review screens operate on a detached minimal shell without owner workspace chrome or administrative actions.',
      'Non-inherited access grant model: client view access is scoped strictly to specific immutable DocVersion snapshots.',
    ],
  },
  {
    title: '4. Data Protection & Sovereignty',
    status: 'AVAILABLE NOW' as const,
    points: [
      'All commercial data, client records, and document text reside on your local physical machine.',
      'Zero background cloud synchronization or silent telemetry transmission.',
      'Destructive operations (Reset demo state, purge cache) are strictly isolated inside an explicit Settings Danger Zone.',
    ],
  },
  {
    title: '5. AI Processing & Boundary Guarantees',
    status: 'PLANNED DIRECTION' as const,
    points: [
      'Architected for local-first inference via Ollama (packages/ai-engine) connecting to localhost:11434 with zero third-party API exposure.',
      'TaskRouter and ContextBuilder enforce prompt isolation; prompts only receive explicitly bound context.',
      'Currently in specification/contracts phase; UI is not wired to live LLMs in the current v0.1 desktop build.',
    ],
  },
  {
    title: '6. Immutable Auditability',
    status: 'AVAILABLE NOW' as const,
    points: [
      'Submitted document versions (DocVersion) are strictly immutable. Once shared, they cannot be modified in-place.',
      'Client approvals bind to exact version snapshots with reviewer identity, decision status, and timestamp records.',
      'Delivery packages require 100% prerequisite deliverable sign-off before completion gates can be unlocked.',
    ],
  },
  {
    title: '7. Secure Development & Dependency Hygiene',
    status: 'AVAILABLE NOW' as const,
    points: [
      'Strict TypeScript compilation across all packages with zero any leakage.',
      'Fast linting via oxlint enforcing React hook invariants and clean module exports.',
      'Automated headless route and interaction verification harness testing 35/35 application routes and window lifecycles.',
    ],
  },
  {
    title: '8. Vulnerability Reporting & Responsible Disclosure',
    status: 'AVAILABLE NOW' as const,
    points: [
      'We welcome vulnerability reports from security researchers and operators.',
      'Direct reporting channel: security@syntaflow.tech with response acknowledgement within 48 business hours.',
      'We follow coordinated vulnerability disclosure guidelines and do not take legal action against good-faith security research.',
    ],
  },
];

export const SecurityPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Security Architecture & Threat Model — Syntaflow"
        description="Verifiable desktop security: Electron sandboxing, scrypt credential hashing, safeStorage session encryption, and physical machine isolation."
      />

      <PageHero
        eyebrow="Security & Trust"
        title="Security designed into the architecture."
        description="We believe in verifiable technical architecture over marketing claims. Syntaflow is engineered from the operating system up to protect client confidentiality and data sovereignty."
        primaryCta={{ label: 'View Privacy Commitment', href: '/privacy' }}
        secondaryCta={{ label: 'Data Handling Details', href: '/data-handling' }}
      />

      <section className="sf-section">
        <Container>
          {/* Transparent Compliance Statement */}
          <div
            style={{
              padding: 'var(--space-6) var(--space-8)',
              backgroundColor: 'rgba(37, 99, 235, 0.08)',
              border: '1px solid var(--color-cobalt)',
              borderRadius: 'var(--radius-lg)',
              marginBottom: 'var(--space-12)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--color-cyan)', fontSize: '1.125rem' }}>ℹ</span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.0625rem', fontWeight: 700, color: '#ffffff' }}>
                Our Commitment to Truthful Security Claims
              </h3>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: 'var(--color-text-secondary)', margin: 0 }}>
              Syntaflow does not claim SOC 2, ISO 27001, HIPAA, or GDPR formal certifications today because the current product is a local-first desktop application without a multi-tenant cloud backend. Rather than borrowing hollow badges, we document our exact, verifiable technical boundaries below. Every claim is auditable in the repository.
            </p>
          </div>

          {/* Detailed Security Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', marginBottom: 'var(--space-16)' }}>
            {SECURITY_SECTIONS.map((sec, i) => (
              <Card key={i} padding="lg">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.1875rem',
                      fontWeight: 700,
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    {sec.title}
                  </h3>
                  <StatusBadge status={sec.status} />
                </div>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {sec.points.map((p, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.875rem', lineHeight: '1.6', color: 'var(--color-text-secondary)' }}>
                      <span style={{ color: 'var(--color-cyan)', marginTop: '0.125rem' }}>•</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>

          {/* Vulnerability Report Callout */}
          <div
            style={{
              padding: 'var(--space-8)',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              textAlign: 'center',
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
              Found a potential security issue?
            </h3>
            <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', maxWidth: '640px', margin: '0 auto var(--space-6) auto' }}>
              We take security disclosures seriously. If you have identified a vulnerability or privilege boundary violation, please reach out to our security team.
            </p>
            <Button href="mailto:security@syntaflow.tech" variant="primary" size="md">
              Contact security@syntaflow.tech
            </Button>
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  );
};
