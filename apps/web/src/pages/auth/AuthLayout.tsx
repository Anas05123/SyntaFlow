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
        backgroundColor: 'var(--canvas)',
        color: 'var(--text)',
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
          padding: 'clamp(2.5rem, 5vw, 4rem)',
          position: 'relative',
          backgroundColor: 'var(--surface-contrast)',
          color: 'var(--text-contrast)',
          borderRight: '1px solid var(--border-contrast)',
          overflow: 'hidden',
        }}
      >
        {/* Top Logo */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            <BrandMark variant="full" size="md" textColor="#FFFFFF" />
          </Link>
        </div>

        {/* Center Brand Statement & Flow Graphic */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '520px', margin: 'auto 0' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '5px 14px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(41, 196, 232, 0.12)',
              border: '1px solid rgba(41, 196, 232, 0.3)',
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--cyan)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '1.5rem',
              fontFamily: 'var(--font-mono)',
            }}
          >
            Connected Client Operating Environment
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              color: '#FFFFFF',
              marginBottom: '1.25rem',
            }}
          >
            Work moves better when context stays connected.
          </h2>

          <p
            style={{
              fontSize: '1.05rem',
              lineHeight: 1.62,
              color: 'var(--text-contrast-muted)',
              marginBottom: '2.5rem',
            }}
          >
            Syntaflow keeps the context, history, and decisions behind every client engagement in one continuous desktop record — from first contact to final delivery.
          </p>

          {/* Connected record highlights */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              padding: '18px 20px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '13px',
              color: 'var(--text-contrast)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: 'var(--mint)', fontWeight: 700 }}>✓</span>
              <span>100% Local-First SQLite Persistence</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: 'var(--cyan)', fontWeight: 700 }}>✓</span>
              <span>Immutable DocVersion Cryptographic Snapshots</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: 'var(--cobalt)', fontWeight: 700 }}>✓</span>
              <span>Prerequisite Delivery Gate Enforcement</span>
            </div>
          </div>
        </div>

        {/* Bottom Legal / Version */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', gap: '20px', fontSize: '12px', color: 'var(--text-contrast-metadata)' }}>
          <span>© {new Date().getFullYear()} Syntaflow Systems</span>
          <Link href="/privacy" style={{ color: 'var(--text-contrast-metadata)', textDecoration: 'none' }}>Privacy</Link>
          <Link href="/terms" style={{ color: 'var(--text-contrast-metadata)', textDecoration: 'none' }}>Terms</Link>
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
          backgroundColor: 'var(--canvas)',
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
          className="paper-card"
          style={{
            width: '100%',
            maxWidth: '440px',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-card)',
            padding: '2.5rem 2rem',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.625rem', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
              {title}
            </h1>
            {subtitle && (
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
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
              color: 'var(--text-muted)',
              textDecoration: 'none',
              transition: 'color var(--transition-fast)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--cobalt)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
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
