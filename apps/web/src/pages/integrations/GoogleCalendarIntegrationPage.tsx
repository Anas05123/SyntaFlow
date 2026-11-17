import React from 'react';
import { IntegrationDetail } from '../../components/marketing/IntegrationDetail';

export const GoogleCalendarIntegrationPage: React.FC = () => <IntegrationDetail {...{
  "path": "/integrations/google-calendar",
  "id": "google-calendar",
  "name": "Google Calendar",
  "purpose": "See the schedule alongside the project.",
  "context": "Use calendar context to plan review sessions and deadlines in relation to active client work.",
  "caveat": "Calendar access depends on the account and permissions you connect."
}} />;
