export interface UserProfile {
  userId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AccountPlan {
  planId: 'preview' | 'pro' | 'team';
  planName?: string;
  status: 'active' | 'trialing' | 'expired' | 'past_due';
  startedAt: string;
  expiresAt?: string;
}

export interface DeviceSession {
  id: string;
  userId: string;
  clientName: string;
  clientVersion?: string;
  osName: string;
  deviceModel?: string;
  ip?: string;
  countryName?: string;
  current: boolean;
  lastActivity?: string;
}

export type EntitlementKey =
  | 'desktop.download'
  | 'integration.gmail'
  | 'integration.calendar'
  | 'integration.drive'
  | 'integration.github'
  | 'integration.notion'
  | 'integration.linear'
  | 'ai.local'
  | 'ai.cloud'
  | 'workspace.create'
  | 'team.members';

export const PREVIEW_PLAN: AccountPlan = {
  planId: 'preview',
  planName: 'Desktop Preview',
  status: 'active',
  startedAt: '2026-09-01T00:00:00.000Z',
};

export function checkEntitlement(plan: AccountPlan | null | undefined, key: EntitlementKey): boolean {
  if (!plan) return false;
  switch (key) {
    case 'desktop.download':
    case 'integration.gmail':
    case 'integration.calendar':
    case 'integration.drive':
    case 'integration.github':
    case 'integration.notion':
    case 'integration.linear':
    case 'ai.local':
    case 'workspace.create':
      return plan.status === 'active';
    case 'ai.cloud':
    case 'team.members':
      return plan.planId === 'team' || plan.planId === 'pro';
    default:
      return false;
  }
}
