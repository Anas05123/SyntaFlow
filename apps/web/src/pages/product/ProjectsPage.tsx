import React from 'react';
import { OutcomePage } from '../../components/marketing/OutcomePage';

export const ProjectsPage: React.FC = () => <OutcomePage {...{
  "path": "/product/projects",
  "eyebrow": "Project workspace",
  "title": "Know where the project stands.",
  "intro": "The project view keeps the brief, work, review state, and delivery gate close enough to make the next step clear.",
  "result": "The work has a place, and the next step has an owner.",
  "image": "/product-screens/current/project.png",
  "imageAlt": "The Brand identity system project in the current Syntaflow desktop build.",
  "imageNote": "Brand identity system · sample project",
  "points": [
    {
      "title": "Start from the project",
      "body": "See the engagement as a whole before opening a task."
    },
    {
      "title": "Keep work attached",
      "body": "Tasks and review records belong to this project."
    },
    {
      "title": "See what is waiting",
      "body": "The project view points to a pending review rather than making you infer it."
    }
  ]
}} />;
