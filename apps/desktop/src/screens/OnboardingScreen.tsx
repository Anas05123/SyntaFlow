/**
 * A06 · Onboarding — owner, workspace, then first client.
 *
 * Progress is saved as you go, and the exit is an actionable first-work prompt
 * rather than an empty dashboard.
 */

import { useState } from 'react';

import { useStore } from '../state/store';
import { useOverlay } from '../ui/overlay';
import { navigate } from '../app/router';
import { Banner, Button, Card, CardBody, CardFoot, Field, TextInput } from '../ui/primitives';

const STEPS = ['Owner', 'Workspace', 'First client'];

export function OnboardingScreen() {
  const { state } = useStore();
  const overlay = useOverlay();
  const [step] = useState(2);

  return (
    <div className="auth-wrap" style={{ maxWidth: 620, paddingTop: '7vh' }}>
      <div className="eyebrow">Account &amp; first value · A06</div>
      <h1>Set up your workspace</h1>
      <p className="page-sub mt-8">
        Three fields, then your first client. Progress is saved as you go — you can leave and resume.
      </p>

      <div className="steps mt-24" style={{ maxWidth: 400 }}>
        {STEPS.map((s, i) => (
          <div className={`step ${i + 1 < step ? 'done' : i + 1 === step ? 'current' : ''}`} key={s}>
            <div className="step-bar" />
            <div className="step-label">{s}</div>
          </div>
        ))}
      </div>

      <Card>
        <CardBody>
          <div className="stack">
            <div className="grid grid-2">
              <Field label="Your name" htmlFor="ob-name">
                <TextInput id="ob-name" defaultValue={state.workspace.ownerName} />
              </Field>
              <Field label="Workspace name" htmlFor="ob-ws">
                <TextInput id="ob-ws" defaultValue={state.workspace.name} />
              </Field>
            </div>
            <Field label="Timezone" htmlFor="ob-tz" hint="Used for due dates on reviews and deliveries.">
              <select className="select" id="ob-tz" defaultValue={state.workspace.timezone}>
                <option value={state.workspace.timezone}>{state.workspace.timezone}</option>
                <option value="Europe/London (GMT+1)">Europe/London (GMT+1)</option>
                <option value="America/New_York (GMT-4)">America/New_York (GMT-4)</option>
              </select>
            </Field>
            <Field label="Brand and service defaults" hint="(optional)" htmlFor="ob-services">
              <TextInput
                id="ob-services"
                defaultValue={state.workspace.services.slice(0, 3).map((s) => s.name).join(' · ')}
              />
            </Field>
            <Banner tone="ok" title="Progress saved" sub="You can close this and resume from Home." />
          </div>
        </CardBody>
        <CardFoot>
          <div className="row-between">
            <Button
              variant="ghost"
              onClick={() => {
                overlay.toast('Optional setup skipped', 'You can finish this later in Settings.', 'default');
                navigate('#/home');
              }}
            >
              Skip optional setup
            </Button>
            <Button variant="primary" onClick={() => navigate('#/first-run')}>
              Continue to first client
            </Button>
          </div>
        </CardFoot>
      </Card>
    </div>
  );
}
