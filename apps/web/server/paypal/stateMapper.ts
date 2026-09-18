import type { SubscriptionStatus, PaymentStatus } from '../types.js';

/**
 * Maps PayPal Subscription status string to internal Syntaflow SubscriptionStatus.
 *
 * Authoritative mapping:
 * - APPROVAL_PENDING -> pending
 * - APPROVED -> pending
 * - ACTIVE -> active
 * - SUSPENDED -> suspended
 * - CANCELLED -> cancelled
 * - EXPIRED -> expired
 *
 * Any unknown or unhandled provider state throws or maps safely to pending,
 * ensuring access is never granted on unverified states.
 */
export function mapPayPalSubscriptionStatus(paypalStatus: string | undefined | null): SubscriptionStatus {
  if (!paypalStatus) {
    return 'pending';
  }

  const normalized = paypalStatus.trim().toUpperCase();
  switch (normalized) {
    case 'ACTIVE':
      return 'active';
    case 'APPROVAL_PENDING':
    case 'APPROVED':
      return 'pending';
    case 'SUSPENDED':
      return 'suspended';
    case 'CANCELLED':
      return 'cancelled';
    case 'EXPIRED':
      return 'expired';
    default:
      console.warn(`[PayPal StateMapper] Unknown PayPal subscription status: "${paypalStatus}". Defaulting to pending.`);
      return 'pending';
  }
}

/**
 * Maps PayPal Sale / Capture / Payment status to internal Syntaflow PaymentStatus.
 */
export function mapPayPalPaymentStatus(paypalStatus: string | undefined | null): PaymentStatus {
  if (!paypalStatus) {
    return 'pending';
  }

  const normalized = paypalStatus.trim().toUpperCase();
  switch (normalized) {
    case 'COMPLETED':
      return 'completed';
    case 'REFUNDED':
      return 'refunded';
    case 'REVERSED':
      return 'reversed';
    case 'PENDING':
      return 'pending';
    case 'DENIED':
    case 'FAILED':
      return 'failed';
    default:
      console.warn(`[PayPal StateMapper] Unknown PayPal payment status: "${paypalStatus}". Defaulting to failed.`);
      return 'failed';
  }
}
