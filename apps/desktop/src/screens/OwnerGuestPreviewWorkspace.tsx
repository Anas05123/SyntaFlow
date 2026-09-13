/**
 * OwnerGuestPreviewWorkspace
 *
 * The first-class workspace screen that hosts the client review experience
 * directly inside the CoreDesk application shell.
 *
 * Keeps the owner inside CoreDesk, providing full context and owner toolbar
 * controls, without ejecting them into a disconnected standalone route.
 */

import { useState } from 'react';
import { useStore } from '../state/store';
import { navigate, goBack } from '../app/router';
import { OwnerPreviewToolbar } from '../components/guest/OwnerPreviewToolbar';
import { GuestReviewSurface } from '../components/guest/GuestReviewSurface';
import type { Review, DocumentRecord } from '../domain/types';

export interface OwnerGuestPreviewWorkspaceProps {
  documentId?: string;
  reviewId?: string;
}

export function OwnerGuestPreviewWorkspace({
  documentId,
  reviewId,
}: OwnerGuestPreviewWorkspaceProps) {
  const { state, derived } = useStore();
  const [refreshKey, setRefreshKey] = useState(0);

  // Resolve target review
  let review: Review | null = null;
  if (reviewId) {
    review = state.reviews.find((r) => r.id === reviewId) ?? null;
  } else if (documentId) {
    review = derived.activeReviewOfDocument(documentId) ?? state.reviews.find((r) => r.documentId === documentId) ?? null;
  }

  if (!review) {
    review = derived.waitingReviews[0] ?? state.reviews[0] ?? null;
  }

  const doc: DocumentRecord | null = review
    ? derived.documentById(review.documentId)
    : documentId
      ? derived.documentById(documentId)
      : null;

  const handleClose = () => {
    if (doc) {
      navigate(`#/documents/${doc.id}`);
    } else {
      goBack();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, overflow: 'hidden' }}>
      <OwnerPreviewToolbar
        review={review}
        doc={doc}
        onClose={handleClose}
        onRefresh={() => setRefreshKey((k) => k + 1)}
      />

      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <GuestReviewSurface
          key={refreshKey}
          reviewId={review?.id ?? reviewId}
          documentId={doc?.id ?? documentId}
          isOwnerPreview={true}
          onClosePreview={handleClose}
        />
      </div>
    </div>
  );
}
