import React, { useState, useMemo } from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { Card } from '../../components/ui/Card';

const TOC_ITEMS = [
  { id: 'sec-1', label: '1. About & Scope' },
  { id: 'sec-2', label: '2. Information Collected' },
  { id: 'sec-3', label: '3. Accounts & Auth' },
  { id: 'sec-4', label: '4. Local SQLite Storage' },
  { id: 'sec-5', label: '5. Integration Architecture' },
  { id: 'sec-6', label: '6. Google User Data Principles' },
  { id: 'sec-7', label: '7. Gmail Scopes' },
  { id: 'sec-8', label: '8. Calendar Scopes' },
  { id: 'sec-9', label: '9. Drive Scopes' },
  { id: 'sec-10', label: '10. Docs & Sheets Scopes' },
  { id: 'sec-11', label: '11. Identity Scopes' },
  { id: 'sec-12', label: '12. How Data is Used' },
  { id: 'sec-13', label: '13. AI & Model Transparency' },
  { id: 'sec-14', label: '14. OS Credential Vault' },
  { id: 'sec-15', label: '15. Web Infrastructure' },
  { id: 'sec-16', label: '16. PKCE & Session Security' },
  { id: 'sec-17', label: '17. Subprocessors' },
  { id: 'sec-18', label: '18. Zero Data Sales' },
  { id: 'sec-19', label: '19. Google Limited Use Policy' },
  { id: 'sec-20', label: '20. Retention Criteria' },
  { id: 'sec-21', label: '21. Revoking OAuth Grants' },
  { id: 'sec-22', label: '22. Deletion Rights' },
  { id: 'sec-23', label: '23. Security Practices' },
  { id: 'sec-24', label: '24. Updates & Contact' },
];

export const PrivacyPage: React.FC = () => {
  const [activeId, setActiveId] = useState<string>('sec-1');
  const [tocSearch, setTocSearch] = useState<string>('');

  const scrollTo = (id: string) => {
    setActiveId(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const filteredToc = useMemo(() => {
    if (!tocSearch.trim()) return TOC_ITEMS;
    const q = tocSearch.toLowerCase();
    return TOC_ITEMS.filter((item) => item.label.toLowerCase().includes(q));
  }, [tocSearch]);

  return (
    <div style={{ paddingBottom: 'var(--space-80)', fontFamily: 'var(--font-body)', position: 'relative', overflow: 'hidden' }}>
      <SEOHead
        title="Privacy Policy — Syntaflow"
        description="Official Privacy Policy for Syntaflow. Detailed disclosures on local-first data handling, Google OAuth scopes, Gmail, Calendar, Drive access, and Google Limited Use compliance."
        path="/privacy"
      />

      {/* Ambient Top Glow Backdrop */}
      <div
        style={{
          position: 'absolute',
          top: '-100px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '1200px',
          height: '500px',
          background: 'radial-gradient(ellipse at 50% 20%, rgba(37, 99, 235, 0.14) 0%, rgba(6, 182, 212, 0.07) 38%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Header Banner */}
      <section className="section" style={{ paddingTop: 'var(--space-48)', paddingBottom: 'var(--space-28)', borderBottom: '1px solid var(--border)', position: 'relative', zIndex: 1 }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-12)' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              LEGAL & COMPLIANCE // OFFICIAL PRIVACY POLICY
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>·</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Last Updated: September 16, 2026</span>
          </div>

          <h1 className="heading-1" style={{ fontSize: 'clamp(28px, 4vw, 42px)', color: 'var(--text)', marginBottom: 'var(--space-12)', letterSpacing: '-0.02em' }}>
            SyntaFlow (Syntaflow Desktop) Privacy Policy
          </h1>

          <p style={{ fontSize: '16px', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '820px', margin: 0 }}>
            This Privacy Policy explains how <strong>SyntaFlow</strong> (and the <strong>Syntaflow Desktop</strong> native application, collectively &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) accesses, collects, uses, stores, shares, and protects information when you visit our website at <a href="https://syntaflow.tech" style={{ color: 'var(--cyan)' }}>https://syntaflow.tech</a> or use the Syntaflow Desktop software and connected Google Workspace integration services.
          </p>
        </div>
      </section>

      {/* 2-Column Reader Layout */}
      <section className="section" style={{ paddingTop: 'var(--space-36)', position: 'relative', zIndex: 1 }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 'var(--space-48)' }} className="legal-layout-grid">

            {/* Sticky Left Navigation Sidebar */}
            <aside style={{ position: 'sticky', top: '90px', alignSelf: 'start' }}>
              {/* Executive Summary Card */}
              <Card variant="raised" style={{ padding: '16px', backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border)', marginBottom: 'var(--space-20)', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 }}>
                  CORE COMMITMENTS
                </div>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '14px', margin: 0, fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  <li><strong>Local SQLite:</strong> Zero cloud database mirroring.</li>
                  <li><strong>Narrow Scopes:</strong> 10 explicit Google OAuth permissions.</li>
                  <li><strong>Google Limited Use:</strong> No ad targeting or generalized AI training.</li>
                  <li><strong>Zero Tracking:</strong> No cross-site ad beacons.</li>
                  <li><strong>Instant Revocation:</strong> 1-click disconnect in Settings.</li>
                </ul>
              </Card>

              {/* Table of Contents Nav Header with Search */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  TABLE OF CONTENTS ({filteredToc.length})
                </span>
                {tocSearch && (
                  <button
                    type="button"
                    onClick={() => setTocSearch('')}
                    style={{ background: 'none', border: 'none', color: 'var(--cyan)', fontSize: '11px', cursor: 'pointer', padding: 0 }}
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Quick TOC Search Input */}
              <div style={{ marginBottom: '8px' }}>
                <input
                  type="text"
                  placeholder="Filter 24 sections..."
                  value={tocSearch}
                  onChange={(e) => setTocSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '7px 10px',
                    fontSize: '12px',
                    backgroundColor: 'var(--surface-raised)',
                    border: '1px solid var(--border)',
                    borderRadius: '5px',
                    color: 'var(--text)',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* TOC Nav List without native scrollbar */}
              <div
                className="hide-scrollbar"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  maxHeight: 'calc(100vh - 380px)',
                  overflowY: 'auto',
                  paddingRight: '2px',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                {filteredToc.map((item) => {
                  const active = item.id === activeId;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => scrollTo(item.id)}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '6px 10px',
                        borderRadius: '4px',
                        backgroundColor: active ? 'rgba(6, 182, 212, 0.12)' : 'transparent',
                        color: active ? 'var(--cyan)' : 'var(--text-muted)',
                        border: '1px solid',
                        borderColor: active ? 'rgba(6, 182, 212, 0.3)' : 'transparent',
                        textAlign: 'left',
                        fontSize: '12px',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)',
                      }}
                      className="interactive-lift"
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* Main Policy Content Column */}
            <main>
              {/* Executive Summary / In Short Box */}
              <Card variant="raised" style={{ padding: 'var(--space-24)', borderLeft: '4px solid var(--cyan)', backgroundColor: 'var(--surface-raised)', marginBottom: 'var(--space-36)' }}>
                <h2 style={{ fontSize: '13px', fontWeight: 650, fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 'var(--space-12)' }}>
                  In Short — Executive Privacy Summary & Google User Data Disclosures
                </h2>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingLeft: '18px', margin: 0, fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  <li><strong>Application Identity:</strong> This policy explicitly applies to <strong>SyntaFlow</strong>, also distributed and identified as <strong>Syntaflow Desktop</strong> (&ldquo;the application&rdquo;).</li>
                  <li><strong>Google User Data Accessed:</strong> Our application accesses the data you explicitly authorize via Google OAuth: user identity (name, email address, profile picture), Gmail correspondence and draft composition, Google Calendar event details and availability, Google Drive files specifically selected or created through the app, and Google Docs/Sheets for draft export.</li>
                  <li><strong>How Google User Data is Used:</strong> We use your Google user data exclusively to provide requested in-app workstation features: correlating client email correspondence with active local workspaces, composing review notice drafts upon your command, synchronizing milestone deadlines onto your Google Calendar, and attaching deliverable assets. We do NOT use Google user data for profiling, data enrichment, or advertising.</li>
                  <li><strong>Data Sharing & Zero Data Sales:</strong> We do NOT sell, rent, trade, or monetize Google user data. We do NOT share, transfer, or disclose Google user data with third-party data brokers, advertising platforms, or information resellers.</li>
                  <li><strong>Data Protection & Encryption:</strong> All sensitive credentials, including Google OAuth access and refresh tokens, are encrypted at rest using OS-level cryptographic vaults (Windows DPAPI via Electron safeStorage, Apple Keychain, or Linux Secret Service). All API transit is encrypted via TLS 1.3.</li>
                  <li><strong>Data Retention & Deletion:</strong> Workspace data is stored locally in your physical on-device SQLite database (<code>%APPDATA%\Syntaflow\storage\syntaflow.db</code>). Gmail and Calendar entries are held only in transient memory during your session. Disconnecting in <em>Settings &rarr; Integrations</em> permanently purges all tokens. Access can also be revoked anytime via <a href="https://myaccount.google.com/permissions" target="_blank" rel="noreferrer" style={{ color: 'var(--cyan)' }}>Google Security Permissions</a>.</li>
                  <li><strong>AI / ML Model Training Affirmation:</strong> Syntaflow Desktop explicitly affirms that Google Workspace APIs and Google user data are <strong>NOT used to develop, improve, or train non-personalized, generalized machine learning (ML) or artificial intelligence (AI) models</strong>.</li>
                  <li><strong>Google Limited Use Compliance:</strong> Syntaflow Desktop&rsquo;s use and transfer to any other app of information received from Google APIs will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noreferrer" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>Google API Services User Data Policy</a>, including the Limited Use requirements.</li>
                </ul>
              </Card>

              {/* Comprehensive 24-Section Policy Body */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-36)', fontSize: '14.5px', color: 'var(--text-muted)', lineHeight: 1.75 }}>

                {/* 1 */}
                <div id="sec-1" style={{ scrollMarginTop: '100px' }}>
                  <h2 className="heading-3" style={{ color: 'var(--text)', marginBottom: 'var(--space-8)' }}>
                    1. About this Privacy Policy & Scope
                  </h2>
                  <p>
                    Syntaflow provides a professional client operating environment designed to maintain continuous context across client onboarding, proposals, project scoping, tasks, document reviews, approvals, and deliverables. This policy governs both the public Syntaflow website (<a href="https://syntaflow.tech" style={{ color: 'var(--cyan)' }}>https://syntaflow.tech</a>) and the Syntaflow desktop client application.
                  </p>
                </div>

                {/* 2 */}
                <div id="sec-2" style={{ scrollMarginTop: '100px' }}>
                  <h2 className="heading-3" style={{ color: 'var(--text)', marginBottom: 'var(--space-8)' }}>
                    2. Information Syntaflow Collects
                  </h2>
                  <p>
                    We minimize data collection by design. We only collect or process information when strictly necessary to provide requested services:
                  </p>
                  <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                    <li><strong>Website Communication Data:</strong> If you submit an inquiry through our Contact page or request access to preview downloads, we collect your name, email address, and message content to respond to your inquiry.</li>
                    <li><strong>Voluntary Account Credentials:</strong> If you register an account, we collect your email address and a securely hashed password.</li>
                    <li><strong>Connected Integration Metadata:</strong> Account identifiers and OAuth tokens required to establish authorized API bridges with third-party providers you choose to connect.</li>
                  </ul>
                </div>

                {/* 3 */}
                <div id="sec-3" style={{ scrollMarginTop: '100px' }}>
                  <h2 className="heading-3" style={{ color: 'var(--text)', marginBottom: 'var(--space-8)' }}>
                    3. Account Information & Authentication
                  </h2>
                  <p>
                    Desktop application user accounts are authenticated locally using industry-standard password hashing (scrypt with randomized salts) and constant-time verification. When using web-based account authentication, sessions are managed via encrypted authentication cookies. We do not store plaintext passwords.
                  </p>
                </div>

                {/* 4 */}
                <div id="sec-4" style={{ scrollMarginTop: '100px' }}>
                  <h2 className="heading-3" style={{ color: 'var(--text)', marginBottom: 'var(--space-8)' }}>
                    4. Local Application Data & Storage Architecture
                  </h2>
                  <p>
                    The primary source of truth for Syntaflow workspace data is a physical SQLite database located in your operating system&rsquo;s local application data directory. Client profiles, blueprints, milestone scopes, task records, document versions, and delivery sign-offs remain strictly on your device. Zero operational records are automatically transmitted to remote cloud databases.
                  </p>
                </div>

                {/* 5 */}
                <div id="sec-5" style={{ scrollMarginTop: '100px' }}>
                  <h2 className="heading-3" style={{ color: 'var(--text)', marginBottom: 'var(--space-8)' }}>
                    5. Connected Service Data & Integration Architecture
                  </h2>
                  <p>
                    Syntaflow integrates with third-party productivity platforms—including Google Workspace (Gmail, Google Calendar, Google Drive, Google Docs, Google Sheets), GitHub, Notion, Figma, Slack, and Linear. All third-party connections operate through explicit, user-initiated OAuth authorization or the Model Context Protocol (MCP). Connected data is queried on demand and is not persistently mirrored on external servers.
                  </p>
                </div>

                {/* 6 */}
                <div id="sec-6" style={{ scrollMarginTop: '100px', padding: 'var(--space-20)', backgroundColor: 'rgba(37, 99, 235, 0.05)', border: '1px solid rgba(37, 99, 235, 0.2)', borderRadius: '6px' }}>
                  <h2 className="heading-3" style={{ color: 'var(--text)', marginBottom: 'var(--space-8)' }}>
                    6. Google User Data: Purpose & Processing Principles
                  </h2>
                  <p>
                    When you connect Google services to Syntaflow, our application requests access to specific categories of Google user data. We process this data strictly within the boundaries of your local workstation to correlate client communications, schedule delivery review milestones, and attach deliverable files to active projects. We do not use Google user data for profiling, data enrichment, or advertising.
                  </p>
                </div>

                {/* 7 */}
                <div id="sec-7" style={{ scrollMarginTop: '100px' }}>
                  <h2 className="heading-3" style={{ color: 'var(--text)', marginBottom: 'var(--space-8)' }}>
                    7. Gmail Data & Requested Scopes
                  </h2>
                  <p>
                    When connecting Gmail, Syntaflow requests the following specific OAuth scopes:
                  </p>
                  <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                    <li><code>https://www.googleapis.com/auth/gmail.readonly</code>: <strong>View email messages and settings.</strong> Used to search and display email correspondence matching the email addresses of clients associated with your active projects. This allows you to review recent client conversations directly inside the relevant project workspace without tool-switching.</li>
                    <li><code>https://www.googleapis.com/auth/gmail.compose</code>: <strong>Manage drafts and send emails.</strong> Used to compose draft review notices and deliverable transmission emails. Syntaflow creates drafts on your behalf; <em>dispatching live outbound emails requires your explicit confirmation</em>.</li>
                  </ul>
                  <p style={{ marginTop: '8px' }}>
                    <strong>Storage:</strong> Email messages and thread snippets are fetched on demand from the Gmail API and cached temporarily in application memory during your working session. Syntaflow does not maintain an external cloud copy of your emails.
                  </p>
                </div>

                {/* 8 */}
                <div id="sec-8" style={{ scrollMarginTop: '100px' }}>
                  <h2 className="heading-3" style={{ color: 'var(--text)', marginBottom: 'var(--space-8)' }}>
                    8. Google Calendar Data & Requested Scopes
                  </h2>
                  <p>
                    When connecting Google Calendar, Syntaflow requests the following scopes:
                  </p>
                  <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                    <li><code>https://www.googleapis.com/auth/calendar.readonly</code>: <strong>See and download calendars you can access.</strong> Used to inspect your meeting availability and surface upcoming client review sessions and project deadlines alongside your milestone timeline.</li>
                    <li><code>https://www.googleapis.com/auth/calendar.events</code>: <strong>View and edit events on all your calendars.</strong> Used to schedule client review meetings, presentation appointments, and project delivery deadlines directly onto your Google Calendar upon your command.</li>
                  </ul>
                  <p style={{ marginTop: '8px' }}>
                    <strong>Storage:</strong> Calendar events are queried dynamically from the Google Calendar API. Syntaflow does not export or share your schedule with any third parties.
                  </p>
                </div>

                {/* 9 */}
                <div id="sec-9" style={{ scrollMarginTop: '100px' }}>
                  <h2 className="heading-3" style={{ color: 'var(--text)', marginBottom: 'var(--space-8)' }}>
                    9. Google Drive Data & Requested Scopes
                  </h2>
                  <p>
                    When connecting Google Drive, Syntaflow adheres to the principle of least privilege by requesting narrow file-level access:
                  </p>
                  <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                    <li><code>https://www.googleapis.com/auth/drive.file</code>: <strong>See, edit, create, and delete only the specific Google Drive files you use with this app.</strong> Used to upload final deliverable archives, export proposal documents, and open specific project files you select. <em>Syntaflow cannot access or view other files in your Google Drive that were not created or selected through the application.</em></li>
                    <li><code>https://www.googleapis.com/auth/drive.metadata.readonly</code>: <strong>See information about your Google Drive files.</strong> Used to display file names, file sizes, and revision dates in the document attachment selector so you can link assets to client blueprints.</li>
                  </ul>
                </div>

                {/* 10 */}
                <div id="sec-10" style={{ scrollMarginTop: '100px' }}>
                  <h2 className="heading-3" style={{ color: 'var(--text)', marginBottom: 'var(--space-8)' }}>
                    10. Google Docs & Sheets Data
                  </h2>
                  <p>
                    For extended document and commercial table workflows, Syntaflow requests:
                  </p>
                  <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                    <li><code>https://www.googleapis.com/auth/documents</code>: Used to read client briefs and export completed document drafts to Google Docs.</li>
                    <li><code>https://www.googleapis.com/auth/spreadsheets</code>: Used to synchronize milestone budgets, commercial hourly logs, and financial runways with Google Sheets spreadsheets.</li>
                  </ul>
                </div>

                {/* 11 */}
                <div id="sec-11" style={{ scrollMarginTop: '100px' }}>
                  <h2 className="heading-3" style={{ color: 'var(--text)', marginBottom: 'var(--space-8)' }}>
                    11. Google Account Identity Scopes
                  </h2>
                  <ul style={{ paddingLeft: '20px' }}>
                    <li><code>https://www.googleapis.com/auth/userinfo.email</code>: Used solely to display the email address of your connected Google account in application settings and verify token ownership.</li>
                    <li><code>https://www.googleapis.com/auth/userinfo.profile</code>: Used solely to display your account name and avatar within the local integration card.</li>
                  </ul>
                </div>

                {/* 12 */}
                <div id="sec-12" style={{ scrollMarginTop: '100px' }}>
                  <h2 className="heading-3" style={{ color: 'var(--text)', marginBottom: 'var(--space-8)' }}>
                    12. How Connected Service Data is Used & Processed
                  </h2>
                  <p>
                    All data accessed from connected services is used exclusively to deliver user-requested workspace features:
                  </p>
                  <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                    <li>Displaying contextually relevant communications alongside active projects.</li>
                    <li>Scheduling milestone deadlines and synchronizing calendar availability.</li>
                    <li>Attaching deliverable assets and exporting document versions.</li>
                    <li>Allowing you to manage client engagements from a unified operational cockpit.</li>
                  </ul>
                </div>

                {/* 13 */}
                <div id="sec-13" style={{ scrollMarginTop: '100px', padding: 'var(--space-20)', backgroundColor: 'var(--surface-raised)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                  <h2 className="heading-3" style={{ color: 'var(--text)', marginBottom: 'var(--space-8)' }}>
                    13. Artificial Intelligence (AI) & Model Processing Transparency
                  </h2>
                  <p>
                    Syntaflow includes contextual intelligence features designed to summarize client threads, assist with project scoping, and generate document drafts. Our AI architecture enforces strict privacy safeguards:
                  </p>
                  <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                    <li><strong>No Generalized AI Model Training:</strong> Syntaflow <strong>does NOT</strong> use your client records, documents, emails, calendar events, or Google user data to train, retrain, or fine-tune generalized machine learning or foundational AI models.</li>
                    <li><strong>Local-First Model Support:</strong> Syntaflow supports executing open-weights models locally on your workstation via Ollama, ensuring prompt context never leaves your physical hardware.</li>
                    <li><strong>User-Initiated Execution:</strong> AI features operate only when explicitly invoked by you. Integration data is passed to the AI inference engine strictly within the scope of your immediate command.</li>
                    <li><strong>Granular Agent Permission Gates:</strong> In application settings, you can toggle agent access for each integration and require explicit human confirmation before any external action (such as sending an email) is performed.</li>
                  </ul>
                </div>

                {/* 14 */}
                <div id="sec-14" style={{ scrollMarginTop: '100px' }}>
                  <h2 className="heading-3" style={{ color: 'var(--text)', marginBottom: 'var(--space-8)' }}>
                    14. Local-First Physical Storage & OS-Level Credential Encryption
                  </h2>
                  <p>
                    OAuth access tokens and refresh tokens required to maintain API connections are encrypted at rest using your operating system&rsquo;s native cryptographic vault:
                  </p>
                  <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                    <li>On Windows, credentials are encrypted using the <strong>Windows Data Protection API (DPAPI)</strong> via Electron <code>safeStorage</code>.</li>
                    <li>On macOS, credentials are protected by the <strong>Apple Keychain</strong>.</li>
                    <li>On Linux, credentials utilize Secret Service API / <code>libsecret</code>.</li>
                  </ul>
                  <p style={{ marginTop: '8px' }}>
                    Tokens are never written in plaintext to disk, never checked into code repositories, and never transmitted to Syntaflow servers.
                  </p>
                </div>

                {/* 15 */}
                <div id="sec-15" style={{ scrollMarginTop: '100px' }}>
                  <h2 className="heading-3" style={{ color: 'var(--text)', marginBottom: 'var(--space-8)' }}>
                    15. Data Stored by Syntaflow Services
                  </h2>
                  <p>
                    Our web infrastructure (hosted on Appwrite Sites with CDN edge routing) does not store your local workspace records. If you submit an inquiry through our contact form, that inquiry information is securely stored only for the purpose of communicating with you and is deleted upon request.
                  </p>
                </div>

                {/* 16 */}
                <div id="sec-16" style={{ scrollMarginTop: '100px' }}>
                  <h2 className="heading-3" style={{ color: 'var(--text)', marginBottom: 'var(--space-8)' }}>
                    16. Authentication, OAuth Tokens & Session Security
                  </h2>
                  <p>
                    Syntaflow implements the industry-standard <strong>OAuth 2.0 with Proof Key for Code Exchange (PKCE)</strong> (RFC 8252) flow for native desktop applications. During authentication, a local loopback server is instantiated dynamically on <code>127.0.0.1</code> to receive the authorization code. Single-use cryptographic state parameters with short expiration windows are enforced to prevent CSRF and replay attacks.
                  </p>
                </div>

                {/* 17 */}
                <div id="sec-17" style={{ scrollMarginTop: '100px' }}>
                  <h2 className="heading-3" style={{ color: 'var(--text)', marginBottom: 'var(--space-8)' }}>
                    17. Third-Party Service Providers & Subprocessors
                  </h2>
                  <p>
                    We use a minimal set of reputable infrastructure providers to host our public website and documentation:
                  </p>
                  <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                    <li><strong>Appwrite Cloud / Fastly:</strong> Hosting and content delivery for the static marketing website (<a href="https://syntaflow.tech" style={{ color: 'var(--cyan)' }}>https://syntaflow.tech</a>).</li>
                    <li><strong>GitHub:</strong> Source code repository hosting and release artifact distribution.</li>
                  </ul>
                  <p style={{ marginTop: '8px' }}>
                    None of these providers receive access to your local SQLite databases or integration tokens.
                  </p>
                </div>

                {/* 18 */}
                <div id="sec-18" style={{ scrollMarginTop: '100px' }}>
                  <h2 className="heading-3" style={{ color: 'var(--text)', marginBottom: 'var(--space-8)' }}>
                    18. Data Sharing & Non-Disclosure (Zero Data Sales, Zero Ad Networks)
                  </h2>
                  <p>
                    We maintain an absolute commitment to user confidentiality:
                  </p>
                  <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                    <li>We do <strong>NOT</strong> sell, rent, trade, or monetize your personal data or Google user data.</li>
                    <li>We do <strong>NOT</strong> share user data with data brokers, advertising platforms, or market research firms.</li>
                    <li>We do <strong>NOT</strong> permit third parties to access your connected service records.</li>
                    <li>We only disclose information if strictly required by applicable law, court order, or governmental subpoena.</li>
                  </ul>
                </div>

                {/* 19 - Dedicated Google Limited Use */}
                <div id="sec-19" style={{ scrollMarginTop: '100px', padding: 'var(--space-20)', backgroundColor: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '6px' }}>
                  <h2 className="heading-3" style={{ color: 'var(--text)', marginBottom: 'var(--space-8)' }}>
                    19. Google API Services User Data Policy & Limited Use Compliance
                  </h2>
                  <p style={{ fontWeight: 500, color: 'var(--text)' }}>
                    Syntaflow Desktop&rsquo;s use and transfer to any other app of information received from Google APIs will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noreferrer" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>Google API Services User Data Policy</a>, including the Limited Use requirements:
                  </p>
                  <ol style={{ paddingLeft: '20px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <li>We only use Google user data to provide or improve user-facing features that are prominent in Syntaflow Desktop&rsquo;s user interface.</li>
                    <li>We do not transfer Google user data to third parties unless necessary to provide or improve user-facing features, comply with applicable law, or as part of a merger, acquisition, or asset sale with user consent.</li>
                    <li>We do not use or transfer Google user data for serving advertisements, including retargeting, personalized, or interest-based advertising.</li>
                    <li>We do not allow humans to read Google user data unless: (a) we have obtained your affirmative agreement for specific messages; (b) it is necessary for security purposes (such as investigating a bug or abuse); (c) it is required to comply with applicable law; or (d) the data is aggregated and anonymized for internal operations.</li>
                    <li>We do not use Google user data to train non-personalized or generalized machine learning (ML) or artificial intelligence (AI) models.</li>
                  </ol>
                </div>

                {/* 20 */}
                <div id="sec-20" style={{ scrollMarginTop: '100px' }}>
                  <h2 className="heading-3" style={{ color: 'var(--text)', marginBottom: 'var(--space-8)' }}>
                    20. Data Retention Criteria & Storage Durations
                  </h2>
                  <p>
                    Because Syntaflow operates on a local-first model:
                  </p>
                  <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                    <li><strong>Local Workspace Data:</strong> Persists on your computer until you delete individual records or uninstall the application.</li>
                    <li><strong>Connected Integration Data:</strong> Gmail messages and calendar entries are queried on demand and stored in transient memory; they are discarded upon closing the view or session.</li>
                    <li><strong>OAuth Tokens:</strong> Persist in your OS encrypted credential vault until you click &ldquo;Disconnect&rdquo; or revoke the authorization.</li>
                    <li><strong>Contact Inquiries:</strong> Retained on our secure email servers for up to 90 days to resolve support requests, after which they are permanently purged.</li>
                  </ul>
                </div>

                {/* 21 */}
                <div id="sec-21" style={{ scrollMarginTop: '100px' }}>
                  <h2 className="heading-3" style={{ color: 'var(--text)', marginBottom: 'var(--space-8)' }}>
                    21. Disconnecting Integrations & Revoking OAuth Grants
                  </h2>
                  <p>
                    You maintain complete, immediate control over all connected services:
                  </p>
                  <ol style={{ paddingLeft: '20px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <li><strong>Within Syntaflow:</strong> Open <em>Settings &rarr; Integrations</em>, select any connected service, and click <strong>Disconnect</strong>. All encrypted tokens and cached session metadata are instantly deleted from your machine.</li>
                    <li><strong>Within Google Account:</strong> You can revoke Syntaflow&rsquo;s access at any time by visiting <a href="https://myaccount.google.com/permissions" target="_blank" rel="noreferrer" style={{ color: 'var(--cyan)' }}>Google Security: Third-party apps with account access</a> and removing Syntaflow. Once revoked, Syntaflow can no longer access your Google data.</li>
                  </ol>
                </div>

                {/* 22 */}
                <div id="sec-22" style={{ scrollMarginTop: '100px' }}>
                  <h2 className="heading-3" style={{ color: 'var(--text)', marginBottom: 'var(--space-8)' }}>
                    22. Data Deletion Rights & Procedures
                  </h2>
                  <p>
                    You have the right to request deletion of any personal data we hold. To delete your local application data, you can delete the Syntaflow data directory from your workstation at any time. To request deletion of any inquiry communications or account records, email <a href="mailto:privacy@syntaflow.tech" style={{ color: 'var(--cyan)' }}>privacy@syntaflow.tech</a> with the subject &ldquo;Data Deletion Request&rdquo;. We fulfill verified deletion requests within 30 days.
                  </p>
                </div>

                {/* 23 */}
                <div id="sec-23" style={{ scrollMarginTop: '100px' }}>
                  <h2 className="heading-3" style={{ color: 'var(--text)', marginBottom: 'var(--space-8)' }}>
                    23. Security Practices & Defense-in-Depth
                  </h2>
                  <p>
                    We employ comprehensive technical and architectural security controls:
                  </p>
                  <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                    <li><strong>Electron Privilege Boundary:</strong> The user-facing renderer operates in a sandboxed context with zero direct Node.js or filesystem access. All privileged interactions traverse a typed preload IPC bridge.</li>
                    <li><strong>OS Cryptographic Vaults:</strong> Secret tokens are protected using DPAPI / Keychain encryption.</li>
                    <li><strong>Transport Layer Security:</strong> All API requests use TLS 1.3 encryption in transit.</li>
                    <li><strong>Automated Test Suites:</strong> Security boundaries, preload isolation, and token redactions are verified continuously by automated unit and integration tests.</li>
                  </ul>
                </div>

                {/* 24 */}
                <div id="sec-24" style={{ scrollMarginTop: '100px' }}>
                  <h2 className="heading-3" style={{ color: 'var(--text)', marginBottom: 'var(--space-8)' }}>
                    24. International Processing, Children&rsquo;s Privacy, Policy Updates & Contact
                  </h2>
                  <p>
                    <strong>Children&rsquo;s Privacy:</strong> Syntaflow is professional workstation software not directed to individuals under the age of 16. We do not knowingly collect personal data from children.
                  </p>
                  <p style={{ marginTop: '8px' }}>
                    <strong>Changes to this Policy:</strong> We may update this Privacy Policy from time to time to reflect product enhancements or regulatory requirements. Material revisions will be posted on this page with an updated effective date.
                  </p>
                  <p style={{ marginTop: '8px' }}>
                    <strong>Privacy Inquiries & Contact:</strong> For any questions, data subject requests, or privacy concerns, please contact our privacy team:
                  </p>
                  <div style={{ marginTop: '12px', padding: '16px', backgroundColor: 'var(--surface-raised)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                    <div><strong>Syntaflow Privacy Team</strong></div>
                    <div>Email: <a href="mailto:privacy@syntaflow.tech" style={{ color: 'var(--cyan)' }}>privacy@syntaflow.tech</a></div>
                    <div>Security: <a href="mailto:security@syntaflow.tech" style={{ color: 'var(--cyan)' }}>security@syntaflow.tech</a></div>
                    <div>Website: <a href="https://syntaflow.tech" style={{ color: 'var(--cyan)' }}>https://syntaflow.tech</a></div>
                  </div>
                </div>

              </div>
            </main>
          </div>
        </div>
      </section>
    </div>
  );
};
