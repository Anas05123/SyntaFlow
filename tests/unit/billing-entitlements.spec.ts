import { describe, it, expect, beforeEach } from 'vitest';
import { EntitlementEngine } from '../../apps/web/server/entitlements';
import { BillingStore } from '../../apps/web/server/db/billingStore';

describe('Billing Entitlements Engine', () => {
  let store: BillingStore;
  let engine: EntitlementEngine;

  beforeEach(async () => {
    // Isolated in-memory store for unit test
    store = new BillingStore();
    await store.initialize();
    engine = new EntitlementEngine(store);
  });

  it('grants base capabilities to default workspace on Preview plan', async () => {
    const workspaceId = 'ws_preview_user';
    expect(await engine.getEffectivePlan(workspaceId)).toBe('preview');
    expect(await engine.can(workspaceId, 'flow.full')).toBe(true);
    expect(await engine.can(workspaceId, 'integrations.google')).toBe(true);
    expect(await engine.can(workspaceId, 'clients.unlimited')).toBe(true);
    expect(await engine.can(workspaceId, 'reviews.unlimited')).toBe(true);

    // Pro-exclusive capabilities should be false
    expect(await engine.can(workspaceId, 'billing.plan')).toBe(false);
    expect(await engine.can(workspaceId, 'memory.full')).toBe(false);
  });

  it('grants Pro capabilities when subscription is active', async () => {
    const workspaceId = 'ws_pro_user';
    await store.saveSubscription({
      id: 'sub_1',
      workspaceId,
      userId: 'usr_1',
      provider: 'paypal',
      providerSubscriptionId: 'I-12345',
      providerPlanId: 'P-SANDBOX-PRO-MONTHLY',
      plan: 'pro',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    expect(await engine.getEffectivePlan(workspaceId)).toBe('pro');
    expect(await engine.can(workspaceId, 'billing.plan')).toBe(true);
    expect(await engine.can(workspaceId, 'memory.full')).toBe(true);
    expect(await engine.can(workspaceId, 'flow.full')).toBe(true);
  });

  it('revokes Pro capabilities if subscription is cancelled or suspended, but preserves Preview functionality', async () => {
    const workspaceId = 'ws_cancelled_user';
    await store.saveSubscription({
      id: 'sub_2',
      workspaceId,
      userId: 'usr_2',
      provider: 'paypal',
      providerSubscriptionId: 'I-CANCELLED',
      providerPlanId: 'P-SANDBOX-PRO-MONTHLY',
      plan: 'pro',
      status: 'cancelled',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    expect(await engine.getEffectivePlan(workspaceId)).toBe('preview');
    expect(await engine.can(workspaceId, 'billing.plan')).toBe(false);
    expect(await engine.can(workspaceId, 'memory.full')).toBe(false);
    // Baseline capabilities stay unlocked
    expect(await engine.can(workspaceId, 'flow.full')).toBe(true);
  });

  it('does NOT grant Pro if subscription status is pending', async () => {
    const workspaceId = 'ws_pending_user';
    await store.saveSubscription({
      id: 'sub_3',
      workspaceId,
      userId: 'usr_3',
      provider: 'paypal',
      providerSubscriptionId: 'I-PENDING',
      providerPlanId: 'P-SANDBOX-PRO-MONTHLY',
      plan: 'pro',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    expect(await engine.getEffectivePlan(workspaceId)).toBe('preview');
    expect(await engine.can(workspaceId, 'billing.plan')).toBe(false);
  });
});
