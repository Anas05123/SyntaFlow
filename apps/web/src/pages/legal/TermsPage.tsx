import React, { useState } from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { Card } from '../../components/ui/Card';

interface TermSection {
  id: string;
  num: string;
  title: string;
  inShort: string;
  content: React.ReactNode;
}

const TERMS_SECTIONS: TermSection[] = [
  {
    id: 'agreement',
    num: '1',
    title: 'Agreement to Terms',
    inShort: 'By using Syntaflow, you agree to these legal terms. If you disagree, do not use the software.',
    content: (
      <p>
        These Terms of Service (&ldquo;Terms&rdquo;) constitute a legally binding agreement between you (&ldquo;User&rdquo; or &ldquo;you&rdquo;) and Syntaflow (&ldquo;Syntaflow,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), governing your access to and use of the Syntaflow website (<a href="https://syntaflow.tech" style={{ color: 'var(--cyan)' }}>https://syntaflow.tech</a>), desktop applications, software tools, and related documentation. By downloading, installing, or executing Syntaflow, you acknowledge that you have read, understood, and agree to be bound by these Terms.
      </p>
    ),
  },
  {
    id: 'eligibility',
    num: '2',
    title: 'Eligibility & Professional Accounts',
    inShort: 'You must be at least 18 years old or legal age of majority in your jurisdiction.',
    content: (
      <p>
        Syntaflow is designed exclusively for professional productivity and business purposes. You must be at least 18 years old to access or use the application. If you represent an organization, company, or boutique agency, you represent that you possess legal authority to bind that entity to these Terms.
      </p>
    ),
  },
  {
    id: 'preview-status',
    num: '3',
    title: 'Syntaflow Services & Preview Status',
    inShort: 'The software is currently in Desktop Preview ($0 / Free). Features and updates may occur frequently.',
    content: (
      <p>
        Syntaflow provides a unified desktop operating environment uniting client operations, blueprint scoping, dual-density task boards, typographic document authoring, client review sign-offs, and delivery gate enforcement. Because the desktop application is provided under a <strong>Desktop Preview</strong> program, features may be updated, adjusted, or refined toward general release.
      </p>
    ),
  },
  {
    id: 'license-grant',
    num: '4',
    title: 'Software License Grant & Restrictions',
    inShort: 'You receive a revocable, non-exclusive license to use the software on your devices.',
    content: (
      <div>
        <p>
          Subject to your ongoing compliance with these Terms, Syntaflow grants you a limited, non-exclusive, non-transferable, non-sublicensable, revocable license to install and execute the desktop application solely for your own internal business and productivity purposes.
        </p>
        <p style={{ marginTop: '10px' }}>
          You agree not to reverse engineer, decompile, disassemble, or derive the underlying source code of the binary distributions, bypass license verification checks, or use the software in violation of applicable laws.
        </p>
      </div>
    ),
  },
  {
    id: 'user-ownership',
    num: '5',
    title: 'User Content Ownership & Data Sovereignty',
    inShort: 'You retain 100% exclusive ownership of all your content, client data, contracts, and documents.',
    content: (
      <div>
        <p>
          <strong>You retain complete and exclusive ownership of all client records, commercial rates, blueprints, task allocations, documents, and review sign-offs you produce within Syntaflow.</strong>
        </p>
        <p style={{ marginTop: '10px' }}>
          Syntaflow asserts zero intellectual property rights, zero copyright claims, and zero ownership claims over any content you create. Because our architecture is local-first, your content remains physically stored on your workstations within your local SQLite database.
        </p>
      </div>
    ),
  },
  {
    id: 'integrations',
    num: '6',
    title: 'Third-Party Services & Google Integrations',
    inShort: 'Connecting external tools (Google, GitHub, Slack) is optional and uses secure, on-demand local OAuth.',
    content: (
      <div>
        <p>
          Syntaflow allows optional integration with third-party productivity services—including Google Workspace (Gmail, Calendar, Drive), GitHub, Notion, Figma, and Slack. External services operate under their respective terms and privacy policies.
        </p>
        <p style={{ marginTop: '10px' }}>
          When connecting Google Workspace accounts, Syntaflow accesses data solely on demand and adheres strictly to the <strong>Google API Services User Data Policy</strong>, including the Limited Use requirements. We never mirror your Google data onto external cloud databases.
        </p>
      </div>
    ),
  },
  {
    id: 'ai-oversight',
    num: '7',
    title: 'AI Synthesis & Human Oversight',
    inShort: 'AI assistance features require your review. You are responsible for final deliverable approvals.',
    content: (
      <p>
        Syntaflow provides contextual assistance to synthesize project briefs and structure scopes. AI-generated suggestions are assistive tools. You remain exclusively responsible for verifying, validating, and approving any specifications, commercial agreements, or communications before transmitting them to clients.
      </p>
    ),
  },
  {
    id: 'acceptable-use',
    num: '8',
    title: 'Acceptable Use Policy',
    inShort: 'Do not use Syntaflow for unlawful, malicious, or abusive activities.',
    content: (
      <div>
        <p>You agree not to use Syntaflow to:</p>
        <ul style={{ paddingLeft: '20px', marginTop: '8px', lineHeight: 1.7 }}>
          <li>Violate any local, national, or international statute, regulation, or privacy standard.</li>
          <li>Transmit unauthorized communications, spam, or malicious payloads.</li>
          <li>Infringe upon the intellectual property or privacy rights of any third party.</li>
          <li>Circumvent or attempt to tamper with security boundaries or credential vault encryption.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'intellectual-property',
    num: '9',
    title: 'Syntaflow Intellectual Property',
    inShort: 'Syntaflow trademarks, designs, and interface architectures remain our property.',
    content: (
      <p>
        The Syntaflow brand, interface designs, logos, software binaries, typographic systems, and documentation are protected by intellectual property laws and remain the exclusive property of Syntaflow. All rights not expressly granted to you are reserved.
      </p>
    ),
  },
  {
    id: 'data-portability',
    num: '10',
    title: 'Local Storage, Backup & Data Portability',
    inShort: 'Your data is in a standard local SQLite database. You can back it up or export it anytime.',
    content: (
      <p>
        Because Syntaflow operates local-first, the physical custody and backup of your database file resides with you. You may export documents, manifests, and records at any time. We encourage maintaining regular workstation backups.
      </p>
    ),
  },
  {
    id: 'pricing-terms',
    num: '11',
    title: 'Commercial Tiers, Subscriptions & Fees',
    inShort: 'Preview is free ($0). When paid tiers launch, pricing will be clear and opt-in only.',
    content: (
      <p>
        Syntaflow Desktop Preview is currently provided at no cost ($0). When commercial paid tiers (such as Pro or Studio) are introduced, explicit pricing terms and subscription details will be published in advance. You will never be charged without your affirmative consent.
      </p>
    ),
  },
  {
    id: 'termination',
    num: '12',
    title: 'Termination & License Cancellation',
    inShort: 'You may stop using Syntaflow anytime by uninstalling the application.',
    content: (
      <p>
        You may terminate these Terms at any time simply by uninstalling the desktop application and ceasing use of our website. We reserve the right to suspend or terminate access if these Terms are materially breached.
      </p>
    ),
  },
  {
    id: 'disclaimers',
    num: '13',
    title: 'Disclaimers & Limitation of Liability',
    inShort: 'Software provided "AS IS" during preview. Liability is limited to the extent allowed by law.',
    content: (
      <p style={{ textTransform: 'uppercase', fontSize: '13px', lineHeight: 1.6, color: 'var(--text-muted)' }}>
        THE SOFTWARE AND SERVICES ARE PROVIDED ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; BASIS WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. TO THE MAXIMUM EXTENT PERMITTED BY LAW, SYNTAFLOW SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR FOR LOSS OF PROFITS, DATA, OR BUSINESS REPUTATION.
      </p>
    ),
  },
  {
    id: 'modifications',
    num: '14',
    title: 'Modifications to Terms',
    inShort: 'We may update these terms as the platform evolves, with updated revision dates.',
    content: (
      <p>
        We may update these Terms periodically. Significant modifications will be reflected with an updated &ldquo;Last Updated&rdquo; date at the top of this document. Continued use of Syntaflow constitutes agreement to the updated Terms.
      </p>
    ),
  },
  {
    id: 'contact',
    num: '15',
    title: 'Legal Contact & Notice Information',
    inShort: 'Contact our legal team at legal@syntaflow.tech.',
    content: (
      <div style={{ padding: '16px', backgroundColor: 'var(--surface-raised)', borderRadius: '6px', border: '1px solid var(--border)' }}>
        <div><strong>Syntaflow Legal Team</strong></div>
        <div>Email: <a href="mailto:legal@syntaflow.tech" style={{ color: 'var(--cyan)' }}>legal@syntaflow.tech</a></div>
        <div>Website: <a href="https://syntaflow.tech" style={{ color: 'var(--cyan)' }}>https://syntaflow.tech</a></div>
      </div>
    ),
  },
];

export const TermsPage: React.FC = () => {
  const [activeSectionId, setActiveSectionId] = useState<string>('agreement');
  const [tocSearch, setTocSearch] = useState<string>('');

  const scrollToSection = (id: string) => {
    setActiveSectionId(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const filteredSections = React.useMemo(() => {
    if (!tocSearch.trim()) return TERMS_SECTIONS;
    const q = tocSearch.toLowerCase();
    return TERMS_SECTIONS.filter((s) => s.title.toLowerCase().includes(q) || s.inShort.toLowerCase().includes(q));
  }, [tocSearch]);

  return (
    <div style={{ paddingBottom: 'var(--space-80)', fontFamily: 'var(--font-body)', position: 'relative', overflow: 'hidden' }}>
      <SEOHead
        title="Terms of Service — Syntaflow"
        description="Official terms of service governing the Syntaflow website and desktop preview application."
        path="/terms"
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
              LEGAL // OFFICIAL TERMS OF SERVICE
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>·</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Last Updated: September 16, 2026</span>
          </div>

          <h1 className="heading-1" style={{ fontSize: 'clamp(28px, 4vw, 42px)', color: 'var(--text)', marginBottom: 'var(--space-12)', letterSpacing: '-0.02em' }}>
            Syntaflow Terms of Service
          </h1>

          <p style={{ fontSize: '16px', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '820px', margin: 0 }}>
            These terms govern your access to the Syntaflow website (<a href="https://syntaflow.tech" style={{ color: 'var(--cyan)' }}>https://syntaflow.tech</a>) and the Syntaflow Desktop application.
          </p>
        </div>
      </section>

      {/* 2-Column Reader Layout */}
      <section className="section" style={{ paddingTop: 'var(--space-36)', position: 'relative', zIndex: 1 }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 'var(--space-48)' }} className="legal-layout-grid">

            {/* Sticky Table of Contents */}
            <aside style={{ position: 'sticky', top: '90px', alignSelf: 'start' }}>
              {/* Executive Summary Callout */}
              <Card variant="raised" style={{ padding: '16px', backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border)', marginBottom: 'var(--space-20)', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 650 }}>
                  KEY PRINCIPLES
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                  <div>✓ <strong>$0 Free Preview:</strong> No surprise fees.</div>
                  <div>✓ <strong>Data Sovereignty:</strong> You own all content 100%.</div>
                  <div>✓ <strong>Local SQLite:</strong> Your work stays on your device.</div>
                  <div>✓ <strong>Google Limited Use:</strong> No ad targeting or AI training.</div>
                </div>
              </Card>

              {/* Navigation Header with Search */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  TABLE OF CONTENTS ({filteredSections.length})
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

              {/* Filter Input */}
              <div style={{ marginBottom: '8px' }}>
                <input
                  type="text"
                  placeholder="Filter 15 sections..."
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
                {filteredSections.map((sec) => {
                  const active = sec.id === activeSectionId;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => scrollToSection(sec.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '7px 10px',
                        borderRadius: '4px',
                        backgroundColor: active ? 'rgba(6, 182, 212, 0.12)' : 'transparent',
                        color: active ? 'var(--cyan)' : 'var(--text-muted)',
                        border: '1px solid',
                        borderColor: active ? 'rgba(6, 182, 212, 0.3)' : 'transparent',
                        textAlign: 'left',
                        fontSize: '12.5px',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)',
                      }}
                      className="interactive-lift"
                    >
                      <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', opacity: 0.7 }}>
                        {sec.num.padStart(2, '0')}.
                      </span>
                      <span>{sec.title}</span>
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* Main Legal Content Column */}
            <main>
              {/* Preview Status Banner */}
              <Card variant="raised" style={{ padding: 'var(--space-20)', marginBottom: 'var(--space-36)', borderLeft: '4px solid var(--border-accent)', backgroundColor: 'var(--surface-raised)' }}>
                <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  PREVIEW STATUS NOTICE
                </div>
                <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
                  Syntaflow is currently provided under a <strong>Desktop Preview</strong> program. During this preview period, access to the desktop application and core features is provided free of charge for evaluation and professional productivity.
                </p>
              </Card>

              {/* Sections List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-36)' }}>
                {TERMS_SECTIONS.map((sec) => (
                  <div key={sec.id} id={sec.id} style={{ scrollMarginTop: '100px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-8)' }}>
                      <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)' }}>
                        SECTION {sec.num.padStart(2, '0')}
                      </span>
                    </div>
                    <h2 style={{ fontSize: '20px', fontWeight: 650, color: 'var(--text)', marginBottom: 'var(--space-12)' }}>
                      {sec.title}
                    </h2>

                    {/* In Short Callout Pill */}
                    <div style={{ padding: '10px 14px', backgroundColor: 'rgba(6, 182, 212, 0.05)', border: '1px solid rgba(6, 182, 212, 0.2)', borderRadius: '6px', marginBottom: 'var(--space-16)', fontSize: '13px', color: 'var(--cyan)' }}>
                      <strong>In short:</strong> {sec.inShort}
                    </div>

                    <div style={{ fontSize: '14.5px', color: 'var(--text-muted)', lineHeight: 1.75 }}>
                      {sec.content}
                    </div>
                  </div>
                ))}
              </div>
            </main>
          </div>
        </div>
      </section>
    </div>
  );
};
