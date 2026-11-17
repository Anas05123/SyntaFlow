import React from 'react';
import { IntegrationDetail } from '../../components/marketing/IntegrationDetail';

export const NotionIntegrationPage: React.FC = () => <IntegrationDetail {...{
  "path": "/integrations/notion",
  "id": "notion",
  "name": "Notion",
  "purpose": "Keep selected notes in the engagement context.",
  "context": "Use pages you choose to share with the connector as supporting project context.",
  "caveat": "Only pages authorized in your provider setup should be considered available."
}} />;
