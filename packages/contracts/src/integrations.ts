import { z } from "zod";

export const integrationCategorySchema = z.enum([
  "Communication",
  "Calendar",
  "Files",
  "Design",
  "Knowledge",
  "Development",
]);

export type IntegrationCategory = z.infer<typeof integrationCategorySchema>;

export const integrationStatusSchema = z.enum([
  "available",
  "disconnected",
  "connecting",
  "connected",
  "degraded",
  "offline",
  "auth-expired",
  "permission-required",
  "error",
  "test",
  "coming-soon",
  // Backward compatibility tokens
  "beta",
  "expired",
  "experimental",
  "needs-attention",
]);

export type IntegrationStatus = z.infer<typeof integrationStatusSchema>;

export const integrationTransportSchema = z.enum(["api", "mcp", "local"]);

export type IntegrationTransport = z.infer<typeof integrationTransportSchema>;

export const capabilityIdSchema = z.enum([
  "mail.search",
  "mail.read",
  "mail.draft",
  "mail.send",
  "calendar.read",
  "calendar.availability",
  "calendar.create",
  "files.search",
  "files.read",
  "files.write",
  "issues.read",
  "issues.create",
  "issues.update",
  "design.read",
  "knowledge.search",
  "knowledge.read",
  "knowledge.write",
  "messaging.search",
  "messaging.post",
]);

export type CapabilityId = z.infer<typeof capabilityIdSchema>;

export const capabilityRiskClassSchema = z.enum([
  "READ",
  "WRITE",
  "EXTERNAL_ACTION",
  "DESTRUCTIVE",
]);

export type CapabilityRiskClass = z.infer<typeof capabilityRiskClassSchema>;

export interface CapabilityRiskDefinition {
  riskClass: CapabilityRiskClass;
  requiresConfirmation: boolean;
  summary: string;
}

export const CAPABILITY_RISK_MAP: Record<CapabilityId, CapabilityRiskDefinition> = {
  "mail.search": { riskClass: "READ", requiresConfirmation: false, summary: "Search email messages and metadata" },
  "mail.read": { riskClass: "READ", requiresConfirmation: false, summary: "Read email threads and details" },
  "mail.draft": { riskClass: "WRITE", requiresConfirmation: false, summary: "Create or modify email drafts" },
  "mail.send": { riskClass: "EXTERNAL_ACTION", requiresConfirmation: true, summary: "Dispatch live emails to external recipients" },

  "calendar.read": { riskClass: "READ", requiresConfirmation: false, summary: "Inspect calendar schedule and events" },
  "calendar.availability": { riskClass: "READ", requiresConfirmation: false, summary: "Query free/busy meeting availability" },
  "calendar.create": { riskClass: "WRITE", requiresConfirmation: false, summary: "Schedule new calendar events" },

  "files.search": { riskClass: "READ", requiresConfirmation: false, summary: "Query folder and file hierarchy" },
  "files.read": { riskClass: "READ", requiresConfirmation: false, summary: "Read file content and metadata" },
  "files.write": { riskClass: "DESTRUCTIVE", requiresConfirmation: true, summary: "Upload or overwrite files in cloud storage" },

  "issues.read": { riskClass: "READ", requiresConfirmation: false, summary: "Read issues, tickets, and milestones" },
  "issues.create": { riskClass: "WRITE", requiresConfirmation: false, summary: "Create issues and development tasks" },
  "issues.update": { riskClass: "WRITE", requiresConfirmation: false, summary: "Modify issue state or labels" },

  "design.read": { riskClass: "READ", requiresConfirmation: false, summary: "Read canvas frames, tokens, and assets" },

  "knowledge.search": { riskClass: "READ", requiresConfirmation: false, summary: "Query workspace docs and pages" },
  "knowledge.read": { riskClass: "READ", requiresConfirmation: false, summary: "Read workspace documentation" },
  "knowledge.write": { riskClass: "WRITE", requiresConfirmation: false, summary: "Create or edit documentation pages" },

  "messaging.search": { riskClass: "READ", requiresConfirmation: false, summary: "Search team chat channels and messages" },
  "messaging.post": { riskClass: "EXTERNAL_ACTION", requiresConfirmation: true, summary: "Post messages to team channels" },
};

export const agentAccessConfigSchema = z.object({
  enabled: z.boolean(),
  allowedCapabilities: z.array(capabilityIdSchema),
  elevatedConfirmed: z.boolean().optional(),
});

export type AgentAccessConfig = z.infer<typeof agentAccessConfigSchema>;

export const normalizedErrorCodeSchema = z.enum([
  "authorization_failed",
  "permission_denied",
  "token_expired",
  "rate_limited",
  "provider_unavailable",
  "mcp_unavailable",
  "unsupported_capability",
  "connection_lost",
  "network_unavailable",
  "auth_expired",
  "permission_required",
  "timeout",
  "not_found",
  "system",
]);

export type NormalizedErrorCode = z.infer<typeof normalizedErrorCodeSchema>;

export const integrationErrorSchema = z.object({
  code: normalizedErrorCodeSchema,
  message: z.string().min(1),
  category: z.string().optional(),
  retryable: z.boolean().optional(),
  userAction: z.string().optional(),
});

export type IntegrationError = z.infer<typeof integrationErrorSchema>;

export const healthCheckResultSchema = z.object({
  status: integrationStatusSchema,
  latencyMs: z.number().optional(),
  checkedAt: z.string(),
  error: integrationErrorSchema.optional(),
});

export type HealthCheckResult = z.infer<typeof healthCheckResultSchema>;

export const integrationDefinitionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  category: integrationCategorySchema,
  logo: z.string().min(1),
  website: z.string().url().or(z.string().min(1)),
  status: integrationStatusSchema,
  transports: z.array(integrationTransportSchema),
  primaryTransport: integrationTransportSchema,
  capabilities: z.array(capabilityIdSchema),
  authType: z.enum(["oauth2", "apiKey", "token", "mcp-oauth", "none"]),
  scopes: z.array(z.string()),
  agentAccessSupported: z.boolean(),
  mcpDetails: z
    .object({
      supportLevel: z.enum(["production", "preview", "experimental", "restricted"]),
      serverUrl: z.string().optional(),
      notes: z.string().optional(),
    })
    .optional(),
  apiDetails: z
    .object({
      endpoint: z.string().optional(),
      docUrl: z.string().optional(),
    })
    .optional(),
});

export type IntegrationDefinition = z.infer<typeof integrationDefinitionSchema>;

export const integrationConnectionSchema = z.object({
  integrationId: z.string().min(1),
  state: integrationStatusSchema,
  accountLabel: z.string().optional(),
  accountEmail: z.string().optional(),
  connectedAt: z.string().optional(),
  lastCheckedAt: z.string().optional(),
  grantedScopes: z.array(z.string()),
  transport: integrationTransportSchema,
  agentAccess: agentAccessConfigSchema,
  error: integrationErrorSchema.optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type IntegrationConnection = z.infer<typeof integrationConnectionSchema>;
