import type { BillingStore } from './db/billingStore.js';
import { defaultBillingStore } from './db/billingStore.js';

export type EntitlementCapability =
  | 'billing.plan'
  | 'flow.full'
  | 'memory.full'
  | 'integrations.google'
  | 'clients.unlimited'
  | 'reviews.unlimited';

export class EntitlementEngine {
  private store: BillingStore;

  constructor(store: BillingStore = defaultBillingStore) {
    this.store = store;
  }

  /**
   * Determine if a workspace has access to a specific capability.
   */
  public async can(workspaceId: string, capability: EntitlementCapability): Promise<boolean> {
    const sub = await this.store.getSubscriptionByWorkspace(workspaceId);
    const isProActive = Boolean(sub && sub.plan === 'pro' && sub.status === 'active');

    switch (capability) {
      case 'billing.plan':
        return isProActive;
      case 'memory.full':
        return isProActive;
      case 'flow.full':
      case 'integrations.google':
      case 'clients.unlimited':
      case 'reviews.unlimited':
        // Unlocked for both active preview and active pro
        return true;
      default:
        return false;
    }
  }

  /**
   * Get the current effective plan for a workspace.
   */
  public async getEffectivePlan(workspaceId: string): Promise<'preview' | 'pro'> {
    const sub = await this.store.getSubscriptionByWorkspace(workspaceId);
    if (sub && sub.plan === 'pro' && sub.status === 'active') {
      return 'pro';
    }
    return 'preview';
  }
}

export const defaultEntitlementEngine = new EntitlementEngine();
