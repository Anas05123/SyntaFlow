import React from 'react';
import { IntegrationDetail } from '../../components/marketing/IntegrationDetail';

export const GitHubIntegrationPage: React.FC = () => <IntegrationDetail {...{
  "path": "/integrations/github",
  "id": "github",
  "name": "GitHub",
  "purpose": "Connect repository context to the project.",
  "context": "Use repository references to help explain development work alongside the client engagement.",
  "caveat": "The connector's usable actions depend on your token and repository permissions."
}} />;
