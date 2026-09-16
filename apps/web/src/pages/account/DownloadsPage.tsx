import React, { useState } from 'react';
import { SEOHead } from '../../components/ui/SEOHead';

export const DownloadsPage: React.FC = () => {
  const [downloading, setDownloading] = useState(false);
  const [selectedOS, setSelectedOS] = useState<'windows' | 'macos' | 'linux'>('windows');

  const handleDownload = () => {
    setDownloading(true);
    const link = document.createElement('a');
    link.href = '/downloads/Syntaflow-Setup-0.1.0-preview.4.exe';
    link.download = 'Syntaflow-Setup-0.1.0-preview.4.exe';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloading(false), 3000);
  };

  return (
    <div style={{ maxWidth: '1080px', width: '100%', margin: '0 auto' }}>
      <SEOHead
        title="Downloads — Syntaflow Account"
        description="Download Syntaflow Desktop for Windows 10/11 x64 and explore upcoming platform builds."
        path="/account/downloads"
        indexable={false}
      />

      {/* Header with Title and Platform Switcher */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '2.25rem',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: '#ffffff',
              margin: '0 0 0.5rem 0',
            }}
          >
            Downloads
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'rgba(255, 255, 255, 0.65)', margin: 0 }}>
            Syntaflow Desktop is the core product. The rest of the family stays available here.
          </p>
        </div>

        {/* Platform Switcher Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '9999px',
            padding: '3px',
            gap: '2px',
          }}
        >
          {/* macOS */}
          <button
            type="button"
            onClick={() => setSelectedOS('macos')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '12.5px',
              fontWeight: selectedOS === 'macos' ? 600 : 500,
              color: selectedOS === 'macos' ? '#000000' : 'rgba(255, 255, 255, 0.65)',
              backgroundColor: selectedOS === 'macos' ? '#ffffff' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 1.01-2.87-.96.04-2.09.65-2.73 1.4-.56.64-1.05 1.7-1.01 2.76 1.06.08 2.12-.54 2.73-1.29z" />
            </svg>
            <span>macOS</span>
          </button>

          {/* Windows (Active Default) */}
          <button
            type="button"
            onClick={() => setSelectedOS('windows')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '12.5px',
              fontWeight: selectedOS === 'windows' ? 600 : 500,
              color: selectedOS === 'windows' ? '#000000' : 'rgba(255, 255, 255, 0.65)',
              backgroundColor: selectedOS === 'windows' ? '#ffffff' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
            </svg>
            <span>Windows</span>
          </button>

          {/* Linux */}
          <button
            type="button"
            onClick={() => setSelectedOS('linux')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '12.5px',
              fontWeight: selectedOS === 'linux' ? 600 : 500,
              color: selectedOS === 'linux' ? '#000000' : 'rgba(255, 255, 255, 0.65)',
              backgroundColor: selectedOS === 'linux' ? '#ffffff' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.001 2c-2.4 0-3.9 1.8-3.9 4 0 1.2.5 2.3 1.2 3.1-.3.7-.7 1.5-.7 2.4 0 1.2.4 2.2 1 3-.8.6-1.6 1.6-1.6 2.8 0 2 2.4 3.7 5.1 3.7 2.7 0 5.1-1.7 5.1-3.7 0-1.2-.8-2.2-1.6-2.8.6-.8 1-1.8 1-3 0-.9-.4-1.7-.7-2.4.7-.8 1.2-1.9 1.2-3.1 0-2.2-1.5-4-3.9-4h-.8zm-1.8 3.5c.4 0 .7.3.7.8s-.3.8-.7.8-.7-.3-.7-.8.3-.8.7-.8zm3.6 0c.4 0 .7.3.7.8s-.3.8-.7.8-.7-.3-.7-.8.3-.8.7-.8z" />
            </svg>
            <span>Linux</span>
          </button>
        </div>
      </div>

      {/* Hero Featured Card (Full Width) */}
      <div
        style={{
          width: '100%',
          padding: '2rem 2.5rem',
          borderRadius: '16px',
          backgroundColor: 'rgba(17, 20, 26, 0.95)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), 0 0 30px rgba(59, 130, 246, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.75rem',
          position: 'relative',
          boxSizing: 'border-box',
        }}
      >
        {/* Left: Icon + Description */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', minWidth: '320px', flex: '1 1 auto' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <img
              src="/brand/LogoIcon_WBG.png"
              alt="Syntaflow"
              style={{
                width: '38px',
                height: '38px',
                objectFit: 'contain',
              }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ffffff', margin: 0 }}>
                Syntaflow Desktop
              </h2>
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(59, 130, 246, 0.18)',
                  border: '1px solid rgba(59, 130, 246, 0.35)',
                  color: '#60a5fa',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                }}
              >
                Core
              </span>
            </div>
            <p style={{ fontSize: '13.5px', color: 'rgba(255, 255, 255, 0.7)', margin: '4px 0 6px 0', lineHeight: 1.4 }}>
              The local-first workflow execution engine. Visual canvas, hybrid AI execution, and zero lock-in.
            </p>
            <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.4)' }}>
              Available on macOS, Windows, and Linux
            </div>
          </div>
        </div>

        {/* Right: Download Action */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '11px 24px',
              borderRadius: '9999px',
              backgroundColor: '#ffffff',
              color: '#000000',
              fontSize: '13.5px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)',
              transition: 'all 0.15s ease',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
            </svg>
            <span>{downloading ? 'Starting download...' : 'Download for Windows'}</span>
          </button>
          <span style={{ fontSize: '11.5px', color: 'rgba(255, 255, 255, 0.4)', fontFamily: 'monospace' }}>
            .exe installer
          </span>
        </div>
      </div>

      {/* Secondary Section Header */}
      <div style={{ margin: '2.75rem 0 1rem 0' }}>
        <span
          style={{
            fontSize: '11px',
            fontFamily: 'monospace',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'rgba(255, 255, 255, 0.4)',
            fontWeight: 600,
          }}
        >
          ALSO IN THE FAMILY
        </span>
      </div>

      {/* Stacked Family Platform List */}
      <div
        style={{
          width: '100%',
          borderRadius: '16px',
          backgroundColor: 'rgba(17, 20, 26, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        {/* Row 1: Syntaflow for macOS */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '280px', flex: '1 1 auto' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '11px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: 'rgba(255, 255, 255, 0.8)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 1.01-2.87-.96.04-2.09.65-2.73 1.4-.56.64-1.05 1.7-1.01 2.76 1.06.08 2.12-.54 2.73-1.29z" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '14.5px', fontWeight: 600, color: '#ffffff' }}>Syntaflow for macOS</div>
              <div style={{ fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.55)', marginTop: '2px' }}>
                Native Apple Silicon & Intel build with Keychain security and local models.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
            <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.4)', fontFamily: 'monospace' }}>
              .dmg installer
            </span>
            <span
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '12px',
                fontWeight: 500,
              }}
            >
              macOS only
            </span>
          </div>
        </div>

        {/* Row 2: Syntaflow for Linux */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '280px', flex: '1 1 auto' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '11px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: 'rgba(255, 255, 255, 0.8)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.001 2c-2.4 0-3.9 1.8-3.9 4 0 1.2.5 2.3 1.2 3.1-.3.7-.7 1.5-.7 2.4 0 1.2.4 2.2 1 3-.8.6-1.6 1.6-1.6 2.8 0 2 2.4 3.7 5.1 3.7 2.7 0 5.1-1.7 5.1-3.7 0-1.2-.8-2.2-1.6-2.8.6-.8 1-1.8 1-3 0-.9-.4-1.7-.7-2.4.7-.8 1.2-1.9 1.2-3.1 0-2.2-1.5-4-3.9-4h-.8zm-1.8 3.5c.4 0 .7.3.7.8s-.3.8-.7.8-.7-.3-.7-.8.3-.8.7-.8zm3.6 0c.4 0 .7.3.7.8s-.3.8-.7.8-.7-.3-.7-.8.3-.8.7-.8z" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '14.5px', fontWeight: 600, color: '#ffffff' }}>Syntaflow for Linux</div>
              <div style={{ fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.55)', marginTop: '2px' }}>
                Universal AppImage and tarball for Ubuntu, Debian, Fedora, and Arch.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
            <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.4)', fontFamily: 'monospace' }}>
              .AppImage
            </span>
            <span
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '12px',
                fontWeight: 500,
              }}
            >
              Coming Soon
            </span>
          </div>
        </div>

        {/* Row 3: Syntaflow CLI & Headless Runner */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '280px', flex: '1 1 auto' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '11px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: 'rgba(255, 255, 255, 0.8)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="4 17 10 11 4 5" />
                <line x1="12" y1="19" x2="20" y2="19" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '14.5px', fontWeight: 600, color: '#ffffff' }}>Syntaflow CLI & Headless Runner</div>
              <div style={{ fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.55)', marginTop: '2px' }}>
                Headless workflow execution, cron triggers, and CI/CD pipelines.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
            <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.4)', fontFamily: 'monospace' }}>
              npm / binary
            </span>
            <span
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '12px',
                fontWeight: 500,
              }}
            >
              Coming Soon
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

