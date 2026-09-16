/**
 * Workspace Settings Section.
 * Organization-level configuration: business identity, services fee schedule, and proposal defaults.
 */

import { useState, type FormEvent } from 'react';
import { useStore } from '../../../state/store';
import { useOverlay } from '../../../ui/overlay';
import { Icon } from '../../../ui/Icon';
import { BrandMark } from '../../../ui/BrandMark';
import type { ServiceDefault } from '../../../domain/types';
import {
  SettingsPage,
  SettingsSection,
  SettingsRow,
  SettingsToggleRow,
  SettingsCard,
} from '../SettingsPrimitives';

export function WorkspaceSettings() {
  const { state, dispatch } = useStore();
  const overlay = useOverlay();
  const ws = state.workspace;

  const [name, setName] = useState(ws.name);
  const [timezone, setTimezone] = useState(ws.timezone);
  const [website, setWebsite] = useState(ws.business.website);
  const [registration, setRegistration] = useState(ws.business.registration);

  const [includeFeeTable, setIncludeFeeTable] = useState(ws.proposalDefaults.includeFeeTable);
  const [includeAssumptions, setIncludeAssumptions] = useState(ws.proposalDefaults.includeAssumptions);
  const [includePaymentTerms, setIncludePaymentTerms] = useState(ws.proposalDefaults.includePaymentTerms);

  const [services, setServices] = useState<ServiceDefault[]>(ws.services);
  const [isDirty, setIsDirty] = useState(false);

  // New service item modal / inline prompt state
  const [isAddingService, setIsAddingService] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceAmount, setNewServiceAmount] = useState('1200');
  const [newServiceBasis, setNewServiceBasis] = useState<'Day rate' | 'Hourly' | 'Fixed fee'>('Day rate');

  const markDirty = () => setIsDirty(true);

  const handleSave = () => {
    dispatch({
      type: 'workspace/patch',
      patch: {
        name,
        timezone,
        business: {
          ...ws.business,
          website,
          registration,
        },
        proposalDefaults: {
          includeFeeTable,
          includeAssumptions,
          includePaymentTerms,
        },
        services,
      },
    });
    setIsDirty(false);
    overlay.toast('Workspace updated', 'Organization settings saved.', 'ok');
  };

  const handleAddService = (e: FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;
    const item: ServiceDefault = {
      id: `svc-${Date.now()}`,
      name: newServiceName.trim(),
      amount: parseFloat(newServiceAmount) || 1000,
      currency: 'EUR',
      basis: newServiceBasis,
    };
    setServices([...services, item]);
    setNewServiceName('');
    setIsAddingService(false);
    markDirty();
    overlay.toast('Fee item added', `${item.name} added to schedule.`, 'ok');
  };

  const handleRemoveService = (id: string) => {
    setServices(services.filter((s) => s.id !== id));
    markDirty();
  };

  return (
    <SettingsPage
      title="Workspace"
      description="Organization profile, business identity, default billing rates, and proposal standards."
      actions={
        <button
          type="button"
          className="cd-settings-btn primary"
          disabled={!isDirty}
          onClick={handleSave}
        >
          Save changes
        </button>
      }
    >
      {/* Organization Identity */}
      <SettingsSection
        title="Organization Identity"
        description="Public studio details visible on proposals, review portals, and delivery manifests."
      >
        <SettingsRow
          label="Workspace logo"
          sub="Primary visual identity displayed on client-facing review headers."
          control={
            <div className="row" style={{ gap: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--r-control, 8px)',
                  background: 'var(--raised, #161922)',
                  border: '1px solid var(--divider, rgba(255,255,255,0.1))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BrandMark size={24} />
              </div>
              <button
                type="button"
                className="cd-settings-btn secondary"
                onClick={() => overlay.toast('Logo branding', 'Workspace uses current Syntaflow brand mark.', 'default')}
              >
                Change mark
              </button>
            </div>
          }
        />

        <SettingsRow
          label="Organization name"
          sub="Legal or studio name used on contracts, deliverables, and invoices."
          htmlFor="ws-name"
          control={
            <input
              id="ws-name"
              type="text"
              className="cd-settings-input"
              style={{ width: 260 }}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                markDirty();
              }}
            />
          }
        />

        <SettingsRow
          label="Primary timezone"
          sub="Default timezone for milestone scheduling and delivery expiration deadlines."
          htmlFor="ws-tz"
          control={
            <select
              id="ws-tz"
              className="cd-settings-select"
              value={timezone}
              onChange={(e) => {
                setTimezone(e.target.value);
                markDirty();
              }}
            >
              <option value="Europe/London (GMT+1)">Europe/London (GMT+1)</option>
              <option value="Europe/Paris (GMT+2)">Europe/Paris (GMT+2)</option>
              <option value="America/New_York (GMT-4)">America/New_York (GMT-4)</option>
              <option value="America/Los_Angeles (GMT-7)">America/Los_Angeles (GMT-7)</option>
              <option value="Asia/Tokyo (GMT+9)">Asia/Tokyo (GMT+9)</option>
            </select>
          }
        />

        <SettingsRow
          label="Business website"
          sub="Included in document cover headers and client notification footers."
          htmlFor="ws-web"
          control={
            <input
              id="ws-web"
              type="text"
              className="cd-settings-input"
              style={{ width: 260 }}
              value={website}
              onChange={(e) => {
                setWebsite(e.target.value);
                markDirty();
              }}
            />
          }
        />

        <SettingsRow
          label="Company registration / VAT"
          sub="Fiscal registration number printed on approved project agreements."
          htmlFor="ws-reg"
          control={
            <input
              id="ws-reg"
              type="text"
              className="cd-settings-input"
              style={{ width: 260 }}
              value={registration}
              placeholder="e.g. GB 928 4102 88"
              onChange={(e) => {
                setRegistration(e.target.value);
                markDirty();
              }}
            />
          }
        />
      </SettingsSection>

      {/* Services & Rate Schedule */}
      <SettingsSection
        title="Services & Rate Schedule"
        description="Standard catalog items pre-populating proposal fee schedules. Fully editable per document."
        action={
          <button
            type="button"
            className="cd-settings-btn secondary"
            onClick={() => setIsAddingService(true)}
          >
            <Icon name="plus" size={14} />
            <span>Add fee item</span>
          </button>
        }
      >
        {isAddingService ? (
          <SettingsCard className="mb-16">
            <form onSubmit={handleAddService} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text, #fff)' }}>
                New Fee Item
              </div>
              <div className="grid grid-3" style={{ gap: 10 }}>
                <input
                  type="text"
                  className="cd-settings-input"
                  placeholder="Service name (e.g. Creative Direction)"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  autoFocus
                />
                <input
                  type="number"
                  className="cd-settings-input"
                  placeholder="Rate amount (€)"
                  value={newServiceAmount}
                  onChange={(e) => setNewServiceAmount(e.target.value)}
                />
                <select
                  className="cd-settings-select"
                  value={newServiceBasis}
                  onChange={(e) => setNewServiceBasis(e.target.value as any)}
                >
                  <option value="Day rate">Day rate</option>
                  <option value="Hourly">Hourly</option>
                  <option value="Fixed fee">Fixed deliverable</option>
                </select>
              </div>
              <div className="row" style={{ gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
                <button
                  type="button"
                  className="cd-settings-btn ghost"
                  onClick={() => setIsAddingService(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="cd-settings-btn primary">
                  Save item
                </button>
              </div>
            </form>
          </SettingsCard>
        ) : null}

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {services.map((s) => (
            <div
              key={s.id}
              className="cd-settings-row"
              style={{ padding: '12px 0' }}
            >
              <div className="cd-settings-row-main">
                <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--text, #fff)' }}>
                  {s.name}
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted, #64748b)' }}>{s.basis}</div>
              </div>
              <div className="cd-settings-row-control">
                <span
                  style={{
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--text, #fff)',
                  }}
                >
                  {s.currency === 'EUR' ? '€' : '$'}
                  {s.amount.toLocaleString('en-GB')}
                  <span style={{ fontSize: 11, color: 'var(--muted, #64748b)', marginLeft: 4 }}>
                    {s.basis === 'Day rate' ? '/ day' : s.basis === 'Hourly' ? '/ hr' : ''}
                  </span>
                </span>
                <button
                  type="button"
                  className="cd-settings-btn ghost"
                  style={{ padding: '0 8px', height: 32 }}
                  onClick={() => handleRemoveService(s.id)}
                  aria-label={`Remove ${s.name}`}
                >
                  <Icon name="trash" size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </SettingsSection>

      {/* Proposal Standards */}
      <SettingsSection
        title="Proposal Standards"
        description="Default structural sections automatically included when composing new client proposals."
      >
        <SettingsToggleRow
          id="ws-fee-table"
          label="Include milestone fee schedule"
          sub="Automatically inserts the milestone payment schedule into new proposal drafts."
          checked={includeFeeTable}
          onChange={(val) => {
            setIncludeFeeTable(val);
            markDirty();
          }}
        />

        <SettingsToggleRow
          id="ws-assumptions"
          label="Include operational assumptions section"
          sub="Adds delivery prerequisites, client response deadlines, and revision limitations."
          checked={includeAssumptions}
          onChange={(val) => {
            setIncludeAssumptions(val);
            markDirty();
          }}
        />

        <SettingsToggleRow
          id="ws-payment-terms"
          label="Include statutory payment terms"
          sub="Standard 30-day net payment and staged delivery disbursement clauses."
          checked={includePaymentTerms}
          onChange={(val) => {
            setIncludePaymentTerms(val);
            markDirty();
          }}
        />
      </SettingsSection>
    </SettingsPage>
  );
}
