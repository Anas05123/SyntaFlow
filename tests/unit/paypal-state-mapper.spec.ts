import { describe, it, expect } from 'vitest';
import { mapPayPalSubscriptionStatus, mapPayPalPaymentStatus } from '../../apps/web/server/paypal/stateMapper';

describe('PayPal State Mapper', () => {
  describe('Subscription Status Mapping', () => {
    it('maps ACTIVE to active', () => {
      expect(mapPayPalSubscriptionStatus('ACTIVE')).toBe('active');
      expect(mapPayPalSubscriptionStatus('active')).toBe('active');
    });

    it('maps APPROVAL_PENDING and APPROVED to pending', () => {
      expect(mapPayPalSubscriptionStatus('APPROVAL_PENDING')).toBe('pending');
      expect(mapPayPalSubscriptionStatus('APPROVED')).toBe('pending');
    });

    it('maps SUSPENDED to suspended', () => {
      expect(mapPayPalSubscriptionStatus('SUSPENDED')).toBe('suspended');
    });

    it('maps CANCELLED to cancelled', () => {
      expect(mapPayPalSubscriptionStatus('CANCELLED')).toBe('cancelled');
    });

    it('maps EXPIRED to expired', () => {
      expect(mapPayPalSubscriptionStatus('EXPIRED')).toBe('expired');
    });

    it('defaults unknown or empty statuses safely to pending (fail-closed)', () => {
      expect(mapPayPalSubscriptionStatus(null)).toBe('pending');
      expect(mapPayPalSubscriptionStatus(undefined)).toBe('pending');
      expect(mapPayPalSubscriptionStatus('UNKNOWN_STATUS')).toBe('pending');
      expect(mapPayPalSubscriptionStatus('FRAUD_SUSPECTED')).toBe('pending');
    });
  });

  describe('Payment Status Mapping', () => {
    it('maps COMPLETED to completed', () => {
      expect(mapPayPalPaymentStatus('COMPLETED')).toBe('completed');
    });

    it('maps REFUNDED to refunded', () => {
      expect(mapPayPalPaymentStatus('REFUNDED')).toBe('refunded');
    });

    it('maps REVERSED to reversed', () => {
      expect(mapPayPalPaymentStatus('REVERSED')).toBe('reversed');
    });

    it('maps PENDING to pending', () => {
      expect(mapPayPalPaymentStatus('PENDING')).toBe('pending');
    });

    it('maps DENIED and FAILED to failed', () => {
      expect(mapPayPalPaymentStatus('DENIED')).toBe('failed');
      expect(mapPayPalPaymentStatus('FAILED')).toBe('failed');
    });

    it('defaults unknown payment statuses to failed', () => {
      expect(mapPayPalPaymentStatus(null)).toBe('pending');
      expect(mapPayPalPaymentStatus('SOMETHING_STRANGE')).toBe('failed');
    });
  });
});
