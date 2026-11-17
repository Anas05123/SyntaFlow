import React from 'react';
import { OutcomePage } from '../../components/marketing/OutcomePage';

export const AIWorkspacePage: React.FC = () => <OutcomePage {...{
  "path": "/product/ai-workspace",
  "eyebrow": "Flow in context",
  "title": "Ask Flow while you work.",
  "intro": "Flow appears inside the desktop workspace beside the project context. It is an optional operator surface, and its output should be checked before action.",
  "result": "Keep the question close to the work.",
  "image": "/product-screens/current/flow.png",
  "imageAlt": "The Flow contextual operator screen in the current Syntaflow desktop build.",
  "imageNote": "Flow · contextual operator surface",
  "points": [
    {
      "title": "Start with the project",
      "body": "The operator has the current workspace context in view."
    },
    {
      "title": "Review the result",
      "body": "Suggestions are a starting point for your judgment."
    },
    {
      "title": "Keep control",
      "body": "The desktop workspace remains the source of the project record."
    }
  ]
}} />;
