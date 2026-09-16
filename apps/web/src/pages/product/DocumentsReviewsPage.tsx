import React from 'react';
import { DocumentsPage } from './DocumentsPage';

/**
 * Legacy route component for /product/documents-reviews
 * Redirects functionally to the canonical /product/documents
 */
export const DocumentsReviewsPage: React.FC = () => {
  return <DocumentsPage />;
};
