import React, { useState } from 'react';
import { Card } from '../ui/Card';

type SimulatorView = 'cockpit' | 'blueprints' | 'tasks' | 'documents' | 'reviews' | 'gate' | 'integrations';

interface TaskItem {
  id: string;
  title: string;
  stage: 'todo' | 'in_progress' | 'review' | 'done';
  client: string;
  attention?: 'urgent' | 'waiting' | 'blocked';
  completed: boolean;
}

export const DesktopSimulator: React.FC = () => {
  const [activeView, setActiveView] = useState<SimulatorView>('tasks');
  const [taskViewMode, setTaskViewMode] = useState<'board' | 'list'>('board');
  const [tasks, setTasks] = useState<TaskItem[]>([
    { id: 't-1', title: 'Sign-off on localized SQLite persistence schema', stage: 'done', client: 'Acme Corp', completed: true },
    { id: 't-2', title: 'Synthesize client brief from attached Gmail thread', stage: 'in_progress', client: 'Acme Corp', attention: 'waiting', completed: false },
    { id: 't-3', title: 'Render typographic paper canvas for Brand Guidelines v03', stage: 'review', client: 'Acme Corp', attention: 'urgent', completed: false },
    { id: 't-4', title: 'Enforce prerequisite sign-offs on Delivery Gate bundle', stage: 'todo', client: 'Vertex Labs', completed: false },
    { id: 't-5', title: 'Verify Google Calendar sync for executive review milestone', stage: 'in_progress', client: 'Meridian', completed: false },
    { id: 't-6', title: 'Lock immutable DocVersion snapshot for client transmission', stage: 'review', client: 'Northlight', completed: false },
  ]);
  const [reviewApproved, setReviewApproved] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  const [gateUnlocked, setGateUnlocked] = useState(true);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const next = !t.completed;
        return { ...t, completed: next, stage: next ? 'done' : 'in_progress' };
      }
      return t;
    }));
  };

  return (
    <div
      style={{
        width: '100%',
        backgroundColor: '#0B0D0F',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 24px 60px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        textAlign: 'left',
        fontFamily: 'var(--font-body)',
      }}
      className="desktop-simulator-root"
    >
      {/* 1. TOP WINDOW CHROME */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          backgroundColor: '#121518',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          userSelect: 'none',
        }}
      >
        {/* Window Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#EF4444', opacity: 0.8 }} />
          <div style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#F59E0B', opacity: 0.8 }} />
          <div style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#10B981', opacity: 0.8 }} />
          <span style={{ marginLeft: '12px', fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: 'var(--cyan)' }}>Syntaflow Desktop</span>
            <span>/</span>
            <span>Northlight Studio</span>
            <span>/</span>
            <span style={{ color: 'var(--text)' }}>Acme Corp Rebrand</span>
          </span>
        </div>

        {/* Status Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '3px 9px', borderRadius: '100px', backgroundColor: 'rgba(6, 182, 212, 0.12)', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--cyan)' }} className="pulse-glow" />
            <span style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', fontWeight: 600, letterSpacing: '0.04em' }}>
              LIVE PREVIEW PLAYGROUND
            </span>
          </div>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-disabled)', padding: '2px 6px', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px' }}>
            ⌘K Command
          </span>
        </div>
      </div>

      {/* 2. APP WORKSPACE GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: '230px 1fr', minHeight: '520px' }} className="simulator-grid">
        {/* Left Navigation Rail */}
        <div
          style={{
            backgroundColor: '#0F1215',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '16px 12px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px', paddingLeft: '8px' }}>
              OPERATING DOMAINS
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {[
                { id: 'cockpit' as SimulatorView, label: 'Cockpit Overview', icon: '◈', badge: 'Pulse' },
                { id: 'blueprints' as SimulatorView, label: 'Blueprint Studio', icon: '◫', count: '14' },
                { id: 'tasks' as SimulatorView, label: 'Dual-Density Tasks', icon: '▦', count: `${tasks.filter(t => !t.completed).length}` },
                { id: 'documents' as SimulatorView, label: 'Paper Canvas', icon: '▤', badge: 'v03.0' },
                { id: 'reviews' as SimulatorView, label: 'Reviews & Sign-Offs', icon: '✓', count: '1' },
                { id: 'gate' as SimulatorView, label: 'Delivery Gate', icon: '🔒', badge: 'Gated' },
                { id: 'integrations' as SimulatorView, label: 'Connected Tools', icon: '⚯', count: 'Live' },
              ].map(item => {
                const active = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveView(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      backgroundColor: active ? 'rgba(6, 182, 212, 0.14)' : 'transparent',
                      color: active ? 'var(--cyan)' : 'var(--text-muted)',
                      border: '1px solid',
                      borderColor: active ? 'rgba(6, 182, 212, 0.3)' : 'transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '13px',
                      fontWeight: active ? 600 : 400,
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                      <span style={{ fontSize: '14px', opacity: active ? 1 : 0.6 }}>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', padding: '1px 6px', borderRadius: '4px', backgroundColor: active ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.06)', color: active ? 'var(--cyan)' : 'var(--text-metadata)' }}>
                        {item.badge}
                      </span>
                    )}
                    {item.count && !item.badge && (
                      <span style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: active ? 'var(--cyan)' : 'var(--text-disabled)' }}>
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Local SQLite Status Pill */}
          <div
            style={{
              padding: '10px 12px',
              borderRadius: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              fontSize: '11.5px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)' }}>DATABASE</span>
              <span style={{ color: '#10B981', fontWeight: 600, fontSize: '10.5px' }}>LOCAL SQLITE</span>
            </div>
            <div style={{ color: 'var(--text-disabled)', fontSize: '11px' }}>
              Zero cloud telemetry · DPAPI Vault
            </div>
          </div>
        </div>

        {/* Main Operating Surface (Switches by activeView) */}
        <div style={{ backgroundColor: '#0B0D0F', padding: '24px', overflowY: 'auto' }}>

          {/* VIEW: COCKPIT */}
          {activeView === 'cockpit' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', margin: 0 }}>Operator Cockpit</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Real-time agency runway, client relationship health, and review blockages.</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ padding: '4px 10px', borderRadius: '4px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', fontSize: '12px', border: '1px solid rgba(16, 185, 129, 0.25)', fontWeight: 600 }}>
                    8 ACTIVE CLIENTS
                  </span>
                </div>
              </div>

              {/* Metric Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '20px' }}>
                <Card variant="raised" style={{ padding: '16px', backgroundColor: '#14181C', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)' }}>COMMERCIAL RUNWAY</div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text)', marginTop: '4px' }}>$48,500</div>
                  <div style={{ fontSize: '11.5px', color: '#10B981', marginTop: '2px' }}>+18% from retainers</div>
                </Card>
                <Card variant="raised" style={{ padding: '16px', backgroundColor: '#14181C', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)' }}>ACTIVE BLUEPRINTS</div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text)', marginTop: '4px' }}>14 Active</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--cyan)', marginTop: '2px' }}>3 awaiting review</div>
                </Card>
                <Card variant="raised" style={{ padding: '16px', backgroundColor: '#14181C', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)' }}>DELIVERY GATES</div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: '#10B981', marginTop: '4px' }}>1 Unlocked</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>Ready for production handover</div>
                </Card>
              </div>

              {/* Active Client Feeds */}
              <div style={{ backgroundColor: '#121518', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '16px' }}>
                <div style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: '12px' }}>
                  CONNECTED ENGAGEMENT THREAD // ACME CORP
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', backgroundColor: '#181C20', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                      <span style={{ color: 'var(--text)', fontWeight: 500 }}>Gmail Thread Attached:</span>
                      <span style={{ color: 'var(--text-muted)', marginLeft: '6px' }}>&ldquo;Brand Guidelines Sign-Off Meeting Confirmation&rdquo;</span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-metadata)' }}>14:22 Today</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', backgroundColor: '#181C20', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                      <span style={{ color: 'var(--text)', fontWeight: 500 }}>Document Version Frozen:</span>
                      <span style={{ color: 'var(--text-muted)', marginLeft: '6px' }}>Brand Guidelines Master Scope v03.0 (Hash: 9c8cf98)</span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#10B981' }}>IMMUTABLE</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: BLUEPRINTS */}
          {activeView === 'blueprints' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', margin: 0 }}>Blueprint Scoping Studio</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Pre-packaged project blueprints with automated milestone structures.</p>
                </div>
                <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)' }}>
                  BLUEPRINT: BRAND IDENTITY SUITE
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { phase: 'Phase 01', title: 'Strategic Discovery & Alignment', budget: '$12,000', status: 'Approved', completed: true, deliverables: 'Brief synthesis, competitive matrix, stakeholder interview notes' },
                  { phase: 'Phase 02', title: 'Design Tokens, Typographic Canvas & Assets', budget: '$16,000', status: 'In Progress', completed: false, deliverables: 'Color scales, Sora/Inter hierarchy, component specifications' },
                  { phase: 'Phase 03', title: 'Brand Guidelines Document & Delivery Package', budget: '$8,000', status: 'Ready for Review', completed: false, deliverables: 'Final immutable PDF bundle, Figma library sync, release manifest' },
                ].map((p, i) => (
                  <Card key={i} variant="raised" style={{ padding: '16px', backgroundColor: '#14181C', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', padding: '2px 6px', backgroundColor: 'rgba(6, 182, 212, 0.1)', borderRadius: '4px' }}>
                          {p.phase}
                        </span>
                        <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>{p.title}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '14px', fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>{p.budget}</span>
                        <span style={{ fontSize: '11.5px', padding: '3px 8px', borderRadius: '4px', backgroundColor: p.completed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(37, 99, 235, 0.15)', color: p.completed ? '#10B981' : 'var(--cyan)', border: '1px solid', borderColor: p.completed ? 'rgba(16, 185, 129, 0.3)' : 'rgba(37, 99, 235, 0.3)' }}>
                          {p.status}
                        </span>
                      </div>
                    </div>
                    <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                      <strong>Deliverables:</strong> {p.deliverables}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: TASKS (Dual-Density) */}
          {activeView === 'tasks' && (
            <div>
              {/* Task Header & Mode Switcher */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '19px', fontWeight: 600, color: 'var(--text)', margin: 0 }}>Dual-Density Task Boards</h3>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>Click any task checkbox to interactively test state persistence.</div>
                </div>

                {/* View Switcher */}
                <div style={{ display: 'flex', backgroundColor: '#161A1E', borderRadius: '6px', padding: '3px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <button
                    type="button"
                    onClick={() => setTaskViewMode('board')}
                    style={{
                      padding: '4px 12px',
                      fontSize: '12px',
                      borderRadius: '4px',
                      backgroundColor: taskViewMode === 'board' ? 'var(--cyan)' : 'transparent',
                      color: taskViewMode === 'board' ? '#000000' : 'var(--text-muted)',
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Kanban Board
                  </button>
                  <button
                    type="button"
                    onClick={() => setTaskViewMode('list')}
                    style={{
                      padding: '4px 12px',
                      fontSize: '12px',
                      borderRadius: '4px',
                      backgroundColor: taskViewMode === 'list' ? 'var(--cyan)' : 'transparent',
                      color: taskViewMode === 'list' ? '#000000' : 'var(--text-muted)',
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Compact List
                  </button>
                </div>
              </div>

              {/* KANBAN BOARD VIEW */}
              {taskViewMode === 'board' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                  {[
                    { key: 'todo', title: 'To Do', border: 'rgba(255,255,255,0.1)' },
                    { key: 'in_progress', title: 'In Progress', border: 'rgba(6, 182, 212, 0.4)' },
                    { key: 'done', title: 'Signed Off', border: 'rgba(16, 185, 129, 0.4)' },
                  ].map(col => {
                    const colTasks = tasks.filter(t => col.key === 'done' ? t.completed : (!t.completed && (col.key === 'in_progress' ? t.stage === 'in_progress' || t.stage === 'review' : t.stage === 'todo')));
                    return (
                      <div key={col.key} style={{ backgroundColor: '#121519', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', padding: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '8px', borderBottom: `2px solid ${col.border}` }}>
                          <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text)' }}>{col.title}</span>
                          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)' }}>{colTasks.length}</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {colTasks.map(t => (
                            <div
                              key={t.id}
                              onClick={() => toggleTask(t.id)}
                              style={{
                                padding: '10px 12px',
                                backgroundColor: '#181C21',
                                border: '1px solid rgba(255,255,255,0.06)',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                              }}
                              className="interactive-lift"
                            >
                              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                <input
                                  type="checkbox"
                                  checked={t.completed}
                                  onChange={() => toggleTask(t.id)}
                                  style={{ marginTop: '3px', accentColor: 'var(--cyan)', cursor: 'pointer' }}
                                />
                                <div style={{ fontSize: '12.5px', color: t.completed ? 'var(--text-disabled)' : 'var(--text)', textDecoration: t.completed ? 'line-through' : 'none', lineHeight: 1.4 }}>
                                  {t.title}
                                </div>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.04)', fontSize: '10.5px' }}>
                                <span style={{ color: 'var(--cyan)', fontFamily: 'var(--font-mono)' }}>{t.client}</span>
                                {t.attention && (
                                  <span style={{ color: t.attention === 'urgent' ? '#EF4444' : '#F59E0B', textTransform: 'uppercase', fontWeight: 600 }}>
                                    ● {t.attention}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* COMPACT LIST VIEW */}
              {taskViewMode === 'list' && (
                <div style={{ backgroundColor: '#121519', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 120px 100px 90px', padding: '8px 14px', backgroundColor: '#161A1F', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <span></span>
                    <span>TASK IDENTIFIER / SCOPE</span>
                    <span>CLIENT</span>
                    <span>STAGE</span>
                    <span>ATTENTION</span>
                  </div>
                  {tasks.map(t => (
                    <div
                      key={t.id}
                      onClick={() => toggleTask(t.id)}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '32px 1fr 120px 100px 90px',
                        padding: '10px 14px',
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        alignItems: 'center',
                        fontSize: '12.5px',
                        cursor: 'pointer',
                        backgroundColor: t.completed ? 'rgba(255,255,255,0.01)' : 'transparent',
                      }}
                      className="interactive-lift"
                    >
                      <input
                        type="checkbox"
                        checked={t.completed}
                        onChange={() => toggleTask(t.id)}
                        style={{ accentColor: 'var(--cyan)' }}
                      />
                      <span style={{ color: t.completed ? 'var(--text-disabled)' : 'var(--text)', textDecoration: t.completed ? 'line-through' : 'none' }}>
                        {t.title}
                      </span>
                      <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{t.client}</span>
                      <span style={{ fontSize: '11px', color: t.completed ? '#10B981' : 'var(--cyan)' }}>{t.completed ? 'Signed Off' : t.stage}</span>
                      <span style={{ fontSize: '10.5px', color: t.attention === 'urgent' ? '#EF4444' : (t.attention ? '#F59E0B' : 'var(--text-disabled)') }}>
                        {t.attention ? t.attention.toUpperCase() : 'NORMAL'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* VIEW: DOCUMENTS (Typographic Paper Canvas) */}
          {activeView === 'documents' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '19px', fontWeight: 600, color: 'var(--text)', margin: 0 }}>Typographic Paper Canvas</h3>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Distraction-free 780px paper surface with immutable DocVersion lock.</div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setShowDiff(!showDiff)}
                    style={{
                      padding: '5px 12px',
                      fontSize: '12px',
                      borderRadius: '4px',
                      backgroundColor: showDiff ? 'rgba(6, 182, 212, 0.2)' : '#1A1E22',
                      color: showDiff ? 'var(--cyan)' : 'var(--text-muted)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      cursor: 'pointer',
                    }}
                  >
                    {showDiff ? 'Hide Version Diff' : 'Compare v02.1 vs v03.0'}
                  </button>
                  <span style={{ padding: '5px 10px', borderRadius: '4px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', fontSize: '11.5px', fontFamily: 'var(--font-mono)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                    FROZEN SNAPSHOT // v03.0
                  </span>
                </div>
              </div>

              {/* Physical Paper Canvas Simulation */}
              <div
                style={{
                  maxWidth: '720px',
                  margin: '0 auto',
                  backgroundColor: '#FFFFFF',
                  color: '#111827',
                  borderRadius: '4px',
                  padding: '36px 44px',
                  boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6)',
                  fontFamily: 'Georgia, serif',
                  lineHeight: 1.7,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #E5E7EB', paddingBottom: '12px', marginBottom: '20px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#6B7280' }}>
                  <span>NORTHLIGHT STUDIO // SPECIFICATION</span>
                  <span>DOC VERSION: v03.0-FINAL</span>
                </div>

                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', color: '#111827', marginBottom: '8px', lineHeight: 1.2 }}>
                  Acme Corporation — Brand System & Tokens Specification
                </h2>

                <p style={{ fontSize: '14px', color: '#4B5563', fontStyle: 'italic', marginBottom: '20px' }}>
                  Prepared for Sarah Jenkins, VP Brand · Delivery Target: October 2026
                </p>

                {showDiff ? (
                  <div style={{ padding: '12px', backgroundColor: '#FEF3C7', border: '1px solid #F59E0B', borderRadius: '4px', fontSize: '13px', color: '#92400E', fontFamily: 'var(--font-mono)', marginBottom: '16px' }}>
                    <div style={{ color: '#DC2626' }}>- v02.1: Secondary accent palette undefined for dark surfaces.</div>
                    <div style={{ color: '#059669', marginTop: '4px' }}>+ v03.0: Standardized WCAG 1.4.3 compliant Cyan (#06B6D4) and Cobalt (#2563EB).</div>
                  </div>
                ) : null}

                <div style={{ fontSize: '14.5px', color: '#1F2937' }}>
                  <p style={{ marginBottom: '14px' }}>
                    This specification governs the foundational design tokens, typographic hierarchy, and delivery assets for the Acme Corporation brand evolution. All deliverables referenced herein are bound to this immutable snapshot.
                  </p>
                  <p style={{ marginBottom: '14px' }}>
                    <strong>1. Core Typography:</strong> Primary display typography relies on geometric high-contrast sans-serif paired with optimized body scale for dual-density displays.
                  </p>
                  <p>
                    <strong>2. Decision Binding:</strong> Approvals granted by the client bind exclusively to snapshot hash <code>#9c8cf98f</code>. Revisions require an incremented draft version.
                  </p>
                </div>

                <div style={{ marginTop: '28px', paddingTop: '16px', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#9CA3AF' }}>
                  <span>HASH: SHA256:9c8cf98f0ec0f897207</span>
                  <span>STATUS: SIGNED & LOCKED</span>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: REVIEWS */}
          {activeView === 'reviews' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '19px', fontWeight: 600, color: 'var(--text)', margin: 0 }}>Client Review & Decision Surface</h3>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Reviews bind directly to immutable document version snapshots.</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
                {/* Left: Snapshot Card */}
                <div style={{ backgroundColor: '#13161A', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', padding: '20px' }}>
                  <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', marginBottom: '8px' }}>
                    ACTIVE REVIEW ARTIFACT
                  </div>
                  <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
                    Brand Guidelines Scope Document v03.0
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.5 }}>
                    Transmitted to Sarah Jenkins (VP Brand, Acme Corp) on Sept 15, 2026. Contains 24 scope specifications and commercial budget sign-off.
                  </p>

                  <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#0B0D0F', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
                    <div style={{ color: 'var(--text-metadata)' }}>Snapshot ID: snap_v03_acme_2026</div>
                    <div style={{ color: reviewApproved ? '#10B981' : 'var(--waiting)', marginTop: '4px' }}>
                      Status: {reviewApproved ? 'APPROVED & SEALED' : 'AWAITING CLIENT DECISION'}
                    </div>
                  </div>

                  <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setReviewApproved(true)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '6px',
                        backgroundColor: reviewApproved ? '#10B981' : 'var(--cyan)',
                        color: '#000000',
                        fontWeight: 600,
                        fontSize: '13px',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)',
                      }}
                    >
                      {reviewApproved ? '✓ Sign-off Recorded' : 'Simulate Client Approval'}
                    </button>
                    {reviewApproved && (
                      <button
                        type="button"
                        onClick={() => setReviewApproved(false)}
                        style={{
                          padding: '10px 14px',
                          borderRadius: '6px',
                          backgroundColor: '#1E2328',
                          color: 'var(--text-muted)',
                          fontSize: '12px',
                          border: '1px solid rgba(255,255,255,0.1)',
                          cursor: 'pointer',
                        }}
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                {/* Right: Decision Audit Trail */}
                <div style={{ backgroundColor: '#13161A', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', padding: '20px' }}>
                  <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)', marginBottom: '12px' }}>
                    DECISION AUDIT TRAIL
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12.5px' }}>
                    {reviewApproved && (
                      <div style={{ padding: '10px', backgroundColor: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '6px' }}>
                        <div style={{ color: '#10B981', fontWeight: 600 }}>Approved by Sarah Jenkins (VP Brand)</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '2px' }}>Just now · Bound to snapshot #9c8cf98f</div>
                      </div>
                    )}
                    <div style={{ padding: '10px', backgroundColor: '#181C20', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ color: 'var(--cyan)', fontWeight: 600 }}>Revision Signed: v02.1</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '2px' }}>Marcus Brody · Sept 14, 2026</div>
                    </div>
                    <div style={{ padding: '10px', backgroundColor: '#181C20', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Initial Draft Transmitted: v01.0</div>
                      <div style={{ color: 'var(--text-disabled)', fontSize: '11px', marginTop: '2px' }}>Sept 10, 2026</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: DELIVERY GATE */}
          {activeView === 'gate' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '19px', fontWeight: 600, color: 'var(--text)', margin: 0 }}>Delivery Gate Enforcement</h3>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Canonical rule: Final delivery packages require all prerequisite deliverables to be approved.</div>
                </div>
                <button
                  type="button"
                  onClick={() => setGateUnlocked(!gateUnlocked)}
                  style={{
                    padding: '4px 10px',
                    fontSize: '11.5px',
                    fontFamily: 'var(--font-mono)',
                    backgroundColor: '#1C2025',
                    color: 'var(--cyan)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Toggle Gate State
                </button>
              </div>

              <div style={{ backgroundColor: '#13161A', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)' }}>PACKAGE ID: DELIV-ACME-2026-FINAL</span>
                    <h4 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', margin: '4px 0 0 0' }}>
                      Acme Brand System Complete Production Handover
                    </h4>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '6px', backgroundColor: gateUnlocked ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', border: '1px solid', borderColor: gateUnlocked ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.35)' }}>
                    <span style={{ fontSize: '14px' }}>{gateUnlocked ? '🔓' : '🔒'}</span>
                    <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: gateUnlocked ? '#10B981' : '#EF4444' }}>
                      {gateUnlocked ? 'GATE UNLOCKED · READY' : 'GATE LOCKED · PENDING PREREQUISITES'}
                    </span>
                  </div>
                </div>

                {/* Prerequisite Checklist */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                  {[
                    { label: 'Prerequisite 01: Brand Identity Scope v03.0 Approved by Sarah Jenkins', passed: true },
                    { label: 'Prerequisite 02: Design Tokens & Canvas Specs Signed Off', passed: true },
                    { label: 'Prerequisite 03: Final Invoice Milestone Confirmed ($8,000)', passed: gateUnlocked },
                  ].map((p, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', backgroundColor: '#181C20', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '13px' }}>
                      <span style={{ color: p.passed ? '#10B981' : '#EF4444', fontWeight: 700 }}>{p.passed ? '✓' : '✗'}</span>
                      <span style={{ color: p.passed ? 'var(--text)' : 'var(--text-muted)' }}>{p.label}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Export package includes: Immutable PDF, vector marks, SQLite manifest audit trail.
                  </div>
                  <button
                    type="button"
                    disabled={!gateUnlocked}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '6px',
                      backgroundColor: gateUnlocked ? 'var(--cyan)' : '#24292E',
                      color: gateUnlocked ? '#000000' : 'var(--text-disabled)',
                      fontWeight: 600,
                      fontSize: '13px',
                      border: 'none',
                      cursor: gateUnlocked ? 'pointer' : 'not-allowed',
                    }}
                  >
                    Release & Handover Package &rarr;
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: INTEGRATIONS */}
          {activeView === 'integrations' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '19px', fontWeight: 600, color: 'var(--text)', margin: 0 }}>Connected Tools & Local OAuth Vault</h3>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Zero external server mirroring. Tokens encrypted in OS Keychain.</div>
                </div>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#10B981' }}>
                  VAULT: AES-256-GCM (DPAPI)
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {[
                  { name: 'Google Workspace', services: 'Gmail, Google Calendar, Google Drive', status: 'Connected', badge: '10 Scopes', scopes: 'gmail.readonly, drive.file, calendar.events' },
                  { name: 'GitHub', services: 'Repository links, pull requests, commit threads', status: 'Connected', badge: 'OAuth App', scopes: 'repo:status, read:user' },
                  { name: 'Slack', services: 'Channel notifications, decision broadcasts', status: 'Connected', badge: 'Bot Token', scopes: 'chat:write, channels:read' },
                  { name: 'Figma', services: 'Frame embeds, design snapshot reviews', status: 'Available', badge: 'REST API', scopes: 'file:read' },
                ].map((tool, idx) => (
                  <div key={idx} style={{ padding: '16px', backgroundColor: '#13161A', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--text)' }}>{tool.name}</span>
                      <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', padding: '2px 6px', borderRadius: '4px', backgroundColor: tool.status === 'Connected' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.06)', color: tool.status === 'Connected' ? '#10B981' : 'var(--text-metadata)' }}>
                        {tool.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '8px' }}>{tool.services}</div>
                    <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)' }}>Scopes: {tool.scopes}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
