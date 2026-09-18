import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BillingService } from '../../apps/web/server/billingService';
import { BillingStore } from '../../apps/web/server/db/billingStore';
import { PayPalClient } from '../../apps/web/server/paypal/paypalClient';
import { EntitlementEngine } from '../../apps/web/server/entitlements';
import { handleApiRequest } from '../../apps/web/server/apiRouter';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { EventEmitter } from 'node:events';

function createMockReq(options: {
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: string;
}): IncomingMessage {
  const req = new EventEmitter() as any;
  req.url = options.url;
  req.method = options.method;
  req.headers = options.headers || {};
  process.nextTick(() => {
    if (options.body) {
      req.emit('data', Buffer.from(options.body));
    }
    req.emit('end');
  });
  return req;
}

function createMockRes(): { res: ServerResponse; getOutput: () => { statusCode: number; headers: Record<string, any>; body: any } } {
  let statusCode = 200;
  const headers: Record<string, any> = {};
  let bodyStr = '';

  const res = {
    statusCode: 200,
    setHeader(name: string, value: any) {
      headers[name.toLowerCase()] = value;
    },
    end(chunk?: any) {
      if (chunk) bodyStr += chunk.toString();
      statusCode = this.statusCode;
    },
  } as any;

  return {
    res,
    getOutput: () => ({
      statusCode,
      headers,
      body: bodyStr ? JSON.parse(bodyStr) : null,
    }),
  };
}

describe('PayPal Security & Anti-Spoofing Invariants', () => {
  let store: BillingStore;
  let mockPayPalClient: PayPalClient;
  let service: BillingService;

  beforeEach(async () => {
    store = new BillingStore();
    await store.initialize();

    mockPayPalClient = new PayPalClient({
      clientId: 'sandbox_client_id_secret_test',
      clientSecret: 'super_secret_never_leak_this',
      webhookId: 'webhook_secret_never_leak_this',
    });

    service = new BillingService(
      store,
      mockPayPalClient,
      new EntitlementEngine(store),
      { proMonthlyPlanId: 'P-OFFICIAL-PRO-PLAN-ID' }
    );
  });

  it('rejects subscription linking if PayPal plan ID does not match official plan ID (anti-spoofing)', async () => {
    // Attacker approved a cheaper plan on PayPal (e.g. $1 test plan)
    vi.spyOn(mockPayPalClient, 'getSubscription').mockResolvedValue({
      id: 'I-ATTACKER-CHEAP',
      plan_id: 'P-ATTACKER-1-DOLLAR-PLAN',
      status: 'ACTIVE',
    });

    await expect(
      service.linkSubscription('ws_victim', 'usr_attacker', 'I-ATTACKER-CHEAP')
    ).rejects.toThrow('Plan ID does not match Syntaflow Pro Monthly plan.');

    // Subscription must not be saved
    const sub = await store.getSubscriptionByProviderId('I-ATTACKER-CHEAP');
    expect(sub).toBeNull();
  });

  it('never exposes PAYPAL_CLIENT_SECRET or PAYPAL_WEBHOOK_ID in /api/billing/config', async () => {
    process.env.PAYPAL_CLIENT_SECRET = 'super_secret_never_leak_this';
    process.env.PAYPAL_WEBHOOK_ID = 'webhook_secret_never_leak_this';

    const req = createMockReq({ url: '/api/billing/config', method: 'GET' });
    const { res, getOutput } = createMockRes();

    await handleApiRequest(req, res, service);
    const output = getOutput();

    expect(output.statusCode).toBe(200);
    expect(output.body).toBeDefined();

    // Client ID and Plan ID are safe
    expect(output.body.clientId).toBeDefined();
    expect(output.body.proMonthlyPlanId).toBeDefined();

    // Secrets MUST NOT be present
    expect(output.body.clientSecret).toBeUndefined();
    expect(output.body.webhookId).toBeUndefined();
    expect(JSON.stringify(output.body)).not.toContain('super_secret_never_leak_this');
    expect(JSON.stringify(output.body)).not.toContain('webhook_secret_never_leak_this');
  });

  it('rejects unauthorized cancellation of another user subscription', async () => {
    // Legitimate owner subscription
    await store.saveSubscription({
      id: 'sub_owner',
      workspaceId: 'ws_legitimate',
      userId: 'usr_legitimate_owner',
      provider: 'paypal',
      providerSubscriptionId: 'I-LEGIT-123',
      providerPlanId: 'P-OFFICIAL-PRO-PLAN-ID',
      plan: 'pro',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Attacker tries to cancel
    await expect(
      service.cancelSubscription('ws_legitimate', 'usr_attacker_malicious')
    ).rejects.toThrow('Unauthorized to cancel this subscription.');

    // Subscription remains active
    const sub = await store.getSubscriptionByProviderId('I-LEGIT-123');
    expect(sub?.status).toBe('active');
  });

  it('rejects unauthenticated requests to protected billing APIs with HTTP 401', async () => {
    const req = createMockReq({
      url: '/api/billing/subscription',
      method: 'GET',
      headers: {}, // No auth header
    });
    const { res, getOutput } = createMockRes();

    await handleApiRequest(req, res, service);
    const output = getOutput();

    expect(output.statusCode).toBe(401);
    expect(output.body.error).toContain('Authentication required');
  });
});
