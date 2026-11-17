import React from 'react';
import { OutcomePage } from '../../components/marketing/OutcomePage';

export const FreelancersPage: React.FC = () => <OutcomePage {...{
  "path": "/solutions/freelancers",
  "eyebrow": "For independent professionals",
  "title": "Know what to do next for every client.",
  "intro": "When you manage the work and the relationship, Home gives you a place to start and each project keeps its tasks and decisions together.",
  "result": "Less searching before the next action.",
  "image": "/product-screens/current/home.png",
  "imageAlt": "Syntaflow Home in a sample solo client engagement.",
  "imageNote": "Home · sample engagement",
  "points": [
    {
      "title": "Start your day",
      "body": "See attention and active work in one view."
    },
    {
      "title": "Open the project",
      "body": "Go from a client record into the work that matters."
    },
    {
      "title": "Review with clarity",
      "body": "Keep comments tied to a named version."
    }
  ]
}} />;
