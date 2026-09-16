import React from 'react';
import { ClientManagementPage } from './ClientManagementPage';

/**
 * Legacy route component for /product/client-ops
 * Redirects functionally to the canonical /product/client-management
 */
export const ClientOpsPage: React.FC = () => {
  return <ClientManagementPage />;
};
