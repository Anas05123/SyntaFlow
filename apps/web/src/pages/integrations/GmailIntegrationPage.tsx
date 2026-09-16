import React from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { Link } from '../../components/ui/Link';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ServiceLogo } from '../../components/brand/ServiceLogos';

export const GmailIntegrationPage: React.FC = () => {
  return (
    <div style={{ paddingBottom: 'var(--space-80)' }}>
      <SEOHead path="/integrations/gmail" />

      {/* Breadcrumb Navigation */}
      <section className="section" style={{ paddingTop: 'var(--space-32)', paddingBottom: 'var(--space-16)' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--text-muted)' }}>
            <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <Link href="/integrations" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Integrations</Link>
            <span>/</span>
            <span style={{ color: 'var(--cyan)', fontWeight: 500 }}>Gmail</span>
          </div>
        </div>
      </section>

      {/* Hero Header */}
      <section className="section" style={{ paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-36)' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: 'var(--space-20)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ServiceLogo name="gmail" size={30} />
            </div>
            <div>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                GOOGLE WORKSPACE INTEGRATION // STATUS: AVAILABLE
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 600 }}>● PRODUCTION READY</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>· OAuth 2.0 PKCE · Local Storage</span>
              </div>
            </div>
          </div>

          <h1 className="heading-1" style={{ fontSize: 'clamp(32px, 5vw, 46px)', color: 'var(--text)', marginBottom: 'var(--space-16)', letterSpacing: '-0.02em' }}>
            Connect Gmail to your client workflow.
          </h1>

          <p style={{ fontSize: '18px', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '780px', margin: 0 }}>
            Syntaflow integrates Gmail with client workspaces to surface relevant project correspondence, prepare transmission drafts, and document formal review handoffs without cluttering your inbox or exposing private messages.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: 'var(--space-24)' }}>
            <Button variant="primary" href="/download">
              Connect in Syntaflow Desktop &rarr;
            </Button>
            <Button variant="secondary" href="/privacy#sec-7">
              Review Gmail Scopes & Privacy
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
                What Syntaflow Does With Gmail
              </h3>
              <ul style={{ paddingLeft: '18px', margin: 0, color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.7 }}>
                <li><strong>Find & Read Authorized Email:</strong> Queries message threads specifically matching verified client email addresses.</li>
                <li><strong>Contextual Work Association:</strong> Anchors correspondence directly to project blueprints, tasks, and commercial retainers.</li>
                <li><strong>Create Transmission Drafts:</strong> Prepares formatted review summaries, release packages, and invoices inside your Gmail draft folder.</li>
                <li><strong>Guarded Send Action:</strong> Sending is never automated; emails are dispatched only when explicitly confirmed by the operator.</li>
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
                  <code style={{ fontSize: '12px', color: 'var(--cyan)' }}>gmail.readonly</code>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    View email messages and settings matching active client accounts.
                  </div>
                </div>
                <div style={{ backgroundColor: 'var(--surface-sunken)', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                  <code style={{ fontSize: '12px', color: 'var(--cyan)' }}>gmail.compose</code>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Create drafts and send messages upon explicit human confirmation.
                  </div>
                </div>
                <div style={{ backgroundColor: 'var(--surface-sunken)', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                  <code style={{ fontSize: '12px', color: 'var(--cyan)' }}>userinfo.email</code>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Verify the connected account identifier for local display.
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
                How It Connects
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>
                Syntaflow uses the official Google OAuth 2.0 Authorization Code flow with Proof Key for Code Exchange (PKCE). When you initiate connection inside Syntaflow Desktop, authentication occurs directly in your default system browser on Google&rsquo;s secure domain (<code>accounts.google.com</code>). Tokens are returned via an ephemeral localhost redirect loop and encrypted immediately inside your local operating system vault (Windows Data Protection API or macOS Keychain). No OAuth credentials or refresh tokens are ever transmitted to or stored on Syntaflow cloud servers.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text)', marginBottom: 'var(--space-12)' }}>
                Data Accessed & How It Is Used
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.7, margin: '0 0 12px 0' }}>
                Syntaflow adheres strictly to the principle of least privilege. The application accesses:
              </p>
              <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)', fontSize: '14.5px', lineHeight: 1.7, margin: 0 }}>
                <li>Sender, recipient, date, and subject header metadata.</li>
                <li>Message thread snippets and message bodies strictly matching contacts associated with your active clients.</li>
                <li>Draft creation endpoint to stage outgoing project updates.</li>
              </ul>
              <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.7, margin: '12px 0 0 0' }}>
                This data is used exclusively to display correspondence timelines, verify client approval confirmations, and draft transmissions. <strong>Syntaflow never sells, rents, or transfers your Gmail data, does not use your email to serve advertisements, and never uses your email content to train generalized AI foundation models.</strong>
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text)', marginBottom: 'var(--space-12)' }}>
                Disconnecting Access & Revocation
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.7, margin: '0 0 12px 0' }}>
                You maintain complete control over your Gmail connection at all times:
              </p>
              <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)', fontSize: '14.5px', lineHeight: 1.7, margin: 0 }}>
                <li><strong>In-App Disconnect:</strong> In Syntaflow Desktop &rarr; Settings &rarr; Integrations &rarr; Gmail, click &ldquo;Disconnect&rdquo;. This immediately purges all access tokens, refresh tokens, and session references from your local machine.</li>
                <li><strong>Google Account Permissions:</strong> You can revoke Syntaflow&rsquo;s access at any time through your <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--cyan)' }}>Google Account Security Dashboard</a>. Once revoked, Syntaflow can no longer make API requests on your behalf.</li>
              </ul>
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
              <Link href="/product/client-management" style={{ color: 'var(--cyan)', textDecoration: 'none' }}>Client Management</Link>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Related: <Link href="/integrations/google-calendar" style={{ color: 'var(--text-muted)' }}>Google Calendar</Link> · <Link href="/integrations/google-drive" style={{ color: 'var(--text-muted)' }}>Google Drive</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
