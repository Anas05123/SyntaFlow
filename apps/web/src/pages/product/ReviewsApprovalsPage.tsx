import React from 'react';
import { OutcomePage } from '../../components/marketing/OutcomePage';

export const ReviewsApprovalsPage: React.FC = () => <OutcomePage {...{
  "path": "/product/reviews-approvals",
  "eyebrow": "Review and approval",
  "title": "Review the exact version your client saw.",
  "intro": "Syntaflow shows the submitted version and its review decision together. An approved earlier document does not silently approve later work.",
  "result": "The decision stays attached to the right version.",
  "image": "/product-screens/current/review-detail.png",
  "imageAlt": "Version three review for the Brand identity system sample project.",
  "imageNote": "Brand guidelines · version-specific review",
  "points": [
    {
      "title": "Discuss the submitted version",
      "body": "Open the review record with its version visible."
    },
    {
      "title": "Keep decisions distinct",
      "body": "A later revision can have a different status from an earlier approved document."
    },
    {
      "title": "Hold the handoff when needed",
      "body": "The sample delivery screen still shows two files awaiting approval."
    }
  ]
}} />;
