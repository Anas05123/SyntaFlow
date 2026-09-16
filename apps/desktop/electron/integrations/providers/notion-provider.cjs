/**
 * Syntaflow Notion TEST Provider
 *
 * Implements Notion workspace knowledge integration in TEST phase.
 *
 * Capabilities:
 * - knowledge.search (READ)
 * - knowledge.read (READ)
 * - knowledge.write (WRITE)
 */

const { BaseProvider } = require('./base-provider.cjs');

const NOTION_API_BASE = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

class NotionProvider extends BaseProvider {
  constructor(vault, oauthManager) {
    super('notion', vault, oauthManager);
  }

  async connect(options = {}) {
    const token = options.apiKey || options.token || 'simulated_notion_secret_token';
    const workspaceName = options.workspaceName || (options.simulateAccount ? options.simulateAccount.name : 'Syntaflow Workspace');

    this.vault.saveTokens(this.integrationId, {
      accessToken: token,
      tokenType: 'Bearer',
    });

    const connection = this.vault.saveConnectionState(this.integrationId, {
      state: 'connected',
      accountLabel: workspaceName,
      accountEmail: options.simulateAccount ? options.simulateAccount.email : 'operator@notion.internal',
      connectedAt: new Date().toISOString(),
      lastCheckedAt: new Date().toISOString(),
      grantedScopes: ['read_content', 'update_content'],
      transport: 'api',
      agentAccess: {
        enabled: true,
        allowedCapabilities: ['knowledge.search', 'knowledge.read'],
      },
    });

    return {
      success: true,
      connection,
    };
  }

  async testConnection() {
    const tokens = this.vault.getTokens(this.integrationId);
    if (!tokens || !tokens.accessToken) {
      return {
        success: false,
        error: {
          code: 'authorization_failed',
          message: 'No credentials stored for Notion TEST provider',
        },
      };
    }

    if (tokens.accessToken.startsWith('simulated_')) {
      const conn = this.vault.getConnectionState(this.integrationId);
      if (conn) {
        conn.lastCheckedAt = new Date().toISOString();
        this.vault.saveConnectionState(this.integrationId, conn);
      }
      return { success: true, latencyMs: 22 };
    }

    const startTime = Date.now();
    try {
      const res = await fetch(NOTION_API_BASE + '/users/me', {
        headers: {
          Authorization: 'Bearer ' + tokens.accessToken,
          'Notion-Version': NOTION_VERSION,
        },
      });

      const latencyMs = Date.now() - startTime;

      if (!res.ok) {
        if (res.status === 401) {
          return {
            success: false,
            error: {
              code: 'auth_expired',
              message: 'Notion API token expired or unauthorized',
            },
          };
        }
        return {
          success: false,
          error: {
            code: 'provider_unavailable',
            message: 'Notion returned status ' + res.status,
          },
        };
      }

      const conn = this.vault.getConnectionState(this.integrationId);
      if (conn) {
        conn.lastCheckedAt = new Date().toISOString();
        this.vault.saveConnectionState(this.integrationId, conn);
      }

      return { success: true, latencyMs };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'network_unavailable',
          message: 'Failed to connect to Notion: ' + err.message,
        },
      };
    }
  }

  async executeCapability(capabilityId, params = {}) {
    const conn = await this.getStatus();
    if (conn.state !== 'connected') {
      return {
        success: false,
        error: { code: 'authorization_failed', message: 'Notion is not connected' },
      };
    }

    const tokens = this.vault.getTokens(this.integrationId);

    switch (capabilityId) {
      case 'knowledge.search': {
        if (tokens && tokens.accessToken && tokens.accessToken.startsWith('simulated_')) {
          return {
            success: true,
            data: {
              results: [
                {
                  id: 'notion_page_001',
                  title: 'Brand Guidelines & Identity Architecture',
                  url: 'https://notion.so/syntaflow/brand-guidelines',
                  lastEdited: new Date().toISOString(),
                },
                {
                  id: 'notion_page_002',
                  title: 'Q3 Delivery Acceptance Criteria',
                  url: 'https://notion.so/syntaflow/acceptance-criteria',
                  lastEdited: new Date(Date.now() - 3600000).toISOString(),
                },
              ],
            },
          };
        }

        const res = await fetch(NOTION_API_BASE + '/search', {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + tokens.accessToken,
            'Notion-Version': NOTION_VERSION,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: params.query || '',
            page_size: 10,
          }),
        });
        if (!res.ok) {
          return { success: false, error: { code: 'provider_unavailable', message: 'Failed to search Notion' } };
        }
        const data = await res.json();
        return { success: true, data };
      }

      case 'knowledge.read': {
        if (tokens && tokens.accessToken && tokens.accessToken.startsWith('simulated_')) {
          return {
            success: true,
            data: {
              pageId: params.pageId || 'notion_page_001',
              title: 'Brand Guidelines & Identity Architecture',
              content: 'Syntaflow represents precision and intelligence in flow.',
              lastEdited: new Date().toISOString(),
            },
          };
        }

        const pageId = params.pageId;
        if (!pageId) {
          return { success: false, error: { code: 'unsupported_capability', message: 'pageId required for knowledge.read' } };
        }
        const res = await fetch(NOTION_API_BASE + '/pages/' + encodeURIComponent(pageId), {
          headers: {
            Authorization: 'Bearer ' + tokens.accessToken,
            'Notion-Version': NOTION_VERSION,
          },
        });
        if (!res.ok) {
          return { success: false, error: { code: 'provider_unavailable', message: 'Failed to read Notion page' } };
        }
        const data = await res.json();
        return { success: true, data };
      }

      case 'knowledge.write': {
        if (tokens && tokens.accessToken && tokens.accessToken.startsWith('simulated_')) {
          return {
            success: true,
            data: {
              id: 'notion_page_' + Date.now(),
              title: params.title || 'New Operational Note',
              created: true,
              timestamp: new Date().toISOString(),
            },
          };
        }

        return {
          success: true,
          data: { created: true, message: 'Notion write request received in TEST mode.' },
        };
      }

      default:
        return super.executeCapability(capabilityId, params);
    }
  }
}

module.exports = {
  NotionProvider,
};
