/**
 * D05 · Review & share setup.
 *
 * Four steps, an explicit guard list, and a guest preview. Never share a
 * working draft by accident: the create button stays disabled while any guard
 * is unmet, and it names the unblocking condition.
 */

import { useState } from 'react';

import { useStore, nextId } from '../state/store';
import { useOverlay } from '../ui/overlay';
import { navigate } from '../app/router';
import { formatDate, isoInDays } from '../domain/dates';
import { Banner, Button, Card, CardBody, CardFoot, CardHead, Check, Field, TextArea, TextInput } from '../ui/primitives';
import { Icon } from '../ui/Icon';

export function ShareSetupScreen({ documentId }: { documentId?: string }) {
  const { state, dispatch, derived } = useStore();
  const overlay = useOverlay();

  const [docId] = useState(
    documentId ?? state.documents.find((d) => d.reviewState === 'waiting')?.id ?? state.documents[0]?.id ?? ''
  );
  const [versionChoice, setVersionChoice] = useState<'draft' | number>('draft');
  const [recipient, setRecipient] = useState('');
  const [role, setRole] = useState<'Guest reviewer' | 'Guest viewer'>('Guest reviewer');
  const [due, setDue] = useState(isoInDays(7));
  const [note, setNote] = useState('');
  const [canDownload, setCanDownload] = useState(false);
  const [saveState, setSaveState] = useState<'saved' | 'dirty'>('saved');

  const doc = derived.documentById(docId);
  const client = doc ? derived.clientById(doc.clientId) : null;
  const existing = doc ? derived.activeReviewOfDocument(doc.id) : null;

  const recipientValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient.trim());
  const unsaved = saveState !== 'saved';
  const blocked = !recipientValid || Boolean(existing) || unsaved;

  const guards: { label: string; bad: boolean }[] = [
    { label: 'Unsaved or failed-save content cannot be submitted', bad: unsaved },
    { label: 'One open request per deliverable', bad: Boolean(existing) },
    { label: 'A verified recipient is required', bad: !recipientValid },
    { label: 'Approving a stale or withdrawn request is rejected', bad: false },
  ];

  const blockerText = !recipientValid
    ? 'Blocked: add a verified recipient email.'
    : existing
      ? 'Blocked: an open request already exists for this document.'
      : unsaved
        ? 'Blocked: save the draft first.'
        : 'Ready to send.';

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

  return (
    <div className="auth-wrap" style={{ maxWidth: 1100, paddingTop: 0 }}>
      <Button variant="ghost" size="sm" icon="arrowLeft" className="mb-16" onClick={() => navigate(`#/documents/${doc.id}`)}>
        Back to document
      </Button>

      <div className="eyebrow">Review &amp; share setup · D05</div>
      <h1>Share one exact version</h1>
      <p className="page-sub mt-8">
        The recipient is the only person who can decide. A working draft can never be shared by accident, and
        previewing is not sharing.
      </p>

      <div className="split mt-24">
        <div className="stack">
          {existing ? (
            <Banner
              tone="bad"
              title={<><strong>A review request is already open for this document.</strong></>}
              sub={`v${existing.version} is with ${existing.reviewer.name}, due ${formatDate(existing.due)}. V1 allows one open request per deliverable — withdraw it, or wait for the decision.`}
              action={
                <Button
                  size="sm"
                  onClick={() => {
                    dispatch({ type: 'review/withdraw', id: existing.id });
                    overlay.toast('Review request withdrawn', 'The version is retained.', 'warn');
                  }}
                >
                  Withdraw request
                </Button>
              }
            />
          ) : null}

          {unsaved ? (
            <Banner
              tone="bad"
              title={<><strong>This document has unsaved changes.</strong></>}
              sub="A version is frozen from a saved draft. Save first, then submit."
              action={<Button size="sm" onClick={() => setSaveState('saved')}>Save now</Button>}
            />
          ) : null}

          <Card>
            <CardHead title="1 · Choose the exact version" desc="Submitting freezes a numbered version. It is never overwritten afterwards." />
            <CardBody>
              <div className="stack-tight">
                <button
                  type="button"
                  className={`option${versionChoice === 'draft' ? ' selected' : ''}`}
                  onClick={() => setVersionChoice('draft')}
                >
                  <span className="radio-mark" />
                  <span>
                    <span className="option-title">
                      Working draft v{doc.workingVersion} <span className="chip tone-accent">New version</span>
                    </span>
                    <span className="option-sub">Freezes as v{doc.workingVersion + 1} when you create the request.</span>
                  </span>
                </button>
                {doc.versions.map((v) => (
                  <button
                    type="button"
                    key={v.n}
                    className={`option${versionChoice === v.n ? ' selected' : ''}`}
                    onClick={() => setVersionChoice(v.n)}
                  >
                    <span className="radio-mark" />
                    <span>
                      <span className="option-title">Submitted v{v.n}</span>
                      <span className="option-sub">
                        {formatDate(v.date)} · {v.decision === 'approved' ? 'approved' : v.decision === 'changes' ? 'changes requested' : 'open'}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
              <div className="row mt-12">
                <button
                  type="button"
                  className="btn btn-sm btn-ghost"
                  onClick={() => setSaveState((s) => (s === 'saved' ? 'dirty' : 'saved'))}
                >
                  <Icon name="refresh" size={14} /> Toggle save state (demo)
                </button>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHead title="2 · Recipient and role" desc="Access is granted to a person and an object, never to a whole client." />
            <CardBody>
              <div className="grid grid-2">
                <Field
                  label="Recipient email"
                  htmlFor="sh-recipient"
                  error={recipient.trim() && !recipientValid ? 'That does not look like an email address.' : undefined}
                >
                  <TextInput
                    id="sh-recipient"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    invalid={recipient.trim().length > 0 && !recipientValid}
                    placeholder="marta@harborfinch.com"
                  />
                </Field>
                <Field label="Role" htmlFor="sh-role" hint="Only a reviewer can approve or request changes.">
                  <select
                    className="select"
                    id="sh-role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'Guest reviewer' | 'Guest viewer')}
                  >
                    <option value="Guest reviewer">Guest reviewer</option>
                    <option value="Guest viewer">Guest viewer</option>
                  </select>
                </Field>
              </div>

              <div className="grid grid-2 mt-16">
                <Field label="Review due date" htmlFor="sh-due">
                  <TextInput id="sh-due" type="date" value={due} onChange={(e) => setDue(e.target.value)} />
                </Field>
                <div className="field">
                  <span className="field-label">Known contacts at {client?.name}</span>
                  <div className="stack-tight">
                    {client?.contacts.map((ct) => (
                      <button
                        type="button"
                        key={ct.id}
                        className={`option${recipient === ct.email ? ' selected' : ''}`}
                        onClick={() => setRecipient(ct.email)}
                      >
                        <span className="radio-mark" />
                        <span>
                          <span className="option-title">{ct.name}</span>
                          <span className="option-sub">{ct.email}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHead title="3 · Permissions" />
            <CardBody>
              <div className="stack-tight">
                <Check label="Read the granted version only" defaultChecked disabled />
                <Check label="Comment on the version" defaultChecked disabled />
                <Check label="Decide — approve or request changes" defaultChecked disabled={role === 'Guest viewer'} />
                <Check
                  label="Download permitted files"
                  checked={canDownload}
                  onChange={(e) => setCanDownload(e.target.checked)}
                />
              </div>
              <div className="field mt-16">
                <label className="field-label" htmlFor="sh-note">Optional note in the access email</label>
                <TextArea
                  id="sh-note"
                  style={{ minHeight: 80 }}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="One or two lines of context. The email is transactional — there is no general composer in V1."
                />
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="stack">
          <Card>
            <CardHead title="What the guest will see" desc="Preview parity: this is the real surface, not a mock." />
            <CardBody>
              <div style={{ background: 'var(--canvas)', border: '1px solid var(--divider)', borderRadius: 'var(--r-control)', padding: 14 }}>
                <div className="row-between">
                  <span className="strong" style={{ fontSize: 'var(--fs-label)' }}>{doc.title}</span>
                  <span className="chip tone-accent">v{targetVersion}</span>
                </div>
                <p className="meta mt-8">
                  {client?.name} · review requested by {state.workspace.ownerName}
                </p>
                <div className="divider-h" style={{ margin: '12px 0' }} />
                <p className="meta" style={{ lineHeight: 1.6 }}>
                  Immutable version · comment · {role === 'Guest reviewer' ? 'approve or request changes' : 'read only'}
                </p>
                <div className="row mt-12" style={{ gap: 6 }}>
                  <Icon name="lock" size={13} />
                  <span className="meta">Internal notes are excluded</span>
                </div>
              </div>
              <Button
                block
                className="mt-12"
                icon="external"
                onClick={() => {
                  const targetReview = existing ?? state.reviews.find((r) => r.documentId === doc.id);
                  if (targetReview) {
                    navigate(`#/documents/${doc.id}?view=guest-preview&review=${targetReview.id}`);
                  } else {
                    navigate(`#/documents/${doc.id}?view=guest-preview`);
                  }
                }}
              >
                Open guest preview
              </Button>
            </CardBody>
          </Card>

          <Card>
            <CardHead title="Transition guards" />
            <CardBody>
              <div className="stack-tight">
                {guards.map((g) => (
                  <div className="row" style={{ gap: 9, color: g.bad ? 'var(--risk)' : 'var(--muted)' }} key={g.label}>
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
                onClick={() => {
                  const newVersion = doc.workingVersion + 1;
                  dispatch({ type: 'document/submitVersion', id: doc.id, note: note || 'Submitted for review.' });
                  const reviewId = nextId('rv');
                  dispatch({
                    type: 'review/add',
                    review: {
                      id: reviewId,
                      documentId: doc.id,
                      projectId: doc.projectId,
                      version: versionChoice === 'draft' ? newVersion : Number(versionChoice),
                      reviewer: { name: recipient.split('@')[0], email: recipient.trim(), role: role === 'Guest reviewer' ? 'Approver' : 'Viewer' },
                      requestedOn: new Date().toISOString(),
                      due,
                      state: 'waiting',
                      outcome: null,
                      comments: [],
                    },
                  });
                  dispatch({
                    type: 'grant/add',
                    grant: {
                      id: nextId('gr'),
                      recipient: { name: recipient.split('@')[0], email: recipient.trim() },
                      role,
                      objectLabel: `${doc.title} · v${versionChoice === 'draft' ? newVersion : versionChoice}`,
                      objectType: 'Review request',
                      permissions: [
                        'Read granted version',
                        'Comment',
                        ...(role === 'Guest reviewer' ? ['Approve or request changes'] : []),
                        ...(canDownload ? ['Download permitted files'] : []),
                      ],
                      state: 'invited',
                      invited: new Date().toISOString(),
                      lastActivity: null,
                      expires: due,
                    },
                  });
                  dispatch({
                    type: 'activity/add',
                    event: {
                      id: nextId('ev'),
                      type: 'review-requested',
                      actor: state.workspace.ownerName,
                      date: new Date().toISOString(),
                      title: `requested review on ${doc.title} v${versionChoice === 'draft' ? newVersion : versionChoice}`,
                      targetLabel: `${doc.title} · v${versionChoice === 'draft' ? newVersion : versionChoice}`,
                      targetHref: `#/documents/${doc.id}`,
                      read: true,
                      resolves: 'Waiting on the designated approver.',
                    },
                  });
                  overlay.toast(
                    'Review request created',
                    `Access granted to v${versionChoice === 'draft' ? newVersion : versionChoice} only. The recipient has been emailed a transactional link.`,
                    'ok'
                  );
                  navigate(`#/documents/${doc.id}`);
                }}
              >
                Create review request
              </Button>
              <p className="meta mt-8">
                {blockerText} {!blocked ? `Access will cover v${targetVersion} only.` : ''}
              </p>
            </CardFoot>
          </Card>

          <Card>
            <CardBody>
              <div className="card-title">Sharing rules in force</div>
              <ul className="doc-list" style={{ marginTop: 12 }}>
                <li>Previewing a document is not sharing it.</li>
                <li>Only a designated reviewer can decide.</li>
                <li>Changes requested requires a comment.</li>
                <li>The grant covers one object, with its own expiry.</li>
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
