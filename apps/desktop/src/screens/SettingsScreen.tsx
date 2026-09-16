/**
 * Syntaflow Settings Screen.
 * Dedicated control center coordinating vertical navigation and modular settings sections.
 */

import { useState, useEffect } from 'react';
import { useStore } from '../state/store';
import { navigate, useHistory } from '../app/router';
import { SettingsShell, type SettingsSectionId } from '../components/settings/SettingsShell';

// Section components
import { GeneralSettings } from '../components/settings/sections/GeneralSettings';
import { AppearanceSettings } from '../components/settings/sections/AppearanceSettings';
import { NotificationsSettings } from '../components/settings/sections/NotificationsSettings';
import { WorkspaceSettings } from '../components/settings/sections/WorkspaceSettings';
import { ClientAccessSettings } from '../components/settings/sections/ClientAccessSettings';
import { IntegrationsSettings } from '../components/settings/sections/IntegrationsSettings';
import { AiSettings } from '../components/settings/sections/AiSettings';
import { SecuritySettings } from '../components/settings/sections/SecuritySettings';
import { AccountSettings } from '../components/settings/sections/AccountSettings';
import { AdvancedSettings } from '../components/settings/sections/AdvancedSettings';

export function normalizeSettingsSection(raw?: string): SettingsSectionId {
  if (!raw) return 'general';
  const clean = raw.toLowerCase().trim();
  if (clean === 'defaults' || clean === 'general') return 'general';
  if (clean === 'appearance') return 'appearance';
  if (clean === 'notifications') return 'notifications';
  if (clean === 'workspace') return 'workspace';
  if (clean === 'access' || clean === 'client-access') return 'client-access';
  if (clean === 'integrations') return 'integrations';
  if (clean === 'ai' || clean === 'models') return 'ai';
  if (clean === 'security') return 'security';
  if (clean === 'account') return 'account';
  if (clean === 'advanced') return 'advanced';
  return 'general';
}

export function SettingsScreen({ section }: { section?: string }) {
  const { state } = useStore();
  const { canGoBack, goBack } = useHistory();

  const [activeSection, setActiveSection] = useState<SettingsSectionId>(() =>
    normalizeSettingsSection(section)
  );

  // Synchronize when the route section param changes
  useEffect(() => {
    setActiveSection(normalizeSettingsSection(section));
  }, [section]);

  const handleSelectSection = (nextSection: SettingsSectionId) => {
    setActiveSection(nextSection);
    navigate(`#/settings/${nextSection}`);
  };

  const handleBack = () => {
    if (canGoBack) {
      goBack();
    } else {
      navigate('#/home');
    }
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'general':
        return <GeneralSettings />;
      case 'appearance':
        return <AppearanceSettings />;
      case 'notifications':
        return <NotificationsSettings />;
      case 'workspace':
        return <WorkspaceSettings />;
      case 'client-access':
        return <ClientAccessSettings />;
      case 'integrations':
        return <IntegrationsSettings />;
      case 'ai':
        return <AiSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'account':
        return <AccountSettings />;
      case 'advanced':
        return <AdvancedSettings />;
      default:
        return <GeneralSettings />;
    }
  };

  return (
    <SettingsShell
      activeSection={activeSection}
      onSelectSection={handleSelectSection}
      onBack={handleBack}
      grantsCount={state.grants.length}
    >
      {renderActiveSection()}
    </SettingsShell>
  );
}
