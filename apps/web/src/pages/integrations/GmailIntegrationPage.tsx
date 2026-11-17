import React from 'react';
import { IntegrationDetail } from '../../components/marketing/IntegrationDetail';

export const GmailIntegrationPage: React.FC = () => <IntegrationDetail {...{
  "path": "/integrations/gmail",
  "id": "gmail",
  "name": "Gmail",
  "purpose": "See relevant client correspondence without leaving the engagement.",
  "context": "Use the Gmail connector to bring selected message context beside the project you are working on.",
  "caveat": "Review provider permissions during setup. A connector is not evidence that an email was sent or that all inbox content is imported."
}} />;
