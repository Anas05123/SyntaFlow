import React from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { Link } from '../../components/ui/Link';

export const DesktopConnectPage: React.FC = () => {
  return (
    <div>
      <SEOHead
        title="Desktop Connection & Browser Sign-In — Syntaflow Account"
        description="Connect and authorize Syntaflow Desktop using secure browser authentication."
        path="/account/desktop"
        indexable={false}
      />

      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.025em', color: '#ffffff', margin: '0 0 0.5rem 0' }}>
          Desktop Connection
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 }}>
          Syntaflow Desktop uses cryptographic browser-based authorization to link your local workspace with your account identity.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '750px' }}>
        {/* Connection Status Card */}
        <div
          style={{
            padding: '2rem',
            borderRadius: '14px',
            backgroundColor: 'rgba(17, 20, 26, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(37, 99, 235, 0.15)',
                  border: '1px solid rgba(0, 242, 254, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00f2fe" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>

              <div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff' }}>Syntaflow Desktop Client</div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>Windows 10 / 11 Runtime</div>
              </div>
            </div>

            <span
              style={{
                padding: '4px 10px',
                borderRadius: '12px',
                backgroundColor: 'rgba(0, 242, 254, 0.1)',
                border: '1px solid rgba(0, 242, 254, 0.3)',
                color: '#00f2fe',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              Ready to Pair
            </span>
          </div>

          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            To sign into your desktop app, open Syntaflow on your Windows PC and click <strong>"Sign in with browser"</strong>. Your browser will open an approval window to securely transmit a one-time authorization token back to your local client.
          </p>

          <Link
            href="/auth/desktop?redirect_uri=http%3A%2F%2F127.0.0.1%3A5173%2Fcallback&state=manual_test"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '8px',
              backgroundColor: 'var(--cobalt)',
              color: '#ffffff',
              fontSize: '13.5px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <span>Open Desktop Authorization Test</span>
            <span>→</span>
          </Link>
        </div>

        {/* How Browser Login Works */}
        <div
          style={{
            padding: '2rem',
            borderRadius: '14px',
            backgroundColor: 'rgba(17, 20, 26, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#ffffff', marginTop: 0, marginBottom: '1.25rem' }}>
            Browser Login Architecture (PKCE & Security)
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'rgba(0, 242, 254, 0.15)', color: '#00f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>
                1
              </div>
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#ffffff' }}>Local Loopback Listener</div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Desktop starts an ephemeral loopback HTTP server on 127.0.0.1 and creates a high-entropy state nonce.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'rgba(0, 242, 254, 0.15)', color: '#00f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>
                2
              </div>
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#ffffff' }}>Browser Authorization</div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Your authenticated browser session confirms your identity without exposing your master account password to desktop storage.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'rgba(0, 242, 254, 0.15)', color: '#00f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>
                3
              </div>
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#ffffff' }}>One-Time Handshake & DPAPI Vault</div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  The short-lived code is redeemed once and the active session is encrypted via the OS-native Windows DPAPI vault.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
