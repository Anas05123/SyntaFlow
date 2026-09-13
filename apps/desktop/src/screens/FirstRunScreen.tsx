/**
 * A06 first-run companion — the guided setup behind W01's first-run state.
 *
 * The lifecycle board starts at "Lead / New Client", so this screen creates the
 * first client and then hands over to the project.
 */

import { useState } from 'react';

import { useStore } from '../state/store';
import { useOverlay } from '../ui/overlay';
import { navigate } from '../app/router';
import { Button, Card, CardBody, CardFoot, Field, TextArea, TextInput } from '../ui/primitives';
import { nextId } from '../state/store';

const STEPS = ['Client', 'Project', 'Document', 'Review'];

export function FirstRunScreen() {
  const { dispatch } = useStore();
  const overlay = useOverlay();
  const [name, setName] = useState('Harbor & Finch');
  const [contact, setContact] = useState('Marta Velasco');
  const [email, setEmail] = useState('marta@harborfinch.com');
  const [note, setNote] = useState('');

  const valid = name.trim().length > 0;

  return (
    <div style={{ maxWidth: 660, margin: '4vh auto 0' }}>
      <div className="eyebrow">First run</div>
      <h1>Let&apos;s get your first client in.</h1>
      <p className="page-sub mt-12">
        CoreDesk is a workspace for one professional running client work. Start with a client — projects,
        documents and reviews all hang off that relationship.
      </p>

      <div className="steps mt-24" style={{ maxWidth: 420 }}>
        {STEPS.map((s, i) => (
          <div className={`step ${i === 0 ? 'current' : ''}`} key={s}>
            <div className="step-bar" />
            <div className="step-label">{s}</div>
          </div>
        ))}
      </div>

      <Card>
        <CardBody>
          <div className="stack">
            <Field label="Client or company name" htmlFor="fr-name" error={valid ? undefined : 'A client needs a name.'}>
              <TextInput
                id="fr-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                invalid={!valid}
                placeholder="Harbor & Finch"
              />
            </Field>
            <div className="grid grid-2">
              <Field label="Primary contact" htmlFor="fr-contact">
                <TextInput id="fr-contact" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Full name" />
              </Field>
              <Field label="Email" htmlFor="fr-email">
                <TextInput id="fr-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" />
              </Field>
            </div>
            <Field label="Private note" hint="(only you see this)" htmlFor="fr-note">
              <TextArea
                id="fr-note"
                style={{ minHeight: 88 }}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="How you met, what they need, anything to remember."
              />
            </Field>
          </div>
        </CardBody>
        <CardFoot>
          <div className="row-between">
            <span className="meta">You can add projects and documents next.</span>
            <div className="row">
              <Button variant="ghost" onClick={() => navigate('#/home')}>Skip for now</Button>
              <Button
                variant="primary"
                disabled={!valid}
                onClick={() => {
                  const clientId = nextId('cl');
                  dispatch({
                    type: 'client/add',
                    client: {
                      id: clientId,
                      name: name.trim(),
                      state: 'active',
                      contacts: contact.trim()
                        ? [{ id: nextId('ct'), name: contact.trim(), role: 'Primary contact', email: email.trim(), primary: true }]
                        : [],
                      nextAction: 'Define the first project',
                      nextActionTone: 'accent',
                      nextActionDue: '2026-09-17',
                      lastActivity: new Date().toISOString(),
                      privateNote: note,
                    },
                  });
                  overlay.toast('Client created', 'Next: define the project that relationship is about.', 'ok');
                  navigate(`#/new-project?client=${clientId}`);
                }}
              >
                Create client
              </Button>
            </div>
          </div>
        </CardFoot>
      </Card>

      <p className="meta mt-16">
        Optional setup — workspace name, timezone and document defaults — lives in Settings.
      </p>
    </div>
  );
}
