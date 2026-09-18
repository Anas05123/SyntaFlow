import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BillingService } from '../../apps/web/server/billingService';
import { BillingStore } from '../../apps/web/server/db/billingStore';
import { PayPalClient } from '../../apps/web/server/paypal/paypalClient';
import { EntitlementEngine } from '../../apps/web/server/entitlements';

describe('PayPal Webhooks Integration', () => {
  let store: BillingStore;
  let mockPayPalClient: PayPalClient;
  let service: BillingService;

  beforeEach(async () => {
    store = new BillingStore();
    await store.initialize();

    mockPayPalClient = new PayPalClient({
      clientId: 'sandbox_client_test',
      clientSecret: 'sandbox_secret_test',
      webhookId: 'WH-TEST-WEBHOOK-ID',
    });

    // Mock official PayPal signature verification
    vi.spyOn(mockPayPalClient, 'verifyWebhookSignature').mockImplementation(async (params) => {
      const webhookId = params.webhookId || mockPayPalClient.getWebhookId();
      if (
        !params.authAlgo ||
        !params.certUrl ||
        !params.transmissionId ||
        !params.transmissionSig ||
        !params.transmissionTime ||
        !webhookId
      ) {
        return false;
      }
      // Simulate valid vs invalid signature
      return params.transmissionSig === 'VALID_SIGNATURE';
    });

    vi.spyOn(mockPayPalClient, 'getSubscription').mockResolvedValue({
      id: 'I-TEST-SUB-001',
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

  const sampleHeaders = {
    'paypal-auth-algo': 'SHA256withRSA',
    'paypal-cert-url': 'https://api.sandbox.paypal.com/v1/notifications/certs/CERT-123',
    'paypal-transmission-id': 'trans-123',
    'paypal-transmission-sig': 'VALID_SIGNATURE',
    'paypal-transmission-time': '2026-09-18T00:00:00Z',
  };

  const samplePayload = {
    id: 'WH-EVT-001',
    event_type: 'BILLING.SUBSCRIPTION.ACTIVATED',
    resource: {
      id: 'I-TEST-SUB-001',
      plan_id: 'P-SANDBOX-PRO-MONTHLY',
      status: 'ACTIVE',
      start_time: '2026-09-18T00:00:00Z',
      billing_info: {
        next_billing_time: '2026-10-18T00:00:00Z',
      },
      custom_id: 'ws_test_user',
    },
  };

  it('processes webhook with valid signature and grants active status', async () => {
    const result = await service.processWebhook(sampleHeaders, samplePayload);
    expect(result.status).toBe('processed');
    expect(result.eventId).toBe('WH-EVT-001');

    const sub = await store.getSubscriptionByProviderId('I-TEST-SUB-001');
    expect(sub).not.toBeNull();
    expect(sub?.status).toBe('active');
  });

  it('rejects webhook with invalid signature with HTTP 400 error', async () => {
    const invalidHeaders = {
      ...sampleHeaders,
      'paypal-transmission-sig': 'INVALID_SIGNATURE_TAMPERED',
    };

    await expect(
      service.processWebhook(invalidHeaders, samplePayload)
    ).rejects.toThrow('Invalid PayPal webhook signature.');

    // Subscription must not be created or updated
    const sub = await store.getSubscriptionByProviderId('I-TEST-SUB-001');
    expect(sub).toBeNull();
  });

  it('rejects webhook missing required headers', async () => {
    const missingHeaders = {
      'paypal-transmission-sig': 'VALID_SIGNATURE',
      // Missing auth-algo, cert-url, transmission-id, etc.
    };

    await expect(
      service.processWebhook(missingHeaders, samplePayload)
    ).rejects.toThrow('Invalid PayPal webhook signature.');
  });

  it('safely logs and ignores unknown events without modifying billing state', async () => {
    const unknownPayload = {
      id: 'WH-EVT-UNKNOWN-999',
      event_type: 'INVOICING.INVOICE.CANCELLED',
      resource: { id: 'INV-123' },
    };

    const result = await service.processWebhook(sampleHeaders, unknownPayload);
    expect(result.status).toBe('processed');

    const eventRecord = await store.getWebhookEvent('WH-EVT-UNKNOWN-999');
    expect(eventRecord?.status).toBe('processed');
  });

  it('handles duplicate webhook delivery idempotently without reprocessing', async () => {
    const eventPayload = {
      id: 'WH-EVT-DUP-001',
      event_type: 'BILLING.SUBSCRIPTION.ACTIVATED',
      resource: {
        id: 'I-SUB-DUP',
        plan_id: 'P-SANDBOX-PRO-MONTHLY',
        status: 'ACTIVE',
      },
    };

    // First arrival
    const res1 = await service.processWebhook(sampleHeaders, eventPayload);
    expect(res1.status).toBe('processed');

    // Duplicate arrival (PayPal webhook retry)
    const res2 = await service.processWebhook(sampleHeaders, eventPayload);
    expect(res2.status).toBe('already_processed');
  });
});
