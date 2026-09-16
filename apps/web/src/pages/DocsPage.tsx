import React, { useState, useMemo } from 'react';
import { SEOHead } from '../components/ui/SEOHead';

interface DocArticle {
  id: string;
  category: string;
  title: string;
  readTime: string;
  summary: string;
  codeSnippet?: { language: string; code: string };
  shortcuts?: { key: string; action: string }[];
  callout?: { title: string; text: string; type: 'info' | 'security' | 'architecture' };
  sections: { heading: string; content: string }[];
}

const ARTICLES: DocArticle[] = [
  {
    id: 'installation',
    category: 'GETTING STARTED',
    title: 'Installation & System Architecture',
    readTime: '3 min read',
    summary: 'Installing the Syntaflow Desktop runtime, OS keychain integration, and local SQLite data paths.',
    callout: {
      title: 'Local-First Persistence Guarantee',
      text: 'All workspaces, commercial rates, blueprints, and documents are stored physically within an embedded SQLite database on your local drive. No cloud server maintains a mirror.',
      type: 'architecture',
    },
    shortcuts: [
      { key: '⌘ / Ctrl + K', action: 'Global Command Palette & Switcher' },
      { key: '⌘ / Ctrl + ,', action: 'Open Workspace & Integration Settings' },
    ],
    sections: [
      {
        heading: '1. Hardware & System Prerequisites',
        content: 'Syntaflow Preview requires a 64-bit Windows 10 or 11 workstation. A minimum of 4 GB RAM is recommended. Storage footprint is strictly lightweight (approx. 250 MB for runtime binaries and localized database indices).',
      },
      {
        heading: '2. Cryptographic Credential Isolation',
        content: 'Upon first launch, Syntaflow creates a secure local profile. Your credentials are scrypt-hashed on your workstation. Integration OAuth tokens are encrypted with Windows DPAPI via Electron safeStorage.',
      },
    ],
    codeSnippet: {
      language: 'bash',
      code: '# Verify local database location\n%APPDATA%\\Syntaflow\\storage\\syntaflow.db\n\n# Database integrity check\nsqlite3 syntaflow.db "PRAGMA integrity_check;"',
    },
  },
  {
    id: 'client-ops',
    category: 'CORE CONCEPTS',
    title: 'Client Operations & Commercial Terms',
    readTime: '4 min read',
    summary: 'Structuring client relationship records, fixed and retainer commercial terms, and multi-project runways.',
    shortcuts: [
      { key: '⌘ / Ctrl + N', action: 'New Client Relationship Studio' },
      { key: '⌘ / Ctrl + B', action: 'Instantiate Project Blueprint' },
    ],
    sections: [
      {
        heading: '1. Single Canonical Client Record',
        content: 'In Syntaflow, tasks, proposals, and documents are never orphaned. Every artifact belongs to an overarching Client Record containing commercial terms, billing rates, primary decision-makers, and active project threads.',
      },
      {
        heading: '2. Commercial Runway Calculation',
        content: 'The Operator Cockpit monitors unbilled milestones, active retainers, and turnaround SLAs. When a milestone review deadline approaches, Syntaflow surfaces alerts in the Cockpit without requiring third-party monitoring plugins.',
      },
    ],
  },
  {
    id: 'blueprints-tasks',
    category: 'WORKFLOW ENGINES',
    title: 'Blueprint Scoping & Dual-Density Tasks',
    readTime: '5 min read',
    summary: 'Instantiating pre-packaged project blueprints and managing tasks with decoupled 3D state.',
    callout: {
      title: 'Decoupled 3D State Machine',
      text: 'Syntaflow never collapses workflow state into a single status field. Tasks maintain three independent dimensions: Lifecycle Stage, Operational Attention, and Security Access.',
      type: 'info',
    },
    shortcuts: [
      { key: '⌘ / Ctrl + T', action: 'Toggle Kanban Board vs Compact List' },
      { key: 'Space', action: 'Toggle Task Completion Status' },
    ],
    sections: [
      {
        heading: '1. Blueprint Scoping Studio',
        content: 'Blueprints allow boutique agencies to package recurring service engagements (such as Brand Identity Suite, Executive Strategy Retainer, or Web Experience) with predetermined milestones, deliverables, and estimation schedules.',
      },
      {
        heading: '2. Dual-Density Task Surfaces',
        content: 'Switch effortlessly between a visual Kanban board and a high-density, keyboard-driven list. Tasks reflect real-time attention signals (Waiting on Client, Blocked, Overdue) and associate directly with project deliverables.',
      },
    ],
    codeSnippet: {
      language: 'json',
      code: '{\n  "taskId": "task_acme_042",\n  "stage": "in_progress",\n  "attention": "waiting_on_client",\n  "securityTier": "confidential",\n  "linkedDeliverable": "doc_guidelines_v03"\n}',
    },
  },
  {
    id: 'documents-reviews',
    category: 'WORKFLOW ENGINES',
    title: 'Typographic Canvas & Immutable Reviews',
    readTime: '5 min read',
    summary: 'Composing on physical 780px paper, freezing cryptographic snapshots, and enforcing legally defensible reviews.',
    callout: {
      title: 'Document Version Immutability Rule',
      text: 'Submitted document versions (DocVersion) are strictly immutable. Review decisions bind to exact version snapshots. Revisions occur on incremented drafts.',
      type: 'security',
    },
    shortcuts: [
      { key: '⌘ / Ctrl + D', action: 'Open Paper Canvas Studio' },
      { key: '⌘ / Ctrl + R', action: 'Transmit Document for Client Review' },
    ],
    sections: [
      {
        heading: '1. Typographic Paper Canvas',
        content: 'Proposals, design briefs, and strategy specifications are drafted on a physical 780px paper canvas. Typography adheres to a calibrated baseline grid, ensuring presentation clarity both on screen and in exported PDF deliverables.',
      },
      {
        heading: '2. Cryptographic Review Snapshots',
        content: 'When you transmit a document for client sign-off, Syntaflow creates a frozen DocVersion snapshot with a SHA-256 hash. When a client approves or marks revisions, their decision binds irrevocably to that specific snapshot.',
      },
    ],
  },
  {
    id: 'delivery-gates',
    category: 'WORKFLOW ENGINES',
    title: 'Delivery Gate Enforcement & Handover',
    readTime: '4 min read',
    summary: 'Enforcing prerequisite deliverable approvals before final release package generation.',
    sections: [
      {
        heading: '1. Delivery Gate Invariant',
        content: 'Syntaflow enforces that no project can be archived or marked handed over until all prerequisite milestone deliverables possess verified, timestamped client approvals.',
      },
      {
        heading: '2. Automated Release Package Manifest',
        content: 'Upon gate clearance, Syntaflow compiles a sealed handover package containing immutable PDFs, vector assets, and an audit manifest log of all client decisions.',
      },
    ],
  },
  {
    id: 'oauth-vault',
    category: 'INTEGRATIONS & SECURITY',
    title: 'Integrations & RFC 8252 OAuth Vault',
    readTime: '6 min read',
    summary: 'Connecting Google Workspace, GitHub, and Slack via loopback PKCE with local DPAPI credential storage.',
    callout: {
      title: 'Google Limited Use & Zero-Mirroring',
      text: 'Syntaflow accesses Google data (Gmail, Calendar, Drive) solely on demand on your workstation. It does not transfer Google user data to cloud AI models or external servers.',
      type: 'security',
    },
    sections: [
      {
        heading: '1. RFC 8252 Loopback Architecture',
        content: 'Connecting Google services triggers a secure browser handshake. Authorization codes are returned to a localized loopback listener on 127.0.0.1 with PKCE state validation, completely bypassing remote cloud proxies.',
      },
      {
        heading: '2. Instant Token Revocation',
        content: 'Every integration can be revoked with a single click in Settings. Upon revocation, tokens are immediately purged from the OS Keychain and local SQLite tables.',
      },
    ],
    codeSnippet: {
      language: 'typescript',
      code: '// Syntaflow Local OAuth Vault Contract\ninterface OAuthTokenRecord {\n  provider: "google" | "github" | "slack";\n  encryptedToken: Uint8Array; // AES-256-GCM via DPAPI\n  scopes: string[];\n  lastRefreshedAt: string;\n}',
    },
  },
];

export const DocsPage: React.FC = () => {
  const [activeArticleId, setActiveArticleId] = useState('installation');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return ARTICLES;
    const q = searchQuery.toLowerCase();
    return ARTICLES.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const activeArticle = ARTICLES.find((a) => a.id === activeArticleId) || ARTICLES[0];

  // Group filtered articles by category
  const categories = useMemo(() => {
    const cats: { [key: string]: DocArticle[] } = {};
    filteredArticles.forEach((art) => {
      if (!cats[art.category]) cats[art.category] = [];
      cats[art.category].push(art);
    });
    return cats;
  }, [filteredArticles]);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div style={{ paddingBottom: 'var(--space-80)', fontFamily: 'var(--font-body)' }}>
      <SEOHead
        title="Documentation — Syntaflow Knowledge Hub"
        description="Comprehensive technical and workflow documentation for Syntaflow Desktop. Architecture, Client Ops, Blueprints, Documents, Reviews, and OAuth Vault."
        path="/docs"
      />

      {/* Hero Header */}
      <section className="section" style={{ paddingTop: 'var(--space-48)', paddingBottom: 'var(--space-28)', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: '1120px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-12)' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              KNOWLEDGE HUB // DOCUMENTATION
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>·</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Desktop Runtime v0.1.0-preview</span>
          </div>

          <h1 className="heading-1" style={{ fontSize: 'clamp(28px, 4vw, 42px)', color: 'var(--text)', marginBottom: 'var(--space-12)' }}>
            Syntaflow Documentation
          </h1>

          <p style={{ fontSize: '16px', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '720px', margin: 0 }}>
            Architecture guides, keyboard workflows, and domain invariants for the connected operating environment.
          </p>
        </div>
      </section>

      {/* Main 2-Column Documentation Surface */}
      <section className="section" style={{ paddingTop: 'var(--space-36)' }}>
        <div className="container" style={{ maxWidth: '1120px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 'var(--space-40)' }} className="docs-layout-grid">

            {/* Sticky Left Navigation Sidebar */}
            <aside style={{ position: 'sticky', top: '90px', alignSelf: 'start' }}>
              {/* Search Filter Input */}
              <div style={{ marginBottom: 'var(--space-20)' }}>
                <input
                  type="text"
                  placeholder="Search articles & concepts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--surface-raised)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Categorized Nav Tree */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-20)' }}>
                {Object.keys(categories).map((cat) => (
                  <div key={cat}>
                    <div style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)', letterSpacing: '0.08em', marginBottom: '8px', paddingLeft: '8px' }}>
                      {cat}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      {categories[cat].map((art) => {
                        const active = art.id === activeArticleId;
                        return (
                          <button
                            key={art.id}
                            type="button"
                            onClick={() => setActiveArticleId(art.id)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '7px 10px',
                              borderRadius: '4px',
                              backgroundColor: active ? 'rgba(6, 182, 212, 0.12)' : 'transparent',
                              color: active ? 'var(--cyan)' : 'var(--text-muted)',
                              border: '1px solid',
                              borderColor: active ? 'rgba(6, 182, 212, 0.3)' : 'transparent',
                              textAlign: 'left',
                              fontSize: '13px',
                              fontWeight: active ? 600 : 400,
                              cursor: 'pointer',
                              transition: 'all var(--transition-fast)',
                            }}
                          >
                            <span>{art.title}</span>
                            <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: active ? 'var(--cyan)' : 'var(--text-disabled)' }}>
                              {art.readTime.split(' ')[0]}m
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </aside>

            {/* Article Content Surface */}
            <main style={{ minWidth: 0 }}>
              {/* Article Header */}
              <div style={{ marginBottom: 'var(--space-24)', paddingBottom: 'var(--space-16)', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  <span>{activeArticle.category}</span>
                  <span>·</span>
                  <span style={{ color: 'var(--text-metadata)' }}>{activeArticle.readTime}</span>
                </div>
                <h2 style={{ fontSize: '28px', fontWeight: 650, color: 'var(--text)', margin: '0 0 10px 0' }}>
                  {activeArticle.title}
                </h2>
                <p style={{ fontSize: '15.5px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                  {activeArticle.summary}
                </p>
              </div>

              {/* Callout Banner (if present) */}
              {activeArticle.callout && (
                <div
                  style={{
                    padding: '16px 20px',
                    borderRadius: '8px',
                    backgroundColor: activeArticle.callout.type === 'security' ? 'rgba(16, 185, 129, 0.08)' : (activeArticle.callout.type === 'architecture' ? 'rgba(6, 182, 212, 0.08)' : 'rgba(37, 99, 235, 0.08)'),
                    border: '1px solid',
                    borderColor: activeArticle.callout.type === 'security' ? 'rgba(16, 185, 129, 0.25)' : (activeArticle.callout.type === 'architecture' ? 'rgba(6, 182, 212, 0.25)' : 'rgba(37, 99, 235, 0.25)'),
                    marginBottom: 'var(--space-28)',
                  }}
                >
                  <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: activeArticle.callout.type === 'security' ? '#10B981' : (activeArticle.callout.type === 'architecture' ? 'var(--cyan)' : '#60A5FA'), marginBottom: '4px', fontWeight: 600 }}>
                    CANONICAL RULE: {activeArticle.callout.title}
                  </div>
                  <p style={{ fontSize: '13.5px', color: 'var(--text)', margin: 0, lineHeight: 1.6 }}>
                    {activeArticle.callout.text}
                  </p>
                </div>
              )}

              {/* Subsections */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-28)', marginBottom: 'var(--space-32)' }}>
                {activeArticle.sections.map((sec, idx) => (
                  <div key={idx}>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>
                      {sec.heading}
                    </h3>
                    <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>
                      {sec.content}
                    </p>
                  </div>
                ))}
              </div>

              {/* Keyboard Shortcuts Cheat Sheet (if present) */}
              {activeArticle.shortcuts && (
                <div style={{ marginBottom: 'var(--space-32)', backgroundColor: 'var(--surface-raised)', borderRadius: '8px', border: '1px solid var(--border)', padding: '16px 20px' }}>
                  <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)', textTransform: 'uppercase', marginBottom: '12px' }}>
                    KEYBOARD SHORTCUTS
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
                    {activeArticle.shortcuts.map((sc, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: 'var(--canvas)', borderRadius: '4px', border: '1px solid var(--border)', fontSize: '12.5px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{sc.action}</span>
                        <code style={{ fontSize: '11.5px', color: 'var(--cyan)' }}>{sc.key}</code>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Code Snippet Box (if present) */}
              {activeArticle.codeSnippet && (
                <div style={{ marginBottom: 'var(--space-32)', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 16px', backgroundColor: '#14181C', borderBottom: '1px solid var(--border)', fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)' }}>
                    <span>{activeArticle.codeSnippet.language.toUpperCase()}</span>
                    <button
                      type="button"
                      onClick={() => copyCode(activeArticle.codeSnippet!.code)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: copiedCode ? '#10B981' : 'var(--cyan)',
                        fontSize: '11px',
                        fontFamily: 'var(--font-mono)',
                        cursor: 'pointer',
                      }}
                    >
                      {copiedCode ? '✓ Copied' : 'Copy Snippet'}
                    </button>
                  </div>
                  <pre style={{ margin: 0, padding: '16px', backgroundColor: '#0A0C0E', color: '#E2E8F0', fontSize: '12.5px', fontFamily: 'var(--font-mono)', lineHeight: 1.6, overflowX: 'auto' }}>
                    <code>{activeArticle.codeSnippet.code}</code>
                  </pre>
                </div>
              )}

              {/* Navigation Footer (Next/Previous) */}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 'var(--space-24)', borderTop: '1px solid var(--border)' }}>
                {(() => {
                  const currentIndex = ARTICLES.findIndex((a) => a.id === activeArticle.id);
                  const prev = currentIndex > 0 ? ARTICLES[currentIndex - 1] : null;
                  const next = currentIndex < ARTICLES.length - 1 ? ARTICLES[currentIndex + 1] : null;
                  return (
                    <>
                      {prev ? (
                        <button
                          type="button"
                          onClick={() => setActiveArticleId(prev.id)}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            background: 'none',
                            border: '1px solid var(--border)',
                            padding: '12px 18px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            textAlign: 'left',
                          }}
                          className="interactive-lift"
                        >
                          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)' }}>&larr; PREVIOUS</span>
                          <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text)', marginTop: '2px' }}>{prev.title}</span>
                        </button>
                      ) : <div />}

                      {next ? (
                        <button
                          type="button"
                          onClick={() => setActiveArticleId(next.id)}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            background: 'none',
                            border: '1px solid var(--border)',
                            padding: '12px 18px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            textAlign: 'right',
                          }}
                          className="interactive-lift"
                        >
                          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)' }}>NEXT &rarr;</span>
                          <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text)', marginTop: '2px' }}>{next.title}</span>
                        </button>
                      ) : <div />}
                    </>
                  );
                })()}
              </div>

            </main>
          </div>
        </div>
      </section>
    </div>
  );
};
