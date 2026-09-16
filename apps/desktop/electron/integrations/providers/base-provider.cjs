/**
 * Syntaflow Base Integration Provider
 *
 * Defines the contract that all vendor and service adapters must implement.
 *
 * Enforces:
 * - Isolation: Never expose raw auth headers or tokens to caller
 * - Sanitized results and safe error envelopes
 * - Standardized lifecycle methods
 */

class BaseProvider {
  constructor(integrationId, vault, oauthManager) {
    this.integrationId = integrationId;
    this.vault = vault;
    this.oauthManager = oauthManager;
  }

  /**
   * Returns current safe connection status from vault.
   */
  async getStatus() {
    const connection = this.vault.getConnectionState(this.integrationId);
    if (!connection) {
      return {
        integrationId: this.integrationId,
        state: 'disconnected',
        grantedScopes: [],
        transport: 'api',
        agentAccess: { enabled: false, allowedCapabilities: [] },
      };
    }
    return connection;
  }

  /**
   * Retrieves safe account summary (e.g. email, workspace, display name).
   */
  async getAccountSummary() {
    const conn = await this.getStatus();
    return {
      accountLabel: conn.accountLabel || null,
      accountEmail: conn.accountEmail || null,
      state: conn.state,
    };
  }

  /**
   * Connects the provider. Implemented by subclasses.
   */
  async connect(_options = {}) {
    throw new Error(`connect() not implemented for ${this.integrationId}`);
  }

  /**
   * Disconnects the provider, revoking tokens and wiping credentials.
   */
  async disconnect() {
    // If an authorization is pending, cancel it
    this.cancelAuthorization();
    const updated = this.vault.disconnect(this.integrationId);
    return {
      success: true,
      connection: updated,
    };
  }

  /**
   * Cancels in-flight authorization for this provider.
   */
  cancelAuthorization() {
    if (this.oauthManager && typeof this.oauthManager.cancelAuthorization === 'function') {
      return this.oauthManager.cancelAuthorization(this.integrationId);
    }
    return false;
  }

  /**
   * Verifies live provider connection. Implemented by subclasses.
   */
  async testConnection() {
    throw new Error(`testConnection() not implemented for ${this.integrationId}`);
  }

  /**
   * Concurrently locks token refresh for this provider instance.
   * If a refresh is already in progress, concurrent callers await the same promise.
   */
  async withTokenRefreshLock(refreshFn) {
    if (this._inFlightRefresh) {
      return await this._inFlightRefresh;
    }

    this._inFlightRefresh = (async () => {
      try {
        return await refreshFn();
      } finally {
        this._inFlightRefresh = null;
      }
    })();

    return await this._inFlightRefresh;
  }

  /**
   * Refreshes Google OAuth tokens with concurrency deduplication.
   * Distinguishes 401/invalid_grant (auth-expired) from network failure (network_unavailable).
   */
  async refreshGoogleTokens(clientId, clientSecret) {
    return await this.withTokenRefreshLock(async () => {
      const tokens = this.vault.getTokens(this.integrationId);
      if (!tokens || !tokens.refreshToken) {
        const conn = this.vault.getConnectionState(this.integrationId);
        if (conn) {
          conn.state = 'auth-expired';
          conn.error = {
            code: 'auth_expired',
            message: 'No refresh token stored. Re-authentication required.',
          };
          this.vault.saveConnectionState(this.integrationId, conn);
        }
        return { success: false, error: { code: 'auth_expired', message: 'No refresh token' } };
      }

      const body = new URLSearchParams();
      body.set('grant_type', 'refresh_token');
      body.set('refresh_token', tokens.refreshToken);
      body.set('client_id', clientId);
      if (clientSecret) body.set('client_secret', clientSecret);

      try {
        const res = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: body.toString(),
        });

        if (!res.ok) {
          const errText = await res.text();
          if (res.status === 400 || res.status === 401) {
            const conn = this.vault.getConnectionState(this.integrationId);
            if (conn) {
              conn.state = 'auth-expired';
              conn.error = {
                code: 'auth_expired',
                message: 'OAuth refresh token expired or revoked. Please re-authenticate.',
              };
              this.vault.saveConnectionState(this.integrationId, conn);
            }
            return {
              success: false,
              error: { code: 'auth_expired', message: `Token refresh rejected: ${errText.slice(0, 100)}` },
            };
          }

          return {
            success: false,
            error: { code: 'provider_unavailable', message: `Refresh endpoint error (${res.status})` },
          };
        }

        const data = await res.json();
        const updatedTokens = {
          ...tokens,
          accessToken: data.access_token,
          expiresIn: data.expires_in,
          tokenType: data.token_type || 'Bearer',
        };
        if (data.refresh_token) {
          updatedTokens.refreshToken = data.refresh_token;
        }
        this.vault.saveTokens(this.integrationId, updatedTokens);

        const conn = this.vault.getConnectionState(this.integrationId);
        if (conn && conn.state === 'auth-expired') {
          conn.state = 'connected';
          delete conn.error;
          this.vault.saveConnectionState(this.integrationId, conn);
        }

        return { success: true, tokens: updatedTokens };
      } catch (networkErr) {
        return {
          success: false,
          error: {
            code: 'network_unavailable',
            message: `Network failure refreshing token: ${networkErr.message}`,
          },
        };
      }
    });
  }

  /**
   * Executes a normalized capability (e.g. 'calendar.read', 'mail.draft').
   */
  async executeCapability(_capabilityId, _params = {}) {
    return {
      success: false,
      error: {
        code: 'unsupported_capability',
        message: `Capability ${_capabilityId} is not supported by ${this.integrationId}`,
      },
    };
  }
}

module.exports = {
  BaseProvider,
};
