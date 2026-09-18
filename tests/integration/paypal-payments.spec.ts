import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BillingService } from '../../apps/web/server/billingService';
import { BillingStore } from '../../apps/web/server/db/billingStore';
import { PayPalClient } from '../../apps/web/server/paypal/paypalClient';
import { EntitlementEngine } from '../../apps/web/server/entitlements';

describe('PayPal Payments Integration', () => {
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
      id: 'I-SUB-PAY',
      plan_id: 'P-SANDBOX-PRO-MONTHLY',
      status: 'ACTIVE',
    });

    service = new BillingService(
      store,
      mockPayPalClient,
      new EntitlementEngine(store),
      { proMonthlyPlanId: 'P-SANDBOX-PRO-MONTHLY' }
    );
  });

  it('records PAYMENT.SALE.COMPLETED in payment ledger and links with subscription', async () => {
    // Linked subscription exists
    await store.saveSubscription({
      id: 'sub_pay_1',
      workspaceId: 'ws_pay_user',
      userId: 'usr_pay_1',
      provider: 'paypal',
      providerSubscriptionId: 'I-SUB-PAY',
      providerPlanId: 'P-SANDBOX-PRO-MONTHLY',
      plan: 'pro',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await service.processWebhook(validHeaders, {
      id: 'WH-EVT-SALE-COMPLETED',
      event_type: 'PAYMENT.SALE.COMPLETED',
      resource: {
        id: 'SALE-999-XYZ',
        billing_agreement_id: 'I-SUB-PAY',
        amount: {
          total: '19.00',
          currency: 'USD',
        },
        create_time: '2026-09-18T12:00:00Z',
      },
    });

    const payment = await store.getPaymentByProviderId('SALE-999-XYZ');
    expect(payment).not.toBeNull();
    expect(payment?.amount).toBe(19.0);
    expect(payment?.currency).toBe('USD');
    expect(payment?.status).toBe('completed');
    expect(payment?.workspaceId).toBe('ws_pay_user');

    // Subscription transitions to active
    const sub = await store.getSubscriptionByProviderId('I-SUB-PAY');
    expect(sub?.status).toBe('active');
  });

  it('records PAYMENT.SALE.REFUNDED and reconciles with PayPal without deleting records', async () => {
    await store.savePayment({
      id: 'pay_ref_1',
      workspaceId: 'ws_pay_user',
      provider: 'paypal',
      providerPaymentId: 'SALE-REFUND-TARGET',
      providerSubscriptionId: 'I-SUB-PAY',
      amount: 19.0,
      currency: 'USD',
      status: 'completed',
      createdAt: new Date().toISOString(),
      paidAt: new Date().toISOString(),
    });

    await service.processWebhook(validHeaders, {
      id: 'WH-EVT-SALE-REFUNDED',
      event_type: 'PAYMENT.SALE.REFUNDED',
      resource: {
        id: 'REFUND-001',
        sale_id: 'SALE-REFUND-TARGET',
      },
    });

    const payment = await store.getPaymentByProviderId('SALE-REFUND-TARGET');
    expect(payment?.status).toBe('refunded');
  });

  it('records PAYMENT.SALE.REVERSED accurately in payment ledger', async () => {
    await store.savePayment({
      id: 'pay_rev_1',
      workspaceId: 'ws_pay_user',
      provider: 'paypal',
      providerPaymentId: 'SALE-REVERSE-TARGET',
      providerSubscriptionId: 'I-SUB-PAY',
      amount: 19.0,
      currency: 'USD',
      status: 'completed',
      createdAt: new Date().toISOString(),
      paidAt: new Date().toISOString(),
    });

    await service.processWebhook(validHeaders, {
      id: 'WH-EVT-SALE-REVERSED',
      event_type: 'PAYMENT.SALE.REVERSED',
      resource: {
        id: 'REVERSE-001',
        sale_id: 'SALE-REVERSE-TARGET',
      },
    });

    const payment = await store.getPaymentByProviderId('SALE-REVERSE-TARGET');
    expect(payment?.status).toBe('reversed');
  });
});
