import React from 'react';
import { ReviewsApprovalsPage } from './ReviewsApprovalsPage';

/**
 * Legacy route component for /product/delivery-approvals
 * Redirects functionally to the canonical /product/reviews-approvals
 */
export const DeliveryApprovalsPage: React.FC = () => {
  return <ReviewsApprovalsPage />;
};
