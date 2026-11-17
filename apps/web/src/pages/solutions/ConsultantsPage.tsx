import React from 'react';
import { OutcomePage } from '../../components/marketing/OutcomePage';

export const ConsultantsPage: React.FC = () => <OutcomePage {...{
  "path": "/solutions/consultants",
  "eyebrow": "For consultants",
  "title": "Carry the decision with the work.",
  "intro": "Keep client context, project tasks, document versions, and approval records connected from the first brief to the final handoff.",
  "result": "A clearer record when you return to an engagement.",
  "image": "/product-screens/current/review-detail.png",
  "imageAlt": "Syntaflow review detail for the Brand identity system sample project.",
  "imageNote": "Version-specific review · current build",
  "points": [
    {
      "title": "Find the context",
      "body": "The project anchors the client's work."
    },
    {
      "title": "Record the review",
      "body": "A named version gives feedback a reference point."
    },
    {
      "title": "Check before handoff",
      "body": "Approval state remains visible in the delivery view."
    }
  ]
}} />;
