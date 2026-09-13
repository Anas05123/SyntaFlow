/**
 * S01-S03 · Settings.
 *
 * Account & workspace, Professional defaults, Client access. One owner in V1;
 * everything a guest can reach is controlled from the access tab.
 */

import { useState } from 'react';

import { useStore } from '../state/store';
import { useOverlay } from '../ui/overlay';
import { navigate } from '../app/router';
import { formatShortDate, initials, relative } from '../domain/dates';
import {
  Banner, Button, Card, CardBody, CardHead, Check, Chip, Def, Defs, Field,
  PageHead, TabLink, Tabs, TextInput,
} from '../ui/primitives';
import { BrandMark } from '../ui/BrandMark';

type Section = 'account' | 'defaults' | 'access';

export function SettingsScreen({ section }: { section: string }) {
  const { state, dispatch } = useStore();
  const overlay = useOverlay();
  const [tab, setTab] = useState<Section>(
    section === 'defaults' || section === 'access' ? section : 'account'
  );

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
          <TabLink label="Account & workspace" selected={tab === 'account'} onClick={() => setTab('account')} />
          <TabLink label="Professional defaults" selected={tab === 'defaults'} onClick={() => setTab('defaults')} />
          <TabLink label="Client access" count={state.grants.length} selected={tab === 'access'} onClick={() => setTab('access')} />
        </Tabs>
      </div>

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
                  {/*
                    Sign out returns to the entry surface.

                    There is no session to clear — this build has no backend and no
                    auth — so the honest reading of "sign out" is "leave the
                    workspace and go back to the door". Previously this button only
                    fired a toast and left the user sitting in Settings with a
                    "Signed out" message on screen, which is worse than having no
                    button at all.

                    It keeps local workspace data on purpose. Signing out is not
                    the same action as resetting, and conflating the two would
                    make an ordinary navigation destroy the user's work. Data is
                    reset deliberately, from its own control.
                  */}
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

            <Card>
              <CardHead title="Workspace" />
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
                <div className="panel-section">
                  <div className="panel-section-title">Notifications</div>
                  <div className="stack-tight">
                    <Check label="Tell me when a review is decided" defaultChecked />
                    <Check label="Tell me when a guest downloads a delivered file" defaultChecked />
                    <Check label="Weekly summary of open work" />
                  </div>
                </div>
              </CardBody>
            </Card>

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
                </Defs>
                <div className="row mt-16 row-wrap">
                  <Button icon="download" onClick={() => overlay.toast('Data export requested', 'A JSON export of every record will be written to the workspace folder.', 'ok')}>
                    Request data export
                  </Button>
                  <Button
                    variant="danger"
                    icon="trash"
                    onClick={() => overlay.openModal('reset-workspace')}
                  >
                    Reset demo data
                  </Button>
                </div>
                <div className="row mt-20" style={{ gap: 16 }}>
                  <a href="#/terms">Terms</a>
                  <a href="#/privacy">Privacy</a>
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

      {tab === 'defaults' ? (
        <div className="split">
          <div className="stack">
            <Card>
              <CardHead
                title="Business identity"
                desc="Applies to new documents only. Historical versions stay exactly as submitted."
              />
              <CardBody>
                <div className="grid grid-2">
                  <Field label="Business name" htmlFor="biz-name"><TextInput id="biz-name" defaultValue={ws.name} /></Field>
                  <Field label="Contact email" htmlFor="biz-email"><TextInput id="biz-email" defaultValue={ws.ownerEmail} /></Field>
                  <Field label="Website" htmlFor="biz-web"><TextInput id="biz-web" defaultValue={ws.business.website} /></Field>
                  <Field label="Registration / VAT" htmlFor="biz-reg"><TextInput id="biz-reg" defaultValue={ws.business.registration} placeholder="Optional" /></Field>
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
                    <div className="panel-section-title">Document accent</div>
                    <div className="row row-wrap">
                      {['#2F6FEB', '#3FA66B', '#D49A3A', '#14181C'].map((hex, i) => (
                        <button
                          key={hex}
                          type="button"
                          className={`option${i === 0 ? ' selected' : ''}`}
                          style={{ width: 'auto', padding: 8 }}
                          onClick={() => overlay.toast('Accent selected', `${hex} will be used on new documents.`, 'ok')}
                        >
                          <span style={{ background: hex, borderRadius: 4, height: 26, width: 26, display: 'inline-block', border: '1px solid var(--divider)' }} />
                        </button>
                      ))}
                    </div>
                    <div className="field mt-16">
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
              <CardHead title="Live preview" desc="A proposal cover with current defaults." />
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
    </>
  );
}
