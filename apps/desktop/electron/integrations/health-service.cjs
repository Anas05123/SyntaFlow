/**
 * Syntaflow Integration Health & Connectivity Service
 *
 * Centralized operational monitoring situated exclusively in the Electron main process.
 *
 * Responsibilities:
 * - Normalizes network and protocol errors into typed Syntaflow statuses
 *   (offline, auth-expired, permission-required, degraded, error, connected)
 * - Implements non-aggressive freshness caching (30-60s) to prevent vendor rate-limits
 * - Enforces fast timeouts on health pings (3.5s max)
 * - Exponential backoff scheduling for degraded/offline providers
 * - Shields renderer from raw Node network exception details
 */

class IntegrationHealthService {
  constructor(vault, options = {}) {
    this.vault = vault;
    this.freshnessMs = options.freshnessMs || 45000; // 45 seconds default
    this.timeoutMs = options.timeoutMs || 3500; // 3.5 seconds default ping timeout
    this.healthCache = new Map(); // id -> { result, cachedAt }
    this.backoffState = new Map(); // id -> { failureCount, nextEligibleTime }
  }

  /**
   * Normalizes an exception or HTTP status code into a canonical status and error envelope.
   */
  normalizeError(error, statusCode = null) {
    const message = error && error.message ? error.message : String(error || 'Unknown error');
    const msgLower = message.toLowerCase();

    // 1. Network / Transport Outage -> 'offline'
    if (
      msgLower.includes('econnrefused') ||
      msgLower.includes('econnreset') ||
      msgLower.includes('enotfound') ||
      msgLower.includes('etimedout') ||
      msgLower.includes('network error') ||
      msgLower.includes('fetch failed') ||
      msgLower.includes('failed to fetch') ||
      msgLower.includes('socket hang up')
    ) {
      return {
        status: 'offline',
        error: {
          code: 'network_unavailable',
          message: 'Endpoint unreachable or network connection offline',
          retryable: true,
          userAction: 'Check your internet connection or server availability and retry.',
        },
      };
    }

    // 2. Authentication Expired / Revoked -> 'auth-expired'
    if (
      statusCode === 401 ||
      msgLower.includes('401') ||
      msgLower.includes('token_expired') ||
      msgLower.includes('invalid_grant') ||
      msgLower.includes('unauthorized') ||
      msgLower.includes('revoked')
    ) {
      return {
        status: 'auth-expired',
        error: {
          code: 'auth_expired',
          message: 'Authorization expired or revoked by vendor',
          retryable: false,
          userAction: 'Re-authenticate with provider to grant new access tokens.',
        },
      };
    }

    // 3. Permission / Scope Denied -> 'permission-required'
    if (
      statusCode === 403 ||
      msgLower.includes('403') ||
      msgLower.includes('insufficient_scope') ||
      msgLower.includes('permission_denied') ||
      msgLower.includes('forbidden')
    ) {
      return {
        status: 'permission-required',
        error: {
          code: 'permission_required',
          message: 'Account does not have the required permissions or scopes',
          retryable: false,
          userAction: 'Verify vendor account permissions or re-connect with requested scopes.',
        },
      };
    }

    // 4. Rate Limited -> 'degraded'
    if (statusCode === 429 || msgLower.includes('429') || msgLower.includes('rate_limit')) {
      return {
        status: 'degraded',
        error: {
          code: 'rate_limited',
          message: 'Vendor API rate limit reached',
          retryable: true,
          userAction: 'Wait a few moments before sending additional requests.',
        },
      };
    }

    // 5. Vendor Service Degraded -> 'degraded'
    if (
      (statusCode && statusCode >= 500) ||
      msgLower.includes('502') ||
      msgLower.includes('503') ||
      msgLower.includes('504') ||
      msgLower.includes('bad gateway') ||
      msgLower.includes('service unavailable')
    ) {
      return {
        status: 'degraded',
        error: {
          code: 'provider_unavailable',
          message: 'Vendor service is currently degraded or undergoing maintenance',
          retryable: true,
          userAction: 'Try again later while provider recovers.',
        },
      };
    }

    // 6. Generic error -> 'error'
    return {
      status: 'error',
      error: {
        code: 'system',
        message: message.slice(0, 300),
        retryable: true,
      },
    };
  }

  /**
   * Executes a timed health check against an integration provider.
   * Respects freshness cache to avoid aggressive polling.
   */
  async checkHealth(provider, forceRefresh = false) {
    if (!provider) return null;
    const integrationId = provider.integrationId;

    const now = Date.now();
    const cached = this.healthCache.get(integrationId);

    // Freshness cache check
    if (!forceRefresh && cached && now - cached.cachedAt < this.freshnessMs) {
      return cached.result;
    }

    // Backoff check for degraded/offline providers
    const backoff = this.backoffState.get(integrationId);
    if (!forceRefresh && backoff && now < backoff.nextEligibleTime) {
      return (
        cached?.result || {
          status: 'offline',
          checkedAt: new Date(cached?.cachedAt || now).toISOString(),
          error: {
            code: 'network_unavailable',
            message: 'In exponential backoff cooldown',
            retryable: true,
          },
        }
      );
    }

    // Execute health test with timeout race
    const startTime = Date.now();
    let timeoutHandle;

    try {
      const timeoutPromise = new Promise((_, reject) => {
        timeoutHandle = setTimeout(() => {
          reject(new Error('Health check timed out (ETIMEDOUT)'));
        }, this.timeoutMs);
      });

      const checkPromise = provider.testConnection();
      const rawResult = await Promise.race([checkPromise, timeoutPromise]);
      clearTimeout(timeoutHandle);

      const latencyMs = Date.now() - startTime;

      if (rawResult && rawResult.success) {
        // Clear backoff on success
        this.backoffState.delete(integrationId);

        const result = {
          status: 'connected',
          latencyMs: rawResult.latencyMs || latencyMs,
          checkedAt: new Date().toISOString(),
        };

        this.healthCache.set(integrationId, { result, cachedAt: now });

        // Update vault state if it was degraded/offline
        const conn = this.vault ? this.vault.getConnectionState(integrationId) : null;
        if (conn && conn.state !== 'connected') {
          conn.state = 'connected';
          conn.lastCheckedAt = result.checkedAt;
          delete conn.error;
          this.vault.saveConnectionState(integrationId, conn);
        }

        return result;
      }

      // Handled failure from provider
      const normalized = this.normalizeError(
        rawResult?.error || 'Connection check failed'
      );
      this._recordFailure(integrationId);

      const result = {
        status: normalized.status,
        latencyMs,
        checkedAt: new Date().toISOString(),
        error: normalized.error,
      };

      this.healthCache.set(integrationId, { result, cachedAt: now });

      // Update vault connection status to reflect degraded/offline/auth-expired
      const conn = this.vault ? this.vault.getConnectionState(integrationId) : null;
      if (conn) {
        conn.state = normalized.status;
        conn.lastCheckedAt = result.checkedAt;
        conn.error = normalized.error;
        this.vault.saveConnectionState(integrationId, conn);
      }

      return result;
    } catch (err) {
      if (timeoutHandle) clearTimeout(timeoutHandle);
      const latencyMs = Date.now() - startTime;
      const normalized = this.normalizeError(err);
      this._recordFailure(integrationId);

      const result = {
        status: normalized.status,
        latencyMs,
        checkedAt: new Date().toISOString(),
        error: normalized.error,
      };

      this.healthCache.set(integrationId, { result, cachedAt: now });

      const conn = this.vault ? this.vault.getConnectionState(integrationId) : null;
      if (conn) {
        conn.state = normalized.status;
        conn.lastCheckedAt = result.checkedAt;
        conn.error = normalized.error;
        this.vault.saveConnectionState(integrationId, conn);
      }

      return result;
    }
  }

  _recordFailure(integrationId) {
    const current = this.backoffState.get(integrationId) || { failureCount: 0 };
    const failureCount = current.failureCount + 1;
    // Exponential backoff: 5s, 10s, 20s, 40s, 80s, max 300s (5 min)
    const delaySeconds = Math.min(300, 5 * Math.pow(2, Math.min(failureCount - 1, 6)));
    this.backoffState.set(integrationId, {
      failureCount,
      nextEligibleTime: Date.now() + delaySeconds * 1000,
    });
  }

  invalidateCache(integrationId) {
    if (integrationId) {
      this.healthCache.delete(integrationId);
      this.backoffState.delete(integrationId);
    } else {
      this.healthCache.clear();
      this.backoffState.clear();
    }
  }
}

module.exports = {
  IntegrationHealthService,
};
