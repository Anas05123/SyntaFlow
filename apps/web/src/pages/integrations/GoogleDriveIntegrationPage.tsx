import React from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { Link } from '../../components/ui/Link';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ServiceLogo } from '../../components/brand/ServiceLogos';

export const GoogleDriveIntegrationPage: React.FC = () => {
  return (
    <div style={{ paddingBottom: 'var(--space-80)' }}>
      <SEOHead path="/integrations/google-drive" />

      {/* Breadcrumb Navigation */}
      <section className="section" style={{ paddingTop: 'var(--space-32)', paddingBottom: 'var(--space-16)' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--text-muted)' }}>
            <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <Link href="/integrations" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Integrations</Link>
            <span>/</span>
            <span style={{ color: 'var(--cyan)', fontWeight: 500 }}>Google Drive</span>
          </div>
        </div>
      </section>

      {/* Hero Header */}
      <section className="section" style={{ paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-36)' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: 'var(--space-20)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ServiceLogo name="google-drive" size={30} />
            </div>
            <div>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                GOOGLE WORKSPACE INTEGRATION // STATUS: AVAILABLE
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 600 }}>● PRODUCTION READY</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>· Restricted Per-File Scope (drive.file)</span>
              </div>
            </div>
          </div>

          <h1 className="heading-1" style={{ fontSize: 'clamp(32px, 5vw, 46px)', color: 'var(--text)', marginBottom: 'var(--space-16)', letterSpacing: '-0.02em' }}>
            Connect project files without losing their context.
          </h1>

          <p style={{ fontSize: '18px', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '780px', margin: 0 }}>
            Syntaflow links Google Drive briefs, contract drafts, and final deliverable archives directly to client milestones with strict per-file security boundaries.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: 'var(--space-24)' }}>
            <Button variant="primary" href="/download">
              Connect in Syntaflow Desktop &rarr;
            </Button>
            <Button variant="secondary" href="/privacy#sec-9">
              Review Drive Scopes & Privacy
            </Button>
          </div>
        </div>
      </section>

      {/* Technical Overview Grid */}
      <section className="section" style={{ paddingTop: 0, paddingBottom: 'var(--space-48)' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-24)' }}>
            
            {/* Capabilities */}
            <Card variant="default" style={{ padding: 'var(--space-28)' }}>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: 'var(--space-12)' }}>
                CORE CAPABILITIES
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginBottom: 'var(--space-12)' }}>
                File Operations & Deliverables
              </h3>
              <ul style={{ paddingLeft: '18px', margin: 0, color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.7 }}>
                <li><strong>Selective File Attachment:</strong> Link client briefs, specifications, and media assets using the native Google Drive picker.</li>
                <li><strong>Deliverable Archive Export:</strong> Save approved document versions and delivery packages directly to designated Google Drive folders.</li>
                <li><strong>Revision Metadata Inspection:</strong> Verify file update timestamps against document version snapshots.</li>
                <li><strong>Zero Broad Drive Scanning:</strong> Syntaflow cannot read or browse files you have not explicitly opened or created within the app.</li>
              </ul>
            </Card>

            {/* Permissions & Scopes */}
            <Card variant="default" style={{ padding: 'var(--space-28)' }}>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: 'var(--space-12)' }}>
                SECURITY & SCOPES
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginBottom: 'var(--space-12)' }}>
                Requested Google OAuth Scopes
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ backgroundColor: 'var(--surface-sunken)', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                  <code style={{ fontSize: '12px', color: 'var(--cyan)' }}>drive.file</code>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Access only files that you explicitly open or create with Syntaflow.
                  </div>
                </div>
                <div style={{ backgroundColor: 'var(--surface-sunken)', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                  <code style={{ fontSize: '12px', color: 'var(--cyan)' }}>drive.metadata.readonly</code>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Read metadata (name, size, revision hash) for designated client files.
                  </div>
                </div>
                <div style={{ backgroundColor: 'var(--surface-sunken)', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                  <code style={{ fontSize: '12px', color: 'var(--cyan)' }}>userinfo.email</code>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Confirm the authorized account identity for local vault binding.
                  </div>
                </div>
              </div>
            </Card>

          </div>
        </div>
      </section>

      {/* Deep Dive Details */}
      <section className="section" style={{ paddingTop: 0, paddingBottom: 'var(--space-48)' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-32)' }}>
            
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text)', marginBottom: 'var(--space-12)' }}>
                Why Strict Per-File Scoping Matters
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>
                Many generic SaaS tools request the overly broad <code>https://www.googleapis.com/auth/drive</code> scope, which grants blanket access to all personal files, photos, and company spreadsheets. Syntaflow rejects this practice. We request exclusively <code>https://www.googleapis.com/auth/drive.file</code>, ensuring that our application has zero technical capability to see, modify, or delete any file in your Google Drive unless you specifically select or save it using Syntaflow.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text)', marginBottom: 'var(--space-12)' }}>
                Local Key Vault & Revocation
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>
                Authentication credentials remain strictly in your native OS keychain. You can disconnect Google Drive at any time inside the desktop application or revoke permissions globally via <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--cyan)' }}>Google Account Security</a>.
              </p>
            </div>

            {/* Google Limited Use Notice Box */}
            <Card variant="raised" style={{ padding: 'var(--space-24)', backgroundColor: 'var(--surface-raised)', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: '8px' }}>
                GOOGLE API SERVICES USER DATA POLICY // LIMITED USE DISCLOSURE
              </div>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.65, margin: 0 }}>
                Syntaflow&rsquo;s use and transfer to any other app of information received from Google APIs adheres to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--cyan)' }}>Google API Services User Data Policy</a>, including the Limited Use requirements.
              </p>
            </Card>

          </div>
        </div>
      </section>

      {/* Cross-Link Footer */}
      <section className="section" style={{ paddingTop: 'var(--space-32)', borderTop: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '16px', fontSize: '13.5px' }}>
              <Link href="/privacy" style={{ color: 'var(--cyan)', textDecoration: 'none' }}>Privacy Policy</Link>
              <Link href="/security" style={{ color: 'var(--cyan)', textDecoration: 'none' }}>Security Architecture</Link>
              <Link href="/product/documents" style={{ color: 'var(--cyan)', textDecoration: 'none' }}>Typographic Documents</Link>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Related: <Link href="/integrations/gmail" style={{ color: 'var(--text-muted)' }}>Gmail</Link> · <Link href="/integrations/google-calendar" style={{ color: 'var(--text-muted)' }}>Google Calendar</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
