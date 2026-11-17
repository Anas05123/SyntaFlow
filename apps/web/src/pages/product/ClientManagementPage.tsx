import React from 'react';
import { OutcomePage } from '../../components/marketing/OutcomePage';

export const ClientManagementPage: React.FC = () => <OutcomePage {...{
  "path": "/product/client-management",
  "eyebrow": "Client relationships",
  "title": "Keep the people and the work together.",
  "intro": "A client record gives an engagement a stable home. See the Harbor & Finch sample client alongside its active project and next decision.",
  "result": "Find the right context before you act.",
  "image": "/product-screens/current/client.png",
  "imageAlt": "The Harbor & Finch client record in the current Syntaflow desktop build.",
  "imageNote": "One sample client · one active project",
  "points": [
    {
      "title": "One place to start",
      "body": "Open the client record before searching across separate project notes."
    },
    {
      "title": "People and projects in context",
      "body": "The client and related project stay linked in the workspace."
    },
    {
      "title": "Move to the next decision",
      "body": "Follow the project from its client record into work, review, and handoff."
    }
  ]
}} />;
