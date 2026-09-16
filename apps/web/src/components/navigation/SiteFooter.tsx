import React from 'react';
import { BrandMark } from '../brand/BrandMark';

export const SiteFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        backgroundColor: 'var(--canvas)',
        color: 'var(--text-muted)',
        padding: 'var(--space-48) 0 var(--space-32) 0',
      }}
    >
      <div className="container" style={{ maxWidth: '1120px' }}>
        {/* Columns Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 'var(--space-32)',
            marginBottom: 'var(--space-48)',
          }}
        >
          {/* Brand Info */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ marginBottom: 'var(--space-12)' }}>
              <BrandMark variant="full" size="sm" />
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              Connected operating environment for client work. From context to action.
            </p>
          </div>

          {/* Product */}
          <div>
            <div style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--text)', marginBottom: 'var(--space-12)', letterSpacing: '0.05em' }}>
              PRODUCT
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: 0, margin: 0, listStyle: 'none', fontSize: '13.5px' }}>
              <li><a href="#/product" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Overview</a></li>
              <li><a href="#/integrations" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Integrations</a></li>
              <li><a href="#/pricing" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Pricing</a></li>
              <li><a href="#/download" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Download</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <div style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--text)', marginBottom: 'var(--space-12)', letterSpacing: '0.05em' }}>
              RESOURCES
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: 0, margin: 0, listStyle: 'none', fontSize: '13.5px' }}>
              <li><a href="#/docs" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Docs</a></li>
              <li><a href="#/faq" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>FAQ</a></li>
              <li><a href="#/changelog" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Changelog</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <div style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--text)', marginBottom: 'var(--space-12)', letterSpacing: '0.05em' }}>
              COMPANY
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: 0, margin: 0, listStyle: 'none', fontSize: '13.5px' }}>
              <li><a href="#/about" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>About</a></li>
              <li><a href="#/contact" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Contact</a></li>
              <li><a href="#/security" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Security</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <div style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--text)', marginBottom: 'var(--space-12)', letterSpacing: '0.05em' }}>
              LEGAL
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: 0, margin: 0, listStyle: 'none', fontSize: '13.5px' }}>
              <li><a href="#/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy Policy</a></li>
              <li><a href="#/terms" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Terms of Service</a></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <div style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--text)', marginBottom: 'var(--space-12)', letterSpacing: '0.05em' }}>
              ACCOUNT
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: 0, margin: 0, listStyle: 'none', fontSize: '13.5px' }}>
              <li><a href="#/login" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Log in</a></li>
              <li><a href="#/account" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>My Account</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid var(--border)',
            paddingTop: 'var(--space-24)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            fontSize: '12px',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            Syntaflow — &ldquo;From context to action.&rdquo; · © {currentYear} Syntaflow. All rights reserved.
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="#/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy</a>
            <a href="#/terms" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Terms</a>
            <a href="#/security" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
