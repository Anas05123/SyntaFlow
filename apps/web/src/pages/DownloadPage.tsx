import React, { useState } from 'react';
import { SEOHead } from '../components/ui/SEOHead';
import { Link } from '../components/ui/Link';
import { useAuth } from '../services/auth/AuthContext';

export const DownloadPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [copiedHash, setCopiedHash] = useState(false);

  const SHA256_HASH = '9c8cf98f0ec0f8972071f3fd1b2c62cedd0efcfdbb4249a5b6c31049';

  const copyHash = () => {
    navigator.clipboard.writeText(SHA256_HASH);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div style={{ paddingBottom: '5rem', fontFamily: 'var(--font-sans, -apple-system, sans-serif)', position: 'relative', overflow: 'hidden' }}>
      <SEOHead path="/download" />

      {/* Ambient Top Glow Backdrop */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '1200px',
          height: '450px',
          background: 'radial-gradient(ellipse at 50% -10%, rgba(37, 99, 235, 0.18) 0%, rgba(0, 242, 254, 0.08) 40%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Hero Header */}
      <section style={{ paddingTop: '4rem', paddingBottom: '2.5rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 14px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(0, 242, 254, 0.1)',
              border: '1px solid rgba(0, 242, 254, 0.3)',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#00f2fe' }} />
            <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#00f2fe', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
              OFFICIAL DESKTOP RUNTIME // v0.1.0-PREVIEW.4
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.25rem)', fontWeight: 700, color: '#ffffff', marginBottom: '1rem', letterSpacing: '-0.025em' }}>
            Get Syntaflow for Desktop.
          </h1>

          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '640px', margin: '0 auto' }}>
            A fast, local-first client operating environment designed for high-focus independent professionals, boutique agencies, and studios.
          </p>
        </div>
      </section>

      {/* Featured Windows Card */}
      <section style={{ paddingBottom: '3.5rem', position: 'relative', zIndex: 1 }}>
        <div className="container" style={{ maxWidth: '1080px' }}>
          <div
            style={{
              backgroundColor: 'rgba(17, 20, 26, 0.95)',
              borderRadius: '16px',
              border: '1px solid rgba(0, 242, 254, 0.3)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0, 242, 254, 0.08)',
              padding: '2.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2.5rem',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Left Column: Installer Trigger */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '1.25rem' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(0, 242, 254, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 20px rgba(0, 242, 254, 0.2)',
                    flexShrink: 0,
                  }}
                >
                  <img
                    src="/brand/LogoIcon_WBG.png"
                    alt="Syntaflow Logo"
                    style={{
                      width: '34px',
                      height: '34px',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 3px 10px rgba(0, 242, 254, 0.45))',
                    }}
                  />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', fontFamily: 'monospace', textTransform: 'uppercase', color: '#10b981', letterSpacing: '0.04em', fontWeight: 600 }}>
                      WINDOWS 64-BIT // AVAILABLE NOW
                    </span>
                  </div>
                  <h2 style={{ fontSize: '1.625rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                    Syntaflow Desktop Preview (Windows)
                  </h2>
                </div>
              </div>

              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                Complete local-first environment with the Operator Cockpit, Blueprint Scoping Studio, Dual-Density Task Boards, Typographic Paper Canvas, and OS-encrypted OAuth Vault.
              </p>

              {/* Primary Action: Logged In vs Logged Out */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '1.75rem' }}>
                {isAuthenticated ? (
                  <Link
                    href="/account/downloads"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '13px 28px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--cobalt)',
                      color: '#ffffff',
                      fontSize: '14.5px',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    <span>Go to Downloads & Install</span>
                    <span>→</span>
                  </Link>
                ) : (
                  <Link
                    href="/login?returnTo=/account/downloads"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '13px 28px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--cobalt)',
                      color: '#ffffff',
                      fontSize: '14.5px',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    <span>Sign in to download</span>
                    <span>→</span>
                  </Link>
                )}

                <Link
                  href="/docs"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '13px 20px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#ffffff',
                    fontSize: '14px',
                    textDecoration: 'none',
                  }}
                >
                  Installation Guide →
                </Link>
              </div>
            </div>

            {/* Right Column: Release Highlights */}
            <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.35)', borderRadius: '12px', padding: '1.75rem', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={{ fontSize: '11.5px', fontFamily: 'monospace', color: '#00f2fe', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                  RELEASE HIGHLIGHTS // v0.1.0-PREVIEW.4
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontFamily: 'monospace' }}>Sept 2026</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontSize: '10px', fontFamily: 'monospace', fontWeight: 700 }}>
                      NEW
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>10 Google OAuth Scopes</span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    Native PKCE manager for Gmail, Google Calendar, Google Docs, Sheets, and Drive.
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(0, 242, 254, 0.15)', color: '#00f2fe', fontSize: '10px', fontFamily: 'monospace', fontWeight: 700 }}>
                      CORE
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>Paper Canvas Studio</span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    Continuous typography scaling, 780px physical layout, and immutable version lock.
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(37, 99, 235, 0.15)', color: '#93c5fd', fontSize: '10px', fontFamily: 'monospace', fontWeight: 700 }}>
                      GATE
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>Delivery Gate Enforcement</span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    Automated validation preventing package release until prerequisite milestones pass.
                  </p>
                </div>
              </div>

              {/* Checksum */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-tertiary)' }}>
                <span>SHA-256: {SHA256_HASH.slice(0, 20)}...</span>
                <button
                  type="button"
                  onClick={copyHash}
                  style={{ background: 'none', border: 'none', color: '#00f2fe', cursor: 'pointer', fontSize: '11px', padding: 0 }}
                >
                  {copiedHash ? '✓ Copied' : 'Copy Hash'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* macOS & Linux Upcoming Section */}
      <section style={{ paddingBottom: '4rem', position: 'relative', zIndex: 1 }}>
        <div className="container" style={{ maxWidth: '1080px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              CROSS-PLATFORM ROADMAP
            </span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', marginTop: '0.5rem' }}>
              macOS & Linux Builds
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div style={{ padding: '1.75rem', borderRadius: '14px', backgroundColor: 'rgba(17, 20, 26, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff' }}>macOS (Apple Silicon & Intel)</div>
                <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Coming Later</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Universal binary with macOS Keychain integration is currently passing notarization benchmarks.
              </p>
            </div>

            <div style={{ padding: '1.75rem', borderRadius: '14px', backgroundColor: 'rgba(17, 20, 26, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff' }}>Linux (x86_64)</div>
                <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Coming Later</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                AppImage and Debian package builds with Secret Service API integration will follow GA release.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
