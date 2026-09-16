import React from 'react';
import { BrandMark } from '../../components/brand/BrandMark';
import { Link } from '../../components/ui/Link';

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ title, subtitle, children }) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        backgroundColor: '#08090b',
        color: 'var(--text-primary)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Left / Brand Showcase Column (Desktop Only) */}
      <div
        className="auth-brand-panel"
        style={{
          flex: '1 1 50%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '3rem',
          position: 'relative',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'linear-gradient(135deg, #090b10 0%, #0d1117 100%)',
          overflow: 'hidden',
        }}
      >
        {/* Ambient atmospheric glow in brand panel */}
        <div
          style={{
            position: 'absolute',
            top: '30%',
            left: '30%',
            width: '450px',
            height: '450px',
            background: 'radial-gradient(circle, rgba(0, 242, 254, 0.12) 0%, rgba(37, 99, 235, 0.08) 50%, transparent 75%)',
            filter: 'blur(70px)',
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        />

        {/* Top Logo */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            <BrandMark variant="full" size="md" />
          </Link>
        </div>

        {/* Center Brand Statement & Flow Graphic */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '520px', margin: 'auto 0' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 12px',
              borderRadius: '20px',
              backgroundColor: 'rgba(0, 242, 254, 0.08)',
              border: '1px solid rgba(0, 242, 254, 0.25)',
              fontSize: '11px',
              fontWeight: 600,
              color: '#00f2fe',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '1.5rem',
            }}
          >
            Connected Workspace OS
          </div>

          <h2
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              marginBottom: '1.25rem',
            }}
          >
            Work moves better when context stays connected.
          </h2>

          <p
            style={{
              fontSize: '1rem',
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
              marginBottom: '2rem',
            }}
          >
            Syntaflow unifies commercial terms, scoping blueprints, document reviews, and gate handovers into one local-first operating record.
          </p>

          {/* Minimal live pulse indicator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '12px',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#00f2fe',
                boxShadow: '0 0 10px #00f2fe',
                animation: 'pulse 2s infinite',
              }}
            />
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Local-first SQLite · Zero data scraping · Native DPAPI Vault
            </span>
          </div>
        </div>

        {/* Bottom Legal / Version */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', gap: '20px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
          <span>© {new Date().getFullYear()} Syntaflow Systems</span>
          <Link href="/privacy" style={{ color: 'var(--text-tertiary)', textDecoration: 'none' }}>Privacy</Link>
          <Link href="/terms" style={{ color: 'var(--text-tertiary)', textDecoration: 'none' }}>Terms</Link>
        </div>
      </div>

      {/* Right / Auth Form Column */}
      <div
        style={{
          flex: '1 1 50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1.5rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Mobile Header (Shown on small screens) */}
        <div className="auth-mobile-header" style={{ display: 'none', marginBottom: '2rem', textAlign: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            <BrandMark variant="full" size="md" />
          </Link>
        </div>

        {/* Centered Auth Card */}
        <div
          style={{
            width: '100%',
            maxWidth: '440px',
            backgroundColor: 'rgba(17, 20, 26, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '2.5rem 2rem',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
            <h1 style={{ fontSize: '1.625rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
              {title}
            </h1>
            {subtitle && (
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                {subtitle}
              </p>
            )}
          </div>

          {children}
        </div>

        {/* Back to website button */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link
            href="/"
            style={{
              fontSize: '13px',
              color: 'var(--text-tertiary)',
              textDecoration: 'none',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#00f2fe')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-tertiary)')}
          >
            ← Back to syntaflow.tech
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .auth-brand-panel { display: none !important; }
          .auth-mobile-header { display: block !important; }
        }
      `}</style>
    </div>
  );
};
