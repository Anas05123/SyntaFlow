/**
 * S01-S03 · Settings.
 *
 * Contextual sections: General, Appearance, Workspace, Account, Client access,
 * Integrations, and Advanced. Destructive operations are isolated in Danger Zone.
 */

import { useEffect, useState } from 'react';

import { useStore } from '../state/store';
import { useOverlay } from '../ui/overlay';
import { navigate } from '../app/router';
import { formatShortDate, initials, relative } from '../domain/dates';
import {
  Banner, Button, Card, CardBody, CardHead, Check, Chip, Def, Defs, Field,
  PageHead, TabLink, Tabs, TextInput,
} from '../ui/primitives';
import { BrandMark } from '../ui/BrandMark';
import { Icon } from '../ui/Icon';

export type SettingsSection =
  | 'general'
  | 'appearance'
  | 'workspace'
  | 'account'
  | 'access'
  | 'integrations'
  | 'advanced';

function normalizeSection(raw?: string): SettingsSection {
  if (!raw) return 'general';
  if (raw === 'defaults' || raw === 'general') return 'general';
  if (raw === 'appearance') return 'appearance';
  if (raw === 'workspace') return 'workspace';
  if (raw === 'account') return 'account';
  if (raw === 'access') return 'access';
  if (raw === 'integrations') return 'integrations';
  if (raw === 'advanced') return 'advanced';
  return 'general';
}

export function SettingsScreen({ section }: { section: string }) {
  const { state, dispatch } = useStore();
  const overlay = useOverlay();
  const [tab, setTab] = useState<SettingsSection>(() => normalizeSection(section));

  useEffect(() => {
    setTab(normalizeSection(section));
  }, [section]);

  const ws = state.workspace;
  const activeGrants = state.grants.filter((g) => g.state === 'active' || g.state === 'verified');

  return (
    <>
      <PageHead
        eyebrow="Workspace"
        title="Settings"
        sub="One owner, one workspace. Everything a guest can reach is controlled here."
      />

      <div className="mb-20">
        <Tabs>
          <TabLink href="#/settings/general" label="General" selected={tab === 'general'} onClick={() => setTab('general')} />
          <TabLink href="#/settings/appearance" label="Appearance" selected={tab === 'appearance'} onClick={() => setTab('appearance')} />
          <TabLink href="#/settings/workspace" label="Workspace" selected={tab === 'workspace'} onClick={() => setTab('workspace')} />
          <TabLink href="#/settings/account" label="Account" selected={tab === 'account'} onClick={() => setTab('account')} />
          <TabLink href="#/settings/access" label="Client access" count={state.grants.length} selected={tab === 'access'} onClick={() => setTab('access')} />
          <TabLink href="#/settings/integrations" label="Integrations" selected={tab === 'integrations'} onClick={() => setTab('integrations')} />
          <TabLink href="#/settings/advanced" label="Advanced" selected={tab === 'advanced'} onClick={() => setTab('advanced')} />
        </Tabs>
      </div>

      {/* ---- General Tab (Business Identity & Document Defaults) ---- */}
      {tab === 'general' ? (
        <div className="split">
          <div className="stack">
            <Card>
              <CardHead
                title="Business identity"
                desc="Applies to new documents only. Historical versions stay exactly as submitted."
              />
              <CardBody>
                <div className="grid grid-2">
                  <Field label="Business name" htmlFor="biz-name">
                    <TextInput id="biz-name" defaultValue={ws.name} />
                  </Field>
                  <Field label="Contact email" htmlFor="biz-email">
                    <TextInput id="biz-email" defaultValue={ws.ownerEmail} />
                  </Field>
                  <Field label="Website" htmlFor="biz-web">
                    <TextInput id="biz-web" defaultValue={ws.business.website} />
                  </Field>
                  <Field label="Registration / VAT" htmlFor="biz-reg">
                    <TextInput id="biz-reg" defaultValue={ws.business.registration} placeholder="Optional" />
                  </Field>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHead title="Document branding" />
              <CardBody>
                <div className="grid grid-2">
                  <div>
                    <div className="panel-section-title">Logo</div>
                    <div style={{ border: '1px dashed var(--edge)', borderRadius: 'var(--r-control)', display: 'grid', placeItems: 'center', height: 110 }}>
                      <span className="meta">{ws.business.logoLabel} · click to replace</span>
                    </div>
                  </div>
                  <div>
                    <div className="field">
                      <label className="field-label">Proposal defaults</label>
                      <div className="stack-tight">
                        <Check label="Include fee table" defaultChecked={ws.proposalDefaults.includeFeeTable} />
                        <Check label="Include assumptions section" defaultChecked={ws.proposalDefaults.includeAssumptions} />
                        <Check label="Include payment terms page" defaultChecked={ws.proposalDefaults.includePaymentTerms} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row mt-20 row-wrap">
                  <Button variant="primary" onClick={() => overlay.toast('Defaults saved', 'Applied to new documents. Historical versions are unchanged.', 'ok')}>
                    Save defaults
                  </Button>
                  <Button icon="eye" onClick={() => overlay.toast('Preview', 'Defaults appear on the proposal cover.', 'default')}>
                    Preview on a document
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="stack">
            <Card>
              <CardHead title="Live proposal preview" desc="A proposal cover with current defaults." />
              <CardBody>
                <div style={{ background: 'var(--canvas)', border: '1px solid var(--divider)', borderRadius: 4, padding: 22 }}>
                  <div className="row-between">
                    <BrandMark size={26} />
                    <span className="meta">10 Sep 2026</span>
                  </div>
                  <h3 className="mt-20">Proposal</h3>
                  <p className="meta mt-4">Onboarding redesign · Verity Health</p>
                  <div className="divider-h" style={{ margin: '18px 0' }} />
                  <div className="meta" style={{ lineHeight: 1.7 }}>
                    Prepared by {ws.ownerName}
                    <br />
                    {ws.name}
                    <br />
                    {ws.ownerEmail}
                  </div>
                  {ws.proposalDefaults.includeFeeTable ? (
                    <div style={{ borderTop: '3px solid var(--accent)', marginTop: 18, paddingTop: 10 }}>
                      <span className="meta">Fee table · 3 milestones</span>
                    </div>
                  ) : null}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      ) : null}

      {/* ---- Appearance Tab ---- */}
      {tab === 'appearance' ? (
        <div className="split">
          <div className="stack">
            <Card>
              <CardHead title="Interface theme" desc="Desktop color palette and high-contrast surface rules." />
              <CardBody>
                <div className="grid grid-3">
                  <button
                    type="button"
                    className="option selected"
                    style={{ textAlign: 'left', padding: '14px 16px' }}
                    onClick={() => overlay.toast('Dark Theme Active', 'Canonical desktop theme.', 'default')}
                  >
                    <div className="strong mb-4">Dark (Default)</div>
                    <div className="meta">Graphite workspace with cobalt focus and accents.</div>
                  </button>
                  <button
                    type="button"
                    className="option"
                    style={{ textAlign: 'left', padding: '14px 16px' }}
                    onClick={() => overlay.toast('Light Theme', 'Light mode requires high contrast ratio check.', 'default')}
                  >
                    <div className="strong mb-4">Light</div>
                    <div className="meta">High-contrast surface mode for bright environments.</div>
                  </button>
                  <button
                    type="button"
                    className="option"
                    style={{ textAlign: 'left', padding: '14px 16px' }}
                    onClick={() => overlay.toast('System Sync', 'Matches your operating system preference.', 'default')}
                  >
                    <div className="strong mb-4">System</div>
                    <div className="meta">Automatically syncs with Windows dark/light preference.</div>
                  </button>
                </div>

                <div className="field mt-20">
                  <label className="field-label">Document accent color</label>
                  <div className="row row-wrap" style={{ gap: 8 }}>
                    {[
                      { hex: '#2F6FEB', name: 'Harbor Cobalt' },
                      { hex: '#3FA66B', name: 'Signal Green' },
                      { hex: '#D49A3A', name: 'Amber' },
                      { hex: '#14181C', name: 'Graphite' },
                    ].map((c, i) => (
                      <button
                        key={c.hex}
                        type="button"
                        className={`option${i === 0 ? ' selected' : ''}`}
                        style={{ width: 'auto', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}
                        onClick={() => overlay.toast('Accent selected', `${c.name} (${c.hex}) selected for new documents.`, 'ok')}
                      >
                        <span style={{ background: c.hex, borderRadius: 4, height: 20, width: 20, display: 'inline-block', border: '1px solid var(--divider)' }} />
                        <span style={{ fontSize: 'var(--fs-label)' }}>{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="stack">
            <Card>
              <CardHead title="Design rules in force" desc="From the Foundations frame. These are constraints, not preferences." />
              <CardBody>
                <div className="stack-tight">
                  {[
                    'No glow or glassmorphism',
                    'No bright-outline buttons',
                    'No gradient cards',
                    'No pill-heavy navigation',
                    'Use dividers, rails and work surfaces',
                    'Primary controls: 40–44 px',
                  ].map((r) => (
                    <div className="row" style={{ gap: 9 }} key={r}>
                      <span className="mark-ok">✓</span>
                      <span style={{ fontSize: 'var(--fs-label)' }}>{r}</span>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      ) : null}

      {/* ---- Workspace Tab ---- */}
      {tab === 'workspace' ? (
        <div className="split">
          <div className="stack">
            <Card>
              <CardHead title="Workspace identity" desc="Global settings for your CoreDesk team workspace." />
              <CardBody>
                <div className="grid grid-2">
                  <Field label="Workspace name" htmlFor="ws-name">
                    <TextInput id="ws-name" defaultValue={ws.name} />
                  </Field>
                  <Field label="Timezone" htmlFor="ws-tz">
                    <select className="select" id="ws-tz" defaultValue={ws.timezone}>
                      <option value={ws.timezone}>{ws.timezone}</option>
                      <option value="Europe/London (GMT+1)">Europe/London (GMT+1)</option>
                      <option value="America/New_York (GMT-4)">America/New_York (GMT-4)</option>
                    </select>
                  </Field>
                </div>
                <div className="row mt-16">
                  <Button variant="primary" onClick={() => overlay.toast('Workspace updated', 'Settings saved.', 'ok')}>
                    Save workspace
                  </Button>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHead
                title="Services and default fee items"
                desc="Used to pre-fill proposals. Editable per document."
                action={
                  <Button size="sm" icon="plus" onClick={() => overlay.toast('Fee item added', 'Pre-fills new proposals only.', 'ok')}>
                    Add item
                  </Button>
                }
              />
              <CardBody flush>
                {ws.services.map((s) => (
                  <div className="item-row" key={s.id}>
                    <div className="item-main">
                      <div className="item-title">{s.name}</div>
                      <div className="item-sub">{s.basis}</div>
                    </div>
                    <div className="item-side">
                      <span className="strong num">
                        {s.currency === 'EUR' ? '€' : ''} {s.amount.toLocaleString('en-GB')}
                        {s.basis === 'Day rate' ? ' / day' : s.basis === 'Hourly' ? ' / hour' : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </CardBody>
            </Card>
          </div>

          <div className="stack">
            <Card>
              <CardHead title="Notifications" />
              <CardBody>
                <div className="stack-tight">
                  <Check label="Tell me when a review is decided" defaultChecked />
                  <Check label="Tell me when a guest downloads a delivered file" defaultChecked />
                  <Check label="Weekly summary of open work" />
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      ) : null}

      {/* ---- Account Tab ---- */}
      {tab === 'account' ? (
        <div className="split">
          <div className="stack">
            <Card>
              <CardHead title="Your account" desc="V1 has exactly one owner. Member management arrives with team seats." />
              <CardBody>
                <div className="grid grid-2">
                  <Field label="Full name" htmlFor="ws-owner">
                    <TextInput
                      id="ws-owner"
                      defaultValue={ws.ownerName}
                      onBlur={() => overlay.toast('Profile updated', 'Saved locally.', 'ok')}
                    />
                  </Field>
                  <Field label="Email" htmlFor="ws-email">
                    <TextInput id="ws-email" defaultValue={ws.ownerEmail} />
                  </Field>
                </div>
                <div className="field mt-16">
                  <label className="field-label" htmlFor="ws-pass">Password</label>
                  <div className="row">
                    <TextInput id="ws-pass" type="password" defaultValue="passwordpassword" style={{ maxWidth: 260 }} />
                    <Button onClick={() => overlay.toast('Password change', 'Changing your password signs out other sessions.', 'default')}>
                      Change
                    </Button>
                  </div>
                </div>
                <div className="field mt-16">
                  <label className="field-label">Active session</label>
                  <div className="immutable">
                    <span style={{ fontSize: 'var(--fs-label)' }}>This device · {ws.timezone}</span>
                    <span className="meta">Last active now</span>
                  </div>
                </div>
                <div className="row mt-20">
                  <Button variant="primary" onClick={() => overlay.toast('Settings saved', 'Applied immediately.', 'ok')}>
                    Save changes
                  </Button>
                  <Button
                    onClick={() => {
                      overlay.toast('Signed out', 'Local data stays on this machine.', 'ok');
                      navigate('#/auth');
                    }}
                  >
                    Sign out
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="stack">
            <Card>
              <CardHead title="Security & device posture" />
              <CardBody>
                <Defs>
                  <Def k="Encryption">AES-256 local database</Def>
                  <Def k="Privilege">Local owner (full workspace access)</Def>
                  <Def k="Network">Offline-first (zero external telemetry)</Def>
                </Defs>
              </CardBody>
            </Card>
          </div>
        </div>
      ) : null}

      {/* ---- Client Access Tab ---- */}
      {tab === 'access' ? (
        <>
          <div className="mb-16">
            <Banner
              title={<><strong>Access is granted per object, never per relationship.</strong> A client contact with no grant sees nothing.</>}
              sub="An invitation never gives workspace-wide access, and no grant is inherited by sibling projects or documents."
              action={<Button size="sm" variant="primary" icon="mail" onClick={() => navigate('#/share')}>Invite recipient</Button>}
            />
          </div>

          <Card>
            <CardHead
              title="Access grants"
              desc="Recipient + object + permissions + expiry. Revoking is immediate and separate from archiving."
              action={
                <span className="meta">
                  {activeGrants.length} active · {state.grants.filter((g) => g.state === 'invited').length} pending
                </span>
              }
            />
            <div className="table-wrap">
              <table className="data">
                <thead>
                  <tr>
                    <th>Recipient</th><th>Role</th><th>Object</th><th>Permissions</th>
                    <th>Invited</th><th>Last activity</th><th>State</th><th><span className="visually-hidden">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {state.grants.map((g) => (
                    <tr key={g.id}>
                      <td>
                        <div className="row">
                          <span className="avatar">{initials(g.recipient.name)}</span>
                          <div>
                            <div className="cell-primary">{g.recipient.name}</div>
                            <div className="cell-sub">{g.recipient.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>{g.role}</td>
                      <td>
                        <div>{g.objectLabel}</div>
                        <div className="cell-sub">{g.objectType}</div>
                      </td>
                      <td><span className="meta">{g.permissions.length} permission{g.permissions.length === 1 ? '' : 's'}</span></td>
                      <td className="num"><span className="meta">{formatShortDate(g.invited)}</span></td>
                      <td className="num"><span className="meta">{g.lastActivity ? relative(g.lastActivity) : 'Never'}</span></td>
                      <td><Chip state={g.state === 'verified' ? 'active' : g.state === 'invited' ? 'pending' : g.state} /></td>
                      <td className="cell-actions">
                        {g.state === 'active' || g.state === 'verified' || g.state === 'invited' ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              dispatch({ type: 'grant/state', id: g.id, state: 'revoked' });
                              overlay.toast('Access revoked', 'The recipient can no longer read the granted object. The record itself is unchanged.', 'warn');
                            }}
                          >
                            Revoke
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => {
                              dispatch({ type: 'grant/state', id: g.id, state: 'invited' });
                              overlay.toast('Invitation re-sent', 'A new grant is created rather than reviving the expired one.', 'ok');
                            }}
                          >
                            Re-invite
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="grid grid-3 mt-16">
            <Card>
              <CardHead title="Guest reviewer" desc="Can read the granted version, comment, and decide — only when designated." />
              <CardBody>
                <div className="stack-tight">
                  {['Read granted version', 'Comment', 'Approve or request changes', 'Download permitted files'].map((p) => (
                    <div className="row" style={{ gap: 9 }} key={p}>
                      <span className="mark-ok">✓</span>
                      <span style={{ fontSize: 'var(--fs-label)' }}>{p}</span>
                    </div>
                  ))}
                  <div className="divider-h" style={{ margin: '12px 0' }} />
                  {['Cannot see internal notes', 'Cannot search the workspace', 'Cannot edit drafts', 'Cannot invite others'].map((p) => (
                    <div className="row" style={{ gap: 9, color: 'var(--metadata)' }} key={p}>
                      <span>✕</span>
                      <span style={{ fontSize: 'var(--fs-label)' }}>{p}</span>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHead title="Guest viewer" desc="Reads and downloads granted content. Cannot approve or manage access." />
              <CardBody>
                <Banner
                  title="Tomas Reiner holds viewer access on the shared project summary."
                  sub="It expired on 16 Aug. Re-inviting creates a new grant rather than reviving the old one."
                />
              </CardBody>
            </Card>

            <Card>
              <CardHead title="Access lifecycle" />
              <CardBody>
                <div className="row row-wrap" style={{ gap: 8 }}>
                  <Chip state="invited" label="Invited" />
                  <span className="meta">→</span>
                  <Chip state="active" label="Verified" />
                  <span className="meta">→</span>
                  <Chip state="expired" />
                  <span className="meta">→</span>
                  <Chip state="revoked" />
                </div>
                <Defs>
                  <Def k="Preview parity">Owner preview uses the real guest surface, not a mock</Def>
                  <Def k="Wrong account">Identity can be switched without revealing content</Def>
                  <Def k="Revoked link">Shows a clear unavailable state, never a broken page</Def>
                </Defs>
                <Button block className="mt-12" icon="external" onClick={() => navigate('#/guest/shared')}>
                  Open guest surface
                </Button>
              </CardBody>
            </Card>
          </div>
        </>
      ) : null}

      {/* ---- Integrations Tab ---- */}
      {tab === 'integrations' ? (
        <div className="split">
          <div className="stack">
            <Card>
              <CardHead title="Local storage & filesystem sync" desc="Direct workstation integrations without cloud lock-in." />
              <CardBody>
                <div className="item-row">
                  <div className="item-main">
                    <div className="item-title">Workspace Directory Sync</div>
                    <div className="item-sub">Mirror client deliveries and export bundles to your local files.</div>
                  </div>
                  <div className="item-side">
                    <Chip state="active" label="Connected" />
                  </div>
                </div>
                <div className="item-row">
                  <div className="item-main">
                    <div className="item-title">System Calendar (.ics)</div>
                    <div className="item-sub">Publish milestone gates and review deadlines to Outlook, Google, or Apple Calendar.</div>
                  </div>
                  <div className="item-side">
                    <Chip state="active" label="Configured" />
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHead title="Accounting & automation" desc="Export data for bookkeeping and external scripts." />
              <CardBody>
                <div className="item-row">
                  <div className="item-main">
                    <div className="item-title">Accounting CSV / JSON Export</div>
                    <div className="item-sub">Download structured invoices and service fee items.</div>
                  </div>
                  <div className="item-side">
                    <Button size="sm" onClick={() => overlay.toast('Export configured', 'Ready for download.', 'ok')}>Configure</Button>
                  </div>
                </div>
                <div className="item-row">
                  <div className="item-main">
                    <div className="item-title">Outbound Webhooks</div>
                    <div className="item-sub">Dispatch HTTP notifications when a review is decided or delivery package is downloaded.</div>
                  </div>
                  <div className="item-side">
                    <Button size="sm" onClick={() => overlay.toast('Webhooks', 'Desktop webhook listener active.', 'default')}>Configure</Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="stack">
            <Card>
              <CardHead title="Integration policy" />
              <CardBody>
                <p className="meta" style={{ lineHeight: 1.6 }}>
                  CoreDesk is offline-first. Integrations operate via local file pipes, OS calendar hooks, or explicit user-triggered webhooks. Your data is never synced to third-party servers without your knowledge.
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      ) : null}

      {/* ---- Advanced Tab (Data Storage & Danger Zone) ---- */}
      {tab === 'advanced' ? (
        <div className="split">
          <div className="stack">
            <Card>
              <CardHead
                title="Your data"
                desc="Offline-first: the workspace lives on this machine. Export and deletion are owner actions."
              />
              <CardBody>
                <Defs>
                  <Def k="Storage">Local database · seeded 10 Sep 2026</Def>
                  <Def k="Records">
                    {state.clients.length} clients · {state.projects.length} projects · {state.documents.length} documents
                  </Def>
                  <Def k="Database Location">AppData/Roaming/CoreDesk/canonical-store.db</Def>
                </Defs>
                <div className="row mt-16 row-wrap">
                  <Button
                    icon="download"
                    onClick={() => overlay.toast('Data export requested', 'A JSON export of every record will be written to the workspace folder.', 'ok')}
                  >
                    Request data export
                  </Button>
                </div>
              </CardBody>
            </Card>

            {/* Explicit Danger Zone container */}
            <div className="cd-danger-zone">
              <div className="cd-danger-zone-head">
                <Icon name="alert" size={20} />
                <div>
                  <h3 className="cd-danger-zone-title">Danger Zone</h3>
                  <div className="meta" style={{ margin: 0 }}>
                    Irreversible actions that affect your local workspace database and cached state.
                  </div>
                </div>
              </div>
              <div className="cd-danger-zone-body">
                <div className="cd-danger-zone-row">
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div className="strong" style={{ fontSize: 'var(--fs-label)' }}>Reset Workspace Demo Data</div>
                    <div className="meta">
                      Restores all clients, projects, tasks, and documents back to the seeded baseline. This cannot be undone.
                    </div>
                  </div>
                  <Button
                    variant="danger"
                    icon="trash"
                    onClick={() => overlay.openModal('reset-workspace')}
                  >
                    Reset demo data
                  </Button>
                </div>

                <div className="cd-danger-zone-row">
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div className="strong" style={{ fontSize: 'var(--fs-label)' }}>Purge Local UI Cache</div>
                    <div className="meta">
                      Clears local window geometry, filter memory, and temporary session preferences without touching database records.
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => overlay.toast('UI Cache Purged', 'Local preferences and filter memory reset.', 'ok')}
                  >
                    Purge cache
                  </Button>
                </div>
              </div>
            </div>

            <div className="row mt-20" style={{ gap: 16 }}>
              <a href="#/terms">Terms</a>
              <a href="#/privacy">Privacy</a>
            </div>
          </div>

          <div className="stack">
            <Card>
              <CardHead title="Engine invariants" />
              <CardBody>
                <ul className="doc-list" style={{ marginTop: 0 }}>
                  <li>Local SQLite database is the canonical source of truth.</li>
                  <li>Document versions submitted to review are strictly immutable.</li>
                  <li>Access grants are scoped to individual objects, never whole workspaces.</li>
                </ul>
              </CardBody>
            </Card>
          </div>
        </div>
      ) : null}
    </>
  );
}

