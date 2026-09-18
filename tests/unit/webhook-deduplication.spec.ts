import { describe, it, expect, beforeEach } from 'vitest';
import { BillingStore } from '../../apps/web/server/db/billingStore';

describe('Webhook Deduplication & SQLite Idempotency', () => {
  let store: BillingStore;

  beforeEach(async () => {
    store = new BillingStore();
    await store.initialize();
  });

  it('records initial webhook event and returns true', async () => {
    const eventId = 'WH-123456789-TEST';
    const firstResult = await store.recordWebhookEvent({
      id: 'event_1',
      provider: 'paypal',
      providerEventId: eventId,
      eventType: 'BILLING.SUBSCRIPTION.ACTIVATED',
      receivedAt: new Date().toISOString(),
      status: 'received',
    });

    expect(firstResult).toBe(true);

    const saved = await store.getWebhookEvent(eventId);
    expect(saved).not.toBeNull();
    expect(saved?.providerEventId).toBe(eventId);
    expect(saved?.eventType).toBe('BILLING.SUBSCRIPTION.ACTIVATED');
  });

  it('rejects duplicate webhook event with identical providerEventId and returns false', async () => {
    const eventId = 'WH-DUPLICATE-TEST';

    const first = await store.recordWebhookEvent({
      id: 'event_dup_1',
      provider: 'paypal',
      providerEventId: eventId,
      eventType: 'PAYMENT.SALE.COMPLETED',
      receivedAt: new Date().toISOString(),
      status: 'received',
    });
    expect(first).toBe(true);

    // Duplicate arrival from PayPal retry
    const duplicate = await store.recordWebhookEvent({
      id: 'event_dup_2',
      provider: 'paypal',
      providerEventId: eventId,
      eventType: 'PAYMENT.SALE.COMPLETED',
      receivedAt: new Date().toISOString(),
      status: 'received',
    });
    expect(duplicate).toBe(false);
  });

  it('updates processed status and timestamp on completion', async () => {
    const eventId = 'WH-PROCESS-TEST';
    await store.recordWebhookEvent({
      id: 'event_proc_1',
      provider: 'paypal',
      providerEventId: eventId,
      eventType: 'BILLING.SUBSCRIPTION.ACTIVATED',
      receivedAt: new Date().toISOString(),
      status: 'received',
    });

    await store.markWebhookEventProcessed(eventId, 'processed');

    const updated = await store.getWebhookEvent(eventId);
    expect(updated?.status).toBe('processed');
    expect(updated?.processedAt).toBeDefined();
    expect(updated?.failureReason).toBeNull();
  });
});
