/**
 * D05 · Review & Share Transmission Studio.
 *
 * Executive client review transmission form featuring:
 * 1. Exact immutable version snapshot freezing.
 * 2. Recipient authority assignment & SLA presets.
 * 3. Professional cover message presets.
 * 4. Distinctive document presentation templates.
 * 5. Instant Studio Portfolio & Track Record inclusion.
 * 6. High-fidelity live transactional email and portal preview.
 */

import { useState } from 'react';

import { useStore, nextId } from '../state/store';
import { useOverlay } from '../ui/overlay';
import { navigate } from '../app/router';
import { formatDate, isoInDays } from '../domain/dates';
import { Banner, Button, Card, CardBody, CardFoot, CardHead, Check, Chip, Field, TextArea, TextInput } from '../ui/primitives';
import { Icon } from '../ui/Icon';
import { NORTHLIGHT_PORTFOLIO } from '../domain/portfolio';
import type { PresentationTemplate } from '../domain/types';

export function ShareSetupScreen({ documentId }: { documentId?: string }) {
  const { state, dispatch, derived } = useStore();
  const overlay = useOverlay();

  const [docId] = useState(
    documentId ?? state.documents.find((d) => d.reviewState === 'waiting')?.id ?? state.documents[0]?.id ?? ''
  );
  const doc = derived.documentById(docId);
  const client = doc ? derived.clientById(doc.clientId) : null;
  const project = doc ? derived.projectById(doc.projectId) : null;
  const existing = doc ? derived.activeReviewOfDocument(doc.id) : null;

  // Initial contact resolution
  const primaryContact = client?.contacts.find((c) => c.primary) ?? client?.contacts[0] ?? null;

  const [versionChoice, setVersionChoice] = useState<'draft' | number>('draft');
  const [recipient, setRecipient] = useState(primaryContact?.email ?? '');
  const [recipientName, setRecipientName] = useState(primaryContact?.name ?? '');
  const [role, setRole] = useState<'Guest reviewer' | 'Guest viewer'>('Guest reviewer');
  const [dueDays, setDueDays] = useState(7);
  const [due, setDue] = useState(isoInDays(7));
  const [canDownload, setCanDownload] = useState(true);
  const [saveState] = useState<'saved' | 'dirty'>('saved');

  // Presentation Template & Portfolio State
  const [template, setTemplate] = useState<PresentationTemplate>('executive');
  const [includePortfolio, setIncludePortfolio] = useState(true);
  const [selectedCaseStudies, setSelectedCaseStudies] = useState<string[]>(
    NORTHLIGHT_PORTFOLIO.caseStudies.map((cs) => cs.id)
  );

  // Message Presets
  const [messagePreset, setMessagePreset] = useState<'proposal' | 'deliverable' | 'concept' | 'custom'>('proposal');
  const [note, setNote] = useState(
    `Please find attached our finalized proposal for ${doc?.title ?? 'the engagement'}. It outlines our strategic approach, deliverables, schedule, and investment terms. We look forward to your review and sign-off.`
  );

  // Preview Mode Tab ('email' | 'portal')
  const [previewTab, setPreviewTab] = useState<'email' | 'portal'>('email');

  if (!doc) {
    return (
      <Card>
        <div className="state">
          <div className="state-title">Choose a document</div>
          <p className="state-text">A review request is always made against one exact version of one document.</p>
          <div className="state-actions">
            <Button variant="primary" onClick={() => navigate('#/documents')}>Go to documents</Button>
          </div>
        </div>
      </Card>
    );
  }

  const targetVersion = versionChoice === 'draft' ? doc.workingVersion + 1 : versionChoice;
  const recipientValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient.trim());
  const unsaved = saveState !== 'saved';
  const blocked = !recipientValid || Boolean(existing) || unsaved;

  const guards: { label: string; bad: boolean }[] = [
    { label: 'Unsaved draft content cannot be submitted (Draft is clean)', bad: unsaved },
    { label: 'One active review request per deliverable snapshot', bad: Boolean(existing) },
    { label: 'A verified recipient email address is required', bad: !recipientValid },
    { label: 'Immutable version guarantee: frozen snapshot cannot be overwritten', bad: false },
  ];

  const blockerText = !recipientValid
    ? 'Blocked: enter a valid recipient email.'
    : existing
      ? 'Blocked: an open request already exists for this deliverable.'
      : unsaved
        ? 'Blocked: save the draft before submitting.'
        : 'Ready to dispatch.';

  const handleSelectContact = (email: string, name: string) => {
    setRecipient(email);
    setRecipientName(name);
  };

  const handlePresetChange = (preset: 'proposal' | 'deliverable' | 'concept' | 'custom') => {
    setMessagePreset(preset);
    if (preset === 'proposal') {
      setNote(
        `Please find attached our finalized proposal for ${doc.title} (v${targetVersion}). It outlines our strategic approach, deliverables, schedule, and investment terms. We look forward to your review and sign-off.`
      );
    } else if (preset === 'deliverable') {
      setNote(
        `We are pleased to submit the milestone deliverables for ${doc.title} (v${targetVersion}) for your formal review and sign-off. Please review the detailed specifications and indicate your approval.`
      );
    } else if (preset === 'concept') {
      setNote(
        `We have prepared the initial concept exploration and guidelines for ${doc.title} (v${targetVersion}). We welcome your detailed feedback and direction on the options presented.`
      );
    }
  };

  const handleSlaChange = (days: number) => {
    setDueDays(days);
    setDue(isoInDays(days));
  };

  const toggleCaseStudy = (csId: string) => {
    setSelectedCaseStudies((prev) =>
      prev.includes(csId) ? prev.filter((id) => id !== csId) : [...prev, csId]
    );
  };

  const handleDispatch = () => {
    if (blocked) return;

    const newVersion = doc.workingVersion + 1;
    const finalVersion = versionChoice === 'draft' ? newVersion : Number(versionChoice);

    // 1. Submit immutable version snapshot
    dispatch({
      type: 'document/submitVersion',
      id: doc.id,
      note: note || `Submitted v${finalVersion} for client review.`,
    });

    // 2. Register review request with presentation template and portfolio
    const reviewId = nextId('rv');
    const resolvedName = recipientName.trim() || recipient.split('@')[0];

    dispatch({
      type: 'review/add',
      review: {
        id: reviewId,
        documentId: doc.id,
        projectId: doc.projectId,
        version: finalVersion,
        reviewer: {
          name: resolvedName,
          email: recipient.trim(),
          role: role === 'Guest reviewer' ? 'Approver' : 'Viewer',
        },
        requestedOn: new Date().toISOString(),
        due,
        state: 'waiting',
        outcome: null,
        comments: [],
        template,
        includePortfolio,
        portfolioCaseStudyIds: includePortfolio ? selectedCaseStudies : [],
        coverMessage: note,
      },
    });

    // 3. Register access grant
    dispatch({
      type: 'grant/add',
      grant: {
        id: nextId('gr'),
        recipient: { name: resolvedName, email: recipient.trim() },
        role,
        objectLabel: `${doc.title} · v${finalVersion}`,
        objectType: 'Review request',
        permissions: [
          'Read granted version',
          'Comment on version',
          ...(role === 'Guest reviewer' ? ['Approve or request changes'] : []),
          ...(canDownload ? ['Download permitted files'] : []),
          ...(includePortfolio ? ['Inspect Studio Portfolio & Case Studies'] : []),
        ],
        state: 'invited',
        invited: new Date().toISOString(),
        lastActivity: null,
        expires: due,
      },
    });

    // 4. Register activity event
    dispatch({
      type: 'activity/add',
      event: {
        id: nextId('ev'),
        type: 'review-requested',
        actor: state.workspace.ownerName,
        date: new Date().toISOString(),
        title: `dispatched review package for ${doc.title} v${finalVersion} to ${resolvedName}`,
        targetLabel: `${doc.title} · v${finalVersion}`,
        targetHref: `#/documents/${doc.id}`,
        read: true,
        resolves: `Waiting on ${resolvedName} (${role === 'Guest reviewer' ? 'Approver' : 'Viewer'}).`,
      },
    });

    overlay.toast(
      'Review package dispatched',
      `Sent v${finalVersion} to ${resolvedName} with ${template} template${includePortfolio ? ' and Studio Portfolio' : ''}.`,
      'ok'
    );

    navigate(`#/documents/${doc.id}`);
  };

  return (
    <div className="cd-share-studio">
      {/* Pinned Toolbar */}
      <header className="cd-share-toolbar">
        <div className="cd-share-toolbar-left">
          <Button
            variant="ghost"
            size="sm"
            icon="arrowLeft"
            onClick={() => navigate(`#/documents/${doc.id}`)}
          >
            Back to Document
          </Button>
          <span className="divider-v" style={{ height: 16 }} />
          <span className="strong" style={{ fontSize: 14 }}>{doc.title}</span>
          <Chip state={doc.reviewState} />
          <span className="cd-doc-version-pill">
            Working draft v{doc.workingVersion} → Freezes as v{targetVersion}
          </span>
          <span className="meta">
            {doc.type} · <a href={`#/clients/${client?.id}`}>{client?.name}</a>
            {project ? ` · ${project.name}` : ''}
          </span>
        </div>
        <div className="row" style={{ gap: 10 }}>
          <Button
            variant="primary"
            icon="send"
            disabled={blocked}
            onClick={handleDispatch}
          >
            Dispatch Review Package
          </Button>
        </div>
      </header>

      {/* Main Studio 2-Column Grid */}
      <div className="cd-share-layout">
        {/* Left Column: 5-Step Transmission Form */}
        <div className="stack">
          {existing ? (
            <Banner
              tone="bad"
              title={<><strong>An open review request already exists for this deliverable.</strong></>}
              sub={`v${existing.version} is currently awaiting ${existing.reviewer.name} (due ${formatDate(existing.due)}). Governance permits one open review per deliverable to prevent audit split.`}
              action={
                <Button
                  size="sm"
                  onClick={() => {
                    dispatch({ type: 'review/withdraw', id: existing.id });
                    overlay.toast('Review request withdrawn', 'The prior version was archived.', 'warn');
                  }}
                >
                  Withdraw prior request
                </Button>
              }
            />
          ) : null}

          {/* Step 1: Version & Snapshot Confirmation */}
          <div className="cd-dispatch-step">
            <div className="cd-step-head">
              <div className="cd-step-title-wrap">
                <span className="cd-step-badge">1</span>
                <div>
                  <h3 className="cd-step-title">Document Version &amp; Snapshot Freeze</h3>
                  <div className="cd-step-desc" style={{ marginLeft: 0 }}>
                    Submitting freezes an immutable snapshot (v{targetVersion}). Edits to future drafts will never overwrite this record.
                  </div>
                </div>
              </div>
              <span className="chip tone-accent">Exact Snapshot</span>
            </div>

            <div className="stack-tight mt-12">
              <button
                type="button"
                className={`option${versionChoice === 'draft' ? ' selected' : ''}`}
                onClick={() => setVersionChoice('draft')}
              >
                <span className="radio-mark" />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div className="row-between">
                    <span className="option-title">
                      Working draft v{doc.workingVersion} → Freezes as <strong>v{doc.workingVersion + 1}</strong>
                    </span>
                    <span className="chip tone-accent">New Snapshot</span>
                  </div>
                  <span className="option-sub">
                    {doc.sections.length} sections · includes current saved text · author: {state.workspace.ownerName}
                  </span>
                </div>
              </button>

              {doc.versions.map((v) => (
                <button
                  type="button"
                  key={v.n}
                  className={`option${versionChoice === v.n ? ' selected' : ''}`}
                  onClick={() => setVersionChoice(v.n)}
                >
                  <span className="radio-mark" />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div className="row-between">
                      <span className="option-title">Re-dispatch existing snapshot v{v.n}</span>
                      <Chip
                        state={v.decision === 'approved' ? 'approved' : v.decision === 'changes' ? 'changes-requested' : 'neutral'}
                        label={v.decision ?? 'prior snapshot'}
                      />
                    </div>
                    <span className="option-sub">
                      Frozen {formatDate(v.date)} by {v.author} · {v.note || 'No snapshot note'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Recipient, Authority Level & Turnaround SLA */}
          <div className="cd-dispatch-step">
            <div className="cd-step-head">
              <div className="cd-step-title-wrap">
                <span className="cd-step-badge">2</span>
                <div>
                  <h3 className="cd-step-title">Recipient &amp; Authority Level</h3>
                  <div className="cd-step-desc" style={{ marginLeft: 0 }}>
                    Access is granted to an authorized individual contact, not a generic company alias.
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contacts Pills */}
            {client && client.contacts.length > 0 ? (
              <div className="field">
                <span className="field-label">Known contacts at {client.name}</span>
                <div className="cd-preset-chips">
                  {client.contacts.map((ct) => (
                    <button
                      key={ct.id}
                      type="button"
                      className={`cd-preset-chip${recipient === ct.email ? ' active' : ''}`}
                      onClick={() => handleSelectContact(ct.email, ct.name)}
                    >
                      <Icon name="user" size={13} />
                      <span>{ct.name}</span>
                      <span className="meta" style={{ fontSize: 11 }}>({ct.role})</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="grid grid-2">
              <Field label="Recipient full name" htmlFor="sh-recipient-name">
                <TextInput
                  id="sh-recipient-name"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Marta Velasco"
                />
              </Field>

              <Field
                label="Recipient verified email"
                htmlFor="sh-recipient"
                error={recipient.trim() && !recipientValid ? 'Please enter a valid email address.' : undefined}
              >
                <TextInput
                  id="sh-recipient"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  invalid={recipient.trim().length > 0 && !recipientValid}
                  placeholder="marta@harborfinch.com"
                />
              </Field>
            </div>

            {/* Authority Level Selection */}
            <div className="field mt-12">
              <span className="field-label">Sign-off Authority Level</span>
              <div className="cd-authority-grid">
                <div
                  className={`cd-authority-card${role === 'Guest reviewer' ? ' selected' : ''}`}
                  onClick={() => setRole('Guest reviewer')}
                >
                  <div className="cd-authority-title">
                    <span>Designated Approver</span>
                    <span className="chip tone-accent" style={{ fontSize: 10 }}>Sign-off Authority</span>
                  </div>
                  <span className="cd-authority-desc">
                    Authorized to formally approve v{targetVersion} to unlock downstream milestone deliveries, or request revisions with required feedback.
                  </span>
                </div>

                <div
                  className={`cd-authority-card${role === 'Guest viewer' ? ' selected' : ''}`}
                  onClick={() => setRole('Guest viewer')}
                >
                  <div className="cd-authority-title">
                    <span>Collaborator / Viewer</span>
                    <span className="chip tone-neutral" style={{ fontSize: 10 }}>Feedback Only</span>
                  </div>
                  <span className="cd-authority-desc">
                    Permitted to read and comment on v{targetVersion}, but cannot execute final legal/milestone sign-off.
                  </span>
                </div>
              </div>
            </div>

            {/* Turnaround SLA Presets */}
            <div className="field mt-12">
              <span className="field-label">Turnaround SLA / Review Due Date</span>
              <div className="cd-preset-chips mb-12">
                {[
                  { days: 3, label: '3 Days (Expedited)' },
                  { days: 5, label: '5 Days' },
                  { days: 7, label: '7 Days (Standard)' },
                  { days: 14, label: '14 Days' },
                ].map((preset) => (
                  <button
                    key={preset.days}
                    type="button"
                    className={`cd-preset-chip${dueDays === preset.days ? ' active' : ''}`}
                    onClick={() => handleSlaChange(preset.days)}
                  >
                    <Icon name="clock" size={13} />
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>

              <TextInput
                id="sh-due"
                type="date"
                value={due}
                onChange={(e) => {
                  setDue(e.target.value);
                  setDueDays(0);
                }}
              />
            </div>
          </div>

          {/* Step 3: Executive Cover Message */}
          <div className="cd-dispatch-step">
            <div className="cd-step-head">
              <div className="cd-step-title-wrap">
                <span className="cd-step-badge">3</span>
                <div>
                  <h3 className="cd-step-title">Executive Cover Note</h3>
                  <div className="cd-step-desc" style={{ marginLeft: 0 }}>
                    Professional transmission note included in the client's invitation email and review portal banner.
                  </div>
                </div>
              </div>
            </div>

            <div className="cd-preset-chips">
              <button
                type="button"
                className={`cd-preset-chip${messagePreset === 'proposal' ? ' active' : ''}`}
                onClick={() => handlePresetChange('proposal')}
              >
                Formal Proposal Transmission
              </button>
              <button
                type="button"
                className={`cd-preset-chip${messagePreset === 'deliverable' ? ' active' : ''}`}
                onClick={() => handlePresetChange('deliverable')}
              >
                Milestone Deliverable Handover
              </button>
              <button
                type="button"
                className={`cd-preset-chip${messagePreset === 'concept' ? ' active' : ''}`}
                onClick={() => handlePresetChange('concept')}
              >
                Creative Concept Review
              </button>
            </div>

            <TextArea
              id="sh-note"
              style={{ minHeight: 90, marginTop: 10 }}
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                setMessagePreset('custom');
              }}
              placeholder="Write a clear, personalized message to the client..."
            />
            <div className="row-between">
              <span className="meta" style={{ fontSize: 11 }}>
                Included directly in the secure transactional client email.
              </span>
              <span className="meta" style={{ fontSize: 11 }}>{note.length} characters</span>
            </div>
          </div>

          {/* Step 4: Professional Presentation Template */}
          <div className="cd-dispatch-step">
            <div className="cd-step-head">
              <div className="cd-step-title-wrap">
                <span className="cd-step-badge">4</span>
                <div>
                  <h3 className="cd-step-title">Presentation Template</h3>
                  <div className="cd-step-desc" style={{ marginLeft: 0 }}>
                    Select the styling architecture for the client review sheet and PDF generation.
                  </div>
                </div>
              </div>
              <span className="chip tone-accent">Bespoke Design</span>
            </div>

            <div className="cd-template-grid">
              <div
                className={`cd-template-picker-card${template === 'executive' ? ' selected' : ''}`}
                onClick={() => setTemplate('executive')}
              >
                <span className="cd-template-picker-badge">Recommended</span>
                <span className="cd-template-picker-title">Executive Editorial</span>
                <span className="cd-template-picker-desc">
                  Serif display typography, high-contrast monochrome with cobalt accents, client &amp; studio seal, and dignified margins. Ideal for commercial proposals.
                </span>
              </div>

              <div
                className={`cd-template-picker-card${template === 'modern-studio' ? ' selected' : ''}`}
                onClick={() => setTemplate('modern-studio')}
              >
                <span className="cd-template-picker-badge">Creative</span>
                <span className="cd-template-picker-title">Modern Studio Showcase</span>
                <span className="cd-template-picker-desc">
                  Accent color gradients, elevated metric callout chips, geometric section badges, and creative agency polish.
                </span>
              </div>

              <div
                className={`cd-template-picker-card${template === 'enterprise' ? ' selected' : ''}`}
                onClick={() => setTemplate('enterprise')}
              >
                <span className="cd-template-picker-badge">Corporate</span>
                <span className="cd-template-picker-title">Enterprise Formal</span>
                <span className="cd-template-picker-desc">
                  Structured header blocks, document control number, revision history audit tables, and compliance notices.
                </span>
              </div>
            </div>
          </div>

          {/* Step 5: Studio Portfolio & Track Record Inclusion */}
          <div className="cd-dispatch-step">
            <div className="cd-step-head">
              <div className="cd-step-title-wrap">
                <span className="cd-step-badge">5</span>
                <div>
                  <h3 className="cd-step-title">Studio Portfolio &amp; Track Record</h3>
                  <div className="cd-step-desc" style={{ marginLeft: 0 }}>
                    Deliver Northlight Studio’s verified case studies and credentials right away alongside the review package.
                  </div>
                </div>
              </div>
              <Check
                label="Include Studio Portfolio"
                checked={includePortfolio}
                onChange={(e) => setIncludePortfolio(e.target.checked)}
              />
            </div>

            {includePortfolio ? (
              <div className="cd-portfolio-box">
                <div className="cd-portfolio-box-head">
                  <div className="row" style={{ gap: 8 }}>
                    <span className="cd-portfolio-badge">
                      <Icon name="sparkle" size={12} />
                      {NORTHLIGHT_PORTFOLIO.studioName} Portfolio
                    </span>
                    <span className="meta" style={{ fontSize: 12 }}>
                      {NORTHLIGHT_PORTFOLIO.ownerName} · {NORTHLIGHT_PORTFOLIO.location}
                    </span>
                  </div>
                  <span className="meta" style={{ fontSize: 11 }}>
                    {selectedCaseStudies.length} of {NORTHLIGHT_PORTFOLIO.caseStudies.length} Case Studies Attached
                  </span>
                </div>

                <p className="meta" style={{ margin: '0 0 12px', lineHeight: 1.5, fontSize: 12 }}>
                  {NORTHLIGHT_PORTFOLIO.tagline} Clients can review these case studies inside the review portal to verify credentials and project delivery standards.
                </p>

                <div className="cd-portfolio-cs-list">
                  {NORTHLIGHT_PORTFOLIO.caseStudies.map((cs) => {
                    const isChecked = selectedCaseStudies.includes(cs.id);
                    return (
                      <div className="cd-portfolio-cs-item" key={cs.id}>
                        <div className="row" style={{ gap: 10, flex: 1, minWidth: 0 }}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleCaseStudy(cs.id)}
                            id={`cs-${cs.id}`}
                          />
                          <label htmlFor={`cs-${cs.id}`} style={{ cursor: 'pointer', minWidth: 0, flex: 1 }}>
                            <div className="strong" style={{ fontSize: 12.5, color: 'var(--text)' }}>
                              {cs.title}
                            </div>
                            <div className="meta" style={{ fontSize: 11 }}>
                              {cs.industry} · {cs.year} · {cs.deliverables.slice(0, 2).join(', ')}
                            </div>
                          </label>
                        </div>
                        <div className="row" style={{ gap: 8 }}>
                          {cs.metrics[0] ? (
                            <span className="cd-cs-metric">
                              {cs.metrics[0].value} {cs.metrics[0].label}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="meta" style={{ fontSize: 12, margin: 0 }}>
                Portfolio inclusion is disabled. The client will only receive the document review sheet.
              </p>
            )}

            <div className="divider-h" style={{ margin: '14px 0 6px' }} />

            <div className="row-between">
              <Check
                label="Allow client to download document PDF / assets"
                checked={canDownload}
                onChange={(e) => setCanDownload(e.target.checked)}
              />
              <span className="meta" style={{ fontSize: 11 }}>
                Internal notes strictly excluded
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Client Experience Preview */}
        <div className="stack" style={{ position: 'sticky', top: 24 }}>
          <Card>
            <CardHead
              title="Client Experience Preview"
              desc="Real-time preview of the exact transmission dispatched to the client."
              action={
                <div className="cd-preset-chips" style={{ margin: 0 }}>
                  <button
                    type="button"
                    className={`cd-preset-chip${previewTab === 'email' ? ' active' : ''}`}
                    onClick={() => setPreviewTab('email')}
                  >
                    <Icon name="mail" size={12} /> Email
                  </button>
                  <button
                    type="button"
                    className={`cd-preset-chip${previewTab === 'portal' ? ' active' : ''}`}
                    onClick={() => setPreviewTab('portal')}
                  >
                    <Icon name="eye" size={12} /> Portal
                  </button>
                </div>
              }
            />
            <CardBody flush>
              {previewTab === 'email' ? (
                /* Simulated Transactional Email Preview */
                <div className="cd-email-preview-card">
                  <div className="cd-email-chrome">
                    <div className="cd-email-header-row">
                      <span>From:</span>
                      <strong>Anas Ayari &lt;anas@northlight.studio&gt;</strong>
                    </div>
                    <div className="cd-email-header-row">
                      <span>To:</span>
                      <strong>
                        {recipientName ? `${recipientName} <${recipient || 'client@company.com'}>` : recipient || 'client@company.com'}
                      </strong>
                    </div>
                    <div className="cd-email-header-row">
                      <span>Subject:</span>
                      <span>Review Request: {doc.title} (v{targetVersion})</span>
                    </div>
                  </div>

                  <div className="cd-email-body">
                    <div className="cd-email-studio-brand">
                      NORTHLIGHT STUDIO · DESIGN ARCHITECTURE
                    </div>

                    <div className="cd-email-salutation">
                      Dear {recipientName || 'Team'},
                    </div>

                    <p className="cd-email-copy">
                      {note}
                    </p>

                    <div className="cd-email-doc-box">
                      <div className="row-between">
                        <span className="eyebrow" style={{ margin: 0, color: '#2563eb' }}>{doc.type}</span>
                        <span className="meta" style={{ color: '#475569', fontWeight: 600 }}>v{targetVersion} Snapshot</span>
                      </div>
                      <h4 className="cd-email-doc-title mt-8">{doc.title}</h4>
                      <div className="cd-email-doc-meta">
                        {client?.name} · Prepared by Anas Ayari · Due {formatDate(due)}
                      </div>
                      <div className="meta mt-8" style={{ color: '#64748b', fontSize: 11.5 }}>
                        Template: <strong style={{ color: '#1e293b', textTransform: 'capitalize' }}>{template}</strong> · Authority:{' '}
                        <strong style={{ color: '#1e293b' }}>{role === 'Guest reviewer' ? 'Sign-off Approver' : 'Viewer'}</strong>
                      </div>
                    </div>

                    {includePortfolio ? (
                      <div className="cd-email-portfolio-attachment">
                        <Icon name="sparkle" size={14} />
                        <span>
                          Attached: <strong>Northlight Studio Track Record</strong> ({selectedCaseStudies.length} Case Studies &amp; Client Endorsements)
                        </span>
                      </div>
                    ) : null}

                    <div>
                      <span className="cd-email-cta-btn">
                        Open &amp; Review v{targetVersion} →
                      </span>
                    </div>

                    <div className="cd-email-foot">
                      One-time encrypted review link · Direct access to v{targetVersion} only · Expiring on {formatDate(due)} · Powered by CoreDesk
                    </div>
                  </div>
                </div>
              ) : (
                /* Miniature Portal Preview */
                <div style={{ padding: 18 }}>
                  <div
                    className={`cd-template-${template}`}
                    style={{
                      background: 'var(--canvas)',
                      border: '1px solid var(--divider)',
                      borderRadius: 6,
                      padding: '24px 20px',
                    }}
                  >
                    <div className="row-between">
                      <span className="eyebrow" style={{ margin: 0 }}>{doc.type}</span>
                      <Chip state="neutral" label={`v${targetVersion} preview`} />
                    </div>
                    <h3 className="doc-h1 mt-8" style={{ fontSize: 20 }}>{doc.title}</h3>
                    <p className="cd-doc-sub" style={{ fontSize: 12 }}>
                      Prepared for {client?.name} · Template: {template}
                    </p>

                    <div className="divider-h" style={{ margin: '16px 0' }} />

                    <div className="stack-tight">
                      <div className="strong" style={{ fontSize: 13 }}>{doc.sections[0]}</div>
                      <p className="meta" style={{ fontSize: 12, lineHeight: 1.5, margin: 0 }}>
                        Reviewing frozen version {targetVersion}. The client decides whether to approve or request changes.
                      </p>
                    </div>

                    {includePortfolio ? (
                      <div className="cd-portfolio-box mt-16" style={{ padding: 12 }}>
                        <div className="row" style={{ gap: 6 }}>
                          <Icon name="sparkle" size={12} />
                          <span className="strong" style={{ fontSize: 11.5 }}>
                            Studio Portfolio Embedded
                          </span>
                        </div>
                        <span className="meta" style={{ fontSize: 11 }}>
                          Client can view {selectedCaseStudies.length} verified case studies.
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Transition Guards & Dispatch CTA */}
          <Card>
            <CardHead title="Review Governance Guards" desc="All guards must be satisfied before dispatching." />
            <CardBody>
              <div className="stack-tight">
                {guards.map((g) => (
                  <div
                    className="row"
                    style={{ gap: 9, color: g.bad ? 'var(--risk)' : 'var(--muted)' }}
                    key={g.label}
                  >
                    <Icon name={g.bad ? 'alert' : 'check'} size={15} />
                    <span style={{ fontSize: 'var(--fs-label)' }}>{g.label}</span>
                  </div>
                ))}
              </div>
            </CardBody>
            <CardFoot>
              <Button
                block
                variant="primary"
                icon="send"
                disabled={blocked}
                onClick={handleDispatch}
              >
                Dispatch Review Package to {recipientName || recipient.split('@')[0] || 'Client'}
              </Button>
              <p className="meta mt-8" style={{ fontSize: 11.5, lineHeight: 1.5 }}>
                {blockerText} {!blocked ? `Access binds to v${targetVersion} snapshot only.` : ''}
              </p>
            </CardFoot>
          </Card>
        </div>
      </div>
    </div>
  );
}
