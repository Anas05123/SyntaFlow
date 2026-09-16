/**
 * AI & Models Settings Section.
 * Dedicated control center for local Ollama engine, model selection, prompt context, and offline privacy.
 */

import { useState } from 'react';
import { useOverlay } from '../../../ui/overlay';
import { Icon } from '../../../ui/Icon';
import {
  SettingsPage,
  SettingsSection,
  SettingsRow,
  SettingsToggleRow,
  SettingsCard,
} from '../SettingsPrimitives';

export function AiSettings() {
  const overlay = useOverlay();

  // Configuration state
  const [baseUrl, setBaseUrl] = useState(() => {
    return typeof localStorage !== 'undefined'
      ? localStorage.getItem('syntaflow.ai.baseUrl') || 'http://127.0.0.1:11434'
      : 'http://127.0.0.1:11434';
  });

  const [model, setModel] = useState(() => {
    return typeof localStorage !== 'undefined'
      ? localStorage.getItem('syntaflow.ai.model') || 'llama3:8b'
      : 'llama3:8b';
  });

  const [contextWindow, setContextWindow] = useState(() => {
    return typeof localStorage !== 'undefined'
      ? localStorage.getItem('syntaflow.ai.contextWindow') || '8192'
      : '8192';
  });

  const [temperature, setTemperature] = useState(() => {
    return typeof localStorage !== 'undefined'
      ? localStorage.getItem('syntaflow.ai.temperature') || '0.2'
      : '0.2';
  });

  const [redactPii, setRedactPii] = useState(() => {
    return typeof localStorage !== 'undefined'
      ? localStorage.getItem('syntaflow.ai.redactPii') !== 'false'
      : true;
  });

  // Live health state
  const [testing, setTesting] = useState(false);
  const [healthStatus, setHealthStatus] = useState<'idle' | 'running' | 'offline'>('idle');
  const [healthLatency, setHealthLatency] = useState<number | null>(null);

  const [isDirty, setIsDirty] = useState(false);

  const markDirty = () => setIsDirty(true);

  const handleTestConnection = async () => {
    setTesting(true);
    setHealthStatus('idle');
    const start = performance.now();

    try {
      // In browser/renderer with electron context, we test the local endpoint with a 2s timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const res = await fetch(`${baseUrl}/api/tags`, {
        method: 'GET',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const latency = Math.round(performance.now() - start);
      if (res.ok) {
        setHealthStatus('running');
        setHealthLatency(latency);
        overlay.toast('Ollama Connected', `Local engine ready (${latency}ms).`, 'ok');
      } else {
        setHealthStatus('offline');
        overlay.toast('Ollama Unavailable', `Server responded with HTTP ${res.status}`, 'warn');
      }
    } catch {
      // Offline fallback: Ollama not running on this machine
      setHealthStatus('offline');
      setHealthLatency(null);
      overlay.toast('Connection Refused', `Could not reach local Ollama daemon at ${baseUrl}`, 'warn');
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    try {
      localStorage.setItem('syntaflow.ai.baseUrl', baseUrl);
      localStorage.setItem('syntaflow.ai.model', model);
      localStorage.setItem('syntaflow.ai.contextWindow', contextWindow);
      localStorage.setItem('syntaflow.ai.temperature', temperature);
      localStorage.setItem('syntaflow.ai.redactPii', String(redactPii));
      setIsDirty(false);
      overlay.toast('AI configuration saved', `Model ${model} configured.`, 'ok');
    } catch {
      overlay.toast('Save failed', 'Local storage error.', 'warn');
    }
  };

  return (
    <SettingsPage
      title="AI & Models"
      description="Configure local neural inference, local Ollama daemon connections, context window behavior, and strict privacy bounds."
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
      {/* Local AI Engine (Ollama) */}
      <SettingsSection
        title="Local AI Engine (Ollama)"
        description="Local-first generative engine executing entirely on your workstation GPU/CPU without transmitting prompts across the internet."
        badge={
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              fontSize: 11,
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 9999,
              background:
                healthStatus === 'running'
                  ? 'rgba(16, 185, 129, 0.15)'
                  : healthStatus === 'offline'
                  ? 'rgba(239, 68, 68, 0.15)'
                  : 'var(--raised, #161922)',
              color:
                healthStatus === 'running'
                  ? '#34d399'
                  : healthStatus === 'offline'
                  ? '#f87171'
                  : 'var(--muted, #94a3b8)',
              border: '1px solid var(--divider, rgba(255,255,255,0.08))',
              marginLeft: 8,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background:
                  healthStatus === 'running'
                    ? '#34d399'
                    : healthStatus === 'offline'
                    ? '#f87171'
                    : '#94a3b8',
              }}
            />
            <span>
              {healthStatus === 'running'
                ? `Running (${healthLatency}ms)`
                : healthStatus === 'offline'
                ? 'Daemon Offline'
                : 'Not tested'}
            </span>
          </span>
        }
        action={
          <button
            type="button"
            className="cd-settings-btn secondary"
            style={{ height: 32, fontSize: 12 }}
            onClick={handleTestConnection}
            disabled={testing}
          >
            <Icon name="refresh" size={13} className={testing ? 'animate-spin' : ''} />
            <span>{testing ? 'Checking...' : 'Test connection'}</span>
          </button>
        }
      >
        <SettingsRow
          label="Daemon endpoint"
          sub="Default REST endpoint where your local Ollama daemon listens for prompt routing."
          htmlFor="ai-endpoint"
          control={
            <input
              id="ai-endpoint"
              type="text"
              className="cd-settings-input"
              style={{ width: 260, fontFamily: 'var(--font-mono, monospace)' }}
              value={baseUrl}
              onChange={(e) => {
                setBaseUrl(e.target.value);
                markDirty();
              }}
            />
          }
        />

        <SettingsRow
          label="Inference model"
          sub="Local model loaded into VRAM for task breakdown, proposal drafting, and document summarization."
          htmlFor="ai-model"
          control={
            <select
              id="ai-model"
              className="cd-settings-select"
              value={model}
              onChange={(e) => {
                setModel(e.target.value);
                markDirty();
              }}
            >
              <option value="llama3:8b">Llama 3 (8B) — Balanced Generalist</option>
              <option value="qwen2.5-coder:7b">Qwen 2.5 Coder (7B) — Technical Precision</option>
              <option value="mistral:7b">Mistral (7B) — Fast Writing</option>
              <option value="deepseek-r1:8b">DeepSeek R1 (8B) — Reasoning</option>
              <option value="phi3:mini">Phi-3 Mini (3.8B) — Low Memory</option>
            </select>
          }
        />

        <SettingsRow
          label="Context window limit"
          sub="Maximum token count allocated per task routing request. Higher values permit larger document outlines."
          htmlFor="ai-context"
          control={
            <select
              id="ai-context"
              className="cd-settings-select"
              value={contextWindow}
              onChange={(e) => {
                setContextWindow(e.target.value);
                markDirty();
              }}
            >
              <option value="4096">4,096 tokens (~3,000 words)</option>
              <option value="8192">8,192 tokens (~6,000 words)</option>
              <option value="16384">16,384 tokens (~12,000 words)</option>
            </select>
          }
        />

        <SettingsRow
          label="Sampling temperature"
          sub="Controls creativity vs determinism. Lower values produce strict structured outputs."
          htmlFor="ai-temp"
          control={
            <select
              id="ai-temp"
              className="cd-settings-select"
              value={temperature}
              onChange={(e) => {
                setTemperature(e.target.value);
                markDirty();
              }}
            >
              <option value="0.0">0.0 — Fully Deterministic</option>
              <option value="0.2">0.2 — Analytical &amp; Precise (Default)</option>
              <option value="0.7">0.7 — Creative &amp; Generative</option>
            </select>
          }
        />
      </SettingsSection>

      {/* Privacy & Guardrails */}
      <SettingsSection
        title="Privacy & Data Boundaries"
        description="CoreDesk and Syntaflow operate under strict local sovereignty invariants."
      >
        <SettingsToggleRow
          id="ai-redact"
          label="Redact client PII before prompt compilation"
          sub="Sanitizes email addresses, phone numbers, and bank account details before passing context to the model."
          checked={redactPii}
          onChange={(val) => {
            setRedactPii(val);
            markDirty();
          }}
        />

        <SettingsCard>
          <div className="row" style={{ gap: 10 }}>
            <Icon name="shield" size={18} />
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text, #fff)' }}>
                Offline-First Architectural Guarantee
              </div>
              <p style={{ fontSize: 12.5, color: 'var(--muted, #64748b)', margin: '4px 0 0 0', lineHeight: 1.5 }}>
                UI components never call external LLMs directly. All reasoning requests flow through the backend TaskRouter
                and prompt registry. If Ollama is stopped, the application functions cleanly with full offline fidelity.
              </p>
            </div>
          </div>
        </SettingsCard>
      </SettingsSection>

      {/* Cloud Providers (Clearly Marked Planned / Coming Soon) */}
      <SettingsSection
        title="Cloud Providers (Planned)"
        description="External hosted reasoning APIs. Coming in enterprise team editions."
      >
        <div className="grid grid-3" style={{ gap: 12 }}>
          {[
            { name: 'Anthropic Claude', desc: 'Claude 3.7 Sonnet for high-complexity contract analysis' },
            { name: 'OpenAI GPT-4o', desc: 'Omni reasoning for multimodal asset generation' },
            { name: 'DeepSeek Reasoner', desc: 'Deep reasoning chain-of-thought verification' },
          ].map((cp) => (
            <div
              key={cp.name}
              style={{
                background: 'var(--raised, #13161c)',
                border: '1px solid var(--divider, rgba(255,255,255,0.08))',
                borderRadius: 'var(--r-control, 8px)',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text, #fff)' }}>{cp.name}</div>
                <div style={{ fontSize: 11.5, color: 'var(--muted, #64748b)', marginTop: 3, lineHeight: 1.4 }}>
                  {cp.desc}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: 'var(--muted, #64748b)' }}>Coming soon</span>
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 600,
                    padding: '2px 6px',
                    borderRadius: 4,
                    background: 'var(--surface, #0d0f12)',
                    color: 'var(--muted, #64748b)',
                    border: '1px solid var(--divider, rgba(255,255,255,0.06))',
                  }}
                >
                  Cloud
                </span>
              </div>
            </div>
          ))}
        </div>
      </SettingsSection>
    </SettingsPage>
  );
}
