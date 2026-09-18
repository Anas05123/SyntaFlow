export type SubscriptionStatus =
  | 'pending'
  | 'active'
  | 'past_due'
  | 'suspended'
  | 'cancelled'
  | 'expired';

export type PaymentStatus =
  | 'pending'
  | 'completed'
  | 'refunded'
  | 'reversed'
  | 'failed';

export type BillingPlanId = 'preview' | 'pro';

export interface BillingSubscription {
  id: string;
  workspaceId: string;
  userId: string;
  provider: 'paypal';
  providerSubscriptionId: string;
  providerPlanId: string;
  plan: BillingPlanId;
  status: SubscriptionStatus;
  currentPeriodStart?: string | null;
  currentPeriodEnd?: string | null;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BillingPayment {
  id: string;
  workspaceId: string;
  provider: 'paypal';
  providerPaymentId: string;
  providerSubscriptionId?: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  createdAt: string;
  paidAt?: string | null;
}

export interface WebhookEvent {
  id: string;
  provider: 'paypal';
  providerEventId: string;
  eventType: string;
  receivedAt: string;
  processedAt?: string | null;
  status: 'received' | 'processed' | 'failed' | 'ignored';
  failureReason?: string | null;
}

export interface BillingConfig {
  env: 'sandbox';
  clientId: string;
  proMonthlyPlanId: string;
}
