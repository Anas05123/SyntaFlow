import React from 'react';
import { IntegrationDetail } from '../../components/marketing/IntegrationDetail';

export const LinearIntegrationPage: React.FC = () => <IntegrationDetail {...{
  "path": "/integrations/linear",
  "id": "linear",
  "name": "Linear",
  "purpose": "See issue context with client work.",
  "context": "Use issue references to keep development progress in the project narrative.",
  "caveat": "Issue visibility and actions depend on the connected workspace and its permissions."
}} />;
