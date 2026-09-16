import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

const SECURITY_POINTS = [
  {
    title: 'Zero Outbound Telemetry',
    detail: 'Your client records, commercial numbers, and proposals reside on your local machine. Syntaflow runs no background tracking beacons.',
  },
  {
    title: 'Local-First Canonical Storage',
    detail: 'Persisted in an encrypted local database. You retain 100% data sovereignty with instant JSON/SQLite export capabilities.',
  },
  {
    title: 'Electron Sandboxing & OS Keychain',
    detail: 'Renderer processes operate in context-isolated sandboxes with zero Node.js filesystem access. Sessions are encrypted via native OS safeStorage.',
  },
];

export const SecuritySummarySection: React.FC = () => {
  return (
    <section className="section scroll-reveal" style={{ borderTop: '1px solid var(--edge)', backgroundColor: 'var(--surface-subtle)' }}>
      <div className="container">
        <div style={{ maxWidth: '820px', marginBottom: 'var(--space-48)' }}>
          <div className="eyebrow">Trust & Data Sovereignty</div>
          <h2 className="heading-1" style={{ marginBottom: 'var(--space-16)' }}>
            Built for work that matters.
          </h2>
          <p className="body-large">
            We don&apos;t make unverified compliance claims. Our security model is rooted in architecture: local execution, application sandboxing, and complete physical ownership of your client records.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--space-20)',
            marginBottom: 'var(--space-40)',
          }}
        >
          {SECURITY_POINTS.map((pt) => (
            <Card key={pt.title} variant="default" style={{ padding: 'var(--space-24)' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--active)',
                  marginBottom: 'var(--space-16)',
                }}
              />
              <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text)', marginBottom: 'var(--space-8)' }}>
                {pt.title}
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                {pt.detail}
              </p>
            </Card>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Button href="/security" variant="secondary">
            Read Security Architecture & Data Handling →
          </Button>
        </div>
      </div>
    </section>
  );
};
