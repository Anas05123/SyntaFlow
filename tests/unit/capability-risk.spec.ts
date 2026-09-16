import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { CAPABILITY_RISK_MAP } from '../../packages/contracts/src/integrations';

const { IntegrationsService } = require('../../apps/desktop/electron/integrations/integrations-service.cjs');

describe('Capability Risk & Human Confirmation Gate System', () => {
  let tmpDir: string;
  let service: any;

  beforeEach(async () => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'risk-test-'));
    service = new IntegrationsService(tmpDir);

    // Connect gmail and google drive with simulated accounts
    await service.connect('gmail', {
      simulateAccount: { email: 'operator@syntaflow.io' },
    });
    await service.connect('google-drive', {
      simulateAccount: { email: 'drive@syntaflow.io' },
    });
  });

  afterEach(() => {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch (_e) {}
  });

  it('maps all defined capabilities to appropriate risk classes', () => {
    expect(CAPABILITY_RISK_MAP['mail.search'].riskClass).toBe('READ');
    expect(CAPABILITY_RISK_MAP['mail.search'].requiresConfirmation).toBe(false);

    expect(CAPABILITY_RISK_MAP['mail.draft'].riskClass).toBe('WRITE');
    expect(CAPABILITY_RISK_MAP['mail.draft'].requiresConfirmation).toBe(false);

    expect(CAPABILITY_RISK_MAP['mail.send'].riskClass).toBe('EXTERNAL_ACTION');
    expect(CAPABILITY_RISK_MAP['mail.send'].requiresConfirmation).toBe(true);

    expect(CAPABILITY_RISK_MAP['files.write'].riskClass).toBe('DESTRUCTIVE');
    expect(CAPABILITY_RISK_MAP['files.write'].requiresConfirmation).toBe(true);

    expect(CAPABILITY_RISK_MAP['messaging.post'].riskClass).toBe('EXTERNAL_ACTION');
    expect(CAPABILITY_RISK_MAP['messaging.post'].requiresConfirmation).toBe(true);
  });

  it('blocks high-risk capability execution when human confirmation is not present', async () => {
    const result = await service.executeCapability('mail.send', {
      to: 'client@example.com',
      subject: 'Review needed',
      body: 'Please find attached deliverables.',
    });

    expect(result.success).toBe(false);
    expect(result.requiresConfirmation).toBe(true);
    expect(result.riskClass).toBe('EXTERNAL_ACTION');
    expect(result.error?.code).toBe('permission_required');
  });

  it('allows high-risk capability execution when _confirmedByHuman is true', async () => {
    const result = await service.executeCapability('mail.send', {
      to: 'client@example.com',
      subject: 'Review needed',
      body: 'Please find attached deliverables.',
      _confirmedByHuman: true,
    });

    expect(result.success).toBe(true);
    expect(result.requiresConfirmation).toBeUndefined();
    expect(result.data).toBeDefined();
  });

  it('allows read-only capability execution without human confirmation', async () => {
    const result = await service.executeCapability('files.search', {
      query: 'Q3 Report',
    });

    expect(result.success).toBe(true);
    expect(result.requiresConfirmation).toBeUndefined();
    expect(result.data).toBeDefined();
  });

  it('allows write capability without confirmation when requiresConfirmation is false', async () => {
    const result = await service.executeCapability('mail.draft', {
      subject: 'Draft proposal',
      body: 'Draft body text',
    });

    expect(result.success).toBe(true);
    expect(result.requiresConfirmation).toBeUndefined();
  });
});
