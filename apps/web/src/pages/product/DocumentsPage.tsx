import React from 'react';
import { OutcomePage } from '../../components/marketing/OutcomePage';

export const DocumentsPage: React.FC = () => <OutcomePage {...{
  "path": "/product/documents",
  "eyebrow": "Work and versions",
  "title": "Keep a clear record of what changed.",
  "intro": "Draft work lives with the project. When a version is submitted for review, the discussion refers to that version instead of an ambiguous latest file.",
  "result": "Work stays connected to the decision it leads to.",
  "image": "/product-screens/current/work.png",
  "imageAlt": "Tasks and work in the Brand identity system sample project.",
  "imageNote": "Project work · current desktop build",
  "points": [
    {
      "title": "Work in project context",
      "body": "Tasks sit beside the project they move forward."
    },
    {
      "title": "Submit a version",
      "body": "A review starts from a specific submitted version."
    },
    {
      "title": "Return to the record",
      "body": "Find the decision later without guessing which draft it was about."
    }
  ]
}} />;
