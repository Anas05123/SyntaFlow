import React from 'react';
import { SEOHead } from '../components/ui/SEOHead';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const AccountPage: React.FC = () => {
  return (
    <div style={{ paddingBottom: 'var(--space-64)' }}>
      <SEOHead
        title="My Account — Syntaflow"
        description="Manage your Syntaflow profile, active plan, connected services, and active desktop sessions."
        path="/account"
      />

      <section className="section" style={{ paddingTop: 'var(--space-48)', paddingBottom: 'var(--space-24)', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: '880px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-12)' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase' }}>
              ACCOUNT MANAGEMENT
            </span>
          </div>

          <h1 className="heading-1" style={{ fontSize: 'clamp(28px, 4vw, 40px)', color: 'var(--text)', marginBottom: 'var(--space-8)' }}>
            Account & Sessions
          </h1>

          <p style={{ fontSize: '16px', color: 'var(--text-muted)', margin: 0 }}>
            Manage your Syntaflow user identity, current subscription tier, and connected desktop workstations.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 'var(--space-32)' }}>
        <div className="container" style={{ maxWidth: '880px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
            {/* Profile Overview */}
            <Card variant="raised" style={{ padding: 'var(--space-24)' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginBottom: 'var(--space-16)' }}>
                User Profile
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-16)', fontSize: '13.5px' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '12px', marginBottom: '4px' }}>Name</span>
                  <span style={{ color: 'var(--text)', fontWeight: 500 }}>Anas Ayari</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '12px', marginBottom: '4px' }}>Email</span>
                  <span style={{ color: 'var(--text)', fontWeight: 500 }}>ayarianas79@gmail.com</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '12px', marginBottom: '4px' }}>Primary Studio</span>
                  <span style={{ color: 'var(--text)', fontWeight: 500 }}>Syntaflow Studio</span>
                </div>
              </div>
            </Card>

            {/* Current Plan */}
            <Card variant="default" style={{ padding: 'var(--space-24)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-12)' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', margin: '0 0 4px 0' }}>
                    Active Plan: Desktop Preview
                  </h2>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', margin: 0 }}>
                    Full unconstrained access to all local-first features during the evaluation period.
                  </p>
                </div>
                <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', padding: '4px 10px', borderRadius: '4px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  ACTIVE ($0)
                </span>
              </div>
            </Card>

            {/* Connected Workstations & Services */}
            <Card variant="default" style={{ padding: 'var(--space-24)' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginBottom: 'var(--space-12)' }}>
                Connected Workstations & Services
              </h2>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginBottom: 'var(--space-16)' }}>
                Integration tokens and API credentials are kept strictly inside your workstation&rsquo;s OS credential vault (Windows DPAPI / Keychain). They are not held on cloud servers.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'var(--surface-sunken)', borderRadius: '6px' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)' }}>Primary Workstation (Windows 11 x64)</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Syntaflow Desktop v0.1.0-preview.4 · Last active: Today</div>
                  </div>
                  <Button variant="secondary" href="#/download" style={{ fontSize: '12px', padding: '6px 12px' }}>
                    Download Installer
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};
