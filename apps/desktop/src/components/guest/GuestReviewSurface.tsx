/**
 * GuestReviewSurface
 *
 * The canonical, single-source review presentation component used by BOTH:
 * 1. Owner Preview Workspace inside CoreDesk shell
 * 2. External Client Guest Screen outside CoreDesk shell
 *
 * Guarantees exact immutable snapshot rendering (binding to reviewRequestId
 * and DocumentVersion vX), responsive reading canvas, and structured review
 * decision & comments inspector.
 */

import { useState } from 'react';
import { useStore } from '../../state/store';
import { useOverlay } from '../../ui/overlay';
import { formatDate, formatShortDate, daysUntil } from '../../domain/dates';
import { Button, Chip } from '../../ui/primitives';
import { Icon } from '../../ui/Icon';
import type { Review, DocumentRecord } from '../../domain/types';

export interface GuestReviewSurfaceProps {
  reviewId?: string;
  documentId?: string;
  isOwnerPreview?: boolean;
  onClosePreview?: () => void;
}

export function GuestReviewSurface({
  reviewId,
  documentId,
  isOwnerPreview = false,
  onClosePreview,
}: GuestReviewSurfaceProps) {
  const { state, dispatch, derived } = useStore();
  const overlay = useOverlay();

  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState<string | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  // 1. Resolve Review and Document records
  let review: Review | null = null;
  if (reviewId) {
    review = state.reviews.find((r) => r.id === reviewId) ?? null;
  } else if (documentId) {
    review = derived.activeReviewOfDocument(documentId) ?? state.reviews.find((r) => r.documentId === documentId) ?? null;
  }

  // Fallback to first waiting or first review if unspecified
  if (!review) {
    review = derived.waitingReviews[0] ?? state.reviews[0] ?? null;
  }

  const doc: DocumentRecord | null = review
    ? derived.documentById(review.documentId)
    : documentId
      ? derived.documentById(documentId)
      : null;

  const client = doc ? derived.clientById(doc.clientId) : null;
  const project = doc ? derived.projectById(doc.projectId) : null;

  // 2. Resolve matching Access Grant
  const grant = review
    ? state.grants.find(
        (g) =>
          g.recipient.email.toLowerCase() === review.reviewer.email.toLowerCase() &&
          (g.objectLabel.includes(`v${review.version}`) || (doc && g.objectLabel.includes(doc.title)))
      )
    : null;

  // 3. Handle security & access denial states
  if (!review || !doc) {
    return (
      <div className="cd-guest-review-surface" style={{ padding: '60px var(--pad-page)', alignItems: 'center' }}>
        <div className="cd-review-document" style={{ maxWidth: 560, textAlign: 'center' }}>
          <div style={{ color: 'var(--text-muted)', marginBottom: 12 }}>
            <Icon name="alert" size={32} />
          </div>
          <h2 style={{ fontSize: 20, margin: '0 0 10px', color: 'var(--text)' }}>Review not found</h2>
          <p className="cd-doc-p" style={{ color: 'var(--text-muted)' }}>
            This review request does not exist, was withdrawn, or the link is invalid.
          </p>
          {isOwnerPreview && onClosePreview ? (
            <Button className="mt-16" variant="primary" onClick={onClosePreview}>
              Return to workspace
            </Button>
          ) : null}
        </div>
      </div>
    );
  }

  // Check grant revocation or expiration
  if (grant?.state === 'revoked') {
    return (
      <div className="cd-guest-review-surface" style={{ padding: '60px var(--pad-page)', alignItems: 'center' }}>
        <div className="cd-review-document" style={{ maxWidth: 560, textAlign: 'center' }}>
          <div style={{ color: '#f85149', marginBottom: 12 }}>
            <Icon name="shield" size={32} />
          </div>
          <h2 style={{ fontSize: 20, margin: '0 0 10px', color: 'var(--text)' }}>Access Revoked</h2>
          <p className="cd-doc-p" style={{ color: 'var(--text-muted)' }}>
            Access to this review was revoked by the workspace owner on{' '}
            {grant.revokedOn ? formatDate(grant.revokedOn) : 'record'}. You no longer have permission to view or decide this document.
          </p>
          {isOwnerPreview && onClosePreview ? (
            <Button className="mt-16" variant="primary" onClick={onClosePreview}>
              Return to workspace
            </Button>
          ) : null}
        </div>
      </div>
    );
  }

  if (grant?.state === 'expired') {
    return (
      <div className="cd-guest-review-surface" style={{ padding: '60px var(--pad-page)', alignItems: 'center' }}>
        <div className="cd-review-document" style={{ maxWidth: 560, textAlign: 'center' }}>
          <div style={{ color: '#e3b341', marginBottom: 12 }}>
            <Icon name="alert" size={32} />
          </div>
          <h2 style={{ fontSize: 20, margin: '0 0 10px', color: 'var(--text)' }}>Review Link Expired</h2>
          <p className="cd-doc-p" style={{ color: 'var(--text-muted)' }}>
            This review link expired on {grant.expires ? formatDate(grant.expires) : 'the scheduled deadline'}.
            The workspace owner must generate a renewed access grant.
          </p>
          {isOwnerPreview && onClosePreview ? (
            <Button className="mt-16" variant="primary" onClick={onClosePreview}>
              Return to workspace
            </Button>
          ) : null}
        </div>
      </div>
    );
  }

  if (review.state === 'withdrawn') {
    return (
      <div className="cd-guest-review-surface" style={{ padding: '60px var(--pad-page)', alignItems: 'center' }}>
        <div className="cd-review-document" style={{ maxWidth: 560, textAlign: 'center' }}>
          <div style={{ color: 'var(--text-muted)', marginBottom: 12 }}>
            <Icon name="lock" size={32} />
          </div>
          <h2 style={{ fontSize: 20, margin: '0 0 10px', color: 'var(--text)' }}>Review Withdrawn</h2>
          <p className="cd-doc-p" style={{ color: 'var(--text-muted)' }}>
            This review request was withdrawn by the workspace owner. A revised draft may be issued in the future.
          </p>
          {isOwnerPreview && onClosePreview ? (
            <Button className="mt-16" variant="primary" onClick={onClosePreview}>
              Return to workspace
            </Button>
          ) : null}
        </div>
      </div>
    );
  }

  // Exact immutable snapshot version
  const versionNumber = review.version;
  const docVersion = doc.versions.find((v) => v.n === versionNumber);
  const isApprover = review.reviewer.role === 'Approver';
  const isDecided = review.state === 'approved' || review.state === 'changes-requested';

  // 4. Decision and Comment Handlers
  const handleDecide = (decision: 'approved' | 'changes') => {
    if (decision === 'changes' && comment.trim().length === 0) {
      setCommentError('Changes requested requires a comment, so the revision has a reason attached.');
      return;
    }
    setCommentError(null);

    const reviewActor = isOwnerPreview ? `${state.workspace.ownerName} (Preview)` : review.reviewer.name;
    dispatch({
      type: 'review/decide',
      id: review.id,
      decision,
      comment: comment.trim(),
      actor: reviewActor,
    });
    setComment('');
    overlay.toast(
      decision === 'approved' ? `Approved v${versionNumber}` : `Changes requested on v${versionNumber}`,
      decision === 'approved'
        ? 'The owner can now prepare delivery for this version.'
        : 'Your comment is attached to the request.',
      decision === 'approved' ? 'ok' : 'warn'
    );
  };

  const handlePostComment = () => {
    if (!comment.trim()) return;
    setCommentError(null);
    const reviewActor = isOwnerPreview ? `${state.workspace.ownerName} (Preview)` : review.reviewer.name;
    dispatch({
      type: 'review/comment',
      id: review.id,
      comment: comment.trim(),
      actor: reviewActor,
    });
    setComment('');
    overlay.toast('Comment posted', 'Your feedback was added to the review thread.', 'ok');
  };

  const reviewerInitials = review.reviewer.name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="cd-guest-review-surface">
      {/* Exact Version Guarantee Banner */}
      <div className="cd-review-banner">
        <div className="cd-review-banner-left">
          <Icon name="lock" size={14} />
          <span>
            You are reviewing <strong>v{versionNumber}</strong> — the exact version sent for review. This version cannot change underneath you.
          </span>
        </div>
        <div className="cd-review-banner-right">
          <span>Submitted {formatDate(review.requestedOn)}</span>
          <span>·</span>
          <span>Prepared by {docVersion?.author || state.workspace.ownerName}</span>
        </div>
      </div>

      <div className="cd-review-layout">
        {/* Continuous Editorial Reading Canvas */}
        <div className="cd-review-main">
          <article className="cd-review-document">
            <header className="cd-doc-hero">
              <div className="cd-doc-eyebrow">
                <span>{doc.type}</span>
                <span>·</span>
                <span>{client?.name ?? 'Client'}</span>
                <span>·</span>
                <span className="cd-doc-version-tag">Version {versionNumber}</span>
              </div>
              <h1 className="cd-doc-title">{doc.title}</h1>
              <p className="cd-doc-sub">
                Prepared by {docVersion?.author || state.workspace.ownerName} for {client?.name}
                {project ? ` · Project: ${project.name}` : ''}
              </p>
            </header>

            {/* Continuous Sections */}
            <div className="cd-doc-content">
              {doc.sections.map((sectionTitle) => (
                <section className="cd-doc-section" key={sectionTitle}>
                  <h2 className="cd-doc-section-heading">{sectionTitle}</h2>
                  {renderSectionBody(sectionTitle, client?.name)}
                </section>
              ))}
            </div>
          </article>
        </div>

        {/* Structured Review Inspector Rail */}
        <aside className={`cd-review-inspector ${isInspectorOpen ? 'is-open' : ''}`}>
          {/* Section 1: Reviewer & Version Metadata */}
          <div className="cd-inspector-section">
            <div className="cd-inspector-title">
              <span>Your Review</span>
              <Chip
                state={
                  review.state === 'approved'
                    ? 'approved'
                    : review.state === 'changes-requested'
                      ? 'changes-requested'
                      : 'waiting'
                }
              />
            </div>

            <div className="cd-reviewer-card">
              <span className="avatar">{reviewerInitials}</span>
              <div className="cd-reviewer-info">
                <div className="cd-reviewer-name">{review.reviewer.name}</div>
                <div className="cd-reviewer-role">
                  {review.reviewer.role} · {review.reviewer.email}
                </div>
              </div>
            </div>

            <div className="cd-inspector-metadata-grid mt-12">
              <div className="cd-inspector-row">
                <span className="cd-inspector-label">Document</span>
                <span className="cd-inspector-val">{doc.title}</span>
              </div>
              <div className="cd-inspector-row">
                <span className="cd-inspector-label">Version</span>
                <span className="cd-inspector-val">v{versionNumber} (Immutable)</span>
              </div>
              <div className="cd-inspector-row">
                <span className="cd-inspector-label">Due Date</span>
                <span className="cd-inspector-val">
                  {formatShortDate(review.due)} ({daysUntil(review.due)}d remaining)
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Decision Controls */}
          <div className="cd-inspector-section">
            <div className="cd-inspector-title">Decision</div>

            <div className="cd-decision-box">
              {review.state === 'approved' || review.outcome === 'approved' ? (
                <div className="cd-decision-banner is-approved">
                  <div className="cd-decision-banner-title">
                    <Icon name="checkCircle" size={16} /> Approved v{versionNumber}
                  </div>
                  <div className="cd-decision-banner-sub">
                    Recorded {review.closedOn ? formatDate(review.closedOn) : 'on file'}. The owner has been notified and can prepare delivery.
                  </div>
                </div>
              ) : review.state === 'changes-requested' || review.outcome === 'changes' ? (
                <div className="cd-decision-banner is-changes">
                  <div className="cd-decision-banner-title">
                    <Icon name="message" size={16} /> Changes Requested
                  </div>
                  <div className="cd-decision-banner-sub">
                    Your feedback is recorded on v{versionNumber}. The owner will revise and issue a new version — this version remains frozen.
                  </div>
                </div>
              ) : isApprover ? (
                <>
                  <p className="cd-doc-p" style={{ fontSize: 12, margin: '0 0 10px', color: 'var(--text-muted)' }}>
                    Approving accepts this version as it stands. Requesting changes requires a comment explaining the revision.
                  </p>
                  <Button
                    variant="primary"
                    block
                    icon="checkCircle"
                    onClick={() => handleDecide('approved')}
                  >
                    Approve v{versionNumber}
                  </Button>
                  <Button
                    block
                    icon="message"
                    onClick={() => handleDecide('changes')}
                  >
                    Request changes
                  </Button>
                </>
              ) : (
                <div className="cd-access-badge">
                  <Icon name="eye" size={13} />
                  <span>Viewer access — read and comment permissions only</span>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Comments Thread */}
          <div className="cd-inspector-section" style={{ flex: 1 }}>
            <div className="cd-inspector-title">
              <span>Comments</span>
              <span className="cd-doc-version-tag">{review.comments.length}</span>
            </div>

            <div className="cd-comments-list">
              {review.comments.length === 0 ? (
                <div className="cd-comment-empty">No comments yet on this version.</div>
              ) : (
                review.comments.map((c) => {
                  const authorInitials = c.author
                    .split(' ')
                    .map((p) => p[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase();
                  return (
                    <div className="cd-comment-item" key={c.id}>
                      <span className="avatar" style={{ width: 24, height: 24, fontSize: 10 }}>
                        {authorInitials}
                      </span>
                      <div className="cd-comment-content">
                        <div className="cd-comment-header">
                          <span className="cd-comment-author">{c.author}</span>
                          <span className="cd-comment-time">{formatDate(c.date)}</span>
                        </div>
                        <div className="cd-comment-body">{c.body}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="cd-comment-form">
              <label className="field-label" htmlFor="cd-review-comment-input">
                {isDecided ? 'Add follow-up comment' : 'Add comment (required for changes)'}
              </label>
              <textarea
                id="cd-review-comment-input"
                className={`cd-comment-input ${commentError ? 'has-error' : ''}`}
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                  setCommentError(null);
                }}
                placeholder="Ask a question or specify requested changes..."
              />
              {commentError ? <span className="cd-comment-error">{commentError}</span> : null}

              {comment.trim().length > 0 && !isApprover ? (
                <Button size="sm" onClick={handlePostComment}>
                  Post comment
                </Button>
              ) : null}
            </div>
          </div>

          {/* Section 4: Access Summary */}
          <div className="cd-inspector-section">
            <div className="cd-inspector-title">Access Scope</div>
            <div className="cd-inspector-metadata-grid">
              <div className="cd-inspector-row">
                <span className="cd-inspector-label">Role</span>
                <span className="cd-inspector-val">{review.reviewer.role}</span>
              </div>
              <div className="cd-inspector-row">
                <span className="cd-inspector-label">Covers</span>
                <span className="cd-inspector-val">v{versionNumber} only</span>
              </div>
              <div className="cd-inspector-row">
                <span className="cd-inspector-label">Expires</span>
                <span className="cd-inspector-val">
                  {grant?.expires ? formatDate(grant.expires) : 'No expiration set'}
                </span>
              </div>
            </div>
            <div className="cd-access-badge mt-8" style={{ width: '100%', boxSizing: 'border-box' }}>
              <Icon name="lock" size={12} />
              <span>Zero-trust: private notes and lateral records are strictly redacted</span>
            </div>
          </div>
        </aside>

        {/* Floating toggle button for compact widths */}
        <div className="cd-inspector-toggle-btn">
          <Button
            variant="primary"
            icon={isInspectorOpen ? 'close' : 'message'}
            onClick={() => setIsInspectorOpen(!isInspectorOpen)}
          >
            {isInspectorOpen ? 'Close Inspector' : 'Review & Decision'}
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Renders editorial section body content with rich formatting,
 * diagrams, swatch palettes, and typography guidelines.
 */
function renderSectionBody(title: string, clientName?: string) {
  const norm = title.trim().toLowerCase();

  if (norm.includes('positioning')) {
    return (
      <>
        <p className="cd-doc-p">
          {clientName ?? 'Harbor & Finch'} supplies specialty ingredients to independent kitchens. The brand identity
          must communicate <strong>precision and generosity</strong> simultaneously — a supplier you trust with a
          signature dish, not a commodity supplier.
        </p>
        <p className="cd-doc-p">
          The wordmark carries the primary recognition weight. Everything else acts as a restrained support system
          designed to function at scale across print, packaging, and digital interfaces without continuous supervision.
        </p>
      </>
    );
  }

  if (norm.includes('wordmark')) {
    return (
      <>
        <p className="cd-doc-p">
          The wordmark is set in a modified grotesque with a signature horizontal stress on the ampersand. Two formal
          lockups are approved for production:
        </p>
        <ul className="cd-doc-list">
          <li>
            <strong>Horizontal lockup</strong>: Primary orientation, applied whenever horizontal width permits.
          </li>
          <li>
            <strong>Stacked lockup</strong>: Compact square formats including packaging labels, avatars, and seals.
          </li>
          <li>
            <strong>Mark isolation</strong>: Minimum reproduction size of 8 mm in physical print, 24 px in digital.
          </li>
        </ul>
      </>
    );
  }

  if (norm.includes('clear space')) {
    return (
      <>
        <p className="cd-doc-p">
          Clear space equals the height of the lowercase <strong>h</strong> on all four sides. No typography, framing
          rules, imagery edges, or secondary logos may enter this exclusion perimeter.
        </p>
        <div className="cd-doc-diagram-box">
          <div className="cd-doc-diagram-graphic">
            <span>[ · · · · CLEAR SPACE BOUNDARY (1h) · · · · ]</span>
          </div>
          <div className="cd-doc-diagram-caption">
            Diagram: 1h perimeter margin required on all four sides of the primary wordmark
          </div>
        </div>
        <p className="cd-doc-p">
          Minimum reproduction sizes: <strong>24 px</strong> height in digital viewports, <strong>18 mm</strong> width in print.
        </p>
      </>
    );
  }

  if (norm.includes('colour') || norm.includes('color')) {
    return (
      <>
        <p className="cd-doc-p">
          The colour system is built around an architectural graphite structure with Harbor Cobalt as a single signature
          accent. Cobalt designates action, focus, and confirmed state — never decorative fill.
        </p>
        <div className="cd-doc-table-wrap">
          <table className="cd-doc-table">
            <thead>
              <tr>
                <th>Color Name</th>
                <th>Hex Value</th>
                <th>Application</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span className="cd-color-swatch" style={{ background: '#2F6FEB' }} />
                  Harbor Cobalt
                </td>
                <td><code>#2F6FEB</code></td>
                <td>Primary action, focal highlights, active navigation</td>
              </tr>
              <tr>
                <td>
                  <span className="cd-color-swatch" style={{ background: '#14181C' }} />
                  Graphite
                </td>
                <td><code>#14181C</code></td>
                <td>Structural canvas, background surfaces, typography</td>
              </tr>
              <tr>
                <td>
                  <span className="cd-color-swatch" style={{ background: '#F4F6F8' }} />
                  Bone
                </td>
                <td><code>#F4F6F8</code></td>
                <td>Reversed surfaces, light mode cards, high-contrast labels</td>
              </tr>
              <tr>
                <td>
                  <span className="cd-color-swatch" style={{ background: '#3FA66B' }} />
                  Signal Green
                </td>
                <td><code>#3FA66B</code></td>
                <td>Approved state, verified delivery milestones</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="cd-doc-p">
          Reversed wordmarks over photographic assets require an underlying scrim with minimum 60% opacity or background luminance under 45%.
        </p>
      </>
    );
  }

  if (norm.includes('typography')) {
    return (
      <>
        <p className="cd-doc-p">
          A single typeface family, <strong>Inter</strong>, governs every touchpoint. Typographic hierarchy is established
          exclusively through scale, weight, and letter-spacing contrast, rather than introducing secondary display faces.
        </p>
        <ul className="cd-doc-list">
          <li><strong>Display &amp; Headings</strong>: 600 SemiBold, tracking -0.02em</li>
          <li><strong>Body &amp; Descriptions</strong>: 400 Regular / 500 Medium, 1.65 line height</li>
          <li><strong>Metadata &amp; Labels</strong>: 500 Medium, uppercase, tracking +0.06em</li>
        </ul>
      </>
    );
  }

  if (norm.includes('applications')) {
    return (
      <p className="cd-doc-p">
        Packaging, shipping carton labeling, trade stand displays, and collateral stationery must observe the approved
        scale formulas. Reversed wordmarks over photography are subject to the contrast guidelines above.
      </p>
    );
  }

  if (norm.includes('contact')) {
    return (
      <p className="cd-doc-p">
        Direct all brand implementation and asset inquiries to Northlight Studio. Official review queries receive a
        response within one business day.
      </p>
    );
  }

  // Default fallback for any custom document section
  return (
    <p className="cd-doc-p">
      This section details the specifications for {title}. Content is frozen as part of the immutable version snapshot.
    </p>
  );
}
