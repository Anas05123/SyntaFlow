import React from 'react';
import { OutcomePage } from '../../components/marketing/OutcomePage';

export const SolutionsOverviewPage: React.FC = () => <OutcomePage {...{
  "path": "/solutions",
  "eyebrow": "Who it is for",
  "title": "A calmer way to run client work.",
  "intro": "For people who deliver projects for clients, Syntaflow makes active work, reviews, and handoff status visible in one desktop workspace.",
  "result": "Spend less time reconstructing the state of a project.",
  "image": "/product-screens/current/home.png",
  "imageAlt": "Syntaflow Home showing the sample engagement and what needs attention.",
  "imageNote": "Home · current desktop build",
  "points": [
    {
      "title": "Independent work",
      "body": "Keep the client relationship and the next task close together."
    },
    {
      "title": "Small teams",
      "body": "Let the project record show what has been reviewed and what is still waiting."
    },
    {
      "title": "Client delivery",
      "body": "Check approval before recording a handoff."
    }
  ]
}} />;
