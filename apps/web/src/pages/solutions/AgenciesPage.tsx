import React from 'react';
import { OutcomePage } from '../../components/marketing/OutcomePage';

export const AgenciesPage: React.FC = () => <OutcomePage {...{
  "path": "/solutions/agencies",
  "eyebrow": "For client teams",
  "title": "Make the next decision visible.",
  "intro": "Keep a shared project narrative across work, review, approval, and the delivery gate in the desktop workspace.",
  "result": "Fewer ambiguous handoffs inside the team.",
  "image": "/product-screens/current/project.png",
  "imageAlt": "Syntaflow Brand identity system project for a sample client.",
  "imageNote": "Project · sample engagement",
  "points": [
    {
      "title": "See the project state",
      "body": "Open the project before asking for an update."
    },
    {
      "title": "Review the right version",
      "body": "A decision belongs to the submitted version."
    },
    {
      "title": "Respect the gate",
      "body": "The delivery view shows unresolved approvals."
    }
  ]
}} />;
