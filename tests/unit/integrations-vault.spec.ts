import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const { IntegrationsVault } = require('../../apps/desktop/electron/integrations/vault.cjs');

describe('IntegrationsVault', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cd-vault-test-'));
  });

  afterEach(() => {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch (_e) {}
  });

  it('securely encrypts and stores tokens on disk without leaking plaintext secrets', () => {
    const vault = new IntegrationsVault(tmpDir);

    vault.saveTokens('google-calendar', {
      accessToken: 'ya29.a0ARrdaM_SecretToken123456789',
      refreshToken: '1//0gSecretRefreshToken987654321',
      tokenType: 'Bearer',
      expiresIn: 3600,
    });

    // Inspect stored JSON on disk: plaintext tokens must NEVER appear
    const rawFile = fs.readFileSync(path.join(tmpDir, 'integrations-vault.json'), 'utf8');
    expect(rawFile).not.toContain('SecretToken123456789');
    expect(rawFile).not.toContain('SecretRefreshToken987654321');

    // Decryption recovers the original payload
    const retrieved = vault.getTokens('google-calendar');
    expect(retrieved).toBeDefined();
    expect(retrieved.accessToken).toBe('ya29.a0ARrdaM_SecretToken123456789');
    expect(retrieved.refreshToken).toBe('1//0gSecretRefreshToken987654321');
  });

  it('persists and retrieves safe non-sensitive connection states', () => {
    const vault = new IntegrationsVault(tmpDir);

    vault.saveConnectionState('gmail', {
      state: 'connected',
      accountLabel: 'anas@syntaflow.io',
      accountEmail: 'anas@syntaflow.io',
      connectedAt: '2026-09-15T12:00:00.000Z',
      grantedScopes: ['https://www.googleapis.com/auth/gmail.readonly'],
      transport: 'api',
      agentAccess: {
        enabled: true,
        allowedCapabilities: ['mail.read', 'mail.draft'],
      },
    });

    const conn = vault.getConnectionState('gmail');
    expect(conn).toBeDefined();
    expect(conn.state).toBe('connected');
    expect(conn.accountLabel).toBe('anas@syntaflow.io');
    expect(conn.agentAccess.enabled).toBe(true);
    expect(conn.agentAccess.allowedCapabilities).toEqual(['mail.read', 'mail.draft']);

    const list = vault.listConnectionStates();
    expect(list.some((c: any) => c.integrationId === 'gmail')).toBe(true);
  });

  it('updates agent access permissions independently', () => {
    const vault = new IntegrationsVault(tmpDir);

    vault.saveConnectionState('github', {
      state: 'connected',
      accountLabel: '@syntaflow-org',
      grantedScopes: ['repo'],
      transport: 'mcp',
      agentAccess: {
        enabled: false,
        allowedCapabilities: [],
      },
    });

    vault.updateAgentAccess('github', {
      enabled: true,
      allowedCapabilities: ['issues.read', 'issues.create'],
      elevatedConfirmed: false,
    });

    const conn = vault.getConnectionState('github');
    expect(conn.agentAccess.enabled).toBe(true);
    expect(conn.agentAccess.allowedCapabilities).toEqual(['issues.read', 'issues.create']);
  });

  it('disconnects by wiping stored tokens and resetting status', () => {
    const vault = new IntegrationsVault(tmpDir);

    vault.saveTokens('google-calendar', {
      accessToken: 'token_to_be_wiped',
    });
    vault.saveConnectionState('google-calendar', {
      state: 'connected',
      accountLabel: 'user@example.com',
      grantedScopes: ['calendar.readonly'],
    });

    expect(vault.getTokens('google-calendar')).toBeDefined();

    const disconnected = vault.disconnect('google-calendar');
    expect(disconnected.state).toBe('disconnected');
    expect(disconnected.grantedScopes).toEqual([]);

    // Tokens must be completely gone
    expect(vault.getTokens('google-calendar')).toBeNull();

    const rawFile = fs.readFileSync(path.join(tmpDir, 'integrations-vault.json'), 'utf8');
    expect(rawFile).not.toContain('token_to_be_wiped');
  });

  it('SafeStorageCredentialVault fails secure in production if OS encryption is unavailable', () => {
    const { SafeStorageCredentialVault } = require('../../apps/desktop/electron/integrations/vault.cjs');
    const safeVault = new SafeStorageCredentialVault(tmpDir);

    // In this headless test runtime, safeStorage is not available (mocked/headless)
    if (!safeVault.isEncryptionAvailable) {
      expect(() => {
        safeVault.saveTokens('google-calendar', { accessToken: 'live_secret_token' });
      }).toThrow(/Secure credential storage is unavailable on this device/);
    }
  });

  it('TestCredentialVault strictly forbids instantiation in non-test environments', () => {
    const { TestCredentialVault } = require('../../apps/desktop/electron/integrations/vault.cjs');
    const origEnv = process.env.NODE_ENV;
    try {
      process.env.NODE_ENV = 'production';
      expect(() => {
        new TestCredentialVault(tmpDir);
      }).toThrow(/forbidden in production/);
    } finally {
      process.env.NODE_ENV = origEnv;
    }
  });
});
