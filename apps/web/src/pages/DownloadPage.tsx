import React, { useState } from 'react';
import { SEOHead } from '../components/ui/SEOHead';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const DownloadPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [selectedWaitlist, setSelectedWaitlist] = useState<'mac' | 'linux'>('mac');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  const SHA256_HASH = '9c8cf98f0ec0f8972071f3fd1b2c62cedd0efcfdbb4249a5b6c31049';

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setWaitlistSubmitted(true);
  };

  const copyHash = () => {
    navigator.clipboard.writeText(SHA256_HASH);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div style={{ paddingBottom: 'var(--space-80)', fontFamily: 'var(--font-body)', position: 'relative', overflow: 'hidden' }}>
      <SEOHead
        title="Download Syntaflow — Desktop Preview for Windows, macOS & Linux"
        description="Download Syntaflow for Windows 10/11 x64. Local-first desktop workspace connecting client operations, scoping blueprints, documents, and reviews."
        path="/download"
      />

      {/* Ambient Top Glow Backdrop */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '1200px',
          height: '480px',
          background: 'radial-gradient(ellipse at 50% -10%, rgba(37, 99, 235, 0.18) 0%, rgba(6, 182, 212, 0.08) 35%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Hero Header */}
      <section className="section" style={{ paddingTop: 'var(--space-56)', paddingBottom: 'var(--space-32)', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 14px', borderRadius: '100px', backgroundColor: 'rgba(6, 182, 212, 0.12)', border: '1px solid rgba(6, 182, 212, 0.3)', marginBottom: 'var(--space-16)' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--cyan)' }} className="pulse-glow" />
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              OFFICIAL DESKTOP RUNTIME // v0.1.0-PREVIEW.4
            </span>
          </div>

          <h1 className="heading-1" style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 700, color: 'var(--text)', marginBottom: 'var(--space-16)', letterSpacing: '-0.025em' }}>
            Get Syntaflow for Desktop.
          </h1>

          <p style={{ fontSize: '17px', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '640px', margin: '0 auto' }}>
            A fast, local-first client operating environment designed for high-focus independent professionals, boutique agencies, and studios.
          </p>
        </div>
      </section>

      {/* Primary Download Surface: Windows 64-Bit Showcase */}
      <section className="section" style={{ paddingTop: 0, paddingBottom: 'var(--space-48)', position: 'relative', zIndex: 1 }}>
        <div className="container" style={{ maxWidth: '1040px' }}>
          <Card
            variant="raised"
            style={{
              padding: 'var(--space-40)',
              backgroundColor: 'var(--surface-raised)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              boxShadow: '0 24px 64px -12px rgba(0, 0, 0, 0.8), 0 0 32px -4px rgba(6, 182, 212, 0.15)',
              borderRadius: '16px',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'var(--space-40)', alignItems: 'center' }} className="download-grid-main">
              {/* Left Column: Installer Trigger */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--space-16)' }}>
                  {/* Windows 11 Logo SVG */}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="2" width="9.5" height="9.5" fill="#00A4EF" />
                    <rect x="12.5" y="2" width="9.5" height="9.5" fill="#00A4EF" />
                    <rect x="2" y="12.5" width="9.5" height="9.5" fill="#00A4EF" />
                    <rect x="12.5" y="12.5" width="9.5" height="9.5" fill="#00A4EF" />
                  </svg>
                  <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: '#10B981', letterSpacing: '0.04em', fontWeight: 600 }}>
                    WINDOWS 64-BIT // AVAILABLE NOW
                  </span>
                </div>

                <h2 style={{ fontSize: '26px', fontWeight: 650, color: 'var(--text)', marginBottom: 'var(--space-8)' }}>
                  Syntaflow Desktop Preview (Windows)
                </h2>

                <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 'var(--space-24)' }}>
                  Complete local-first environment with the Operator Cockpit, Blueprint Scoping Studio, Dual-Density Task Boards, Typographic Paper Canvas, and OS-encrypted OAuth Vault.
                </p>

                {/* Primary Download Buttons */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: 'var(--space-24)' }}>
                  <Button
                    variant="primary"
                    href="https://github.com/Anas05123/SyntaFlow/releases"
                    style={{ padding: '14px 28px', fontSize: '15px', fontWeight: 600 }}
                  >
                    ⬇ Download Preview (.exe · 84 MB)
                  </Button>
                  <Button
                    variant="secondary"
                    href="#/docs"
                    style={{ padding: '14px 20px', fontSize: '14px' }}
                  >
                    Installation Guide &rarr;
                  </Button>
                </div>

                {/* System Specs Pills */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)' }}>
                  <div style={{ padding: '8px 12px', backgroundColor: 'var(--canvas)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                    <span>OS:</span> <strong style={{ color: 'var(--text)' }}>Windows 10 / 11 (x64)</strong>
                  </div>
                  <div style={{ padding: '8px 12px', backgroundColor: 'var(--canvas)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                    <span>MEMORY:</span> <strong style={{ color: 'var(--text)' }}>4 GB RAM (8 GB for AI)</strong>
                  </div>
                  <div style={{ padding: '8px 12px', backgroundColor: 'var(--canvas)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                    <span>DATABASE:</span> <strong style={{ color: '#10B981' }}>Local SQLite (Offline)</strong>
                  </div>
                  <div style={{ padding: '8px 12px', backgroundColor: 'var(--canvas)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                    <span>SECURITY:</span> <strong style={{ color: 'var(--cyan)' }}>Windows DPAPI Vault</strong>
                  </div>
                </div>
              </div>

              {/* Right Column: Release Notes & Hash Verifier */}
              <div style={{ backgroundColor: 'var(--canvas)', borderRadius: '12px', padding: 'var(--space-28)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-16)', paddingBottom: 'var(--space-12)', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase' }}>
                    RELEASE HIGHLIGHTS // v0.1.0-PREVIEW.4
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-metadata)' }}>Sept 2026</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', height: 'fit-content' }}>NEW</span>
                    <span><strong>10 Google OAuth Scopes:</strong> Native PKCE manager for Gmail, Google Calendar, Google Docs, Sheets, and Drive.</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(6, 182, 212, 0.15)', color: 'var(--cyan)', height: 'fit-content' }}>CORE</span>
                    <span><strong>Paper Canvas Studio:</strong> Continuous typography scaling, 780px physical layout, and immutable version lock.</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(37, 99, 235, 0.15)', color: '#93C5FD', height: 'fit-content' }}>GATE</span>
                    <span><strong>Delivery Gate Enforcement:</strong> Automated validation preventing package release until prerequisite milestones pass.</span>
                  </div>
                </div>

                {/* SHA-256 Checksum Box */}
                <div style={{ marginTop: 'var(--space-20)', paddingTop: 'var(--space-16)', borderTop: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)' }}>SHA-256 CHECKSUM</span>
                    <button
                      type="button"
                      onClick={copyHash}
                      style={{ background: 'none', border: 'none', color: copiedHash ? '#10B981' : 'var(--cyan)', fontSize: '11px', fontFamily: 'var(--font-mono)', cursor: 'pointer' }}
                    >
                      {copiedHash ? '✓ Copied' : 'Copy Hash'}
                    </button>
                  </div>
                  <code style={{ fontSize: '10.5px', wordBreak: 'break-all', display: 'block', padding: '6px 8px', backgroundColor: 'var(--surface-sunken)', borderRadius: '4px' }}>
                    {SHA256_HASH}
                  </code>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Platform Roadmap: macOS & Linux Cards */}
      <section className="section" style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-56)', position: 'relative', zIndex: 1 }}>
        <div className="container" style={{ maxWidth: '1040px' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-36)' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              CROSS-PLATFORM ROADMAP
            </span>
            <h2 className="heading-2" style={{ fontSize: '26px', color: 'var(--text)', marginTop: '8px' }}>
              macOS & Linux Builds
            </h2>
            <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', maxWidth: '540px', margin: '0 auto' }}>
              Native binaries are currently compiling in our private beta pipeline. Register to be notified upon public release.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-24)', marginBottom: 'var(--space-40)' }}>
            {/* macOS Card */}
            <Card variant="default" style={{ padding: 'var(--space-28)', backgroundColor: 'var(--surface-raised)' }} className="interactive-lift">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-16)' }}>
                {/* Apple Logo SVG */}
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--text)' }}>
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.76 1.06-1.82.94-2.88-.91.04-2.02.61-2.67 1.37-.58.66-1.09 1.74-.95 2.78 1.02.08 2.05-.51 2.68-1.27z" />
                </svg>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'rgba(37, 99, 235, 0.15)', color: '#93C5FD' }}>
                  IN PRIVATE BETA
                </span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>
                macOS (Apple Silicon & Intel)
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, margin: '0 0 var(--space-16) 0' }}>
                Universal binary (.dmg) optimized for M1/M2/M3/M4 and Intel chips with Apple Keychain encryption.
              </p>
              <Button
                variant="secondary"
                onClick={() => setSelectedWaitlist('mac')}
                style={{ width: '100%', textAlign: 'center', fontSize: '13px' }}
              >
                Join macOS Waitlist &rarr;
              </Button>
            </Card>

            {/* Linux Card */}
            <Card variant="default" style={{ padding: 'var(--space-28)', backgroundColor: 'var(--surface-raised)' }} className="interactive-lift">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-16)' }}>
                {/* Linux Terminal / Penguin Icon */}
                <span style={{ fontSize: '24px' }}>🐧</span>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#FCD34D' }}>
                  IN DEVELOPMENT
                </span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>
                Linux (.deb & AppImage)
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, margin: '0 0 var(--space-16) 0' }}>
                Stand-alone AppImage and Debian packages utilizing Secret Service API credential isolation.
              </p>
              <Button
                variant="secondary"
                onClick={() => setSelectedWaitlist('linux')}
                style={{ width: '100%', textAlign: 'center', fontSize: '13px' }}
              >
                Join Linux Waitlist &rarr;
              </Button>
            </Card>
          </div>

          {/* Waitlist Input Bar */}
          <div style={{ maxWidth: '540px', margin: '0 auto', padding: 'var(--space-28)', backgroundColor: 'var(--surface-raised)', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center' }}>
            {waitlistSubmitted ? (
              <div style={{ color: '#10B981', fontSize: '14px', fontWeight: 600 }}>
                ✓ You&rsquo;re registered! We&rsquo;ll notify you the moment the {selectedWaitlist === 'mac' ? 'macOS' : 'Linux'} build goes live.
              </div>
            ) : (
              <form onSubmit={handleWaitlist}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>
                  Register for {selectedWaitlist === 'mac' ? 'macOS' : 'Linux'} notification:
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <input
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ flex: 1, padding: '10px 14px', borderRadius: '6px', backgroundColor: 'var(--canvas)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '13px', outline: 'none' }}
                  />
                  <Button variant="primary" type="submit" style={{ padding: '10px 18px', fontSize: '13px' }}>
                    Notify Me
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
