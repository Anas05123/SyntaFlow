/**
 * D02-D04 · Document Workspace.
 *
 * A document is more than an editor: write, preview & export, and version
 * history are three views of one record. The save-state contract
 * (dirty / saving / saved / failed) is surfaced inline.
 */

import { useState } from 'react';

import { useStore } from '../state/store';
import { useOverlay } from '../ui/overlay';
import { navigate } from '../app/router';
import { formatDate, formatShortDate, initials, relative } from '../domain/dates';
import {
  Banner, Button, Card, CardBody, CardFoot, CardHead, Chip, Def, Defs, EmptyState,
  SaveStateIndicator, TabLink, Tabs, type SaveState,
} from '../ui/primitives';
import { Icon } from '../ui/Icon';
import { NotFound } from '../app/Shell';
import type { PresentationTemplate } from '../domain/types';
import { NORTHLIGHT_PORTFOLIO } from '../domain/portfolio';

type View = 'editor' | 'preview' | 'history';

const SECTION_BODY: Record<string, React.ReactNode> = {
  Positioning: (
    <>
      <p className="doc-p">
        Harbor &amp; Finch supply specialty ingredients to independent kitchens. The identity has to read as{' '}
        <strong>precise and generous</strong> at the same time — a supplier you trust with a signature dish, not a
        commodity line.
      </p>
      <p className="doc-p">
        The wordmark carries the weight. Everything else is a support system that lets the wordmark work at any size,
        in any medium, without supervision.
      </p>
    </>
  ),
  Wordmark: (
    <>
      <p className="doc-p">
        The wordmark is set in a modified grotesque with a horizontal stress on the ampersand. Two lockups are
        approved: horizontal for wide formats, stacked for square formats.
      </p>
      <ul className="doc-list">
        <li>Horizontal lockup — primary, used wherever width allows</li>
        <li>Stacked lockup — packaging, social avatars, stamps</li>
        <li>Mark only — favicons and physical embossing, minimum 8 mm</li>
      </ul>
    </>
  ),
  'Clear space and minimum size': (
    <>
      <p className="doc-p">
        Clear space equals the height of the lowercase <strong>h</strong> on all four sides. Nothing enters this
        field — no rules, no photography edges, no other logos.
      </p>
      <div className="doc-block" style={{ height: 150, marginTop: 16 }}>Clear-space diagram · image block</div>
      <p className="doc-p">Minimum sizes: 24 px digital, 18 mm print for the horizontal lockup.</p>
    </>
  ),
  Colour: (
    <>
      <p className="doc-p">
        The palette is built from a graphite structure with cobalt as a signature. Cobalt identifies action and
        state, never decoration.
      </p>
      <table className="doc-table">
        <thead>
          <tr><th>Role</th><th>Hex</th><th>Use</th></tr>
        </thead>
        <tbody>
          <tr><td>Harbor Cobalt</td><td>#2F6FEB</td><td>Primary action, active state</td></tr>
          <tr><td>Graphite</td><td>#14181C</td><td>Primary text, structure</td></tr>
          <tr><td>Bone</td><td>#F4F6F8</td><td>Reversed surfaces</td></tr>
          <tr><td>Signal Green</td><td>#3FA66B</td><td>Approved, complete</td></tr>
        </tbody>
      </table>
      <p className="doc-p">Reversed wordmarks require a background luminance below 45% or a solid scrim at 60% opacity.</p>
    </>
  ),
  Typography: (
    <p className="doc-p">
      One family, Inter, across every application. Hierarchy comes from size and weight, not from additional
      typefaces.
    </p>
  ),
  Applications: (
    <p className="doc-p">
      Packaging, trade stand and stationery applications are shown at working scale. The reversed logo over
      photography section is still under review.
    </p>
  ),
  Contact: <p className="doc-p">Direct brand questions to Northlight Studio. Response within one working day.</p>,
};

export const INITIAL_SECTION_CONTENT: Record<string, string> = {
  Positioning:
    'Harbor & Finch supply specialty ingredients to independent kitchens. The identity has to read as precise and generous at the same time — a supplier you trust with a signature dish, not a commodity line.\n\nThe wordmark carries the weight. Everything else is a support system that lets the wordmark work at any size, in any medium, without supervision.',
  Wordmark:
    'The wordmark is set in a modified grotesque with a horizontal stress on the ampersand. Two lockups are approved: horizontal for wide formats, stacked for square formats.\n\n• Horizontal lockup — primary, used wherever width allows\n• Stacked lockup — packaging, social avatars, stamps\n• Mark only — favicons and physical embossing, minimum 8 mm',
  'Clear space and minimum size':
    'Clear space equals the height of the lowercase h on all four sides. Nothing enters this field — no rules, no photography edges, no other logos.\n\nMinimum sizes: 24 px digital, 18 mm print for the horizontal lockup.',
  Colour:
    'The palette is built from a graphite structure with cobalt as a signature. Cobalt identifies action and state, never decoration.\n\nHarbor Cobalt: #2F6FEB (Primary action, active state)\nGraphite: #14181C (Primary text, structure)\nBone: #F4F6F8 (Reversed surfaces)\nSignal Green: #3FA66B (Approved, complete)\n\nReversed wordmarks require a background luminance below 45% or a solid scrim at 60% opacity.',
  Typography:
    'One family, Inter, across every application. Hierarchy comes from size and weight, not from additional typefaces.',
  Applications:
    'Packaging, trade stand and stationery applications are shown at working scale. The reversed logo over photography section is still under review.',
  Contact:
    'Direct brand questions to Northlight Studio. Response within one working day.',

  // Proposal sections (doc-proposal-verity & doc-proposal-hf)
  Context:
    'Verity Health is redesigning its patient onboarding experience across web and mobile platforms. The current intake workflow suffers from high drop-off rates during medical history collection and insurance verification, averaging 14 minutes per completion.\n\nThis engagement delivers an end-to-end design system and responsive onboarding workflow that reduces time-to-complete under 6 minutes while maintaining strict HIPAA compliance.',
  Objectives:
    '• Streamline patient intake from 14 minutes to under 6 minutes across mobile and desktop devices.\n• Modernize visual design language to align with Verity Health’s precision clinical identity.\n• Implement accessible WCAG 2.1 AA compliant form interactions and input validation.\n• Deliver an interactive Figma prototype tested with 20 real patient cohorts prior to engineering handoff.',
  Scope:
    'Phase 1 encompasses research synthesis, patient journey mapping, wireframing, high-fidelity Figma components, design tokens, and developer specifications for:\n\n1. Welcome & authentication portal\n2. Identity & insurance capture with smart OCR fallback\n3. Progressive medical history disclosure\n4. Digital consent & signature verification\n5. Confirmation, doctor matching, and calendar appointment scheduling',
  Deliverables:
    '• Comprehensive Patient Onboarding Journey Map (PDF & Figma)\n• Responsive Figma Design System (tokens, inputs, patterns, dark & light themes)\n• High-fidelity click-through prototype in Figma\n• Usability testing report with 20 patient participants\n• Front-end developer handoff documentation & React component specifications',
  Schedule:
    '• Week 1–2: Discovery, Stakeholder Interviews & Journey Mapping\n• Week 3–4: Architecture, Wireframes & Low-Fidelity Testing\n• Week 5–7: High-Fidelity UI Design & Token System\n• Week 8–9: Usability Testing & Iteration Sprint\n• Week 10: Final Design Handoff & Engineering Walkthrough',
  Fees:
    'Total Fixed Engagement Fee: $48,000 USD\n\nStaged Milestone Payments:\n• Milestone 1 (Discovery & Architecture Sign-off): $16,000 (33%)\n• Milestone 2 (High-Fidelity UI & Token System): $16,000 (33%)\n• Milestone 3 (Usability Testing & Final Delivery): $16,000 (34%)\n\nInvoices issued on milestone completion with net-15 payment terms.',
  Assumptions:
    '• Verity Health provides access to HIPAA compliance team for design review checkpoints.\n• Clinical team participates in bi-weekly design review sessions.\n• Brand assets, typefaces, and third-party EHR API documentation provided at kickoff.\n• Revisions accommodated within scheduled review rounds per deliverable gate.',

  // Project brief sections (doc-brief-hf)
  Goals:
    'Establish a modern, cohesive brand identity for Harbor & Finch that positions the firm as a premier specialty supplier to Michelin-starred kitchens and boutique culinary programs.',
  Audience:
    'Executive chefs, restaurant owners, procurement managers, and culinary directors who value exceptional ingredient traceability, reliability, and precision.',
  Constraints:
    'Brand mark must scale flawlessly from 16px digital favicons to stamped metal crates and custom linen packaging. Strict palette limitations for packaging printing.',
  'Success criteria':
    '100% stakeholder approval on final guidelines, complete asset library delivered across print and digital formats, and zero reproduction errors across the initial packaging run.',

  // Welcome pack sections (doc-welcome-atlas)
  'Next steps':
    '1. Finalize engagement agreement and sign off on project deliverables.\n2. Schedule introductory discovery kickoff with key stakeholders.\n3. Access brand repository and existing collateral archives.',
  Milestones:
    '• Discovery & Asset Audit — Week 1\n• Concept Exploration & Direction Review — Week 3\n• Production Asset Packaging — Week 5\n• Final Handoff & Guidelines Publication — Week 6',
  'Required inputs':
    '• High-resolution existing logo files in vector format (.ai / .svg)\n• Current packaging die-lines and supplier print specifications\n• Brand stakeholder contact directory for design review approvals',
};

export function DocumentWorkspaceScreen({ documentId, view }: { documentId: string; view: string | null }) {
  const { state, dispatch, derived } = useStore();
  const overlay = useOverlay();
  const [activeSection, setActiveSection] = useState(0);
  const [exportPct, setExportPct] = useState<number | null>(null);

  const doc = derived.documentById(documentId);

  // Top-level hooks declared unconditionally before early return
  const [savedTexts, setSavedTexts] = useState<Record<string, string>>(() => {
    if (!doc) return {};
    const map: Record<string, string> = {};
    for (const s of doc.sections) {
      map[s] = INITIAL_SECTION_CONTENT[s] ?? '';
    }
    return map;
  });
  const [editedTexts, setEditedTexts] = useState<Record<string, string>>(() => ({ ...savedTexts }));
  const [save, setSave] = useState<SaveState>('saved');
  const [previewTemplate, setPreviewTemplate] = useState<PresentationTemplate>('executive');
  const [includePortfolioInPreview, setIncludePortfolioInPreview] = useState(true);

  if (!doc) return <NotFound kind="document" onHome={() => navigate('#/home')} />;

  const active: View = view === 'preview' || view === 'history' ? view : 'editor';

  const client = derived.clientById(doc.clientId);
  const project = derived.projectById(doc.projectId);
  const activeReview = derived.activeReviewOfDocument(doc.id);
  const versions = derived.reportsOfDocument(doc.id);
  const latest = doc.versions[0] ?? null;

  const activeSectionName = doc.sections[activeSection] ?? doc.sections[0] ?? '';

  const totalWords = Object.values(editedTexts).reduce(
    (acc, text) => acc + (text.trim() ? text.trim().split(/\s+/).length : 0),
    0
  );
  const totalChars = Object.values(editedTexts).reduce((acc, text) => acc + text.length, 0);
  const completedSections = doc.sections.filter((s) => (editedTexts[s] ?? '').trim().length > 0).length;
  const readingTimeMin = Math.max(1, Math.ceil(totalWords / 200));

  const handleSectionTextChange = (sectionName: string, value: string) => {
    const next = { ...editedTexts, [sectionName]: value };
    setEditedTexts(next);
    const isDirty = doc.sections.some((s) => (s === sectionName ? value : (next[s] ?? '')) !== (savedTexts[s] ?? ''));
    setSave(isDirty ? 'dirty' : 'saved');
  };

  const handleSave = () => {
    setSave('saving');
    window.setTimeout(() => {
      setSavedTexts({ ...editedTexts });
      setSave('saved');
      overlay.toast('Draft saved', `Saved changes for "${activeSectionName}".`, 'ok');
    }, 200);
  };

  const handleRevert = () => {
    setEditedTexts({ ...savedTexts });
    setSave('saved');
    overlay.toast('Changes reverted', 'Draft reverted to last saved state.', 'default');
  };

  /* Unified Studio Toolbar */
  const toolbar = (
    <header className="cd-doc-toolbar" aria-label="Document toolbar">
      <div className="cd-doc-toolbar-primary">
        <div className="cd-doc-toolbar-left">
          <span className="cd-doc-toolbar-title">{doc.title}</span>
          <div className="row" style={{ gap: 6 }}>
            <Chip state={doc.reviewState} />
            <Chip state={doc.visibility} />
            <span className="cd-doc-version-pill">
              Working draft v{doc.workingVersion}
              {doc.submittedVersion ? ` · submitted v${doc.submittedVersion}` : ' · never submitted'}
            </span>
          </div>
          <span className="cd-doc-toolbar-meta">
            {doc.type} · <a href={`#/clients/${client?.id}`}>{client?.name}</a> ·{' '}
            <a href={`#/projects/${project?.id}`}>{project?.name}</a>
          </span>
        </div>
        <div className="cd-doc-toolbar-right">
          <SaveStateIndicator state={save} />
          {save === 'dirty' ? (
            <Button size="sm" variant="primary" icon="check" onClick={handleSave}>
              Save draft
            </Button>
          ) : (
            <Button
              size="sm"
              variant="primary"
              icon="send"
              onClick={() => navigate(`#/share?document=${doc.id}`)}
            >
              Request review
            </Button>
          )}
        </div>
      </div>
      <div className="cd-doc-toolbar-tabs">
        <Tabs>
          <TabLink href={`#/documents/${doc.id}`} label="Write" selected={active === 'editor'} />
          <TabLink href={`#/documents/${doc.id}?view=preview`} label="Preview & export" selected={active === 'preview'} />
          <TabLink href={`#/documents/${doc.id}?view=history`} label="Version history" count={doc.versions.length} selected={active === 'history'} />
          {activeReview ? (
            <TabLink href={`#/documents/${doc.id}?view=guest-preview&review=${activeReview.id}`} label="Guest preview" selected={false} />
          ) : null}
        </Tabs>
      </div>
    </header>
  );

  /* ---- D02 Write ---- */
  if (active === 'editor') {
    return (
      <div className="cd-doc-workspace">
        {toolbar}
        <div className="doc-layout">
          {/* Left Sections Outline */}
          <aside className="doc-outline" aria-label="Document sections outline">
            <div className="cd-doc-outline-head">
              <div className="panel-section-title" style={{ margin: 0 }}>Sections</div>
              <span className="cd-doc-outline-badge">
                {completedSections}/{doc.sections.length} written
              </span>
            </div>

            <nav className="cd-doc-outline-list" aria-label="Sections list">
              {doc.sections.map((s, i) => {
                const text = editedTexts[s] ?? '';
                const isDirty = text !== (savedTexts[s] ?? '');
                const hasContent = text.trim().length > 0;
                const isActive = activeSection === i;

                return (
                  <button
                    key={s}
                    type="button"
                    className={`outline-item${isActive ? ' active' : ''}`}
                    onClick={() => {
                      setActiveSection(i);
                      const el = document.getElementById(`section-${i}`);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }}
                    aria-current={isActive ? 'true' : undefined}
                  >
                    <span className="cd-outline-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="cd-outline-label" style={{ flex: 1 }}>{s}</span>
                    <span
                      className={`cd-outline-status ${isDirty ? 'dirty' : hasContent ? 'completed' : 'empty'}`}
                      title={isDirty ? 'Unsaved edits' : hasContent ? 'Section complete' : 'Empty section'}
                    />
                  </button>
                );
              })}
            </nav>

            <div className="divider-h" style={{ margin: '8px 0' }} />

            <div className="panel-section-title" style={{ margin: '0 0 6px' }}>Document Stats</div>
            <div className="cd-doc-stats-grid">
              <div className="cd-doc-stat-row">
                <span className="meta">Total words</span>
                <span className="strong">{totalWords}</span>
              </div>
              <div className="cd-doc-stat-row">
                <span className="meta">Characters</span>
                <span className="strong">{totalChars}</span>
              </div>
              <div className="cd-doc-stat-row">
                <span className="meta">Reading time</span>
                <span className="strong">~{readingTimeMin} min</span>
              </div>
              <div className="cd-doc-stat-row">
                <span className="meta">Working version</span>
                <span className="strong">v{doc.workingVersion}</span>
              </div>
            </div>

            <div className="divider-h" style={{ margin: '8px 0' }} />

            <div className="cd-doc-tips">
              <span className="meta" style={{ lineHeight: 1.6 }}>
                <span style={{ display: 'inline-flex', verticalAlign: -1, marginRight: 4 }}>
                  <Icon name="check" size={12} />
                </span>
                Click any section to edit inline. Press <kbd>Ctrl+S</kbd> to save.
              </span>
            </div>
          </aside>

          {/* Center Writing Desk */}
          <div className="doc-body-col">
            <article className="doc-page">
              {/* Editorial Document Hero Header */}
              <header className="cd-doc-hero">
                <div className="cd-doc-eyebrow">
                  <span>{doc.type}</span>
                  <span>·</span>
                  <span>{client?.name ?? 'Client'}</span>
                  <span>·</span>
                  <span className="cd-doc-version-tag">Working Draft v{doc.workingVersion}</span>
                </div>
                <h1 className="doc-h1">{doc.title}</h1>
                <p className="cd-doc-sub">
                  Prepared by {state.workspace.ownerName} for {client?.name}
                  {project ? ` · Project: ${project.name}` : ''} · Last saved {relative(doc.modified)}
                </p>
              </header>

              {/* Continuous Sections */}
              <div className="cd-doc-content">
                {doc.sections.map((s, i) => {
                  const text = editedTexts[s] ?? '';
                  const isEditing = activeSection === i;
                  const isDirty = text !== (savedTexts[s] ?? '');
                  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

                  if (isEditing) {
                    return (
                      <section className="doc-section cd-section-editing-target" key={s} id={`section-${i}`}>
                        <div className="cd-doc-section-head">
                          <div className="row" style={{ gap: 8 }}>
                            <h2 className="doc-h2">{s}</h2>
                            {isDirty ? (
                              <Chip state="pending" label="Unsaved edits" />
                            ) : (
                              <Chip state="active" label="Saved" />
                            )}
                          </div>
                          <span className="meta">{words} words</span>
                        </div>

                        <div className="cd-section-editor-box">
                          <textarea
                            id={`editor-${i}`}
                            className="textarea cd-section-textarea"
                            aria-label={`Edit content for section ${s}`}
                            rows={Math.max(6, Math.min(22, (text.match(/\n/g) || []).length + 4))}
                            value={text}
                            onChange={(e) => handleSectionTextChange(s, e.target.value)}
                            onKeyDown={(e) => {
                              if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                                e.preventDefault();
                                handleSave();
                              }
                            }}
                            placeholder={`Write ${s} in plain text or structured notes...`}
                            autoFocus
                          />

                          <div className="cd-section-editor-footer">
                            <div className="row" style={{ gap: 8 }}>
                              <Button
                                size="sm"
                                variant="primary"
                                icon="check"
                                disabled={!isDirty || save === 'saving'}
                                onClick={handleSave}
                              >
                                {save === 'saving' ? 'Saving...' : 'Save section'}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                disabled={!isDirty || save === 'saving'}
                                onClick={handleRevert}
                              >
                                Revert
                              </Button>
                            </div>
                            <div className="row" style={{ gap: 12 }}>
                              <span className="meta">{words} words · {text.length} chars</span>
                              <span className="meta" style={{ fontStyle: 'italic' }}>Ctrl+S to save</span>
                            </div>
                          </div>
                        </div>
                      </section>
                    );
                  }

                  return (
                    <section className="doc-section" key={s} id={`section-${i}`}>
                      <div className="cd-doc-section-head">
                        <h2 className="doc-h2">{s}</h2>
                        <div className="row" style={{ gap: 8 }}>
                          {words > 0 ? <span className="meta">{words} words</span> : null}
                          <Button
                            size="sm"
                            variant="ghost"
                            icon="edit"
                            className="cd-section-action-btn"
                            onClick={() => setActiveSection(i)}
                            aria-label={`Edit section ${s}`}
                          >
                            Edit
                          </Button>
                        </div>
                      </div>

                      {text.trim() ? (
                        <div
                          className="cd-doc-p-clickable"
                          onClick={() => setActiveSection(i)}
                          title="Click to edit this section"
                        >
                          {text.split('\n\n').map((para, pIdx) => (
                            <p className="doc-p" key={pIdx}>{para}</p>
                          ))}
                        </div>
                      ) : (
                        <div
                          className="cd-doc-empty-prompt"
                          onClick={() => setActiveSection(i)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setActiveSection(i);
                            }
                          }}
                        >
                          <Icon name="plus" size={14} />
                          <span>Click to add {s}...</span>
                        </div>
                      )}
                    </section>
                  );
                })}
              </div>
            </article>
          </div>

          {/* Right Inspector Panel */}
          <aside className="doc-rail" aria-label="Document inspector">
            {/* Version Status Card */}
            <div className="cd-doc-rail-card">
              <div className="panel-section-title" style={{ margin: '0 0 8px' }}>Version Status</div>
              <div className="row-between">
                <span className="meta">Current draft</span>
                <span className="strong" style={{ color: 'var(--accent)' }}>Working draft v{doc.workingVersion}</span>
              </div>
              <div className="row-between mt-8">
                <span className="meta">Last submitted</span>
                <span className="meta">{doc.submittedVersion ? `v${doc.submittedVersion} (frozen)` : 'Never submitted'}</span>
              </div>
              <div className="row-between mt-8">
                <span className="meta">Review decision</span>
                <Chip state={doc.reviewState} />
              </div>
            </div>

            {/* Client Review & Feedback (if changes requested) */}
            {latest && latest.decision === 'changes' ? (
              <div className="cd-doc-feedback-card">
                <div className="cd-doc-feedback-head">
                  <span className="avatar">MV</span>
                  <div>
                    <div className="strong" style={{ fontSize: 'var(--fs-label)' }}>Marta Velasco</div>
                    <div className="meta">{formatDate(latest.date)} · <Chip state="changes-requested" label="Changes requested" /></div>
                  </div>
                </div>
                <p className="cd-doc-feedback-quote">
                  "{latest.note || 'We need a wider secondary colour range for the trade-stand work, and the reversed logo needs its own section.'}"
                </p>
              </div>
            ) : null}

            {activeReview ? (
              <div className="panel-section">
                <div className="panel-section-title">Open Review Request</div>
                <Banner
                  title={`Awaiting ${activeReview.reviewer.name}`}
                  sub={`v${activeReview.version} · due ${formatShortDate(activeReview.due)}`}
                />
                <div className="stack-tight mt-12">
                  <Button
                    block
                    variant="primary"
                    icon="external"
                    onClick={() => navigate(`#/documents/${doc.id}?view=guest-preview&review=${activeReview.id}`)}
                  >
                    Open guest preview
                  </Button>
                </div>
              </div>
            ) : null}

            {/* Internal Operator Notes */}
            <div className="cd-doc-rail-card">
              <div className="panel-section-title" style={{ margin: '0 0 8px' }}>Internal Notes</div>
              <p className="meta" style={{ lineHeight: 1.6, margin: 0 }}>
                {doc.internalNote || 'No internal notes added.'}
              </p>
              <div className="meta mt-12 row" style={{ gap: 6, fontSize: 11 }}>
                <Icon name="lock" size={12} />
                <span>Private to workspace · Never visible to clients</span>
              </div>
            </div>

            {/* Primary Action */}
            <div className="panel-section">
              <div className="panel-section-title">Next Action</div>
              <div className="stack-tight">
                <Button
                  block
                  variant="primary"
                  icon="send"
                  disabled={save !== 'saved'}
                  onClick={() => navigate(`#/share?document=${doc.id}`)}
                >
                  {doc.submittedVersion ? `Submit v${doc.workingVersion} for review` : 'Submit for review'}
                </Button>
              </div>
              <p className="meta mt-8" style={{ fontSize: 11, lineHeight: 1.5 }}>
                {save === 'saved'
                  ? 'Submitting freezes an immutable snapshot. Previous versions remain in version history.'
                  : 'Save current draft before requesting review.'}
              </p>
            </div>
          </aside>
        </div>
      </div>
    );
  }


  /* ---- D03 Preview & export ---- */
  if (active === 'preview') {
    return (
      <div className="cd-doc-workspace">
        {toolbar}
        <div className="cd-doc-subview">
          <div className="cd-doc-subview-content">
            <div className="split">
              <Card>
                <CardHead
                  title="Paginated preview"
                  desc="Page 1 of 24 · identifies its version on every page."
                  action={<Chip state="neutral" label={`v${doc.workingVersion}`} />}
                />
                <CardBody>
                  <div
                    className={`cd-template-${previewTemplate}`}
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--divider)',
                      borderRadius: 6,
                      margin: '0 auto',
                      maxWidth: 640,
                      padding: '48px 52px',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
                    }}
                  >
                    <div className="row-between">
                      <span className="eyebrow" style={{ margin: 0 }}>{doc.title}</span>
                      <span className="meta">v{doc.workingVersion} · page 1</span>
                    </div>
                    <h2 className="mt-16" style={{ fontSize: 24, fontWeight: 700, color: 'var(--text)' }}>
                      {doc.sections[0]}
                    </h2>
                    <p className="doc-p" style={{ whiteSpace: 'pre-wrap', marginTop: 12 }}>
                      {editedTexts[doc.sections[0]] || (typeof SECTION_BODY[doc.sections[0]] === 'string' ? SECTION_BODY[doc.sections[0]] : null) || 'Preview content.'}
                    </p>

                    {includePortfolioInPreview ? (
                      <div
                        className="cd-portfolio-box mt-20"
                        style={{ padding: '12px 14px', background: 'var(--canvas-subtle)' }}
                      >
                        <div className="row" style={{ gap: 6, marginBottom: 4 }}>
                          <Icon name="sparkle" size={13} />
                          <span className="strong" style={{ fontSize: 12 }}>
                            Attached: {NORTHLIGHT_PORTFOLIO.studioName} Portfolio
                          </span>
                        </div>
                        <div className="meta" style={{ fontSize: 11.5 }}>
                          3 verified case studies (Harbor &amp; Finch, Verity Health, Atlas Logistics) included with client review package.
                        </div>
                      </div>
                    ) : null}

                    <div className="divider-h" style={{ margin: '24px 0 10px' }} />
                    <div className="row-between">
                      <span className="meta">{client?.name}</span>
                      <span className="meta">Prepared by {state.workspace.ownerName}</span>
                    </div>
                  </div>
                </CardBody>
                <CardFoot>
                  <div className="row-between row-wrap">
                    <span className="meta">The PDF identifies its version. Previewing never counts as sharing.</span>
                    <Button
                      variant="primary"
                      icon="download"
                      disabled={exportPct !== null && exportPct < 100}
                      onClick={() => {
                        setExportPct(0);
                        let pct = 0;
                        const timer = window.setInterval(() => {
                          pct += 8;
                          setExportPct(Math.min(pct, 100));
                          if (pct >= 100) {
                            window.clearInterval(timer);
                            window.setTimeout(() => {
                              setExportPct(null);
                              overlay.toast('Export complete', `${doc.title.toLowerCase().replace(/\s+/g, '-')}-v${doc.workingVersion}.pdf · 24 pages`, 'ok');
                            }, 700);
                          }
                        }, 220);
                      }}
                    >
                      Export PDF
                    </Button>
                  </div>
                  {exportPct !== null ? (
                    <div style={{ marginTop: 14 }}>
                      <div className="progress">
                        <div className="progress-track">
                          <div className={exportPct >= 100 ? 'progress-fill ok' : 'progress-fill'} style={{ width: `${exportPct}%` }} />
                        </div>
                        <span className="progress-label">
                          {exportPct >= 100 ? 'Export complete' : `Rendering ${Math.round((exportPct / 100) * 24)} of 24 pages`}
                        </span>
                      </div>
                    </div>
                  ) : null}
                </CardFoot>
              </Card>

              <div className="stack">
                <Card>
                  <CardHead title="Export settings" />
                  <CardBody>
                    <div className="stack">
                      <div className="field">
                        <label className="field-label" htmlFor="template">Presentation Template</label>
                        <select
                          className="select"
                          id="template"
                          value={previewTemplate}
                          onChange={(e) => setPreviewTemplate(e.target.value as PresentationTemplate)}
                        >
                          <option value="executive">Executive Editorial (Default)</option>
                          <option value="modern-studio">Modern Studio Showcase</option>
                          <option value="enterprise">Enterprise Formal</option>
                        </select>
                      </div>
                      <div className="field">
                        <label className="field-label">Include in Package</label>
                        <div className="stack-tight">
                          <label className="check"><input type="checkbox" defaultChecked /><span className="check-text">Section outline</span></label>
                          <label className="check"><input type="checkbox" defaultChecked /><span className="check-text">Version identifier on every page</span></label>
                          <label className="check">
                            <input
                              type="checkbox"
                              checked={includePortfolioInPreview}
                              onChange={(e) => setIncludePortfolioInPreview(e.target.checked)}
                            />
                            <span className="check-text">Studio Portfolio &amp; Case Studies</span>
                          </label>
                          <label className="check"><input type="checkbox" /><span className="check-text">Internal notes <span className="meta">(never exported by default)</span></span></label>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardHead title="Next step" />
                  <CardBody>
                    <p className="meta" style={{ lineHeight: 1.6 }}>
                      Previewing is not sharing. To let the client decide, open Review &amp; share setup and grant access
                      to one exact version.
                    </p>
                    <Button block variant="primary" className="mt-12" icon="send" onClick={() => navigate(`#/share?document=${doc.id}`)}>
                      Request review
                    </Button>
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---- D04 Version history ---- */
  return (
    <div className="cd-doc-workspace">
      {toolbar}
      <div className="cd-doc-subview">
        <div className="cd-doc-subview-content">
          <div className="split">
            <Card>
              <CardHead
                title="Submitted versions"
                desc="Numbered, immutable, and never overwritten. A new draft copies forward from any version."
              />
              <CardBody flush>
                {doc.versions.length === 0 ? (
                  <EmptyState
                    icon="history"
                    title="No submitted version"
                    text="This document has never been submitted for review. Submitting freezes a numbered version."
                  />
                ) : (
                  <>
                    <div className="version current">
                      <span className="version-mark">v{doc.workingVersion}</span>
                      <div>
                        <div className="version-title">
                          Working draft v{doc.workingVersion}{' '}
                          <span className="chip tone-accent" style={{ marginLeft: 6 }}>Current</span>
                        </div>
                        <div className="version-meta">
                          Editable · based on v{Math.max(doc.submittedVersion, 1)} · last saved {relative(doc.modified)}
                        </div>
                      </div>
                      <div className="item-side">
                        <Button size="sm" onClick={() => navigate(`#/documents/${doc.id}`)}>Open editor</Button>
                      </div>
                    </div>

                    {doc.versions.map((v) => {
                      const rv = versions.find((r) => r.version === v.n);
                      const deliveredTo = state.deliveries.find(
                        (d) => d.projectId === doc.projectId && d.fileIds.length > 0 && d.deliveredOn
                      );
                      const stateKey = rv
                        ? rv.state
                        : v.decision === 'approved'
                          ? 'approved'
                          : v.decision === 'changes'
                            ? 'changes-requested'
                            : 'superseded';
                      return (
                        <div className="version" key={v.n}>
                          <span className="version-mark">v{v.n}</span>
                          <div style={{ minWidth: 0 }}>
                            <div className="version-title">
                              Submitted v{v.n} <Chip state={stateKey} />
                            </div>
                            <div className="version-meta">
                              {v.author} · {formatDate(v.date)} · {v.note}
                            </div>
                            {rv && rv.comments.length > 0 ? (
                              <div className="comment" style={{ paddingBottom: 0 }}>
                                <span className="avatar">{initials(rv.comments[0].author)}</span>
                                <div>
                                  <div className="comment-head">
                                    <span className="comment-author">{rv.comments[0].author}</span>
                                    <span className="meta">{formatDate(rv.comments[0].date)}</span>
                                  </div>
                                  <div className="comment-body">{rv.comments[0].body}</div>
                                </div>
                              </div>
                            ) : null}
                            {deliveredTo ? (
                              <div className="row mt-8" style={{ gap: 6 }}>
                                <Icon name="package" size={13} />
                                <span className="meta">Referenced by delivery package “{deliveredTo.title}”</span>
                              </div>
                            ) : null}
                          </div>
                          <div className="item-side" style={{ display: 'flex', gap: 6 }}>
                            {rv ? (
                              <Button
                                size="sm"
                                icon="eye"
                                onClick={() => navigate(`#/documents/${doc.id}?view=guest-preview&review=${rv.id}`)}
                                title={`Preview guest review for v${v.n}`}
                              >
                                Guest preview
                              </Button>
                            ) : null}
                            <Button
                              size="sm"
                              onClick={() => {
                                dispatch({ type: 'document/submitVersion', id: doc.id, note: `Copied forward from v${v.n}.` });
                                overlay.toast('Draft created', `A new working draft was copied forward from v${v.n}.`, 'ok');
                              }}
                            >
                              Copy to new draft
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </CardBody>
            </Card>

            <div className="stack">
              <Card>
                <CardHead title="Version rules" />
                <CardBody>
                  <ul className="doc-list" style={{ marginTop: 0 }}>
                    <li>A submitted version is never overwritten.</li>
                    <li>Approving a stale or withdrawn request is rejected.</li>
                    <li>Repeated submit clicks do not duplicate events.</li>
                    <li>Every event records actor, time, version and outcome.</li>
                  </ul>
                </CardBody>
              </Card>
              <Card>
                <CardHead title="This document" />
                <CardBody>
                  <Defs>
                    <Def k="Type">{doc.type}</Def>
                    <Def k="Visibility"><Chip state={doc.visibility} /></Def>
                    <Def k="Reviewer">{activeReview ? activeReview.reviewer.name : 'Not designated'}</Def>
                    <Def k="Versions">{doc.versions.length} submitted</Def>
                  </Defs>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
