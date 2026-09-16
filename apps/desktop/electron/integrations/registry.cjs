/**
 * Syntaflow Authoritative Integration Definitions Registry
 *
 * Full catalog of approved external vendor services across user-oriented categories:
 * - COMMUNICATION (Gmail, Outlook, Slack)
 * - CALENDAR & MEETINGS (Google Calendar, Calendly, Zoom)
 * - FILES (Google Drive, OneDrive, Dropbox)
 * - DESIGN (Figma)
 * - KNOWLEDGE (Notion)
 * - DEVELOPMENT (GitHub, Linear)
 * - UPCOMING (Google Docs, Google Sheets, Stripe)
 */

const INTEGRATION_DEFINITIONS = [
  // ─── CALENDAR & MEETINGS ──────────────────────────────────────────────────
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
      'https://www.googleapis.com/auth/userinfo.email',
    ],
    agentAccessSupported: true,
    mcpDetails: {
      supportLevel: 'preview',
      notes: 'Google Calendar MCP Developer Preview available',
    },
    apiDetails: {
      endpoint: 'https://www.googleapis.com/calendar/v3',
      docUrl: 'https://developers.google.com/calendar/api',
    },
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
    mcpDetails: {
      supportLevel: 'production',
      serverUrl: 'https://mcp.calendly.com',
      notes: 'Official hosted Calendly MCP server with OAuth 2.1',
    },
    apiDetails: {
      endpoint: 'https://api.calendly.com',
      docUrl: 'https://developer.calendly.com',
    },
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
    scopes: ['meeting:write', 'user:read'],
    agentAccessSupported: true,
    apiDetails: {
      endpoint: 'https://api.zoom.us/v2',
      docUrl: 'https://marketplace.zoom.us/docs/api-reference',
    },
  },

  // ─── COMMUNICATION ────────────────────────────────────────────────────────
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
      'https://www.googleapis.com/auth/userinfo.email',
    ],
    agentAccessSupported: true,
    mcpDetails: {
      supportLevel: 'preview',
      notes: 'Google Workspace Gmail MCP Developer Preview',
    },
    apiDetails: {
      endpoint: 'https://gmail.googleapis.com/gmail/v1',
      docUrl: 'https://developers.google.com/gmail/api',
    },
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
    scopes: ['channels:read', 'chat:write', 'search:read'],
    agentAccessSupported: true,
    mcpDetails: {
      supportLevel: 'production',
      notes: 'Official Slack MCP general availability integration',
    },
    apiDetails: {
      endpoint: 'https://slack.com/api',
      docUrl: 'https://api.slack.com',
    },
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
    scopes: ['Mail.Read', 'Mail.Send', 'User.Read'],
    agentAccessSupported: true,
    apiDetails: {
      endpoint: 'https://graph.microsoft.com/v1.0',
      docUrl: 'https://learn.microsoft.com/en-us/graph/outlook-mail-concept-overview',
    },
  },

  // ─── FILES & STORAGE ──────────────────────────────────────────────────────
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
    scopes: [
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/drive.metadata.readonly',
    ],
    agentAccessSupported: true,
    mcpDetails: {
      supportLevel: 'preview',
      notes: 'Google Drive MCP Developer Preview',
    },
    apiDetails: {
      endpoint: 'https://www.googleapis.com/drive/v3',
      docUrl: 'https://developers.google.com/drive/api',
    },
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
    scopes: ['Files.ReadWrite', 'User.Read'],
    agentAccessSupported: true,
    apiDetails: {
      endpoint: 'https://graph.microsoft.com/v1.0',
      docUrl: 'https://learn.microsoft.com/en-us/graph/api/resources/onedrive',
    },
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
    scopes: ['files.metadata.read', 'files.content.write'],
    agentAccessSupported: true,
    apiDetails: {
      endpoint: 'https://api.dropboxapi.com/2',
      docUrl: 'https://www.dropbox.com/developers/documentation',
    },
  },

  // ─── DESIGN ───────────────────────────────────────────────────────────────
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
    scopes: ['files:read', 'current_user:read'],
    agentAccessSupported: true,
    mcpDetails: {
      supportLevel: 'restricted',
      notes: 'Official Figma remote MCP requires partner catalog client eligibility. Production uses REST API.',
    },
    apiDetails: {
      endpoint: 'https://api.figma.com/v1',
      docUrl: 'https://www.figma.com/developers/api',
    },
  },

  // ─── KNOWLEDGE ────────────────────────────────────────────────────────────
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
    mcpDetails: {
      supportLevel: 'production',
      notes: 'Official Notion MCP integration for agent workflows',
    },
    apiDetails: {
      endpoint: 'https://api.notion.com/v1',
      docUrl: 'https://developers.notion.com',
    },
  },

  // ─── DEVELOPMENT ──────────────────────────────────────────────────────────
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
    mcpDetails: {
      supportLevel: 'production',
      notes: 'Official GitHub Model Context Protocol server',
    },
    apiDetails: {
      endpoint: 'https://api.github.com',
      docUrl: 'https://docs.github.com/en/rest',
    },
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
    scopes: ['read', 'write', 'issues:create'],
    agentAccessSupported: true,
    mcpDetails: {
      supportLevel: 'production',
      notes: 'Official Linear remote MCP server',
    },
    apiDetails: {
      endpoint: 'https://api.linear.app/graphql',
      docUrl: 'https://developers.linear.app',
    },
  },

  // ─── UPCOMING (PREPARED DEFINITIONS) ──────────────────────────────────────
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
    mcpDetails: {
      supportLevel: 'preview',
      notes: 'Google Workspace Docs MCP Preview',
    },
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
    mcpDetails: {
      supportLevel: 'preview',
      notes: 'Google Workspace Sheets MCP Preview',
    },
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

class IntegrationRegistry {
  static getAllDefinitions() {
    return INTEGRATION_DEFINITIONS;
  }

  static getDefinition(id) {
    return INTEGRATION_DEFINITIONS.find((def) => def.id === id) || null;
  }

  static getByCategory(category) {
    if (!category || category === 'All') return INTEGRATION_DEFINITIONS;
    return INTEGRATION_DEFINITIONS.filter((def) => def.category === category);
  }
}

module.exports = {
  INTEGRATION_DEFINITIONS,
  IntegrationRegistry,
};
