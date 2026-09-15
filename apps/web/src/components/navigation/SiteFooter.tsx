import React from 'react';
import { BrandMark } from '../brand/BrandMark';
import { FOOTER_COLUMNS } from '../../content/navData';

export const SiteFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: 'var(--surface)',
        borderTop: '1px solid var(--edge)',
        paddingTop: 'var(--space-64)',
        paddingBottom: 'var(--space-48)',
        marginTop: 'var(--space-80)',
      }}
    >
      <div className="container">
        {/* Top Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 'var(--space-40)',
            marginBottom: 'var(--space-64)',
          }}
        >
          {/* Brand Column */}
          <div style={{ gridColumn: 'span 2', maxWidth: '340px' }}>
            <a href="#/" style={{ display: 'inline-block', marginBottom: 'var(--space-16)' }}>
              <BrandMark variant="full" size="md" />
            </a>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 'var(--space-16)' }}>
              The desktop-first client engagement environment. Keeping one continuous, connected record of every client relationship — from first contact through final delivery.
            </p>
            <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)' }}>
              Domain: syntaflow.tech
            </div>
          </div>

          {/* Links Columns */}
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <div
                style={{
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--text)',
                  marginBottom: 'var(--space-16)',
                }}
              >
                {col.title}
              </div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
                {col.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={`#${link.href}`}
                      style={{
                        fontSize: '13.5px',
                        color: 'var(--text-muted)',
                        textDecoration: 'none',
                        transition: 'color var(--transition-fast)',
                      }}
                      className="footer-link"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            paddingTop: 'var(--space-24)',
            borderTop: '1px solid var(--divider)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-16)',
            fontSize: '13px',
            color: 'var(--text-metadata)',
          }}
        >
          <div>
            <span style={{ color: 'var(--text)', fontWeight: 500 }}>Syntaflow</span> — &ldquo;From context to action.&rdquo;
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-16)' }}>
            <span>&copy; {currentYear} Syntaflow. All rights reserved.</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>syntaflow.tech</span>
          </div>
        </div>
      </div>

      <style>{`
        .footer-link:hover {
          color: var(--text) !important;
        }
      `}</style>
    </footer>
  );
};
