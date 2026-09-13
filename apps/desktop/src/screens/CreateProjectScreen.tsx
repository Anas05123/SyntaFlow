/**
 * P01 create flow — Client, Blueprint & Scope, Dates, Summary.
 *
 * Blueprint-driven project scoping studio:
 * - Select client relationship
 * - Select structured engagement blueprint (Brand Identity, Web Platform, Advisory Retainer, Custom)
 * - Auto-populates scope, milestones, deliverables, and commercial budget
 * - Dates and commitment guards
 */

import { useState } from 'react';
import { useStore, nextId } from '../state/store';
import { useOverlay } from '../ui/overlay';
import { navigate } from '../app/router';
import { formatDate, isoInDays } from '../domain/dates';
import { Banner, Button, Card, CardBody, CardFoot, Chip, Def, Defs, Field, TextArea, TextInput } from '../ui/primitives';

const STEPS = ['Client', 'Blueprint & Scope', 'Dates & Budget', 'Summary'] as const;

interface BlueprintTemplate {
  id: string;
  name: string;
  tagline: string;
  defaultOutcome: string;
  defaultBrief: string;
  inScope: string;
  outOfScope: string;
  defaultBudget: number;
  milestones: { name: string; offsetDays: number }[];
}

const BLUEPRINTS: BlueprintTemplate[] = [
  {
    id: 'brand',
    name: 'Brand Identity System',
    tagline: 'Comprehensive visual language, tokens, and multi-channel asset pack.',
    defaultOutcome: 'A complete, self-sustaining identity system the client can deploy across marketing and product without designer intervention.',
    defaultBrief: 'Establish a distinctive, timeless brand identity system including logo marks, typography scales, color palettes, and application rules.',
    inScope: 'Primary mark and responsive lockups\nTypography and color token scale\nStationery and digital asset templates\nFigma brand library',
    outOfScope: 'Full web application codebase\nPaid ad campaign media spend\nPhysical signage fabrication',
    defaultBudget: 18000,
    milestones: [
      { name: 'Discovery & Competitive Audit', offsetDays: 14 },
      { name: 'Concept Directions & Typographic Lockups', offsetDays: 35 },
      { name: 'Final Asset System Handover & Figma Tokens', offsetDays: 60 },
    ],
  },
  {
    id: 'web',
    name: 'Design System & Web Experience',
    tagline: 'High-performance interactive web experience with production component library.',
    defaultOutcome: 'A production-grade, accessible responsive web experience powered by modern component architecture.',
    defaultBrief: 'Design and build the flagship customer experience with high visual craft, instant interactions, and clear conversion funnels.',
    inScope: 'Design system tokens and UI component library\nDesktop and mobile responsive templates\nInteractive micro-interactions\nLighthouse 95+ performance optimization',
    outOfScope: 'Backend core database migration\nThird-party payment gateway renegotiation',
    defaultBudget: 34000,
    milestones: [
      { name: 'Information Architecture & Wireflows', offsetDays: 18 },
      { name: 'Component UI Design System', offsetDays: 40 },
      { name: 'Production Build & Verification QA', offsetDays: 75 },
    ],
  },
  {
    id: 'retainer',
    name: 'Strategic Advisory & Design Retainer',
    tagline: 'Dedicated monthly partner bandwidth for ongoing executive design and systems oversight.',
    defaultOutcome: 'Continuous high-craft design execution, weekly sprint reviews, and architectural guidance.',
    defaultBrief: 'Embed strategic design leadership into executive roadmap planning and feature execution.',
    inScope: 'Bi-weekly design review sprints\nFeature exploration and user feedback synthesis\nExecutive design reviews',
    outOfScope: 'Round-the-clock on-call engineering support\nAd-hoc copy translation',
    defaultBudget: 9500,
    milestones: [
      { name: 'Month 1 Alignment & Focus Backlog', offsetDays: 30 },
      { name: 'Month 2 Execution Sprints', offsetDays: 60 },
      { name: 'Quarterly Retrospective & Roadmap Reset', offsetDays: 90 },
    ],
  },
];

export function CreateProjectScreen({ preselectedClientId }: { preselectedClientId?: string }) {
  const { state, dispatch } = useStore();
  const overlay = useOverlay();

  const [step, setStep] = useState(1);
  const [clientId, setClientId] = useState(
    preselectedClientId ?? state.clients.find((c) => c.state === 'active')?.id ?? ''
  );
  const [selectedBlueprint, setSelectedBlueprint] = useState<string>('brand');
  const [name, setName] = useState('Brand Identity System');
  const [outcome, setOutcome] = useState(BLUEPRINTS[0].defaultOutcome);
  const [brief, setBrief] = useState(BLUEPRINTS[0].defaultBrief);
  const [inScope, setInScope] = useState(BLUEPRINTS[0].inScope);
  const [outOfScope, setOutOfScope] = useState(BLUEPRINTS[0].outOfScope);
  const [budget, setBudget] = useState(BLUEPRINTS[0].defaultBudget.toString());
  const [startDate, setStartDate] = useState(isoInDays(7));
  const [dueDate, setDueDate] = useState(isoInDays(60));

  const client = state.clients.find((c) => c.id === clientId) ?? null;
  const nameValid = name.trim().length > 0;
  const canContinue = step === 1 ? Boolean(client) : step === 2 ? nameValid : true;

  const applyBlueprint = (bp: BlueprintTemplate) => {
    setSelectedBlueprint(bp.id);
    setName(bp.name);
    setOutcome(bp.defaultOutcome);
    setBrief(bp.defaultBrief);
    setInScope(bp.inScope);
    setOutOfScope(bp.outOfScope);
    setBudget(bp.defaultBudget.toString());
  };

  const create = () => {
    if (!client || !nameValid) return;
    const id = nextId('pr');
    const chosenBp = BLUEPRINTS.find((b) => b.id === selectedBlueprint);
    const parsedBudget = parseInt(budget, 10) || 12000;

    const generatedMilestones = chosenBp
      ? chosenBp.milestones.map((m, idx) => ({
          id: nextId('ms'),
          name: m.name,
          due: isoInDays(m.offsetDays),
          done: idx === 0 ? false : false,
        }))
      : [{ id: nextId('ms'), name: 'Kick-off & Discovery', due: startDate, done: false }];

    dispatch({
      type: 'project/add',
      project: {
        id,
        code: `PRJ-${Math.floor(100 + Math.random() * 900)}`,
        name: name.trim(),
        clientId: client.id,
        outcome: outcome.trim() || 'Outcome not yet stated.',
        stage: 'draft',
        budget: parsedBudget,
        currency: 'USD',
        progressPercent: 0,
        due: dueDate,
        nextMilestone: generatedMilestones[0]?.name ?? 'Kick-off',
        nextMilestoneDue: generatedMilestones[0]?.due ?? startDate,
        nextAction: 'Record scope acceptance',
        nextActionTone: 'waiting',
        brief: brief.trim() || 'Brief not yet written.',
        inScope: inScope.split('\n').map((s) => s.trim()).filter(Boolean),
        outOfScope: outOfScope.split('\n').map((s) => s.trim()).filter(Boolean),
        scopeAccepted: false,
        scopeAcceptedOn: null,
        startedOn: null,
        milestones: generatedMilestones,
      },
    });

    overlay.toast('Project Created', `“${name.trim()}” initialized with blueprint milestones.`, 'ok');
    navigate(`#/projects/${id}`);
  };

  return (
    <div className="auth-wrap" style={{ maxWidth: 740, paddingTop: 0 }}>
      <Button variant="ghost" size="sm" icon="arrowLeft" className="mb-16" onClick={() => navigate('#/projects')}>
        Back to projects
      </Button>

      <div className="eyebrow">Project Scoping Studio · Step {step} of {STEPS.length}</div>
      <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 4 }}>
        {step === 1
          ? 'Select Client Relationship'
          : step === 2
          ? 'Blueprint & Commercial Scope'
          : step === 3
          ? 'Timeline & Commitment Budget'
          : 'Review & Initialize Workstream'}
      </h1>
      <p className="page-sub mt-8">
        A project binds deliverables, client acceptance gates, and commercial terms into an executable workspace.
      </p>

      <div className="steps mt-24">
        {STEPS.map((s, i) => (
          <div className={`step ${i + 1 < step ? 'done' : i + 1 === step ? 'current' : ''}`} key={s}>
            <div className="step-bar" />
            <div className="step-label">{i + 1}. {s}</div>
          </div>
        ))}
      </div>

      <Card>
        <CardBody>
          {/* Step 1: Select Client */}
          {step === 1 ? (
            <div className="stack" style={{ gap: 12 }}>
              <div className="field">
                <span className="field-label">Which client is this project for?</span>
                <span className="field-hint">A project always belongs to exactly one client relationship.</span>
              </div>
              <div className="stack" style={{ gap: 8 }}>
                {state.clients
                  .filter((c) => c.state !== 'archived')
                  .map((c) => (
                    <button
                      type="button"
                      key={c.id}
                      className={`option${clientId === c.id ? ' selected' : ''}`}
                      onClick={() => setClientId(c.id)}
                      style={{ padding: '12px 14px', borderRadius: 8 }}
                    >
                      <span className="radio-mark" />
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: 6,
                            background: c.brandColor ?? '#3b82f6',
                            color: 'white',
                            fontSize: 11,
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {c.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="option-title" style={{ fontWeight: 600 }}>{c.name}</span>
                          <span className="option-sub" style={{ display: 'block', fontSize: 11.5, color: 'var(--metadata)' }}>
                            {c.contacts[0]?.name ?? 'Primary Contact'} · {c.industry ?? 'Commercial'}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          ) : null}

          {/* Step 2: Blueprint & Scope */}
          {step === 2 ? (
            <div className="stack" style={{ gap: 16 }}>
              {/* Blueprint Templates Selector */}
              <div className="field">
                <label className="field-label">Engagement Blueprint Template</label>
                <div className="grid grid-3" style={{ gap: 10, marginTop: 8 }}>
                  {BLUEPRINTS.map((bp) => (
                    <button
                      key={bp.id}
                      type="button"
                      onClick={() => applyBlueprint(bp)}
                      style={{
                        padding: '12px',
                        borderRadius: 8,
                        border: `1.5px solid ${selectedBlueprint === bp.id ? 'var(--accent)' : 'var(--divider)'}`,
                        background: selectedBlueprint === bp.id ? 'color-mix(in srgb, var(--accent) 10%, var(--surface))' : 'var(--surface)',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{bp.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--metadata)', marginTop: 4, lineHeight: 1.3 }}>
                        {bp.tagline}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <Field
                label="Project Name *"
                htmlFor="cp-name"
                error={nameValid ? undefined : 'A project needs a name before it can be created.'}
              >
                <TextInput
                  id="cp-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  invalid={!nameValid}
                  placeholder="e.g. Brand Identity System"
                />
              </Field>

              <Field label="Key Outcome — what exists upon completion?" htmlFor="cp-outcome">
                <TextInput
                  id="cp-outcome"
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value)}
                  placeholder="e.g. A complete identity system ready for commercial deployment."
                />
              </Field>

              <Field label="Brief & Success Criteria" htmlFor="cp-brief">
                <TextArea
                  id="cp-brief"
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  placeholder="Constraints, business objectives, and success markers."
                />
              </Field>

              <div className="grid grid-2" style={{ gap: 12 }}>
                <Field label="In Scope (Deliverables)" hint="(one per line)" htmlFor="cp-in">
                  <TextArea id="cp-in" style={{ minHeight: 96 }} value={inScope} onChange={(e) => setInScope(e.target.value)} />
                </Field>
                <Field label="Out of Scope (Boundaries)" hint="(one per line)" htmlFor="cp-out">
                  <TextArea id="cp-out" style={{ minHeight: 96 }} value={outOfScope} onChange={(e) => setOutOfScope(e.target.value)} />
                </Field>
              </div>
            </div>
          ) : null}

          {/* Step 3: Dates & Budget */}
          {step === 3 ? (
            <div className="stack" style={{ gap: 16 }}>
              <div className="grid grid-2" style={{ gap: 12 }}>
                <Field label="Project Start Date" htmlFor="cp-start">
                  <TextInput id="cp-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </Field>
                <Field label="Target Delivery Gate" htmlFor="cp-due">
                  <TextInput id="cp-due" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                </Field>
              </div>

              <div className="field">
                <label className="field-label" htmlFor="cp-budget">Commercial Contract Budget (USD)</label>
                <TextInput
                  id="cp-budget"
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. 18000"
                />
              </div>

              <Banner
                title="Milestone Commitments"
                sub="Blueprint milestones will be pre-generated upon initialization, providing clear progress tracking."
              />
            </div>
          ) : null}

          {/* Step 4: Summary */}
          {step === 4 ? (
            <div className="stack" style={{ gap: 16 }}>
              <div className="summary">
                <Defs>
                  <Def k="Client Relationship">{client?.name ?? <span className="mark-risk">Not selected</span>}</Def>
                  <Def k="Project Title">{name.trim() || <span className="mark-risk">Not yet named</span>}</Def>
                  <Def k="Budget">${parseInt(budget, 10)?.toLocaleString() ?? 0} USD</Def>
                  <Def k="Deliverables in Scope">{inScope.split('\n').filter((s) => s.trim()).length} work items</Def>
                  <Def k="Scope Boundaries">{outOfScope.split('\n').filter((s) => s.trim()).length} exclusions defined</Def>
                  <Def k="Timeline">{formatDate(startDate)} → {formatDate(dueDate)}</Def>
                  <Def k="Acceptance Gate"><Chip state="waiting" label="Draft Scoping" /></Def>
                </Defs>
              </div>

              <Banner
                title="Workspace Initializer"
                sub="Creating this project sets up the overview dashboard, review gates, and focus tasks. Nothing is shared with the client until an agreement is formally sent."
              />
            </div>
          ) : null}
        </CardBody>

        <CardFoot>
          <div className="row-between">
            <Button variant="ghost" disabled={step === 1} onClick={() => setStep((s) => Math.max(1, s - 1))}>
              Back
            </Button>
            <div className="row" style={{ gap: 8 }}>
              {step === STEPS.length ? (
                <Button variant="primary" className="btn-apple" disabled={!nameValid || !client} onClick={create}>
                  Initialize Project
                </Button>
              ) : (
                <Button
                  variant="primary"
                  className="btn-apple"
                  iconRight="chevronRight"
                  disabled={!canContinue}
                  onClick={() => setStep((s) => Math.min(STEPS.length, s + 1))}
                >
                  Continue
                </Button>
              )}
            </div>
          </div>
        </CardFoot>
      </Card>
    </div>
  );
}
