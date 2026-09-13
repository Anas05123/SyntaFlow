/**
 * OwnerPreviewToolbar
 *
 * Owner-only toolbar rendered at the top of the in-app Preview Workspace.
 * NEVER exposed to external guest reviewers.
 *
 * Controls:
 * - Copy guest link (with toast notification)
 * - Open externally (opens #/guest/review in new window)
 * - Refresh preview
 * - Close preview (returns owner to previous document/project workspace)
 */

import { useOverlay } from '../../ui/overlay';
import { Button } from '../../ui/primitives';
import { Icon } from '../../ui/Icon';
import type { Review, DocumentRecord } from '../../domain/types';

export interface OwnerPreviewToolbarProps {
  review: Review | null;
  doc: DocumentRecord | null;
  onClose: () => void;
  onRefresh?: () => void;
}

export function OwnerPreviewToolbar({
  review,
  doc,
  onClose,
  onRefresh,
}: OwnerPreviewToolbarProps) {
  const overlay = useOverlay();

  const handleCopyLink = () => {
    if (!review) return;
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    const guestUrl = `${origin}${pathname}#/guest/review?id=${review.id}`;

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(guestUrl).then(
        () => {
          overlay.toast('Guest Link Copied', `Direct review link copied to clipboard: v${review.version}`, 'ok');
        },
        () => {
          overlay.toast('Guest Link', guestUrl, 'default');
        }
      );
    } else {
      overlay.toast('Guest Link', guestUrl, 'default');
    }
  };

  const handleOpenExternal = () => {
    if (!review || typeof window === 'undefined') return;
    window.open(`#/guest/review?id=${review.id}`, '_blank');
  };

  return (
    <div className="cd-owner-preview-bar">
      <div className="cd-owner-preview-left">
        <span className="cd-owner-preview-badge">
          <Icon name="shield" size={13} />
          <span>Owner Preview Mode</span>
        </span>

        {doc && review ? (
          <>
            <span className="cd-owner-preview-title">
              {doc.title} · v{review.version}
            </span>
            <span className="cd-owner-preview-meta">
              <span>Reviewer: <strong>{review.reviewer.name}</strong> ({review.reviewer.role})</span>
            </span>
          </>
        ) : null}
      </div>

      <div className="cd-owner-preview-right">
        <Button size="sm" icon="external" onClick={handleCopyLink} title="Copy client guest link">
          Copy guest link
        </Button>
        <Button size="sm" icon="external" onClick={handleOpenExternal} title="Open external view in new tab">
          Open externally
        </Button>
        {onRefresh ? (
          <Button size="sm" icon="refresh" onClick={onRefresh} title="Refresh preview snapshot">
            Refresh
          </Button>
        ) : null}
        <Button size="sm" variant="primary" icon="close" onClick={onClose} title="Return to previous workspace">
          Close preview
        </Button>
      </div>
    </div>
  );
}
