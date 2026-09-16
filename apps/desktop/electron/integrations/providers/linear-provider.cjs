/**
 * Syntaflow Linear TEST Provider
 *
 * Implements Linear issue tracking and development cycles in TEST phase.
 *
 * Capabilities:
 * - issues.read (READ)
 * - issues.create (WRITE)
 * - issues.update (WRITE)
 */

const { BaseProvider } = require('./base-provider.cjs');

const LINEAR_GRAPHQL_ENDPOINT = 'https://api.linear.app/graphql';

class LinearProvider extends BaseProvider {
  constructor(vault, oauthManager) {
    super('linear', vault, oauthManager);
  }

  async connect(options = {}) {
    const apiKey = options.apiKey || options.token || 'simulated_linear_api_key';
    const teamName = options.teamName || (options.simulateAccount ? options.simulateAccount.team : 'Syntaflow Engineering');

    this.vault.saveTokens(this.integrationId, {
      accessToken: apiKey,
      tokenType: 'Bearer',
    });

    const connection = this.vault.saveConnectionState(this.integrationId, {
      state: 'connected',
      accountLabel: teamName,
      accountEmail: options.simulateAccount ? options.simulateAccount.email : 'eng@syntaflow.io',
      connectedAt: new Date().toISOString(),
      lastCheckedAt: new Date().toISOString(),
      grantedScopes: ['read', 'write', 'issues:create'],
      transport: 'api',
      agentAccess: {
        enabled: true,
        allowedCapabilities: ['issues.read', 'issues.create'],
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
          message: 'No credentials stored for Linear TEST provider',
        },
      };
    }

    if (tokens.accessToken.startsWith('simulated_')) {
      const conn = this.vault.getConnectionState(this.integrationId);
      if (conn) {
        conn.lastCheckedAt = new Date().toISOString();
        this.vault.saveConnectionState(this.integrationId, conn);
      }
      return { success: true, latencyMs: 19 };
    }

    const startTime = Date.now();
    try {
      const res = await fetch(LINEAR_GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
          Authorization: tokens.accessToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: '{ viewer { id name email } }',
        }),
      });

      const latencyMs = Date.now() - startTime;

      if (!res.ok) {
        if (res.status === 401) {
          return {
            success: false,
            error: {
              code: 'auth_expired',
              message: 'Linear API key is invalid or revoked',
            },
          };
        }
        return {
          success: false,
          error: {
            code: 'provider_unavailable',
            message: 'Linear returned status ' + res.status,
          },
        };
      }

      const body = await res.json();
      if (body.errors && body.errors.length > 0) {
        return {
          success: false,
          error: {
            code: 'authorization_failed',
            message: body.errors[0].message || 'Linear GraphQL error',
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
          message: 'Network error connecting to Linear: ' + err.message,
        },
      };
    }
  }

  async executeCapability(capabilityId, params = {}) {
    const conn = await this.getStatus();
    if (conn.state !== 'connected') {
      return {
        success: false,
        error: { code: 'authorization_failed', message: 'Linear is not connected' },
      };
    }

    const tokens = this.vault.getTokens(this.integrationId);

    switch (capabilityId) {
      case 'issues.read': {
        if (tokens && tokens.accessToken && tokens.accessToken.startsWith('simulated_')) {
          return {
            success: true,
            data: {
              issues: [
                {
                  id: 'lin_iss_001',
                  identifier: 'SYN-104',
                  title: 'Integrations production health check hardening',
                  state: { name: 'In Progress' },
                  priority: 1,
                  assignee: { name: 'Anas' },
                },
                {
                  id: 'lin_iss_002',
                  identifier: 'SYN-105',
                  title: 'Capability risk confirmation gates and audit report',
                  state: { name: 'Todo' },
                  priority: 2,
                  assignee: { name: 'Anas' },
                },
              ],
            },
          };
        }

        const query = 'query { issues(first: 10, orderBy: updatedAt) { nodes { id identifier title state { name } priority } } }';
        const res = await fetch(LINEAR_GRAPHQL_ENDPOINT, {
          method: 'POST',
          headers: {
            Authorization: tokens.accessToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query }),
        });
        if (!res.ok) {
          return { success: false, error: { code: 'provider_unavailable', message: 'Failed to query Linear issues' } };
        }
        const json = await res.json();
        return { success: true, data: { issues: json.data?.issues?.nodes || [] } };
      }

      case 'issues.create': {
        if (tokens && tokens.accessToken && tokens.accessToken.startsWith('simulated_')) {
          return {
            success: true,
            data: {
              id: 'lin_iss_' + Date.now(),
              identifier: 'SYN-' + (Math.floor(Math.random() * 900) + 100),
              title: params.title || 'New Issue',
              created: true,
            },
          };
        }

        return {
          success: true,
          data: { created: true, message: 'Linear issue created in TEST mode.' },
        };
      }

      case 'issues.update': {
        return {
          success: true,
          data: { updated: true, issueId: params.issueId, message: 'Linear issue updated in TEST mode.' },
        };
      }

      default:
        return super.executeCapability(capabilityId, params);
    }
  }
}

module.exports = {
  LinearProvider,
};
