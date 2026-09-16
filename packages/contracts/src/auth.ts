import { z } from 'zod';

export const userProfileSchema = z.object({
  userId: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  avatarUrl: z.string().url().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;

export const accountPlanSchema = z.object({
  planId: z.enum(['preview', 'pro', 'team']),
  status: z.enum(['active', 'trialing', 'expired', 'past_due']),
  startedAt: z.string(),
  expiresAt: z.string().optional(),
});

export type AccountPlan = z.infer<typeof accountPlanSchema>;

export const deviceSessionSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  clientName: z.string(),
  clientVersion: z.string().optional(),
  osName: z.string(),
  deviceModel: z.string().optional(),
  ip: z.string().optional(),
  countryName: z.string().optional(),
  current: z.boolean().default(false),
  lastActivity: z.string().optional(),
});

export type DeviceSession = z.infer<typeof deviceSessionSchema>;

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
