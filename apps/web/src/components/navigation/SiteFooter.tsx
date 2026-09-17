import React from 'react';
import { BrandMark } from '../brand/BrandMark';
import { Link } from '../ui/Link';

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
              <Link href="/" style={{ textDecoration: 'none' }} aria-label="Syntaflow Home">
                <BrandMark variant="full" size="sm" />
              </Link>
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
              <li><Link href="/product" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Overview</Link></li>
              <li><Link href="/product/client-management" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Client Management</Link></li>
              <li><Link href="/product/projects" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Projects & Tasks</Link></li>
              <li><Link href="/product/documents" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Documents</Link></li>
              <li><Link href="/product/reviews-approvals" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Reviews & Approvals</Link></li>
              <li><Link href="/product/ai-workspace" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>AI Workspace</Link></li>
              <li><Link href="/integrations" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Integrations</Link></li>
              <li><Link href="/pricing" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Pricing</Link></li>
              <li><Link href="/download" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Download</Link></li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <div style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--text)', marginBottom: 'var(--space-12)', letterSpacing: '0.05em' }}>
              SOLUTIONS
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: 0, margin: 0, listStyle: 'none', fontSize: '13.5px' }}>
              <li><Link href="/solutions" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>All Solutions</Link></li>
              <li><Link href="/solutions/agencies" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Agencies</Link></li>
              <li><Link href="/solutions/freelancers" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Freelancers</Link></li>
              <li><Link href="/solutions/consultants" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Consultants</Link></li>
              <li><Link href="/solutions/studios" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Studios</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <div style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--text)', marginBottom: 'var(--space-12)', letterSpacing: '0.05em' }}>
              RESOURCES
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: 0, margin: 0, listStyle: 'none', fontSize: '13.5px' }}>
              <li><Link href={typeof window !== 'undefined' && window.location.hostname.includes('syntaflow.tech') ? 'https://docs.syntaflow.tech' : '/docs'} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Docs</Link></li>
              <li><Link href="/faq" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>FAQ</Link></li>
              <li><Link href="/changelog" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Changelog</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <div style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--text)', marginBottom: 'var(--space-12)', letterSpacing: '0.05em' }}>
              COMPANY
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: 0, margin: 0, listStyle: 'none', fontSize: '13.5px' }}>
              <li><Link href="/about" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>About</Link></li>
              <li><Link href="/contact" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Contact</Link></li>
              <li><Link href="/security" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Security</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <div style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--text)', marginBottom: 'var(--space-12)', letterSpacing: '0.05em' }}>
              LEGAL
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: 0, margin: 0, listStyle: 'none', fontSize: '13.5px' }}>
              <li><Link href="/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy Policy</Link></li>
              <li><Link href="/terms" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Terms of Service</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <div style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--text)', marginBottom: 'var(--space-12)', letterSpacing: '0.05em' }}>
              ACCOUNT
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: 0, margin: 0, listStyle: 'none', fontSize: '13.5px' }}>
              <li><Link href="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Log in</Link></li>
              <li><Link href="/account" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>My Account</Link></li>
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
            <Link href="/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy</Link>
            <Link href="/terms" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Terms</Link>
            <Link href="/security" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
