import React from 'react';
import { SEOHead } from '../components/seo/SEOHead';
import { PageHero } from '../components/marketing/PageHero';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { CTASection } from '../components/marketing/CTASection';

export const DataHandlingPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Data Handling & Persistence Architecture — Syntaflow"
        description="Local-first persistence architecture, immutable snapshot versioning, clean data export, and SQLite foundation."
      />

      <PageHero
        eyebrow="Security & Trust"
        title="Data Handling & Architecture"
        description="How Syntaflow persists, protects, snapshots, and exports your records. Grounded in local-first storage invariants."
        primaryCta={{ label: 'Explore Security Model', href: '/security' }}
        secondaryCta={{ label: 'View Privacy Commitment', href: '/privacy' }}
      />

      <section className="sf-section">
        <Container>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)', marginBottom: 'var(--space-16)' }}>
            {/* Storage Reality */}
            <Card padding="lg">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-cyan)', fontWeight: 600 }}>
                  STORAGE ARCHITECTURE
                </span>
                <StatusBadge status="AVAILABLE NOW" />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
                Local-First Persistence & SQLite Foundation
              </h3>
              <p style={{ fontSize: '0.9375rem', lineHeight: '1.6', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
                Syntaflow desktop operates on an immutable Context + Reducer state architecture backed by persistent local storage (coredesk.state.v1). Relational joins and full-text index searches execute in-memory with sub-millisecond response times.
              </p>
              <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--color-surface-raised)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--color-cobalt)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-cobalt-hover)', fontWeight: 600 }}>
                  PLANNED SQLITE MIGRATION
                </span>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', margin: '0.25rem 0 0 0' }}>
                  The underlying SQLite schema migrations exist in database/migrations/. Full migration from browser storage to a local embedded SQLite engine is scheduled for an upcoming architectural release to support massive archives and instant binary backups.
                </p>
              </div>
            </Card>

            {/* Immutability Invariant */}
            <Card padding="lg">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-cobalt-hover)', fontWeight: 600 }}>
                  DATA INTEGRITY INVARIANT
                </span>
                <StatusBadge status="AVAILABLE NOW" />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
                DocVersion Immutability
              </h3>
              <p style={{ fontSize: '0.9375rem', lineHeight: '1.6', color: 'var(--color-text-secondary)', margin: 0 }}>
                Documents in Syntaflow maintain an explicit separation between working drafts and submitted snapshots. The moment a document version is submitted to a client for review, it is tagged as an immutable DocVersion snapshot. Any further editing takes place on an incremented working draft (e.g., v1.1). Historical snapshots are never altered, ensuring complete auditability for legal and accounting records.
              </p>
            </Card>

            {/* Export and Portability */}
            <Card padding="lg">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-status-active)', fontWeight: 600 }}>
                  PORTABILITY & EXPORT
                </span>
                <StatusBadge status="AVAILABLE NOW" />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
                Data Portability & Zero Lock-In
              </h3>
              <p style={{ fontSize: '0.9375rem', lineHeight: '1.6', color: 'var(--color-text-secondary)', margin: 0 }}>
                Your data belongs to you. You can export complete client records, project scopes, task boards, and document histories into structured JSON files at any time. If you ever choose to stop using Syntaflow, your historical records remain accessible on your computer forever.
              </p>
            </Card>

            {/* Danger Zone Isolation */}
            <Card padding="lg">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-status-risk)', fontWeight: 600 }}>
                  DELETION CONTROLS
                </span>
                <StatusBadge status="AVAILABLE NOW" />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
                Danger Zone Isolation
              </h3>
              <p style={{ fontSize: '0.9375rem', lineHeight: '1.6', color: 'var(--color-text-secondary)', margin: 0 }}>
                Destructive actions — such as resetting demo data or purging local caches — are strictly sequestered within an explicit Danger Zone inside application Settings. Actions require explicit two-step confirmation to eliminate accidental data loss.
              </p>
            </Card>
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  );
};
