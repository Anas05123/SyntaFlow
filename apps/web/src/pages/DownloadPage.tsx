import React from 'react';
import { SEOHead } from '../components/seo/SEOHead';
import { PageHero } from '../components/marketing/PageHero';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const DownloadPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Download Syntaflow Desktop (v0.1 Preview) — Windows 10/11"
        description="Download the official Syntaflow desktop operating environment for Windows. 100% offline, local-first, with zero telemetry."
      />

      <PageHero
        eyebrow="Release Distribution"
        title="Download Syntaflow Desktop"
        description="Experience a continuous operating environment for client work. Free preview standalone release for Windows 10 and 11 (64-bit)."
      />

      <section className="sf-section">
        <Container size="narrow">
          <Card padding="lg" style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'rgba(37, 99, 235, 0.12)',
                border: '1px solid var(--color-cobalt)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-4) auto',
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
              Syntaflow Desktop for Windows
            </h2>
            <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
              Version 0.1.0-preview • 64-bit Architecture • Electron + React 19 Engine
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: 'var(--space-6)' }}>
              <Button
                href="#"
                variant="primary"
                size="lg"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Syntaflow Preview Distribution: In development repositories, launch using Launch-CoreDesk.bat or run "npm run desktop" at root.');
                }}
              >
                Download for Windows (.exe / .zip)
              </Button>
            </div>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
              Windows 10 / Windows 11 • Node.js v20+ or Standalone Electron Runtime
            </div>
          </Card>

          {/* System Requirements & Verification Details */}
          <div className="sf-grid-2" style={{ gap: 'var(--space-6)' }}>
            <Card padding="md">
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
                System Requirements
              </h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                <li>• OS: Windows 10 (1809+) or Windows 11 (64-bit)</li>
                <li>• Display: 1280×720 minimum (1440×900+ recommended)</li>
                <li>• Memory: 4 GB RAM minimum (8 GB recommended)</li>
                <li>• Storage: 250 MB free disk space</li>
              </ul>
            </Card>

            <Card padding="md">
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
                Developer Launch (Monorepo)
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                If you have cloned the Syntaflow repository locally, you can launch the desktop application directly:
              </p>
              <pre style={{ padding: '0.5rem', backgroundColor: 'var(--color-canvas)', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-cyan)', overflowX: 'auto' }}>
                Launch-CoreDesk.bat
              </pre>
            </Card>
          </div>
        </Container>
      </section>
    </>
  );
};
