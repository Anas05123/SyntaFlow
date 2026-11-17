import React from 'react';
import { OutcomePage } from '../../components/marketing/OutcomePage';

export const StudiosPage: React.FC = () => <OutcomePage {...{
  "path": "/solutions/studios",
  "eyebrow": "For creative studios",
  "title": "Show what changed. Ship what was approved.",
  "intro": "Visual work moves through revisions. Syntaflow keeps the submitted version, review decision, and delivery gate in the same engagement record.",
  "result": "Less uncertainty at the last handoff.",
  "image": "/product-screens/current/approval.png",
  "imageAlt": "An approved earlier review in the Brand identity system sample project.",
  "imageNote": "Approval record · same sample project",
  "points": [
    {
      "title": "Keep revisions distinct",
      "body": "An approval is tied to a particular submitted version."
    },
    {
      "title": "See remaining work",
      "body": "The project shows pending review alongside approved work."
    },
    {
      "title": "Record the handoff",
      "body": "Delivery is an external handoff record, not an automatic file send."
    }
  ]
}} />;
