import React, { useState } from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { Button } from '../../components/ui/Button';

export const DownloadsPage: React.FC = () => {
  const [downloading, setDownloading] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  const checksum = '9c8cf98f0ec0f8972071f3fd1b2c62cedd0efcfdbb4249a5b6c31049';

  const handleDownload = () => {
    setDownloading(true);
    // Trigger download of release artifact or binary
    const link = document.createElement('a');
    link.href = '/downloads/Syntaflow-Setup-0.1.0-preview.4.exe';
    link.download = 'Syntaflow-Setup-0.1.0-preview.4.exe';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloading(false), 3000);
  };

  const copyHash = () => {
    navigator.clipboard.writeText(checksum);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div>
      <SEOHead
        title="Downloads & Desktop Runtime — Syntaflow Account"
        description="Download Syntaflow Desktop for Windows 10/11 x64 and explore preview runtime specs."
        path="/account/downloads"
        indexable={false}
      />

      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.025em', color: '#ffffff', margin: '0 0 0.5rem 0' }}>
          Desktop Downloads
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 }}>
          Syntaflow is a high-speed, local-first client operating environment. Install the desktop application to begin.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '850px' }}>
        {/* Windows Featured Card */}
        <div
          style={{
            padding: '2.5rem',
            borderRadius: '16px',
            backgroundColor: 'rgba(17, 20, 26, 0.95)',
            border: '1px solid rgba(0, 242, 254, 0.35)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0, 242, 254, 0.08)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Ambient light behind the card icon */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              width: '120px',
              height: '120px',
              background: 'radial-gradient(circle, rgba(0, 242, 254, 0.25) 0%, transparent 70%)',
              filter: 'blur(30px)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(0, 242, 254, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 25px rgba(0, 242, 254, 0.25)',
                  position: 'relative',
                }}
              >
                <img
                  src="/brand/LogoIcon_WBG.png"
                  alt="Syntaflow Logo"
                  style={{
                    width: '40px',
                    height: '40px',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 4px 12px rgba(0, 242, 254, 0.45))',
                  }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                    Syntaflow for Windows
                  </h2>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(0, 242, 254, 0.15)',
                      border: '1px solid rgba(0, 242, 254, 0.3)',
                      color: '#00f2fe',
                      fontSize: '11px',
                      fontWeight: 600,
                    }}
                  >
                    Preview
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Windows 10 / 11 (64-bit) · Version 0.1.0-preview.4 · 84 MB
                </div>
              </div>
            </div>

            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleDownload}
              style={{
                backgroundColor: 'var(--cobalt)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: 600,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>{downloading ? 'Downloading...' : 'Download for Windows (.exe)'}</span>
            </Button>
          </div>

          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.75rem', position: 'relative', zIndex: 1 }}>
            Complete local-first client operating environment featuring the Operator Cockpit, Blueprint Scoping Studio, Typographic Paper Canvas, Dual-Density Task Boards, and native DPAPI Credential Vault.
          </p>

          {/* Metadata Specs Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px',
              padding: '1rem',
              borderRadius: '10px',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              marginBottom: '1.5rem',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Operating System</div>
              <div style={{ fontSize: '13px', color: '#ffffff', fontWeight: 500, marginTop: '2px' }}>Windows 10 / 11 x64</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Database Engine</div>
              <div style={{ fontSize: '13px', color: '#34d399', fontWeight: 500, marginTop: '2px' }}>Local SQLite (Offline)</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Memory Footprint</div>
              <div style={{ fontSize: '13px', color: '#ffffff', fontWeight: 500, marginTop: '2px' }}>4 GB RAM (8 GB for AI)</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Security Vault</div>
              <div style={{ fontSize: '13px', color: '#00f2fe', fontWeight: 500, marginTop: '2px' }}>Windows DPAPI Hardware</div>
            </div>
          </div>

          {/* SHA-256 Checksum Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              borderRadius: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.04)',
              fontSize: '12px',
              color: 'var(--text-tertiary)',
              flexWrap: 'wrap',
              gap: '8px',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 600 }}>SHA-256:</span>
              <span style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                {checksum.slice(0, 32)}...
              </span>
            </div>
            <button
              type="button"
              onClick={copyHash}
              style={{
                background: 'none',
                border: 'none',
                color: '#00f2fe',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 500,
                padding: 0,
              }}
            >
              {copiedHash ? '✓ Copied' : 'Copy Hash'}
            </button>
          </div>
        </div>

        {/* macOS & Linux Upcoming Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          <div
            style={{
              padding: '1.5rem',
              borderRadius: '14px',
              backgroundColor: 'rgba(17, 20, 26, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff' }}>Syntaflow for macOS</div>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Coming Later</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Apple Silicon (M1/M2/M3/M4) and Intel builds with Keychain credential storage are currently in roadmap testing.
            </p>
          </div>

          <div
            style={{
              padding: '1.5rem',
              borderRadius: '14px',
              backgroundColor: 'rgba(17, 20, 26, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff' }}>Syntaflow for Linux</div>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Coming Later</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              AppImage and deb builds with Secret Service API integration are planned following GA.
            </p>
          </div>
        </div>

        {/* Installation Instructions */}
        <div
          style={{
            padding: '1.75rem',
            borderRadius: '14px',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#ffffff', marginTop: 0, marginBottom: '1rem' }}>
            Installation Guide
          </h3>
          <ol style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            <li>Download the Windows installer (.exe) above.</li>
            <li>Run the installer and complete the setup wizard.</li>
            <li>Launch Syntaflow from your Start Menu.</li>
            <li>Click <strong>Sign in with browser</strong> to authorize your desktop client with your account.</li>
            <li>Approve the connection in your browser — the desktop app connects instantly.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
