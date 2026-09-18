import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BillingService } from '../../apps/web/server/billingService';
import { BillingStore } from '../../apps/web/server/db/billingStore';
import { PayPalClient } from '../../apps/web/server/paypal/paypalClient';
import { EntitlementEngine } from '../../apps/web/server/entitlements';

describe('PayPal Subscription Lifecycle Events', () => {
  let store: BillingStore;
  let mockPayPalClient: PayPalClient;
  let service: BillingService;

  const validHeaders = {
    'paypal-auth-algo': 'SHA256withRSA',
    'paypal-cert-url': 'https://api.sandbox.paypal.com/v1/notifications/certs/CERT-123',
    'paypal-transmission-id': 'trans-123',
    'paypal-transmission-sig': 'VALID_SIG',
    'paypal-transmission-time': '2026-09-18T00:00:00Z',
  };

  beforeEach(async () => {
    store = new BillingStore();
    await store.initialize();

    mockPayPalClient = new PayPalClient();
    vi.spyOn(mockPayPalClient, 'verifyWebhookSignature').mockResolvedValue(true);
    vi.spyOn(mockPayPalClient, 'getSubscription').mockResolvedValue({
      id: 'I-SUB-LIFECYCLE',
      plan_id: 'P-SANDBOX-PRO-MONTHLY',
      status: 'ACTIVE',
      start_time: '2026-09-18T00:00:00Z',
      billing_info: { next_billing_time: '2026-10-18T00:00:00Z' },
    });

    service = new BillingService(
      store,
      mockPayPalClient,
      new EntitlementEngine(store),
      { proMonthlyPlanId: 'P-SANDBOX-PRO-MONTHLY' }
    );
  });

  it('handles BILLING.SUBSCRIPTION.CREATED by leaving status pending without activating Pro', async () => {
    // Initial user record created via frontend
    await store.saveSubscription({
      id: 'sub_c1',
      workspaceId: 'ws_user_1',
      userId: 'usr_1',
      provider: 'paypal',
      providerSubscriptionId: 'I-SUB-CREATED-01',
      providerPlanId: 'P-SANDBOX-PRO-MONTHLY',
      plan: 'pro',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await service.processWebhook(validHeaders, {
      id: 'WH-EVT-CREATED',
      event_type: 'BILLING.SUBSCRIPTION.CREATED',
      resource: {
        id: 'I-SUB-CREATED-01',
        status: 'APPROVAL_PENDING',
      },
    });

    const sub = await store.getSubscriptionByProviderId('I-SUB-CREATED-01');
    expect(sub?.status).toBe('pending');

    const billing = await service.getWorkspaceBilling('ws_user_1');
    expect(billing.isProActive).toBe(false);
    expect(billing.plan).toBe('preview');
  });

  it('handles BILLING.SUBSCRIPTION.ACTIVATED by transitioning to active and unlocking Pro', async () => {
    await store.saveSubscription({
      id: 'sub_a1',
      workspaceId: 'ws_user_2',
      userId: 'usr_2',
      provider: 'paypal',
      providerSubscriptionId: 'I-SUB-ACTIVATE-01',
      providerPlanId: 'P-SANDBOX-PRO-MONTHLY',
      plan: 'pro',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await service.processWebhook(validHeaders, {
      id: 'WH-EVT-ACTIVATED',
      event_type: 'BILLING.SUBSCRIPTION.ACTIVATED',
      resource: {
        id: 'I-SUB-ACTIVATE-01',
        status: 'ACTIVE',
        billing_info: { next_billing_time: '2026-10-18T00:00:00Z' },
      },
    });

    const sub = await store.getSubscriptionByProviderId('I-SUB-ACTIVATE-01');
    expect(sub?.status).toBe('active');

    const billing = await service.getWorkspaceBilling('ws_user_2');
    expect(billing.isProActive).toBe(true);
    expect(billing.plan).toBe('pro');
  });

  it('handles BILLING.SUBSCRIPTION.PAYMENT.FAILED by marking past_due without destroying client data', async () => {
    await store.saveSubscription({
      id: 'sub_f1',
      workspaceId: 'ws_user_3',
      userId: 'usr_3',
      provider: 'paypal',
      providerSubscriptionId: 'I-SUB-FAIL-01',
      providerPlanId: 'P-SANDBOX-PRO-MONTHLY',
      plan: 'pro',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await service.processWebhook(validHeaders, {
      id: 'WH-EVT-FAIL',
      event_type: 'BILLING.SUBSCRIPTION.PAYMENT.FAILED',
      resource: {
        id: 'I-SUB-FAIL-01',
      },
    });

    const sub = await store.getSubscriptionByProviderId('I-SUB-FAIL-01');
    expect(sub?.status).toBe('past_due');

    // Record remains preserved in database
    expect(sub?.workspaceId).toBe('ws_user_3');
  });

  it('handles BILLING.SUBSCRIPTION.CANCELLED by transitioning to cancelled', async () => {
    await store.saveSubscription({
      id: 'sub_can1',
      workspaceId: 'ws_user_4',
      userId: 'usr_4',
      provider: 'paypal',
      providerSubscriptionId: 'I-SUB-CAN-01',
      providerPlanId: 'P-SANDBOX-PRO-MONTHLY',
      plan: 'pro',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await service.processWebhook(validHeaders, {
      id: 'WH-EVT-CANCEL',
      event_type: 'BILLING.SUBSCRIPTION.CANCELLED',
      resource: {
        id: 'I-SUB-CAN-01',
        status: 'CANCELLED',
      },
    });

    const sub = await store.getSubscriptionByProviderId('I-SUB-CAN-01');
    expect(sub?.status).toBe('cancelled');
    expect(sub?.cancelAtPeriodEnd).toBe(true);
  });

  it('handles BILLING.SUBSCRIPTION.SUSPENDED and BILLING.SUBSCRIPTION.EXPIRED', async () => {
    await store.saveSubscription({
      id: 'sub_sus1',
      workspaceId: 'ws_user_5',
      userId: 'usr_5',
      provider: 'paypal',
      providerSubscriptionId: 'I-SUB-SUS-01',
      providerPlanId: 'P-SANDBOX-PRO-MONTHLY',
      plan: 'pro',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await service.processWebhook(validHeaders, {
      id: 'WH-EVT-SUSPEND',
      event_type: 'BILLING.SUBSCRIPTION.SUSPENDED',
      resource: { id: 'I-SUB-SUS-01' },
    });

    let sub = await store.getSubscriptionByProviderId('I-SUB-SUS-01');
    expect(sub?.status).toBe('suspended');

    await service.processWebhook(validHeaders, {
      id: 'WH-EVT-EXPIRED',
      event_type: 'BILLING.SUBSCRIPTION.EXPIRED',
      resource: { id: 'I-SUB-SUS-01' },
    });

    sub = await store.getSubscriptionByProviderId('I-SUB-SUS-01');
    expect(sub?.status).toBe('expired');
  });
});
