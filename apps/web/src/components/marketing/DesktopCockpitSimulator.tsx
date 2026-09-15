import React, { useState } from 'react';

type SimulatorTab = 'dossier' | 'tasks' | 'diff' | 'gate';

export const DesktopCockpitSimulator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SimulatorTab>('dossier');

  // Interactive state for Delivery Gatekeeper tab
  const [deliverablesApproved, setDeliverablesApproved] = useState<{
    spec: boolean;
    brand: boolean;
    audit: boolean;
  }>({
    spec: true,
    brand: true,
    audit: false, // Default to false so user can click and unlock the gate!
  });

  const toggleDeliverable = (key: 'spec' | 'brand' | 'audit') => {
    setDeliverablesApproved((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const allApproved = deliverablesApproved.spec && deliverablesApproved.brand && deliverablesApproved.audit;

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(180deg, rgba(20, 25, 32, 0.95) 0%, rgba(10, 14, 19, 0.98) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 24px 64px -12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(37, 99, 235, 0.15)',
        overflow: 'hidden',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}
    >
      {/* Top Window Titlebar & Enclave Status */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1.25rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(8, 11, 15, 0.7)',
        }}
      >
        {/* Left: Window Controls & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{ display: 'flex', gap: '0.375rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981' }} />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8125rem',
              color: 'var(--color-text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <strong style={{ color: 'var(--color-text-primary)' }}>Syntaflow</strong>
            <span>/</span>
            <span>Nexus Labs // Q3 System Architecture</span>
          </span>
        </div>

        {/* Right: Security Pill & OS Enclave Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.25rem 0.625rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
            }}
          >
            <span className="sf-pulse-dot" style={{ width: '5px', height: '5px' }} />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: '#10B981',
                letterSpacing: '0.04em',
              }}
            >
              LOCAL ENCLAVE • ZERO CLOUD LEAK
            </span>
          </div>
        </div>
      </div>

      {/* Simulator Workspace Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1.25rem',
          backgroundColor: 'rgba(14, 18, 23, 0.6)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          overflowX: 'auto',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('dossier')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4375rem 0.875rem',
            borderRadius: 'var(--radius-md)',
            border: `1px solid ${activeTab === 'dossier' ? 'rgba(0, 212, 255, 0.4)' : 'transparent'}`,
            backgroundColor: activeTab === 'dossier' ? 'rgba(0, 212, 255, 0.12)' : 'transparent',
            color: activeTab === 'dossier' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all var(--duration-fast) ease',
            whiteSpace: 'nowrap',
          }}
        >
          <span>01</span>
          <span>Continuous Client Dossier</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tasks')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4375rem 0.875rem',
            borderRadius: 'var(--radius-md)',
            border: `1px solid ${activeTab === 'tasks' ? 'rgba(0, 212, 255, 0.4)' : 'transparent'}`,
            backgroundColor: activeTab === 'tasks' ? 'rgba(0, 212, 255, 0.12)' : 'transparent',
            color: activeTab === 'tasks' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all var(--duration-fast) ease',
            whiteSpace: 'nowrap',
          }}
        >
          <span>02</span>
          <span>Scope & Tasks</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('diff')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4375rem 0.875rem',
            borderRadius: 'var(--radius-md)',
            border: `1px solid ${activeTab === 'diff' ? 'rgba(0, 212, 255, 0.4)' : 'transparent'}`,
            backgroundColor: activeTab === 'diff' ? 'rgba(0, 212, 255, 0.12)' : 'transparent',
            color: activeTab === 'diff' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all var(--duration-fast) ease',
            whiteSpace: 'nowrap',
          }}
        >
          <span>03</span>
          <span>DocVersion Diff Studio</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('gate')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4375rem 0.875rem',
            borderRadius: 'var(--radius-md)',
            border: `1px solid ${activeTab === 'gate' ? 'rgba(0, 212, 255, 0.4)' : 'transparent'}`,
            backgroundColor: activeTab === 'gate' ? 'rgba(0, 212, 255, 0.12)' : 'transparent',
            color: activeTab === 'gate' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all var(--duration-fast) ease',
            whiteSpace: 'nowrap',
          }}
        >
          <span>04</span>
          <span>Delivery Gatekeeper (Interactive)</span>
        </button>
      </div>

      {/* Simulator Workspace Screen Display */}
      <div style={{ padding: 'clamp(1rem, 3vw, 1.75rem)', minHeight: '360px' }}>
        {/* VIEW 1: CONTINUOUS CLIENT DOSSIER */}
        {activeTab === 'dossier' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Header info */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                paddingBottom: '1rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    color: 'var(--color-cyan)',
                    letterSpacing: '0.05em',
                  }}
                >
                  CLIENT DOSSIER • STAGE 01 ONBOARDED
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    marginTop: '0.25rem',
                  }}
                >
                  Nexus Labs Corporation
                </h3>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <span
                  style={{
                    padding: '0.25rem 0.625rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  Retainer: $14,500/mo
                </span>
                <span
                  style={{
                    padding: '0.25rem 0.625rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(37, 99, 235, 0.15)',
                    border: '1px solid rgba(37, 99, 235, 0.3)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: '#60A5FA',
                  }}
                >
                  Continuous Thread #NEX-882
                </span>
              </div>
            </div>

            {/* Dossier 3-card layout */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(8, 11, 15, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-text-tertiary)', marginBottom: '0.375rem' }}>
                  KEY STAKEHOLDERS
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  Elena Rostova (CTO)
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                  elena@nexuslabs.internal • Signing Authority
                </div>
              </div>

              <div
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(8, 11, 15, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-text-tertiary)', marginBottom: '0.375rem' }}>
                  ACTIVE ENGAGEMENT SCOPE
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  3 Projects In-Flight
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                  Core Infrastructure Spec • Design System v2 • Audit Manifest
                </div>
              </div>

              <div
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(8, 11, 15, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-text-tertiary)', marginBottom: '0.375rem' }}>
                  GOVERNANCE STATUS
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#10B981' }}>
                  All Reviews Synced
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                  1 Pending Final Gate • Zero unaddressed comments
                </div>
              </div>
            </div>

            {/* Context Thread Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(0, 212, 255, 0.06)',
                border: '1px solid rgba(0, 212, 255, 0.2)',
                fontSize: '0.8125rem',
                color: 'var(--color-text-primary)',
              }}
            >
              <span style={{ color: 'var(--color-cyan)', fontWeight: 700 }}>SYNTHESIS:</span>
              <span style={{ color: 'var(--color-text-secondary)' }}>
                Every email exchange, milestone task, and submitted document version stays permanently bound to Nexus Labs — no fragmented silos.
              </span>
            </div>
          </div>
        )}

        {/* VIEW 2: SCOPE & TASKS */}
        {activeTab === 'tasks' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                SPRINT 04 MILESTONE // 8 TASKS LINKED TO DELIVERABLE #DOC-09
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-cyan)' }}>
                GATE: PRE-DELIVERY APPROVAL REQUIRED
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
              <div
                style={{
                  padding: '0.875rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(8, 11, 15, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>COMPLETED</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-text-tertiary)' }}>TSK-401</span>
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  Draft Core Infrastructure Spec
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                  Bound to DocVersion v1.2 • Snapshot immutable
                </div>
              </div>

              <div
                style={{
                  padding: '0.875rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(8, 11, 15, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>COMPLETED</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-text-tertiary)' }}>TSK-402</span>
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  Compile Benchmark Test Suite
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                  Bound to Review Studio cycle #REV-12
                </div>
              </div>

              <div
                style={{
                  padding: '0.875rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(37, 99, 235, 0.08)',
                  border: '1px solid rgba(37, 99, 235, 0.3)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#60A5FA', fontWeight: 600 }}>AWAITING GATE</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#93C5FD' }}>TSK-403</span>
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  Final Client Acceptance Manifest
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                  Pending prerequisite sign-off on Deliverable #03
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: DOCVERSION DIFF STUDIO */}
        {activeTab === 'diff' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '0.5rem',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-cyan)', fontWeight: 600 }}>
                  SNAPSHOT COMPARISON // DRAFT v1.1 → IMMUTABLE v1.2
                </span>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginTop: '0.125rem' }}>
                  Nexus Security Governance & SLA Spec
                </div>
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  padding: '0.25rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                SHA-256: 7f8a9...b401e
              </div>
            </div>

            {/* Code Diff Display */}
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8125rem',
                lineHeight: 1.6,
                backgroundColor: 'rgba(8, 11, 15, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                overflowX: 'auto',
              }}
            >
              <div style={{ color: 'var(--color-text-tertiary)', marginBottom: '0.5rem' }}>@@ Section 4.2 - Data Retention & Handover @@</div>
              <div style={{ color: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.125rem 0.375rem', borderRadius: '2px' }}>
                - 4.2.1 Delivery artifacts will be emailed as uncompressed attachments.
              </div>
              <div style={{ color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '0.125rem 0.375rem', borderRadius: '2px', marginTop: '0.25rem' }}>
                + 4.2.1 Delivery packages require prerequisite gate approval with cryptographic checksum receipts.
              </div>
              <div style={{ color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '0.125rem 0.375rem', borderRadius: '2px', marginTop: '0.25rem' }}>
                + 4.2.2 Submitted versions are immutable; revisions increment to formal draft v1.3.
              </div>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--color-status-active)', fontWeight: 700 }}>● IMMUTABILITY INVARIANT:</span>
              <span>Once submitted, DocVersion records cannot be mutated in place. Reviews bind strictly to exact snapshots.</span>
            </div>
          </div>
        )}

        {/* VIEW 4: DELIVERY GATEKEEPER (INTERACTIVE) */}
        {activeTab === 'gate' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-cyan)', fontWeight: 600 }}>
                  STAGE 06 // DELIVERY PACKAGE GATING
                </span>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  Handover Package #PKG-NEXUS-FINAL
                </h4>
              </div>

              {/* Status Indicator Pill */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.375rem 0.875rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: allApproved ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  border: `1px solid ${allApproved ? '#10B981' : '#EF4444'}`,
                  color: allApproved ? '#10B981' : '#EF4444',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  transition: 'all 0.3s ease',
                }}
              >
                <span>{allApproved ? '● GATE UNLOCKED // READY' : '✕ GATE LOCKED // BLOCKED'}</span>
              </div>
            </div>

            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', margin: 0 }}>
              Test the real rule below: A final delivery package cannot be released until every prerequisite deliverable is approved by the client. Click the checklist to unlock the gate:
            </p>

            {/* Checklist of Deliverables */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label
                onClick={() => toggleDeliverable('spec')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: deliverablesApproved.spec ? 'rgba(16, 185, 129, 0.08)' : 'rgba(8, 11, 15, 0.6)',
                  border: `1px solid ${deliverablesApproved.spec ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input
                    type="checkbox"
                    checked={deliverablesApproved.spec}
                    onChange={() => {}}
                    style={{ accentColor: '#10B981', width: '16px', height: '16px' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      Core Infrastructure Spec (v1.2)
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                      SHA: 7f8a9b...
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: deliverablesApproved.spec ? '#10B981' : 'var(--color-text-tertiary)' }}>
                  {deliverablesApproved.spec ? 'APPROVED' : 'PENDING'}
                </span>
              </label>

              <label
                onClick={() => toggleDeliverable('brand')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: deliverablesApproved.brand ? 'rgba(16, 185, 129, 0.08)' : 'rgba(8, 11, 15, 0.6)',
                  border: `1px solid ${deliverablesApproved.brand ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input
                    type="checkbox"
                    checked={deliverablesApproved.brand}
                    onChange={() => {}}
                    style={{ accentColor: '#10B981', width: '16px', height: '16px' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      Design System & Brand Assets Package
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                      SHA: 3c1a8d...
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: deliverablesApproved.brand ? '#10B981' : 'var(--color-text-tertiary)' }}>
                  {deliverablesApproved.brand ? 'APPROVED' : 'PENDING'}
                </span>
              </label>

              <label
                onClick={() => toggleDeliverable('audit')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: deliverablesApproved.audit ? 'rgba(16, 185, 129, 0.08)' : 'rgba(8, 11, 15, 0.6)',
                  border: `1px solid ${deliverablesApproved.audit ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input
                    type="checkbox"
                    checked={deliverablesApproved.audit}
                    onChange={() => {}}
                    style={{ accentColor: '#10B981', width: '16px', height: '16px' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      Final Acceptance & Security Sign-off Manifest
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                      {deliverablesApproved.audit ? 'Signed by Elena Rostova' : 'Click to simulate client sign-off'}
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: deliverablesApproved.audit ? '#10B981' : '#EF4444' }}>
                  {deliverablesApproved.audit ? 'APPROVED' : 'ACTION REQUIRED'}
                </span>
              </label>
            </div>

            {/* Simulated Action Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
              <button
                type="button"
                disabled={!allApproved}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.625rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: allApproved ? 'var(--color-cobalt)' : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${allApproved ? 'var(--color-cyan)' : 'rgba(255, 255, 255, 0.08)'}`,
                  color: allApproved ? '#FFFFFF' : 'var(--color-text-disabled)',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  cursor: allApproved ? 'pointer' : 'not-allowed',
                  boxShadow: allApproved ? '0 0 20px rgba(0, 212, 255, 0.4)' : 'none',
                  transition: 'all 0.25s ease',
                }}
              >
                <span>{allApproved ? 'Release Delivery Package to Client →' : 'Delivery Locked by System Gate'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
