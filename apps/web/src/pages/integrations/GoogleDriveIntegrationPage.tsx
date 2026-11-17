import React from 'react';
import { IntegrationDetail } from '../../components/marketing/IntegrationDetail';

export const GoogleDriveIntegrationPage: React.FC = () => <IntegrationDetail {...{
  "path": "/integrations/google-drive",
  "id": "google-drive",
  "name": "Google Drive",
  "purpose": "Keep selected file references near the work.",
  "context": "Use Drive context when a brief, draft, or supporting file belongs to an engagement.",
  "caveat": "A linked file reference is not automatic delivery to a client."
}} />;
