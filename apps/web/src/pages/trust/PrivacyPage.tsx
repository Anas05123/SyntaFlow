import React from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { PageHero } from '../../components/marketing/PageHero';
import { Card } from '../../components/ui/Card';
import { CTASection } from '../../components/marketing/CTASection';

const PRIVACY_PRINCIPLES = [
  {
    title: 'Zero Tracking Cookies & Third-Party Pixels',
    description: 'Our website and application do not load Meta pixels, Google Analytics tracking scripts, or ad surveillance beacons.',
  },
  {
    title: 'Zero Telemetry Leaks',
    description: 'When you create a client profile, write a proposal, or complete a task, zero keystrokes or telemetry data are dispatched to remote servers.',
  },
  {
    title: 'Local Session Sovereignty',
    description: 'Your authentication session is verified locally via scrypt password hashing. We do not maintain a central honeypot of user credentials.',
  },
  {
    title: 'Transparent Client Review Links',
    description: 'When transmitting a review presentation to a client, only the designated document snapshot and attached portfolio case studies are exposed. No internal workspace records are leaked.',
  },
];

export const PrivacyPage: React.FC = () => {
  return (
    <div>
      <SEOHead
        title="Privacy Charter — Syntaflow"
        description="Our privacy commitments: zero tracking beacons, local-first data storage, and complete client confidentiality."
        path="/privacy"
      />

      <PageHero
        eyebrow="Trust // Privacy Charter"
        title="Your client records are not our business model."
        description="Most modern software monetizes your behavioral data, trains AI models on your proposals, or forces you into cloud lock-in. Syntaflow is built on complete data sovereignty."
        status="AVAILABLE NOW"
      />

      <section className="section">
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'var(--space-24)',
            }}
          >
            {PRIVACY_PRINCIPLES.map((p) => (
              <Card key={p.title} variant="default" style={{ padding: 'var(--space-28)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginBottom: 'var(--space-8)' }}>
                  {p.title}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {p.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Data handling you can verify."
        description="Explore how Syntaflow stores, exports, and protects your local SQLite database."
        primaryLabel="Explore Data Handling"
        primaryHref="#/data-handling"
      />
    </div>
  );
};
