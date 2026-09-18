import { z } from 'zod';

export const subscriptionStatusSchema = z.enum([
  'pending',
  'active',
  'past_due',
  'suspended',
  'cancelled',
  'expired',
]);

export type SubscriptionStatus = z.infer<typeof subscriptionStatusSchema>;

export const paymentStatusSchema = z.enum([
  'pending',
  'completed',
  'refunded',
  'reversed',
  'failed',
]);

export type PaymentStatus = z.infer<typeof paymentStatusSchema>;

export const billingPlanIdSchema = z.enum(['preview', 'pro']);
export type BillingPlanId = z.infer<typeof billingPlanIdSchema>;

export const billingSubscriptionSchema = z.object({
  id: z.string().min(1),
  workspaceId: z.string().min(1),
  userId: z.string().min(1),
  provider: z.literal('paypal'),
  providerSubscriptionId: z.string().min(1),
  providerPlanId: z.string().min(1),
  plan: billingPlanIdSchema,
  status: subscriptionStatusSchema,
  currentPeriodStart: z.string().nullable().optional(),
  currentPeriodEnd: z.string().nullable().optional(),
  cancelAtPeriodEnd: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type BillingSubscription = z.infer<typeof billingSubscriptionSchema>;

export const billingPaymentSchema = z.object({
  id: z.string().min(1),
  workspaceId: z.string().min(1),
  provider: z.literal('paypal'),
  providerPaymentId: z.string().min(1),
  providerSubscriptionId: z.string().nullable().optional(),
  amount: z.number().positive(),
  currency: z.string().length(3).default('USD'),
  status: paymentStatusSchema,
  createdAt: z.string(),
  paidAt: z.string().nullable().optional(),
});

export type BillingPayment = z.infer<typeof billingPaymentSchema>;

export const webhookEventSchema = z.object({
  id: z.string().min(1),
  provider: z.literal('paypal'),
  providerEventId: z.string().min(1),
  eventType: z.string().min(1),
  receivedAt: z.string(),
  processedAt: z.string().nullable().optional(),
  status: z.enum(['received', 'processed', 'failed', 'ignored']),
  failureReason: z.string().nullable().optional(),
});

export type WebhookEvent = z.infer<typeof webhookEventSchema>;

export interface BillingConfig {
  env: 'sandbox';
  clientId: string;
  proMonthlyPlanId: string;
}
