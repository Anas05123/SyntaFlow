/**
 * G03 · External Guest Review Screen
 *
 * Dedicated external client-facing review surface.
 * Intentionally simpler than the owner app:
 * - Minimal quiet top header (CoreDesk symbol, document name, version chip, reviewer avatar)
 * - Mounts the unified canonical GuestReviewSurface with isOwnerPreview={false}
 * - Zero access to owner navigation, sidebar, internal notes, tasks, or other documents
 */

import { useStore } from '../../state/store';
import { BrandMark } from '../../ui/BrandMark';
import { GuestReviewSurface } from '../../components/guest/GuestReviewSurface';
import type { Review, DocumentRecord } from '../../domain/types';

export interface GuestReviewScreenProps {
  reviewId?: string;
}

export function GuestReviewScreen({ reviewId }: GuestReviewScreenProps) {
  const { state, derived } = useStore();

  // 1. Resolve Review
  let review: Review | null = null;
  if (reviewId) {
    review = state.reviews.find((r) => r.id === reviewId) ?? null;
  }
  if (!review) {
    review = derived.waitingReviews[0] ?? state.reviews[0] ?? null;
  }

  const doc: DocumentRecord | null = review ? derived.documentById(review.documentId) : null;
  const client = doc ? derived.clientById(doc.clientId) : null;

  const reviewerInitials = review
    ? review.reviewer.name
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'MV';

  return (
    <div className="guest" style={{ display: 'flex', flexDirection: 'column', height: '100dvh', minHeight: 0, overflow: 'hidden' }}>
      {/* Minimal Guest Header */}
      <header className="cd-external-guest-header">
        <div className="cd-external-guest-brand">
          <BrandMark size={26} />
          <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>
            {state.workspace.name}
          </span>

          {doc && review ? (
            <div className="cd-external-guest-doc-meta">
              <span className="cd-external-guest-title">{doc.title}</span>
              <span className="cd-doc-version-tag">v{review.version}</span>
              {client ? <span className="cd-external-guest-sub">· {client.name}</span> : null}
            </div>
          ) : null}
        </div>

        <div className="cd-external-guest-user">
          {review ? (
            <>
              <span className="cd-external-guest-sub" style={{ fontSize: 12 }}>
                {review.reviewer.name}
              </span>
              <span
                className="avatar"
                title={`Designated ${review.reviewer.role}: ${review.reviewer.email}`}
              >
                {reviewerInitials}
              </span>
            </>
          ) : null}
        </div>
      </header>

      {/* Unified Canonical Review Surface */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <GuestReviewSurface
          reviewId={review?.id ?? reviewId}
          isOwnerPreview={false}
        />
      </div>
    </div>
  );
}
