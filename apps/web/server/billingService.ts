import crypto from 'node:crypto';
import type { BillingSubscription, BillingPayment } from './types.js';
import { BillingStore, defaultBillingStore } from './db/billingStore.js';
import { PayPalClient, defaultPayPalClient } from './paypal/paypalClient.js';
import { mapPayPalSubscriptionStatus } from './paypal/stateMapper.js';
import { EntitlementEngine, defaultEntitlementEngine } from './entitlements.js';

export interface BillingServiceConfig {
  proMonthlyPlanId?: string;
}

export class BillingService {
  private store: BillingStore;
  private paypalClient: PayPalClient;
  private entitlementEngine: EntitlementEngine;
  private proMonthlyPlanId: string;

  constructor(
    store: BillingStore = defaultBillingStore,
    paypalClient: PayPalClient = defaultPayPalClient,
    entitlementEngine: EntitlementEngine = defaultEntitlementEngine,
    config?: BillingServiceConfig
  ) {
    this.store = store;
    this.paypalClient = paypalClient;
    this.entitlementEngine = entitlementEngine;
    this.proMonthlyPlanId = config?.proMonthlyPlanId || process.env.PAYPAL_PRO_MONTHLY_PLAN_ID || '';
  }

  public getStore(): BillingStore {
    return this.store;
  }

  public getPayPalClient(): PayPalClient {
    return this.paypalClient;
  }

  /**
   * Sync and record a subscription after buyer approves checkout in frontend.
   * Authoritative status is fetched directly from PayPal.
   */
  public async linkSubscription(
    workspaceId: string,
    userId: string,
    providerSubscriptionId: string
  ): Promise<BillingSubscription> {
    if (!workspaceId || !userId || !providerSubscriptionId) {
      throw new Error('[BillingService] Missing required parameters to link subscription.');
    }

    const paypalSub = await this.paypalClient.getSubscription(providerSubscriptionId);
    if (!paypalSub || !paypalSub.id) {
      throw new Error('[BillingService] Subscription not found on PayPal.');
    }

    if (this.proMonthlyPlanId && paypalSub.plan_id !== this.proMonthlyPlanId) {
      console.warn(
        `[BillingService] Plan mismatch: Expected ${this.proMonthlyPlanId}, got ${paypalSub.plan_id}. Rejecting Pro activation.`
      );
      throw new Error('[BillingService] Plan ID does not match Syntaflow Pro Monthly plan.');
    }

    const mappedStatus = mapPayPalSubscriptionStatus(paypalSub.status);
    const existing = await this.store.getSubscriptionByProviderId(providerSubscriptionId);

    const subscription: BillingSubscription = {
      id: existing?.id || crypto.randomUUID(),
      workspaceId,
      userId,
      provider: 'paypal',
      providerSubscriptionId: paypalSub.id,
      providerPlanId: paypalSub.plan_id,
      plan: 'pro',
      status: mappedStatus,
      currentPeriodStart: paypalSub.start_time || new Date().toISOString(),
      currentPeriodEnd: paypalSub.billing_info?.next_billing_time || null,
      cancelAtPeriodEnd: false,
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.store.saveSubscription(subscription);
    return subscription;
  }

  /**
   * Get subscription and entitlement overview for a workspace.
   */
  public async getWorkspaceBilling(workspaceId: string): Promise<{
    subscription: BillingSubscription | null;
    plan: 'preview' | 'pro';
    status: string;
    isProActive: boolean;
    renewalDate: string | null;
  }> {
    const sub = await this.store.getSubscriptionByWorkspace(workspaceId);
    const effectivePlan = await this.entitlementEngine.getEffectivePlan(workspaceId);
    const isProActive = Boolean(sub && sub.plan === 'pro' && sub.status === 'active');

    return {
      subscription: sub,
      plan: effectivePlan,
      status: sub ? sub.status : 'active',
      isProActive,
      renewalDate: sub?.currentPeriodEnd || null,
    };
  }

  /**
   * Cancel an active subscription on PayPal and update internal records.
   */
  public async cancelSubscription(
    workspaceId: string,
    userId: string,
    reason: string = 'User initiated cancellation'
  ): Promise<BillingSubscription> {
    const sub = await this.store.getSubscriptionByWorkspace(workspaceId);
    if (!sub) {
      throw new Error('[BillingService] No active subscription found for this workspace.');
    }

    if (sub.userId !== userId) {
      throw new Error('[BillingService] Unauthorized to cancel this subscription.');
    }

    if (sub.status === 'cancelled' || sub.status === 'expired') {
      return sub;
    }

    await this.paypalClient.cancelSubscription(sub.providerSubscriptionId, reason);

    const updatedSub: BillingSubscription = {
      ...sub,
      status: 'cancelled',
      cancelAtPeriodEnd: true,
      updatedAt: new Date().toISOString(),
    };

    await this.store.saveSubscription(updatedSub);
    return updatedSub;
  }

  /**
   * Process incoming PayPal Webhook.
   */
  public async processWebhook(
    headers: Record<string, string | undefined>,
    rawBody: string | Record<string, any>
  ): Promise<{ status: string; eventId: string; message?: string }> {
    const eventPayload = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody;
    const eventId = eventPayload?.id;
    const eventType = eventPayload?.event_type;

    if (!eventId || !eventType) {
      throw new Error('[BillingService] Invalid webhook payload: Missing event id or event_type.');
    }

    const normalizedHeaders: Record<string, string> = {};
    for (const [key, value] of Object.entries(headers)) {
      if (value) normalizedHeaders[key.toLowerCase()] = String(value);
    }

    const authAlgo = normalizedHeaders['paypal-auth-algo'];
    const certUrl = normalizedHeaders['paypal-cert-url'];
    const transmissionId = normalizedHeaders['paypal-transmission-id'];
    const transmissionSig = normalizedHeaders['paypal-transmission-sig'];
    const transmissionTime = normalizedHeaders['paypal-transmission-time'];

    // 1. Verify Signature
    const isSignatureValid = await this.paypalClient.verifyWebhookSignature({
      authAlgo,
      certUrl,
      transmissionId,
      transmissionSig,
      transmissionTime,
      webhookEvent: eventPayload,
    });

    if (!isSignatureValid) {
      console.warn(`[BillingService] Webhook signature verification failed for event: ${eventId}`);
      throw new Error('Invalid PayPal webhook signature.');
    }

    // 2. Check Idempotency
    const recorded = await this.store.recordWebhookEvent({
      id: crypto.randomUUID(),
      provider: 'paypal',
      providerEventId: eventId,
      eventType,
      receivedAt: new Date().toISOString(),
      status: 'received',
    });

    if (!recorded) {
      console.log(`[BillingService] Webhook event ${eventId} already processed. Skipping.`);
      return { status: 'already_processed', eventId };
    }

    // 3. Process Event by Type
    try {
      await this.handleWebhookEvent(eventType, eventPayload);
      await this.store.markWebhookEventProcessed(eventId, 'processed');
      return { status: 'processed', eventId };
    } catch (err: any) {
      console.error(`[BillingService] Error processing webhook event ${eventId}:`, err);
      await this.store.markWebhookEventProcessed(eventId, 'failed', err.message || 'Unknown processing error');
      throw err;
    }
  }

  private async handleWebhookEvent(eventType: string, eventPayload: any): Promise<void> {
    const resource = eventPayload.resource || {};
    const subscriptionId = resource.id || resource.billing_agreement_id;

    switch (eventType) {
      case 'BILLING.SUBSCRIPTION.CREATED': {
        if (subscriptionId) {
          const sub = await this.store.getSubscriptionByProviderId(subscriptionId);
          if (sub && sub.status !== 'active') {
            await this.store.saveSubscription({
              ...sub,
              status: 'pending',
              updatedAt: new Date().toISOString(),
            });
          }
        }
        break;
      }

      case 'BILLING.SUBSCRIPTION.ACTIVATED': {
        if (!subscriptionId) break;
        const existing = await this.store.getSubscriptionByProviderId(subscriptionId);
        if (existing) {
          const updated: BillingSubscription = {
            ...existing,
            status: 'active',
            currentPeriodStart: resource.start_time || existing.currentPeriodStart,
            currentPeriodEnd: resource.billing_info?.next_billing_time || existing.currentPeriodEnd,
            updatedAt: new Date().toISOString(),
          };
          await this.store.saveSubscription(updated);
        } else {
          try {
            const paypalSub = await this.paypalClient.getSubscription(subscriptionId);
            if (paypalSub && (!this.proMonthlyPlanId || paypalSub.plan_id === this.proMonthlyPlanId)) {
              await this.store.saveSubscription({
                id: crypto.randomUUID(),
                workspaceId: resource.custom_id || 'ws_default',
                userId: resource.subscriber?.payer_id || 'usr_unknown',
                provider: 'paypal',
                providerSubscriptionId: subscriptionId,
                providerPlanId: paypalSub.plan_id,
                plan: 'pro',
                status: 'active',
                currentPeriodStart: paypalSub.start_time || new Date().toISOString(),
                currentPeriodEnd: paypalSub.billing_info?.next_billing_time || null,
                cancelAtPeriodEnd: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              });
            }
          } catch (_e) {
            // reconcile failed
          }
        }
        break;
      }

      case 'BILLING.SUBSCRIPTION.UPDATED': {
        if (!subscriptionId) break;
        const existing = await this.store.getSubscriptionByProviderId(subscriptionId);
        if (existing) {
          const newStatus = mapPayPalSubscriptionStatus(resource.status || existing.status);
          await this.store.saveSubscription({
            ...existing,
            status: newStatus,
            currentPeriodEnd: resource.billing_info?.next_billing_time || existing.currentPeriodEnd,
            updatedAt: new Date().toISOString(),
          });
        }
        break;
      }

      case 'BILLING.SUBSCRIPTION.CANCELLED': {
        if (!subscriptionId) break;
        const existing = await this.store.getSubscriptionByProviderId(subscriptionId);
        if (existing) {
          await this.store.saveSubscription({
            ...existing,
            status: 'cancelled',
            cancelAtPeriodEnd: true,
            updatedAt: new Date().toISOString(),
          });
        }
        break;
      }

      case 'BILLING.SUBSCRIPTION.SUSPENDED': {
        if (!subscriptionId) break;
        const existing = await this.store.getSubscriptionByProviderId(subscriptionId);
        if (existing) {
          await this.store.saveSubscription({
            ...existing,
            status: 'suspended',
            updatedAt: new Date().toISOString(),
          });
        }
        break;
      }

      case 'BILLING.SUBSCRIPTION.EXPIRED': {
        if (!subscriptionId) break;
        const existing = await this.store.getSubscriptionByProviderId(subscriptionId);
        if (existing) {
          await this.store.saveSubscription({
            ...existing,
            status: 'expired',
            updatedAt: new Date().toISOString(),
          });
        }
        break;
      }

      case 'BILLING.SUBSCRIPTION.PAYMENT.FAILED': {
        if (!subscriptionId) break;
        const existing = await this.store.getSubscriptionByProviderId(subscriptionId);
        if (existing) {
          await this.store.saveSubscription({
            ...existing,
            status: 'past_due',
            updatedAt: new Date().toISOString(),
          });
        }
        break;
      }

      case 'PAYMENT.SALE.COMPLETED': {
        const paymentId = resource.id;
        const subId = resource.billing_agreement_id || null;
        const amount = Number(resource.amount?.total || resource.amount?.value || 19.0);
        const currency = resource.amount?.currency || 'USD';

        let workspaceId = 'ws_default';
        if (subId) {
          const sub = await this.store.getSubscriptionByProviderId(subId);
          if (sub) workspaceId = sub.workspaceId;
        }

        const payment: BillingPayment = {
          id: crypto.randomUUID(),
          workspaceId,
          provider: 'paypal',
          providerPaymentId: paymentId,
          providerSubscriptionId: subId,
          amount,
          currency,
          status: 'completed',
          createdAt: resource.create_time || new Date().toISOString(),
          paidAt: resource.create_time || new Date().toISOString(),
        };

        await this.store.savePayment(payment);

        if (subId) {
          const sub = await this.store.getSubscriptionByProviderId(subId);
          if (sub && sub.status !== 'active') {
            await this.store.saveSubscription({
              ...sub,
              status: 'active',
              updatedAt: new Date().toISOString(),
            });
          }
        }
        break;
      }

      case 'PAYMENT.SALE.REFUNDED': {
        const saleId = resource.sale_id || resource.id;
        const existingPayment = await this.store.getPaymentByProviderId(saleId);
        if (existingPayment) {
          await this.store.savePayment({
            ...existingPayment,
            status: 'refunded',
          });
        }
        if (existingPayment?.providerSubscriptionId) {
          try {
            const paypalSub = await this.paypalClient.getSubscription(existingPayment.providerSubscriptionId);
            const sub = await this.store.getSubscriptionByProviderId(existingPayment.providerSubscriptionId);
            if (sub) {
              await this.store.saveSubscription({
                ...sub,
                status: mapPayPalSubscriptionStatus(paypalSub.status),
                updatedAt: new Date().toISOString(),
              });
            }
          } catch (_e) {
            // ignore
          }
        }
        break;
      }

      case 'PAYMENT.SALE.REVERSED': {
        const saleId = resource.sale_id || resource.id;
        const existingPayment = await this.store.getPaymentByProviderId(saleId);
        if (existingPayment) {
          await this.store.savePayment({
            ...existingPayment,
            status: 'reversed',
          });
        }
        break;
      }

      default:
        console.log(`[BillingService] Unhandled webhook event type: ${eventType}. Logged and ignored.`);
        break;
    }
  }
}

export const defaultBillingService = new BillingService();
