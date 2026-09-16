import React, { useState, useMemo } from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

interface FAQItem {
  id: string;
  category: string;
  q: string;
  a: string;
  details?: string[];
  link?: { text: string; href: string };
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 'what-is-syntaflow',
    category: 'PRODUCT & WORKFLOW',
    q: 'What is Syntaflow and what problem does it solve?',
    a: 'Syntaflow is an intelligent operating environment engineered specifically for high-accountability client work. It connects client relationships, commercial rates, blueprint scoping, dual-density task boards, typographic document drafting, client review sign-offs, and gated delivery packages into a single continuous desktop workspace.',
    details: [
      'Unifies client context across briefing, scoping, drafting, and delivery.',
      'Eliminates fragmented SaaS stacks (disjointed Notion, Linear, Slack, Google Drive).',
      'Provides legally defensible client review snapshots bound to exact versions.',
    ],
    link: { text: 'Explore Product Overview', href: '#/product/overview' },
  },
  {
    id: 'who-is-it-for',
    category: 'PRODUCT & WORKFLOW',
    q: 'Who is Syntaflow built for?',
    a: 'It is built for independent strategy consultants, design and software studios, boutique creative agencies, and solo operators delivering high-stakes engagements who need auditable review records and zero SaaS sprawl.',
    details: [
      'Independent consultants billing day rates or milestone retainers.',
      'Boutique agencies managing multi-stage client approval pipelines.',
      'Solo practitioners requiring local privacy and defensible sign-offs.',
    ],
    link: { text: 'Explore Studio Solutions', href: '#/solutions/studios' },
  },
  {
    id: 'dual-density-tasks',
    category: 'PRODUCT & WORKFLOW',
    q: 'How do Dual-Density Tasks work?',
    a: 'Tasks can be viewed as visual Kanban cards or high-density keyboard-driven tables. Unlike generic project managers, tasks in Syntaflow maintain decoupled 3D state: operational stage (To Do, In Progress, Review, Done), attention urgency (Waiting on Client, Blocked, Normal), and security access tier.',
    details: [
      '3-dimensional state decoupling preserves nuanced client statuses without conflation.',
      'Full keyboard navigation (J/K movement, Enter to inspect, Esc to collapse).',
      'Tasks bind directly to blueprint scoping phases and document deliverables.',
    ],
    link: { text: 'Learn Tasks Architecture', href: '#/product/projects-tasks' },
  },
  {
    id: 'delivery-gate-enforcement',
    category: 'PRODUCT & WORKFLOW',
    q: 'How does the Delivery Gate prevent premature handover?',
    a: 'The delivery package builder enforces that final handover packages (deliverable zips, signed contracts, export artifacts) cannot be sealed or dispatched until every prerequisite milestone deliverable has reached an explicit "Approved" state stamped by the client.',
    details: [
      'Automated dependency graph checks prior to delivery generation.',
      'Immutable cryptographic hash stamped onto each final delivery package.',
      'Eliminates disputes over whether work was completed before handover.',
    ],
    link: { text: 'Learn Delivery Approvals', href: '#/product/delivery-approvals' },
  },
  {
    id: 'offline-sqlite',
    category: 'PLATFORM & SQLITE',
    q: 'Does Syntaflow work completely offline?',
    a: 'Yes. Syntaflow is architected local-first on top of an embedded physical SQLite database on your local workstation. You can scope proposals, draft documents, manage tasks, and record review marks with zero active internet connection.',
    details: [
      'Zero network latency when navigating large documents or blueprint databases.',
      'Data resides directly on your physical drive, immune to cloud downtime.',
      'Automatic optimistic writes with immediate disk persistence.',
    ],
  },
  {
    id: 'supported-os',
    category: 'PLATFORM & SQLITE',
    q: 'Which operating systems are currently supported?',
    a: 'The current Desktop Preview is built natively for 64-bit Windows 10 and 11. Native builds for Apple Silicon (macOS) and Linux (AppImage / deb) are in active development and will enter beta testing soon.',
    details: [
      'Windows 10/11 x64: Available now as standalone installer (.exe).',
      'macOS (Apple Silicon & Intel): In active engineering pipeline.',
      'Linux (x86_64 AppImage / deb): Waitlist open.',
    ],
    link: { text: 'View Download Page', href: '#/download' },
  },
  {
    id: 'data-storage-location',
    category: 'PLATFORM & SQLITE',
    q: 'Where is my workspace data stored physically on my device?',
    a: 'All records live locally in your operating system application data directory. On Windows, this is %APPDATA%\\Syntaflow\\storage\\syntaflow.db. We do not operate cloud databases that mirror or store your client contracts, blueprints, or documents.',
    details: [
      'Physical SQLite file located on your workstation disk.',
      'Full database export (.sqlite / .db) accessible via Settings with one click.',
      'Zero remote database synchronization servers.',
    ],
    link: { text: 'Read Data Handling Policy', href: '#/trust/data-handling' },
  },
  {
    id: 'google-data-access',
    category: 'PRIVACY & GOOGLE DATA',
    q: 'What Google user data does Syntaflow access and why?',
    a: 'Syntaflow only requests access to Google data needed for explicit user-activated features: Gmail messages matching client email addresses, Google Calendar events for milestone scheduling, and user-selected files in Google Drive. All access adheres strictly to the Google API Services User Data Policy, including the Limited Use requirements.',
    details: [
      'Only user-activated integration scopes are requested.',
      'OAuth tokens are stored locally in the OS keychain (Windows DPAPI) and never sent to our servers.',
      'Zero cross-client data correlation or unauthorized background indexing.',
    ],
    link: { text: 'Inspect Full Privacy Disclosures', href: '#/privacy' },
  },
  {
    id: 'google-limited-use',
    category: 'PRIVACY & GOOGLE DATA',
    q: 'Does Syntaflow sell Google data or use it to train AI models?',
    a: 'Never. Under our Google Limited Use compliance commitment, Syntaflow does not sell user data, does not use it for advertising or retargeting, does not allow human inspection without explicit written consent, and never uses Google user data to train, retrain, or improve generalized machine learning or AI models.',
    details: [
      'Strict adherence to Google API Services User Data Policy (Limited Use).',
      'No behavioral advertising or ad profiling of any kind.',
      'Explicit zero-retention guarantee for cloud AI models.',
    ],
    link: { text: 'Read Google Limited Use Section', href: '#/privacy' },
  },
  {
    id: 'token-revocation',
    category: 'INTEGRATIONS & MCP',
    q: 'How do I disconnect integrations and revoke tokens?',
    a: 'You can disconnect any integration with a single click in Settings > Integrations. Tokens are immediately purged from your operating system keychain (Windows DPAPI via Electron safeStorage) and removed from your local SQLite database.',
    details: [
      'Immediate local credential erasure upon disconnect.',
      'OAuth grant revocation request dispatched to the identity provider.',
      'No orphaned credentials remain on device.',
    ],
  },
  {
    id: 'connected-services',
    category: 'INTEGRATIONS & MCP',
    q: 'Which third-party services can I integrate with?',
    a: 'Syntaflow integrates with Google Workspace (Gmail, Calendar, Drive, Docs, Sheets), GitHub, Figma, Notion, Slack, and Linear using direct OAuth 2.0 PKCE loopback bridges or official Model Context Protocol (MCP) servers.',
    details: [
      'Direct OAuth 2.0 PKCE loopback (RFC 8252 BCP-212 compliant).',
      'MCP (Model Context Protocol) server registry for extensible tool access.',
      'All integration operations execute locally from your desktop runtime.',
    ],
    link: { text: 'Browse Integrations Catalog', href: '#/integrations' },
  },
  {
    id: 'contextual-ai',
    category: 'AI CONTEXT ENGINE',
    q: 'How does Syntaflow use artificial intelligence?',
    a: 'Syntaflow utilizes local contextual synthesis rather than generic chatbot prompts. It correlates attached briefs, correspondence, and project blueprints so you can draft specifications and summarize meeting decisions without re-explaining context. AI actions never execute without your explicit review and sign-off.',
    details: [
      'Grounded in active workspace documents, briefs, and client notes.',
      'No generalized model training on your proprietary data.',
      'Full human-in-the-loop oversight before any draft or status change is committed.',
    ],
    link: { text: 'Learn AI Engine Architecture', href: '#/docs' },
  },
  {
    id: 'preview-pricing',
    category: 'PRICING & PREVIEW',
    q: 'Is the Desktop Preview free?',
    a: 'Yes. Syntaflow Desktop Preview is completely free of charge ($0) with full access to all workspace domains, document editing, local SQLite storage, and core integrations. Upcoming commercial tiers (Pro and Studio) will be announced prior to general availability.',
    details: [
      '$0 free of charge during preview release.',
      'No credit card or payment information required.',
      'All data created during preview remains 100% yours to keep indefinitely.',
    ],
    link: { text: 'View Pricing Details', href: '#/pricing' },
  },
  {
    id: 'commercial-use',
    category: 'PRICING & PREVIEW',
    q: 'Can I use the Preview release for actual commercial client work?',
    a: 'Yes. The Desktop Preview is engineered for real production productivity. You retain 100% exclusive ownership and copyright over all client contracts, documents, blueprints, and deliverables you produce.',
    details: [
      '100% commercial-use permitted under Preview license.',
      'Zero royalty or telemetry claims by Syntaflow.',
      'Full local export capabilities for client handover.',
    ],
    link: { text: 'Read Terms of Service', href: '#/terms' },
  },
];

const CATEGORIES = [
  'ALL QUESTIONS',
  'PRODUCT & WORKFLOW',
  'PLATFORM & SQLITE',
  'PRIVACY & GOOGLE DATA',
  'INTEGRATIONS & MCP',
  'AI CONTEXT ENGINE',
  'PRICING & PREVIEW',
];

export const FAQPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL QUESTIONS');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(['what-is-syntaflow', 'offline-sqlite']));

  const toggleItem = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredItems = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCat = activeCategory === 'ALL QUESTIONS' || item.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.q.toLowerCase().includes(q) ||
        item.a.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div style={{ paddingBottom: 'var(--space-80)', fontFamily: 'var(--font-body)', position: 'relative', overflow: 'hidden' }}>
      <SEOHead
        title="Frequently Asked Questions — Syntaflow"
        description="Clear, direct answers regarding Syntaflow Desktop, local SQLite persistence, Google OAuth data usage, pricing, and system architecture."
        path="/faq"
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

      {/* Hero Header */}
      <section className="section" style={{ paddingTop: 'var(--space-48)', paddingBottom: 'var(--space-32)', borderBottom: '1px solid var(--border)', position: 'relative', zIndex: 1 }}>
        <div className="container" style={{ maxWidth: '960px', textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 14px',
              borderRadius: '100px',
              backgroundColor: 'rgba(6, 182, 212, 0.1)',
              border: '1px solid rgba(6, 182, 212, 0.28)',
              marginBottom: 'var(--space-14)',
            }}
          >
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              TECHNICAL & OPERATIONAL KNOWLEDGE
            </span>
          </div>

          <h1
            className="heading-1"
            style={{
              fontSize: 'clamp(28px, 4.2vw, 44px)',
              color: 'var(--text)',
              marginBottom: 'var(--space-12)',
              letterSpacing: '-0.025em',
            }}
          >
            Frequently Asked Questions
          </h1>

          <p style={{ fontSize: '16px', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '640px', margin: '0 auto var(--space-28) auto' }}>
            Direct, technical answers about our local-first architecture, privacy guarantees, Google integration compliance, and preview conditions.
          </p>

          {/* Instant Search Bar */}
          <div style={{ maxWidth: '580px', margin: '0 auto', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search questions (e.g. SQLite, offline, Google data, pricing, delivery gate)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '13px 20px',
                paddingLeft: '44px',
                borderRadius: '8px',
                backgroundColor: 'var(--surface-raised)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                fontSize: '14px',
                boxShadow: '0 8px 24px -6px rgba(0, 0, 0, 0.5)',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s ease',
              }}
            />
            {/* Search Icon */}
            <div
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '15px',
                color: 'var(--text-metadata)',
                pointerEvents: 'none',
              }}
            >
              🔍
            </div>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-metadata)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  padding: '4px',
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 2-Column Reader Layout */}
      <section className="section" style={{ paddingTop: 'var(--space-36)', position: 'relative', zIndex: 1 }}>
        <div className="container" style={{ maxWidth: '1160px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '280px 1fr',
              gap: 'var(--space-40)',
            }}
            className="faq-layout-grid"
          >
            {/* Left Column: Sticky Category Navigation & Support Card */}
            <aside style={{ position: 'sticky', top: '90px', alignSelf: 'start' }}>
              <div style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
                CATEGORIES
              </div>

              {/* Category Buttons List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: 'var(--space-28)' }}>
                {CATEGORIES.map((cat) => {
                  const active = activeCategory === cat;
                  const count = cat === 'ALL QUESTIONS' ? FAQ_DATA.length : FAQ_DATA.filter((i) => i.category === cat).length;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '6px',
                        border: '1px solid',
                        borderColor: active ? 'rgba(6, 182, 212, 0.4)' : 'transparent',
                        backgroundColor: active ? 'rgba(6, 182, 212, 0.12)' : 'transparent',
                        color: active ? 'var(--cyan)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        fontSize: '12.5px',
                        fontWeight: active ? 600 : 400,
                        textAlign: 'left',
                        transition: 'all 0.15s ease',
                      }}
                      className="interactive-lift"
                    >
                      <span>{cat}</span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontFamily: 'var(--font-mono)',
                          padding: '1px 6px',
                          borderRadius: '100px',
                          backgroundColor: active ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                          color: active ? 'var(--cyan)' : 'var(--text-metadata)',
                        }}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Still Have Questions Box */}
              <Card
                variant="raised"
                style={{
                  padding: 'var(--space-20)',
                  backgroundColor: 'var(--surface-raised)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                }}
              >
                <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600 }}>
                  OPERATOR SUPPORT
                </div>
                <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>
                  Have an unlisted question?
                </div>
                <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 'var(--space-16)' }}>
                  Our engineering team answers architectural and privacy inquiries directly.
                </p>
                <Button
                  variant="secondary"
                  href="mailto:support@syntaflow.tech"
                  style={{ width: '100%', textAlign: 'center', fontSize: '12px', padding: '8px 12px' }}
                >
                  Contact Support &rarr;
                </Button>
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px', fontSize: '11.5px', color: 'var(--text-metadata)', justifyContent: 'center' }}>
                  <a href="#/docs" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>Read Docs</a>
                  <span>·</span>
                  <a href="#/privacy" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>Privacy Policy</a>
                </div>
              </Card>
            </aside>

            {/* Right Column: Accordion Questions */}
            <div>
              {/* Filter Results Summary */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-16)', paddingBottom: 'var(--space-12)', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)' }}>
                  SHOWING {filteredItems.length} {filteredItems.length === 1 ? 'QUESTION' : 'QUESTIONS'}
                  {activeCategory !== 'ALL QUESTIONS' && ` IN ${activeCategory}`}
                  {searchQuery && ` MATCHING "${searchQuery}"`}
                </span>
                {(activeCategory !== 'ALL QUESTIONS' || searchQuery) && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCategory('ALL QUESTIONS');
                      setSearchQuery('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--cyan)',
                      fontSize: '11.5px',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    Reset filters
                  </button>
                )}
              </div>

              {filteredItems.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: 'var(--space-64) var(--space-24)',
                    backgroundColor: 'var(--surface-raised)',
                    borderRadius: '10px',
                    border: '1px solid var(--border)',
                    color: 'var(--text-muted)',
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '10px' }}>🔍</div>
                  <div style={{ fontSize: '16px', fontWeight: 650, color: 'var(--text)', marginBottom: '6px' }}>
                    No matching questions found
                  </div>
                  <p style={{ fontSize: '13.5px', maxWidth: '440px', margin: '0 auto var(--space-20) auto' }}>
                    We could not find any question matching &ldquo;{searchQuery}&rdquo;. Try another term or contact our engineering desk.
                  </p>
                  <Button variant="secondary" onClick={() => setSearchQuery('')}>
                    Clear Search
                  </Button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-14)' }}>
                  {filteredItems.map((item) => {
                    const isOpen = openIds.has(item.id);
                    return (
                      <div
                        key={item.id}
                        style={{
                          borderRadius: '10px',
                          backgroundColor: 'var(--surface-raised)',
                          border: '1px solid',
                          borderColor: isOpen ? 'rgba(6, 182, 212, 0.4)' : 'rgba(255, 255, 255, 0.08)',
                          boxShadow: isOpen
                            ? '0 12px 32px -8px rgba(0, 0, 0, 0.6), 0 0 20px -4px rgba(6, 182, 212, 0.12)'
                            : 'none',
                          transition: 'all 0.2s ease',
                          overflow: 'hidden',
                        }}
                        className="interactive-lift"
                      >
                        <button
                          type="button"
                          onClick={() => toggleItem(item.id)}
                          style={{
                            width: '100%',
                            padding: '18px 22px',
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            gap: '16px',
                            background: 'none',
                            border: 'none',
                            textAlign: 'left',
                            cursor: 'pointer',
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: '5px', letterSpacing: '0.04em' }}>
                              {item.category}
                            </div>
                            <div
                              style={{
                                fontSize: '16px',
                                fontWeight: 650,
                                color: isOpen ? 'var(--text)' : '#E2E8F0',
                                lineHeight: 1.35,
                                letterSpacing: '-0.01em',
                              }}
                            >
                              {item.q}
                            </div>
                          </div>

                          {/* Chevron / Toggle Icon */}
                          <div
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '6px',
                              backgroundColor: isOpen ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                              border: '1px solid',
                              borderColor: isOpen ? 'rgba(6, 182, 212, 0.3)' : 'rgba(255, 255, 255, 0.08)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: isOpen ? 'var(--cyan)' : 'var(--text-metadata)',
                              fontSize: '14px',
                              flexShrink: 0,
                              transform: isOpen ? 'rotate(180deg)' : 'none',
                              transition: 'transform 0.2s ease',
                            }}
                          >
                            ▼
                          </div>
                        </button>

                        {isOpen && (
                          <div
                            style={{
                              padding: '0 22px 20px 22px',
                              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                              paddingTop: '16px',
                              fontSize: '14px',
                              color: 'var(--text-muted)',
                              lineHeight: 1.65,
                            }}
                          >
                            <p style={{ margin: 0, marginBottom: item.details ? '12px' : '0', color: '#CBD5E1' }}>
                              {item.a}
                            </p>

                            {item.details && (
                              <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
                                {item.details.map((d, di) => (
                                  <li key={di}>{d}</li>
                                ))}
                              </ul>
                            )}

                            {item.link && (
                              <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                <a
                                  href={item.link.href}
                                  style={{
                                    fontSize: '12.5px',
                                    fontWeight: 600,
                                    color: 'var(--cyan)',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                  }}
                                >
                                  {item.link.text} &rarr;
                                </a>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
