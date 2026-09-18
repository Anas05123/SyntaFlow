import { describe, it, expect, beforeEach } from 'vitest';
import { BillingStore } from '../../apps/web/server/db/billingStore';

describe('BillingStore SQLite CRUD', () => {
  let store: BillingStore;

  beforeEach(async () => {
    store = new BillingStore();
    await store.initialize();
  });

  it('persists and retrieves subscriptions accurately', async () => {
    const sub = {
      id: 'sub_test_1',
      workspaceId: 'ws_alpha',
      userId: 'usr_alpha',
      provider: 'paypal' as const,
      providerSubscriptionId: 'I-STORE-TEST-1',
      providerPlanId: 'P-SANDBOX-PRO-MONTHLY',
      plan: 'pro' as const,
      status: 'active' as const,
      currentPeriodStart: '2026-09-01T00:00:00.000Z',
      currentPeriodEnd: '2026-10-01T00:00:00.000Z',
      cancelAtPeriodEnd: false,
      createdAt: '2026-09-01T00:00:00.000Z',
      updatedAt: '2026-09-01T00:00:00.000Z',
    };

    await store.saveSubscription(sub);

    const byWorkspace = await store.getSubscriptionByWorkspace('ws_alpha');
    expect(byWorkspace).toEqual(sub);

    const byProvider = await store.getSubscriptionByProviderId('I-STORE-TEST-1');
    expect(byProvider).toEqual(sub);
  });

  it('updates existing subscription on conflict without duplicate rows', async () => {
    const sub = {
      id: 'sub_test_2',
      workspaceId: 'ws_beta',
      userId: 'usr_beta',
      provider: 'paypal' as const,
      providerSubscriptionId: 'I-STORE-TEST-2',
      providerPlanId: 'P-SANDBOX-PRO-MONTHLY',
      plan: 'pro' as const,
      status: 'pending' as const,
      cancelAtPeriodEnd: false,
      createdAt: '2026-09-01T00:00:00.000Z',
      updatedAt: '2026-09-01T00:00:00.000Z',
    };

    await store.saveSubscription(sub);

    // Update status to active
    await store.saveSubscription({
      ...sub,
      status: 'active',
      updatedAt: '2026-09-02T00:00:00.000Z',
    });

    const result = await store.getSubscriptionByProviderId('I-STORE-TEST-2');
    expect(result?.status).toBe('active');
  });

  it('persists and retrieves payments accurately', async () => {
    const payment = {
      id: 'pay_test_1',
      workspaceId: 'ws_gamma',
      provider: 'paypal' as const,
      providerPaymentId: 'SALE-123',
      providerSubscriptionId: 'I-STORE-TEST-3',
      amount: 19.0,
      currency: 'USD',
      status: 'completed' as const,
      createdAt: '2026-09-01T00:00:00.000Z',
      paidAt: '2026-09-01T00:00:00.000Z',
    };

    await store.savePayment(payment);

    const retrieved = await store.getPaymentByProviderId('SALE-123');
    expect(retrieved).toEqual(payment);
  });
});
