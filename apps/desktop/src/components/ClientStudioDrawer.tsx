/**
 * Client Onboarding Studio Drawer.
 *
 * An Apple-style slide-over studio replacing the cramped modal popup.
 * Captures corporate identity, key stakeholders, commercial terms,
 * and provides an immediate 1-click launchpad.
 */

import { useState } from 'react';
import { useStore, nextId } from '../state/store';
import { useOverlay } from '../ui/overlay';
import { navigate } from '../app/router';
import { Icon } from '../ui/Icon';
import { Button, TextInput, Select, TextArea } from '../ui/primitives';
import type { ClientState } from '../domain/types';

interface ClientStudioDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onClientCreated?: (clientId: string) => void;
}

const BRAND_COLORS = [
  '#2563eb', // Cobalt Blue
  '#4f46e5', // Indigo
  '#059669', // Emerald
  '#d97706', // Amber
  '#8b5cf6', // Violet
  '#e11d48', // Rose
  '#0891b2', // Cyan
  '#4b5563', // Graphite
];

export function ClientStudioDrawer({ isOpen, onClose, onClientCreated }: ClientStudioDrawerProps) {
  const { dispatch } = useStore();
  const overlay = useOverlay();

  // Form State
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('Retail & Lifestyle');
  const [brandColor, setBrandColor] = useState(BRAND_COLORS[0]);
  const [stateValue, setStateValue] = useState<ClientState>('active');

  // Contact
  const [contactName, setContactName] = useState('');
  const [contactRole, setContactRole] = useState('Managing Partner');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // Commercial
  const [tier, setTier] = useState<'retainer' | 'fixed' | 'hourly'>('fixed');
  const [contractValue, setContractValue] = useState('12000');
  const [currency, setCurrency] = useState('USD');
  const [privateNote, setPrivateNote] = useState('');

  // Post-Creation Launchpad Action
  const [nextActionChoice, setNextActionChoice] = useState<'project' | 'proposal' | 'dossier'>('project');

  if (!isOpen) return null;

  const trimmedName = name.trim();
  const isValid = trimmedName.length >= 2;

  const handleCreate = () => {
    if (!isValid) return;

    const clientId = nextId('cl');
    const contactId = nextId('ct');
    const numValue = parseInt(contractValue, 10) || 0;

    dispatch({
      type: 'client/add',
      client: {
        id: clientId,
        name: trimmedName,
        state: stateValue,
        brandColor,
        website: website.trim(),
        industry,
        tier,
        totalBilled: stateValue === 'active' ? numValue : 0,
        currency,
        contacts: [
          {
            id: contactId,
            name: contactName.trim() || 'Primary Stakeholder',
            role: contactRole.trim() || 'Client Lead',
            email: contactEmail.trim(),
            primary: true,
          },
        ],
        nextAction:
          nextActionChoice === 'project'
            ? 'Set up initial project scope'
            : nextActionChoice === 'proposal'
            ? 'Draft commercial proposal'
            : 'Initial client onboarding',
        nextActionTone: 'accent',
        nextActionDue: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        lastActivity: new Date().toISOString(),
        privateNote: privateNote.trim() || 'Onboarded via Client Studio.',
      },
    });

    overlay.toast('Client Onboarded', `Relationship with “${trimmedName}” is established.`, 'ok');
    onClose();

    if (onClientCreated) {
      onClientCreated(clientId);
    }

    // Execute selected launchpad action
    if (nextActionChoice === 'project') {
      navigate('#/new-project');
    } else if (nextActionChoice === 'proposal') {
      navigate('#/documents');
    } else {
      navigate(`#/clients/${clientId}`);
    }
  };

  return (
    <div className="cd-drawer-backdrop" onClick={onClose}>
      <aside className="cd-studio-drawer" onClick={(e) => e.stopPropagation()} aria-label="Client Onboarding Studio">
        {/* Drawer Header */}
        <div className="cd-studio-head">
          <div className="cd-studio-head-left">
            <span className="eyebrow">Relationship Studio</span>
            <h2 className="cd-studio-title">New Client Onboarding</h2>
            <p className="cd-studio-sub">Establish the business relationship, commercial blueprint, and launch immediate work.</p>
          </div>
          <button type="button" className="cd-drawer-close" onClick={onClose} aria-label="Close Studio">
            <Icon name="close" size={18} />
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="cd-studio-body">
          {/* Step 1: Corporate Identity & Brand */}
          <section className="cd-studio-section">
            <div className="cd-studio-section-title">
              <span className="cd-step-num">1</span>
              <span>Company & Brand Identity</span>
            </div>

            <div className="stack" style={{ gap: 14 }}>
              <div className="field">
                <label className="field-label" htmlFor="client-name">Company or Client Name *</label>
                <TextInput
                  id="client-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Harbor & Finch"
                  autoFocus
                />
              </div>

              <div className="grid grid-2" style={{ gap: 12 }}>
                <div className="field">
                  <label className="field-label" htmlFor="client-web">Website / Domain</label>
                  <TextInput
                    id="client-web"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="e.g. harborfinch.com"
                  />
                </div>

                <div className="field">
                  <label className="field-label" htmlFor="client-ind">Industry</label>
                  <Select id="client-ind" value={industry} onChange={(e) => setIndustry(e.target.value)}>
                    <option value="Retail & Lifestyle">Retail & Lifestyle</option>
                    <option value="Healthcare Tech">Healthcare Tech</option>
                    <option value="Food & Beverage">Food & Beverage</option>
                    <option value="Professional Services">Professional Services</option>
                    <option value="Architecture & Design">Architecture & Design</option>
                    <option value="SaaS & Technology">SaaS & Technology</option>
                    <option value="Other">Other</option>
                  </Select>
                </div>
              </div>

              <div className="field">
                <label className="field-label">Brand Color Accent</label>
                <div className="cd-color-swatches" style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  {BRAND_COLORS.map((col) => (
                    <button
                      key={col}
                      type="button"
                      className={`cd-color-swatch ${brandColor === col ? 'is-active' : ''}`}
                      onClick={() => setBrandColor(col)}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        background: col,
                        border: brandColor === col ? '2px solid #fff' : '2px solid transparent',
                        outline: brandColor === col ? '2px solid var(--accent)' : 'none',
                        cursor: 'pointer',
                        transition: 'transform 0.1s ease',
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="field">
                <label className="field-label" htmlFor="client-state">Relationship State</label>
                <Select id="client-state" value={stateValue} onChange={(e) => setStateValue(e.target.value as ClientState)}>
                  <option value="active">Active Relationship (Commercial work in progress or agreed)</option>
                  <option value="prospect">Prospect / Lead (Discovery & proposal phase)</option>
                </Select>
              </div>
            </div>
          </section>

          {/* Step 2: Primary Stakeholder */}
          <section className="cd-studio-section">
            <div className="cd-studio-section-title">
              <span className="cd-step-num">2</span>
              <span>Primary Decision-Maker</span>
            </div>

            <div className="stack" style={{ gap: 14 }}>
              <div className="grid grid-2" style={{ gap: 12 }}>
                <div className="field">
                  <label className="field-label" htmlFor="contact-name">Contact Full Name</label>
                  <TextInput
                    id="contact-name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Marta Velasco"
                  />
                </div>
                <div className="field">
                  <label className="field-label" htmlFor="contact-role">Role / Title</label>
                  <TextInput
                    id="contact-role"
                    value={contactRole}
                    onChange={(e) => setContactRole(e.target.value)}
                    placeholder="e.g. Marketing Director"
                  />
                </div>
              </div>

              <div className="grid grid-2" style={{ gap: 12 }}>
                <div className="field">
                  <label className="field-label" htmlFor="contact-email">Direct Email</label>
                  <TextInput
                    id="contact-email"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="marta@company.com"
                  />
                </div>
                <div className="field">
                  <label className="field-label" htmlFor="contact-phone">Phone (optional)</label>
                  <TextInput
                    id="contact-phone"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Step 3: Commercial Framework */}
          <section className="cd-studio-section">
            <div className="cd-studio-section-title">
              <span className="cd-step-num">3</span>
              <span>Commercial Terms & Value</span>
            </div>

            <div className="stack" style={{ gap: 14 }}>
              <div className="grid grid-3" style={{ gap: 10 }}>
                <button
                  type="button"
                  className={`cd-tier-card ${tier === 'fixed' ? 'is-selected' : ''}`}
                  onClick={() => setTier('fixed')}
                >
                  <div className="cd-tier-title">Fixed Project</div>
                  <div className="cd-tier-desc">Milestone delivery</div>
                </button>
                <button
                  type="button"
                  className={`cd-tier-card ${tier === 'retainer' ? 'is-selected' : ''}`}
                  onClick={() => setTier('retainer')}
                >
                  <div className="cd-tier-title">Retainer</div>
                  <div className="cd-tier-desc">Ongoing recurring</div>
                </button>
                <button
                  type="button"
                  className={`cd-tier-card ${tier === 'hourly' ? 'is-selected' : ''}`}
                  onClick={() => setTier('hourly')}
                >
                  <div className="cd-tier-title">Hourly Rate</div>
                  <div className="cd-tier-desc">Time & materials</div>
                </button>
              </div>

              <div className="grid grid-2" style={{ gap: 12 }}>
                <div className="field">
                  <label className="field-label" htmlFor="contract-val">Initial Contract / Retainer Value</label>
                  <TextInput
                    id="contract-val"
                    value={contractValue}
                    onChange={(e) => setContractValue(e.target.value)}
                    placeholder="12000"
                  />
                </div>
                <div className="field">
                  <label className="field-label" htmlFor="contract-curr">Currency</label>
                  <Select id="contract-curr" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </Select>
                </div>
              </div>

              <div className="field">
                <label className="field-label" htmlFor="private-note">Private Relationship Note</label>
                <TextArea
                  id="private-note"
                  rows={2}
                  value={privateNote}
                  onChange={(e) => setPrivateNote(e.target.value)}
                  placeholder="How you connected, key preferences, communication channel."
                />
              </div>
            </div>
          </section>

          {/* Step 4: Immediate Action Launchpad */}
          <section className="cd-studio-section">
            <div className="cd-studio-section-title">
              <span className="cd-step-num">4</span>
              <span>Next Immediate Step Upon Saving</span>
            </div>

            <div className="cd-launchpad-options" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label className={`cd-launch-card ${nextActionChoice === 'project' ? 'is-active' : ''}`}>
                <input
                  type="radio"
                  name="launchChoice"
                  checked={nextActionChoice === 'project'}
                  onChange={() => setNextActionChoice('project')}
                />
                <div className="cd-launch-info">
                  <div className="cd-launch-name">Launch First Project Immediately</div>
                  <div className="cd-launch-desc">Transition directly into project scoping with this client pre-selected.</div>
                </div>
              </label>

              <label className={`cd-launch-card ${nextActionChoice === 'proposal' ? 'is-active' : ''}`}>
                <input
                  type="radio"
                  name="launchChoice"
                  checked={nextActionChoice === 'proposal'}
                  onChange={() => setNextActionChoice('proposal')}
                />
                <div className="cd-launch-info">
                  <div className="cd-launch-name">Draft Commercial Proposal</div>
                  <div className="cd-launch-desc">Generate a proposal document with terms and fee schedule.</div>
                </div>
              </label>

              <label className={`cd-launch-card ${nextActionChoice === 'dossier' ? 'is-active' : ''}`}>
                <input
                  type="radio"
                  name="launchChoice"
                  checked={nextActionChoice === 'dossier'}
                  onChange={() => setNextActionChoice('dossier')}
                />
                <div className="cd-launch-info">
                  <div className="cd-launch-name">Open Client Dossier</div>
                  <div className="cd-launch-desc">View the full relationship hub, contact cards, and history.</div>
                </div>
              </label>
            </div>
          </section>
        </div>

        {/* Drawer Sticky Footer */}
        <div className="cd-studio-foot">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            className="btn-apple"
            disabled={!isValid}
            onClick={handleCreate}
          >
            Create Client Relationship
          </Button>
        </div>
      </aside>
    </div>
  );
}
