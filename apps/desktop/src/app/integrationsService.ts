/**
 * Syntaflow Renderer Integrations Service
 *
 * Provides a clean client boundary for the React UI.
 * Connects directly to window.coreDeskDesktop.integrations (Electron preload bridge)
 * with robust in-memory mock fallbacks for pure browser/dev environments.
 *
 * Security Invariants:
 * - Renderer NEVER handles raw tokens, credentials, or Node.js APIs.
 * - All operations pass through typed preload IPC calls.
 */

export type IntegrationCategory =
  | 'Communication'
  | 'Calendar'
  | 'Files'
  | 'Design'
  | 'Knowledge'
  | 'Development';

export type IntegrationStatus =
  | 'available'
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'degraded'
  | 'offline'
  | 'auth-expired'
  | 'permission-required'
  | 'error'
  | 'test'
  | 'coming-soon'
  | 'beta'
  | 'expired'
  | 'experimental'
  | 'needs-attention';

export type IntegrationTransport = 'api' | 'mcp' | 'local';

export type CapabilityId =
  | 'mail.search'
  | 'mail.read'
  | 'mail.draft'
  | 'mail.send'
  | 'calendar.read'
  | 'calendar.availability'
  | 'calendar.create'
  | 'files.search'
  | 'files.read'
  | 'files.write'
  | 'issues.read'
  | 'issues.create'
  | 'issues.update'
  | 'design.read'
  | 'knowledge.search'
  | 'knowledge.read'
  | 'knowledge.write'
  | 'messaging.search'
  | 'messaging.post';

export type CapabilityRiskClass = 'READ' | 'WRITE' | 'EXTERNAL_ACTION' | 'DESTRUCTIVE';

export interface CapabilityRiskDefinition {
  riskClass: CapabilityRiskClass;
  requiresConfirmation: boolean;
  summary: string;
}

export const CAPABILITY_RISK_MAP: Record<CapabilityId, CapabilityRiskDefinition> = {
  'mail.search': { riskClass: 'READ', requiresConfirmation: false, summary: 'Search email messages and metadata' },
  'mail.read': { riskClass: 'READ', requiresConfirmation: false, summary: 'Read email threads and details' },
  'mail.draft': { riskClass: 'WRITE', requiresConfirmation: false, summary: 'Create or modify email drafts' },
  'mail.send': { riskClass: 'EXTERNAL_ACTION', requiresConfirmation: true, summary: 'Dispatch live emails to external recipients' },
  'calendar.read': { riskClass: 'READ', requiresConfirmation: false, summary: 'Inspect calendar schedule and events' },
  'calendar.availability': { riskClass: 'READ', requiresConfirmation: false, summary: 'Query free/busy meeting availability' },
  'calendar.create': { riskClass: 'WRITE', requiresConfirmation: false, summary: 'Schedule new calendar events' },
  'files.search': { riskClass: 'READ', requiresConfirmation: false, summary: 'Query folder and file hierarchy' },
  'files.read': { riskClass: 'READ', requiresConfirmation: false, summary: 'Read file content and metadata' },
  'files.write': { riskClass: 'DESTRUCTIVE', requiresConfirmation: true, summary: 'Upload or overwrite files in cloud storage' },
  'issues.read': { riskClass: 'READ', requiresConfirmation: false, summary: 'Read issues, tickets, and milestones' },
  'issues.create': { riskClass: 'WRITE', requiresConfirmation: false, summary: 'Create issues and development tasks' },
  'issues.update': { riskClass: 'WRITE', requiresConfirmation: false, summary: 'Modify issue state or labels' },
  'design.read': { riskClass: 'READ', requiresConfirmation: false, summary: 'Read canvas frames, tokens, and assets' },
  'knowledge.search': { riskClass: 'READ', requiresConfirmation: false, summary: 'Query workspace docs and pages' },
  'knowledge.read': { riskClass: 'READ', requiresConfirmation: false, summary: 'Read workspace documentation' },
  'knowledge.write': { riskClass: 'WRITE', requiresConfirmation: false, summary: 'Create or edit documentation pages' },
  'messaging.search': { riskClass: 'READ', requiresConfirmation: false, summary: 'Search team chat channels and messages' },
  'messaging.post': { riskClass: 'EXTERNAL_ACTION', requiresConfirmation: true, summary: 'Post messages to team channels' },
};

export interface AgentAccessConfig {
  enabled: boolean;
  allowedCapabilities: CapabilityId[];
  elevatedConfirmed?: boolean;
}

export interface IntegrationError {
  code: string;
  message: string;
  category?: string;
  retryable?: boolean;
  userAction?: string;
}

export interface IntegrationDefinition {
  id: string;
  name: string;
  description: string;
  category: IntegrationCategory;
  logo: string;
  website: string;
  status: IntegrationStatus;
  transports: IntegrationTransport[];
  primaryTransport: IntegrationTransport;
  capabilities: CapabilityId[];
  authType: 'oauth2' | 'apiKey' | 'token' | 'mcp-oauth' | 'none';
  scopes: string[];
  agentAccessSupported: boolean;
  mcpDetails?: {
    supportLevel: 'production' | 'preview' | 'experimental' | 'restricted';
    serverUrl?: string;
    notes?: string;
  };
  apiDetails?: {
    endpoint?: string;
    docUrl?: string;
  };
}

export interface IntegrationConnection {
  integrationId: string;
  state: IntegrationStatus;
  accountLabel?: string;
  accountEmail?: string;
  connectedAt?: string;
  lastCheckedAt?: string;
  grantedScopes: string[];
  transport: IntegrationTransport;
  agentAccess: AgentAccessConfig;
  error?: IntegrationError;
  metadata?: Record<string, unknown>;
}

export interface IntegrationDefinitionWithStatus extends IntegrationDefinition {
  connection?: IntegrationConnection | null;
}

interface DesktopIntegrationsBridge {
  listDefinitions: () => Promise<IntegrationDefinitionWithStatus[]>;
  getConnection: (id: string) => Promise<IntegrationConnection | null>;
  connect: (id: string, options?: Record<string, unknown>) => Promise<{
    success: boolean;
    connection?: IntegrationConnection;
    error?: IntegrationError;
  }>;
  cancelConnect?: (id: string) => Promise<{
    success: boolean;
    error?: IntegrationError;
  }>;
  disconnect: (id: string) => Promise<{
    success: boolean;
    connection?: IntegrationConnection;
    error?: IntegrationError;
  }>;
  testConnection: (id: string) => Promise<{
    success: boolean;
    latencyMs?: number;
    error?: IntegrationError;
  }>;
  checkHealth?: (id?: string, forceRefresh?: boolean) => Promise<{
    status: IntegrationStatus;
    reachable: boolean;
    latencyMs?: number;
    error?: IntegrationError;
    cached?: boolean;
    checkedAt: string;
  } | Record<string, unknown>>;
  reconnect?: (id: string) => Promise<{
    success: boolean;
    connection?: IntegrationConnection;
    error?: IntegrationError;
  }>;
  updateAgentAccess: (id: string, access: AgentAccessConfig) => Promise<{
    success: boolean;
    connection?: IntegrationConnection;
    error?: IntegrationError;
  }>;
  executeCapability: (capabilityId: CapabilityId, params?: Record<string, unknown>) => Promise<{
    success: boolean;
    requiresConfirmation?: boolean;
    riskClass?: CapabilityRiskClass;
    data?: unknown;
    error?: IntegrationError;
  }>;
  connectAll?: (options?: Record<string, unknown>) => Promise<{
    success: boolean;
    connectedCount?: number;
    totalCount?: number;
    results?: any[];
    error?: IntegrationError;
  }>;
  disconnectAll?: () => Promise<{
    success: boolean;
    results?: any[];
    error?: IntegrationError;
  }>;
}

function getDesktopBridge(): DesktopIntegrationsBridge | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    syntaflowDesktop?: { integrations?: DesktopIntegrationsBridge };
    coreDeskDesktop?: { integrations?: DesktopIntegrationsBridge };
  };
  return w.syntaflowDesktop?.integrations ?? w.coreDeskDesktop?.integrations ?? null;
}

// In-memory fallback definitions for standalone browser preview mode
const BROWSER_FALLBACK_DEFINITIONS: IntegrationDefinitionWithStatus[] = [
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    description: 'Calendar scheduling & availability sync',
    category: 'Calendar',
    logo: 'google-calendar',
    website: 'https://calendar.google.com',
    status: 'disconnected',
    transports: ['api', 'mcp'],
    primaryTransport: 'api',
    capabilities: ['calendar.read', 'calendar.availability', 'calendar.create'],
    authType: 'oauth2',
    scopes: [
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/calendar.events',
    ],
    agentAccessSupported: true,
    mcpDetails: { supportLevel: 'preview', notes: 'Google Calendar MCP Developer Preview' },
  },
  {
    id: 'calendly',
    name: 'Calendly',
    description: 'Scheduling links & client booking automation',
    category: 'Calendar',
    logo: 'calendly',
    website: 'https://calendly.com',
    status: 'test',
    transports: ['mcp', 'api'],
    primaryTransport: 'mcp',
    capabilities: ['calendar.read', 'calendar.availability'],
    authType: 'mcp-oauth',
    scopes: ['default'],
    agentAccessSupported: true,
    mcpDetails: { supportLevel: 'production', notes: 'Official hosted Calendly MCP server' },
  },
  {
    id: 'zoom',
    name: 'Zoom',
    description: 'Video meeting creation & conferencing links',
    category: 'Calendar',
    logo: 'zoom',
    website: 'https://zoom.us',
    status: 'coming-soon',
    transports: ['api'],
    primaryTransport: 'api',
    capabilities: ['calendar.create'],
    authType: 'oauth2',
    scopes: ['meeting:write'],
    agentAccessSupported: true,
  },
  {
    id: 'gmail',
    name: 'Gmail',
    description: 'Email threads, drafts & delivery dispatches',
    category: 'Communication',
    logo: 'gmail',
    website: 'https://mail.google.com',
    status: 'disconnected',
    transports: ['api', 'mcp'],
    primaryTransport: 'api',
    capabilities: ['mail.search', 'mail.read', 'mail.draft', 'mail.send'],
    authType: 'oauth2',
    scopes: [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.compose',
    ],
    agentAccessSupported: true,
    mcpDetails: { supportLevel: 'preview', notes: 'Google Workspace Gmail MCP Preview' },
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Project discussions, updates & alerts',
    category: 'Communication',
    logo: 'slack',
    website: 'https://slack.com',
    status: 'test',
    transports: ['mcp', 'api'],
    primaryTransport: 'mcp',
    capabilities: ['messaging.search', 'messaging.post'],
    authType: 'oauth2',
    scopes: ['channels:read', 'chat:write'],
    agentAccessSupported: true,
    mcpDetails: { supportLevel: 'production', notes: 'Official Slack MCP integration' },
  },
  {
    id: 'outlook',
    name: 'Microsoft Outlook',
    description: 'Exchange email & Microsoft 365 communication',
    category: 'Communication',
    logo: 'outlook',
    website: 'https://outlook.live.com',
    status: 'coming-soon',
    transports: ['api'],
    primaryTransport: 'api',
    capabilities: ['mail.read', 'mail.draft', 'mail.send'],
    authType: 'oauth2',
    scopes: ['Mail.Read', 'Mail.Send'],
    agentAccessSupported: true,
  },
  {
    id: 'google-drive',
    name: 'Google Drive',
    description: 'Deliverables storage & shared asset folders',
    category: 'Files',
    logo: 'google-drive',
    website: 'https://drive.google.com',
    status: 'disconnected',
    transports: ['api', 'mcp'],
    primaryTransport: 'api',
    capabilities: ['files.search', 'files.read', 'files.write'],
    authType: 'oauth2',
    scopes: ['https://www.googleapis.com/auth/drive.file'],
    agentAccessSupported: true,
  },
  {
    id: 'onedrive',
    name: 'Microsoft OneDrive',
    description: 'Enterprise document sync & SharePoint files',
    category: 'Files',
    logo: 'onedrive',
    website: 'https://onedrive.live.com',
    status: 'coming-soon',
    transports: ['api'],
    primaryTransport: 'api',
    capabilities: ['files.search', 'files.read', 'files.write'],
    authType: 'oauth2',
    scopes: ['Files.ReadWrite'],
    agentAccessSupported: true,
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    description: 'Cloud file sharing & deliverable archive sync',
    category: 'Files',
    logo: 'dropbox',
    website: 'https://dropbox.com',
    status: 'coming-soon',
    transports: ['api'],
    primaryTransport: 'api',
    capabilities: ['files.search', 'files.read', 'files.write'],
    authType: 'oauth2',
    scopes: ['files.content.write'],
    agentAccessSupported: true,
  },
  {
    id: 'figma',
    name: 'Figma',
    description: 'Design canvas preview & token extraction',
    category: 'Design',
    logo: 'figma',
    website: 'https://figma.com',
    status: 'test',
    transports: ['api'],
    primaryTransport: 'api',
    capabilities: ['design.read'],
    authType: 'oauth2',
    scopes: ['files:read'],
    agentAccessSupported: true,
    mcpDetails: { supportLevel: 'restricted', notes: 'Figma MCP catalog restricted to verified partners' },
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Workspace wikis, docs & client requirements sync',
    category: 'Knowledge',
    logo: 'notion',
    website: 'https://notion.so',
    status: 'test',
    transports: ['mcp', 'api'],
    primaryTransport: 'mcp',
    capabilities: ['knowledge.search', 'knowledge.read', 'knowledge.write'],
    authType: 'oauth2',
    scopes: ['read_content', 'update_content'],
    agentAccessSupported: true,
    mcpDetails: { supportLevel: 'production', notes: 'Official Notion MCP server' },
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Repository inspect, code review & PR tracking',
    category: 'Development',
    logo: 'github',
    website: 'https://github.com',
    status: 'disconnected',
    transports: ['mcp', 'api'],
    primaryTransport: 'mcp',
    capabilities: ['issues.read', 'issues.create', 'issues.update', 'files.read'],
    authType: 'token',
    scopes: ['repo', 'read:user'],
    agentAccessSupported: true,
    mcpDetails: { supportLevel: 'production', notes: 'Official GitHub MCP integration' },
  },
  {
    id: 'linear',
    name: 'Linear',
    description: 'High-speed issue tracking & milestone roadmaps',
    category: 'Development',
    logo: 'linear',
    website: 'https://linear.app',
    status: 'test',
    transports: ['mcp', 'api'],
    primaryTransport: 'mcp',
    capabilities: ['issues.read', 'issues.create', 'issues.update'],
    authType: 'oauth2',
    scopes: ['read', 'write'],
    agentAccessSupported: true,
    mcpDetails: { supportLevel: 'production', notes: 'Official Linear hosted MCP server' },
  },
  {
    id: 'google-docs',
    name: 'Google Docs',
    description: 'Collaborative client document editing & export',
    category: 'Knowledge',
    logo: 'google-docs',
    website: 'https://docs.google.com',
    status: 'coming-soon',
    transports: ['api', 'mcp'],
    primaryTransport: 'api',
    capabilities: ['knowledge.read', 'knowledge.write'],
    authType: 'oauth2',
    scopes: ['https://www.googleapis.com/auth/documents'],
    agentAccessSupported: true,
    mcpDetails: { supportLevel: 'preview', notes: 'Google Workspace Docs MCP Preview' },
  },
  {
    id: 'google-sheets',
    name: 'Google Sheets',
    description: 'Commercial budgets & financial runways sync',
    category: 'Knowledge',
    logo: 'google-sheets',
    website: 'https://sheets.google.com',
    status: 'coming-soon',
    transports: ['api', 'mcp'],
    primaryTransport: 'api',
    capabilities: ['knowledge.read', 'knowledge.write'],
    authType: 'oauth2',
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    agentAccessSupported: true,
    mcpDetails: { supportLevel: 'preview', notes: 'Google Workspace Sheets MCP Preview' },
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Client retainer billing & invoice reconciliation',
    category: 'Development',
    logo: 'stripe',
    website: 'https://stripe.com',
    status: 'coming-soon',
    transports: ['api'],
    primaryTransport: 'api',
    capabilities: [],
    authType: 'apiKey',
    scopes: ['read_write'],
    agentAccessSupported: false,
    apiDetails: {
      endpoint: 'https://api.stripe.com/v1',
      docUrl: 'https://stripe.com/docs/api',
    },
  },
];

const mockConnections = new Map<string, IntegrationConnection>();

class IntegrationsServiceClient {
  async listDefinitions(): Promise<IntegrationDefinitionWithStatus[]> {
    const bridge = getDesktopBridge();
    if (bridge) {
      return await bridge.listDefinitions();
    }
    return BROWSER_FALLBACK_DEFINITIONS.map((def) => {
      const conn = mockConnections.get(def.id);
      return {
        ...def,
        status: conn ? conn.state : def.status,
        connection: conn || null,
      };
    });
  }

  async getConnection(id: string): Promise<IntegrationConnection | null> {
    const bridge = getDesktopBridge();
    if (bridge) {
      return await bridge.getConnection(id);
    }
    return mockConnections.get(id) || null;
  }

  async connect(
    id: string,
    options?: Record<string, unknown>
  ): Promise<{ success: boolean; connection?: IntegrationConnection; error?: IntegrationError }> {
    const bridge = getDesktopBridge();
    if (bridge) {
      return await bridge.connect(id, options);
    }

    const def = BROWSER_FALLBACK_DEFINITIONS.find((d) => d.id === id);
    if (!def) {
      return {
        success: false,
        error: { code: 'unsupported_capability', message: 'Integration not found' },
      };
    }

    const userEmail =
      (options?.accountEmail as string) ||
      (options?.email as string) ||
      (options?.simulateAccount as any)?.email ||
      'ayarlanas79@gmail.com';
    const userLabel =
      (options?.accountLabel as string) ||
      (options?.username as string) ||
      userEmail;

    const newConn: IntegrationConnection = {
      integrationId: id,
      state: 'connected',
      accountLabel: userLabel,
      accountEmail: userEmail,
      connectedAt: new Date().toISOString(),
      lastCheckedAt: new Date().toISOString(),
      grantedScopes: def.scopes,
      transport: def.primaryTransport,
      agentAccess: {
        enabled: false,
        allowedCapabilities: def.capabilities.slice(0, 2),
      },
    };
    mockConnections.set(id, newConn);
    return { success: true, connection: newConn };
  }

  async cancelConnect(id: string): Promise<{ success: boolean; error?: IntegrationError }> {
    const bridge = getDesktopBridge();
    if (bridge?.cancelConnect) {
      return await bridge.cancelConnect(id);
    }
    return { success: true };
  }

  async disconnect(
    id: string
  ): Promise<{ success: boolean; connection?: IntegrationConnection; error?: IntegrationError }> {
    const bridge = getDesktopBridge();
    if (bridge) {
      return await bridge.disconnect(id);
    }

    const existing = mockConnections.get(id);
    const updated: IntegrationConnection = {
      integrationId: id,
      state: 'disconnected',
      grantedScopes: [],
      transport: existing ? existing.transport : 'api',
      agentAccess: { enabled: false, allowedCapabilities: [] },
      lastCheckedAt: new Date().toISOString(),
    };
    mockConnections.set(id, updated);
    return { success: true, connection: updated };
  }

  async connectAll(
    options?: Record<string, unknown>
  ): Promise<{ success: boolean; connectedCount?: number; totalCount?: number; results?: any[]; error?: IntegrationError }> {
    const bridge = getDesktopBridge();
    if (bridge?.connectAll) {
      return await bridge.connectAll(options);
    }

    for (const def of BROWSER_FALLBACK_DEFINITIONS) {
      await this.connect(def.id, options);
    }
    return {
      success: true,
      connectedCount: BROWSER_FALLBACK_DEFINITIONS.length,
      totalCount: BROWSER_FALLBACK_DEFINITIONS.length,
    };
  }

  async disconnectAll(): Promise<{ success: boolean; results?: any[] }> {
    const bridge = getDesktopBridge();
    if (bridge?.disconnectAll) {
      return await bridge.disconnectAll();
    }

    for (const id of Array.from(mockConnections.keys())) {
      await this.disconnect(id);
    }
    return { success: true };
  }

  async testConnection(
    id: string
  ): Promise<{ success: boolean; latencyMs?: number; error?: IntegrationError }> {
    const bridge = getDesktopBridge();
    if (bridge) {
      return await bridge.testConnection(id);
    }

    const conn = mockConnections.get(id);
    if (!conn || conn.state !== 'connected') {
      return {
        success: false,
        error: { code: 'authorization_failed', message: 'Service is not connected' },
      };
    }
    conn.lastCheckedAt = new Date().toISOString();
    return { success: true, latencyMs: 16 };
  }

  async checkHealth(
    id?: string,
    forceRefresh?: boolean
  ): Promise<Record<string, unknown> | { status: IntegrationStatus; reachable: boolean; latencyMs?: number; error?: IntegrationError; checkedAt: string }> {
    const bridge = getDesktopBridge();
    if (bridge?.checkHealth) {
      return (await bridge.checkHealth(id, forceRefresh)) as Record<string, unknown>;
    }

    if (id) {
      const conn = mockConnections.get(id);
      return {
        status: conn?.state ?? 'disconnected',
        reachable: conn?.state === 'connected',
        latencyMs: 16,
        checkedAt: new Date().toISOString(),
      };
    }

    const res: Record<string, unknown> = {};
    for (const def of BROWSER_FALLBACK_DEFINITIONS) {
      const conn = mockConnections.get(def.id);
      res[def.id] = {
        status: conn?.state ?? def.status,
        reachable: conn?.state === 'connected',
        latencyMs: 16,
        checkedAt: new Date().toISOString(),
      };
    }
    return res;
  }

  async reconnect(
    id: string
  ): Promise<{ success: boolean; connection?: IntegrationConnection; error?: IntegrationError }> {
    const bridge = getDesktopBridge();
    if (bridge?.reconnect) {
      return await bridge.reconnect(id);
    }
    return this.connect(id);
  }

  async updateAgentAccess(
    id: string,
    access: AgentAccessConfig
  ): Promise<{ success: boolean; connection?: IntegrationConnection; error?: IntegrationError }> {
    const bridge = getDesktopBridge();
    if (bridge) {
      return await bridge.updateAgentAccess(id, access);
    }

    const conn = mockConnections.get(id);
    if (!conn) {
      return { success: false, error: { code: 'provider_unavailable', message: 'Not connected' } };
    }
    conn.agentAccess = access;
    return { success: true, connection: conn };
  }

  async executeCapability(
    capabilityId: CapabilityId,
    params?: Record<string, unknown>
  ): Promise<{
    success: boolean;
    requiresConfirmation?: boolean;
    riskClass?: CapabilityRiskClass;
    data?: unknown;
    error?: IntegrationError;
  }> {
    const bridge = getDesktopBridge();
    if (bridge) {
      return await bridge.executeCapability(capabilityId, params);
    }

    const riskDef = CAPABILITY_RISK_MAP[capabilityId];
    if (riskDef?.requiresConfirmation && !params?._confirmedByHuman) {
      return {
        success: false,
        requiresConfirmation: true,
        riskClass: riskDef.riskClass,
        error: {
          code: 'human_confirmation_required',
          message: `Human confirmation is required to execute capability "${capabilityId}" (${riskDef.riskClass}).`,
        },
      };
    }

    return {
      success: true,
      data: { capability: capabilityId, executed: true, timestamp: new Date().toISOString() },
    };
  }
}

export const integrationsService = new IntegrationsServiceClient();
