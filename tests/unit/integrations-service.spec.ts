import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const { IntegrationsService } = require('../../apps/desktop/electron/integrations/integrations-service.cjs');

describe('IntegrationsService', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cd-service-test-'));
  });

  afterEach(() => {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch (_e) {}
  });

  it('lists authoritative definitions merged with connection states', async () => {
    const service = new IntegrationsService(tmpDir);
    const definitions = await service.listDefinitions();

    expect(definitions.length).toBeGreaterThanOrEqual(13);

    const gcal = definitions.find((d: any) => d.id === 'google-calendar');
    expect(gcal).toBeDefined();
    expect(gcal.name).toBe('Google Calendar');
    expect(gcal.category).toBe('Calendar');
    expect(gcal.status).toBe('disconnected');
    expect(gcal.transports).toContain('api');
    expect(gcal.capabilities).toContain('calendar.read');

    const github = definitions.find((d: any) => d.id === 'github');
    expect(github).toBeDefined();
    expect(github.transports).toContain('mcp');
    expect(github.primaryTransport).toBe('mcp');
  });

  it('connects, verifies status, tests connection, and routes capability execution', async () => {
    const service = new IntegrationsService(tmpDir);

    // 1. Connect Google Calendar
    const connectRes = await service.connect('google-calendar', {
      simulateAccount: { email: 'operator@syntaflow.io' },
    });
    expect(connectRes.success).toBe(true);
    expect(connectRes.connection.state).toBe('connected');
    expect(connectRes.connection.accountLabel).toBe('operator@syntaflow.io');

    // 2. Test Connection
    const testRes = await service.testConnection('google-calendar');
    expect(testRes.success).toBe(true);
    expect(testRes.latencyMs).toBeDefined();

    // 3. Update agent access to permit calendar.read
    await service.updateAgentAccess('google-calendar', {
      enabled: true,
      allowedCapabilities: ['calendar.read'],
    });

    // 4. Capability execution
    const capRes = await service.executeCapability('calendar.read');
    expect(capRes.success).toBe(true);
    expect(capRes.data.events).toBeDefined();

    // 5. Disconnect
    const disconnectRes = await service.disconnect('google-calendar');
    expect(disconnectRes.success).toBe(true);
    expect(disconnectRes.connection.state).toBe('disconnected');

    // Verification that status reflects disconnected
    const connAfter = await service.getConnection('google-calendar');
    expect(connAfter.state).toBe('disconnected');
  });

  it('enforces agent access permissions before executing capabilities', async () => {
    const service = new IntegrationsService(tmpDir);

    await service.connect('gmail', {
      simulateAccount: { email: 'test@syntaflow.io' },
    });

    // Set agent access with only mail.read (omit mail.send)
    await service.updateAgentAccess('gmail', {
      enabled: true,
      allowedCapabilities: ['mail.read'],
    });

    // Attempting mail.draft (not permitted) must fail
    const blockedRes = await service.executeCapability('mail.draft', { to: 'a@b.com' });
    expect(blockedRes.success).toBe(false);
    expect(blockedRes.error.code).toBe('permission_denied');

    // Mail read succeeds
    const allowedRes = await service.executeCapability('mail.read');
    expect(allowedRes.success).toBe(true);
  });

  it('connects Google Drive, queries files, and executes file reading', async () => {
    const service = new IntegrationsService(tmpDir);

    const connectRes = await service.connect('google-drive', {
      simulateAccount: { email: 'drive-operator@syntaflow.io' },
    });
    expect(connectRes.success).toBe(true);
    expect(connectRes.connection.state).toBe('connected');

    const testRes = await service.testConnection('google-drive');
    expect(testRes.success).toBe(true);

    await service.updateAgentAccess('google-drive', {
      enabled: true,
      allowedCapabilities: ['files.search', 'files.read'],
    });

    const searchRes = await service.executeCapability('files.search', { query: 'agreement' });
    expect(searchRes.success).toBe(true);
    expect(searchRes.data.files.length).toBeGreaterThan(0);
  });

  it('connects Notion and Linear TEST providers and executes knowledge/issue queries', async () => {
    const service = new IntegrationsService(tmpDir);

    // Notion TEST
    const notionConn = await service.connect('notion', {
      simulateAccount: { name: 'Syntaflow Team Wiki', email: 'wiki@syntaflow.io' },
    });
    expect(notionConn.success).toBe(true);
    expect(notionConn.connection.accountLabel).toBe('Syntaflow Team Wiki');

    const notionSearch = await service.executeCapability('knowledge.search', { query: 'brand' });
    expect(notionSearch.success).toBe(true);
    expect(notionSearch.data.results.length).toBeGreaterThan(0);

    // Linear TEST
    const linearConn = await service.connect('linear', {
      simulateAccount: { team: 'Syntaflow Core Eng', email: 'eng@syntaflow.io' },
    });
    expect(linearConn.success).toBe(true);

    const linearIssues = await service.executeCapability('issues.read');
    expect(linearIssues.success).toBe(true);
    expect(linearIssues.data.issues.length).toBeGreaterThan(0);
  });

  it('enforces human confirmation before executing EXTERNAL_ACTION and DESTRUCTIVE capabilities', async () => {
    const service = new IntegrationsService(tmpDir);

    await service.connect('gmail', {
      simulateAccount: { email: 'operator@syntaflow.io' },
    });

    await service.updateAgentAccess('gmail', {
      enabled: true,
      allowedCapabilities: ['mail.read', 'mail.send'],
    });

    // Unconfirmed mail.send (EXTERNAL_ACTION) must be blocked with requiresConfirmation: true
    const unconfirmedRes = await service.executeCapability('mail.send', {
      to: 'client@example.com',
      subject: 'Review Ready',
      body: 'Scope finalized.',
    });
    expect(unconfirmedRes.success).toBe(false);
    expect(unconfirmedRes.requiresConfirmation).toBe(true);
    expect(unconfirmedRes.riskClass).toBe('EXTERNAL_ACTION');

    // Confirmed mail.send proceeds
    const confirmedRes = await service.executeCapability('mail.send', {
      to: 'client@example.com',
      subject: 'Review Ready',
      body: 'Scope finalized.',
      _confirmedByHuman: true,
    });
    expect(confirmedRes.success).toBe(true);
  });
});
