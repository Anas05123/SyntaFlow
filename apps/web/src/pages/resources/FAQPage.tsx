import React, { useState } from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { PageHero } from '../../components/marketing/PageHero';
import { Card } from '../../components/ui/Card';
import { CTASection } from '../../components/marketing/CTASection';

interface FAQItem {
  q: string;
  a: string;
}

interface FAQCategory {
  category: string;
  items: FAQItem[];
}

const FAQ_DATA: FAQCategory[] = [
  {
    category: 'General',
    items: [
      {
        q: 'What is Syntaflow?',
        a: 'Syntaflow is a desktop-first client operations operating environment designed for freelancers, consultants, and agencies. It keeps client context, commercial proposals, project execution tasks, and immutable document deliverables in one unified, continuous thread.',
      },
      {
        q: 'What platforms does Syntaflow support today?',
        a: 'The desktop application is currently available as a Windows desktop preview. macOS and Linux native builds are planned for upcoming release milestones.',
      },
      {
        q: 'Is there a web or browser version of Syntaflow?',
        a: 'Not yet available. The core operating environment runs exclusively as a native desktop application. A browser-based guest review portal exists for clients to review and approve documents without installing the desktop software.',
      },
    ],
  },
  {
    category: 'Product & Workflows',
    items: [
      {
        q: 'How does Syntaflow prevent scope creep?',
        a: 'Through immutable DocVersion snapshots and delivery gate enforcement. When a proposal or deliverable is transmitted for review, its contents are cryptographically frozen. Work on new or out-of-scope requests requires an explicit change draft, and final packages cannot discharge until milestone prerequisites are approved.',
      },
      {
        q: 'Can clients edit my internal working drafts?',
        a: 'No. Syntaflow enforces strict "One Presentation, Two Shells" isolation. Clients only access explicitly transmitted review snapshots via their token-bound portal. Internal scratchpads, private notes, and raw project tasks remain strictly isolated.',
      },
      {
        q: 'Does Syntaflow replace project management tools like Linear or Asana?',
        a: 'For client-facing professional services, yes. Unlike generic issue trackers that treat all tasks identically, Syntaflow connects tasks directly to client contracts, turnaround SLAs, and deliverable review gates.',
      },
    ],
  },
  {
    category: 'Security & Privacy',
    items: [
      {
        q: 'Does Syntaflow claim SOC 2 or ISO 27001 certification?',
        a: 'No. Syntaflow does not claim unverified certifications. Because Syntaflow is a local desktop application, your client data is stored on your physical machine and never transits our servers.',
      },
      {
        q: 'Does Syntaflow track my usage or send analytics?',
        a: 'No. Syntaflow contains zero outbound telemetry beacons, usage analytics, or advertising trackers.',
      },
      {
        q: 'How are local sessions and passwords protected?',
        a: 'Authentication is handled locally using memory-hard scrypt hashing with timing-safe comparison. Active session credentials are encrypted using native OS hardware keychains via Electron safeStorage (DPAPI on Windows).',
      },
    ],
  },
  {
    category: 'Data & Sovereignty',
    items: [
      {
        q: 'Where is my data stored physically?',
        a: 'All client profiles, projects, documents, and audit logs are stored locally on your physical machine in the standard operating system user data directory.',
      },
      {
        q: 'Can I export my data if I decide to stop using Syntaflow?',
        a: 'Yes. Syntaflow provides full JSON and SQLite database export capabilities. You own your data completely and can migrate at any time.',
      },
      {
        q: 'How do backups work?',
        a: 'Because Syntaflow stores data in local SQLite database files, taking a backup is as simple as copying your database file or including the application directory in your system backup routine (e.g. Time Machine or Windows Backup).',
      },
    ],
  },
  {
    category: 'Pricing & Licensing',
    items: [
      {
        q: 'How much does Syntaflow cost?',
        a: 'Syntaflow is currently completely free during the Desktop Preview phase. Commercial pricing tiers — including local-first perpetual licenses and boutique studio team plans — will be announced prior to general release.',
      },
      {
        q: 'Will there be a recurring per-seat subscription tax?',
        a: 'We are committed to honest, sustainable software economics. Individual operators will have perpetual license options with transparent update pricing rather than forced monthly SaaS subscriptions.',
      },
    ],
  },
  {
    category: 'Account & Support',
    items: [
      {
        q: 'Do I need an online account to use the desktop app?',
        a: 'No remote cloud account is required. The desktop application uses local authentication that works 100% offline.',
      },
      {
        q: 'How do I submit feedback or report a bug?',
        a: 'You can submit feedback directly via our Contact page or by emailing contact@syntaflow.tech.',
      },
    ],
  },
];

export const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggle = (key: string) => {
    setOpenIndex(openIndex === key ? null : key);
  };

  return (
    <div>
      <SEOHead
        title="Frequently Asked Questions — Syntaflow"
        description="Direct, unvarnished answers about Syntaflow architecture, desktop workflows, data handling, and licensing."
        path="/faq"
      />

      <PageHero
        eyebrow="Resources // FAQ"
        title="Direct answers. Zero marketing spin."
        description="We answer questions with complete technical honesty. If a capability does not exist today, we state it plainly."
        status="AVAILABLE NOW"
      />

      <section className="section">
        <div className="container" style={{ maxWidth: '860px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-48)' }}>
            {FAQ_DATA.map((cat) => (
              <div key={cat.category}>
                <h3
                  style={{
                    fontSize: '13px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--cyan)',
                    marginBottom: 'var(--space-16)',
                    paddingBottom: 'var(--space-8)',
                    borderBottom: '1px solid var(--edge)',
                  }}
                >
                  {cat.category}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
                  {cat.items.map((item, idx) => {
                    const itemKey = `${cat.category}-${idx}`;
                    const isOpen = openIndex === itemKey;
                    return (
                      <Card
                        key={item.q}
                        variant="default"
                        style={{ padding: 'var(--space-20)', cursor: 'pointer' }}
                        onClick={() => toggle(itemKey)}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                          <span style={{ fontSize: '15.5px', fontWeight: 600, color: 'var(--text)' }}>
                            {item.q}
                          </span>
                          <span style={{ color: 'var(--text-metadata)', fontSize: '18px', lineHeight: 1 }}>
                            {isOpen ? '−' : '+'}
                          </span>
                        </div>
                        {isOpen && (
                          <div
                            style={{
                              marginTop: 'var(--space-12)',
                              paddingTop: 'var(--space-12)',
                              borderTop: '1px solid var(--divider)',
                              fontSize: '14px',
                              color: 'var(--text-muted)',
                              lineHeight: 1.65,
                            }}
                          >
                            {item.a}
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Still have an unanswered question?"
        description="Reach out to our team directly. We answer every inquiry with engineering precision."
        primaryLabel="Contact Us"
        primaryHref="#/contact"
        secondaryLabel="Explore Roadmap"
        secondaryHref="#/roadmap"
      />
    </div>
  );
};
