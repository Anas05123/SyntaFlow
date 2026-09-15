import React from 'react';
import { Link } from '../../router/Router';
import { SyntaflowLogo } from '../brand/SyntaflowLogo';
import { FOOTER_NAV } from '../../content/navData';

export const SiteFooter: React.FC = () => {
  return (
    <footer
      role="contentinfo"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        paddingTop: 'var(--space-16)',
        paddingBottom: 'var(--space-12)',
        marginTop: 'auto',
      }}
    >
      <div className="sf-container">
        {/* Main Columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr repeat(5, 1fr)',
            gap: 'var(--space-8)',
            marginBottom: 'var(--space-16)',
          }}
          className="sf-footer-grid"
        >
          {/* Brand Col */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <SyntaflowLogo height={28} />
            <p
              style={{
                fontSize: '0.875rem',
                lineHeight: '1.6',
                color: 'var(--color-text-secondary)',
                maxWidth: '280px',
              }}
            >
              The desktop operating environment for connected client work. Keeping one living record from first contact to final delivery.
            </p>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--color-text-tertiary)',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-status-active)',
                }}
              />
              <span>Desktop Engine v0.1 • Windows 10/11</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4
              style={{
                fontSize: '0.8125rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 'var(--space-4)',
              }}
            >
              Product
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {FOOTER_NAV.product.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--color-text-secondary)',
                      transition: 'color var(--duration-fast)',
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions Links */}
          <div>
            <h4
              style={{
                fontSize: '0.8125rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 'var(--space-4)',
              }}
            >
              Solutions
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {FOOTER_NAV.solutions.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--color-text-secondary)',
                      transition: 'color var(--duration-fast)',
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Security Links */}
          <div>
            <h4
              style={{
                fontSize: '0.8125rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 'var(--space-4)',
              }}
            >
              Security
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {FOOTER_NAV.security.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--color-text-secondary)',
                      transition: 'color var(--duration-fast)',
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4
              style={{
                fontSize: '0.8125rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 'var(--space-4)',
              }}
            >
              Company
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {FOOTER_NAV.company.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--color-text-secondary)',
                      transition: 'color var(--duration-fast)',
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4
              style={{
                fontSize: '0.8125rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 'var(--space-4)',
              }}
            >
              Resources
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {FOOTER_NAV.resources.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--color-text-secondary)',
                      transition: 'color var(--duration-fast)',
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Legal, Domain, Copyright */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-4)',
            paddingTop: 'var(--space-8)',
            borderTop: '1px solid var(--color-border)',
            fontSize: '0.8125rem',
            color: 'var(--color-text-tertiary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <span>&copy; {new Date().getFullYear()} Syntaflow. All rights reserved.</span>
            <span style={{ color: 'var(--color-border-bright)' }}>•</span>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>syntaflow.tech</span>
            <span style={{ color: 'var(--color-border-bright)' }}>•</span>
            <span style={{ fontStyle: 'italic' }}>&ldquo;From context to action.&rdquo;</span>
          </div>

          {/* Legal Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            {FOOTER_NAV.legal.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  color: 'var(--color-text-secondary)',
                  transition: 'color var(--duration-fast)',
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .sf-footer-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .sf-footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
};
