import { describe, expect, it, vi } from 'vitest';

const { IntegrationHealthService } = require('../../apps/desktop/electron/integrations/health-service.cjs');

describe('IntegrationHealthService', () => {
  const mockVault = {
    getConnectionState: vi.fn().mockReturnValue({ state: 'connected' }),
    saveConnectionState: vi.fn(),
  };

  it('normalizes transport and socket errors to offline with network_unavailable', () => {
    const health = new IntegrationHealthService(mockVault);

    const err1 = health.normalizeError(new Error('connect ECONNREFUSED 127.0.0.1:443'));
    expect(err1.status).toBe('offline');
    expect(err1.error.code).toBe('network_unavailable');
    expect(err1.error.retryable).toBe(true);

    const err2 = health.normalizeError(new Error('fetch failed'));
    expect(err2.status).toBe('offline');
    expect(err2.error.code).toBe('network_unavailable');

    const err3 = health.normalizeError(new Error('getaddrinfo ENOTFOUND api.github.com'));
    expect(err3.status).toBe('offline');
    expect(err3.error.code).toBe('network_unavailable');
  });

  it('normalizes 401 and invalid_grant to auth-expired with auth_expired', () => {
    const health = new IntegrationHealthService(mockVault);

    const err1 = health.normalizeError(new Error('Request failed with status 401'), 401);
    expect(err1.status).toBe('auth-expired');
    expect(err1.error.code).toBe('auth_expired');
    expect(err1.error.retryable).toBe(false);

    const err2 = health.normalizeError(new Error('OAuth error: invalid_grant - token has been revoked'));
    expect(err2.status).toBe('auth-expired');
    expect(err2.error.code).toBe('auth_expired');
  });

  it('normalizes 403 and insufficient scopes to permission-required', () => {
    const health = new IntegrationHealthService(mockVault);

    const err1 = health.normalizeError(new Error('Access denied: insufficient_scope'), 403);
    expect(err1.status).toBe('permission-required');
    expect(err1.error.code).toBe('permission_required');
    expect(err1.error.retryable).toBe(false);
  });

  it('normalizes 502/503 and server maintenance to degraded with provider_unavailable', () => {
    const health = new IntegrationHealthService(mockVault);

    const err1 = health.normalizeError(new Error('HTTP 502 Bad Gateway'), 502);
    expect(err1.status).toBe('degraded');
    expect(err1.error.code).toBe('provider_unavailable');
    expect(err1.error.retryable).toBe(true);

    const err2 = health.normalizeError(new Error('HTTP 503 Service Unavailable'), 503);
    expect(err2.status).toBe('degraded');
    expect(err2.error.code).toBe('provider_unavailable');
  });

  it('respects freshness window to prevent aggressive API hammering', async () => {
    const health = new IntegrationHealthService(mockVault, { freshnessMs: 30000 });
    let calls = 0;

    const mockProvider = {
      integrationId: 'google-calendar',
      testConnection: async () => {
        calls++;
        return { success: true, latencyMs: 18 };
      },
    };

    // First check executes
    const res1 = await health.checkHealth(mockProvider);
    expect(res1.status).toBe('connected');
    expect(calls).toBe(1);

    // Second check within freshness window reuses cached result
    const res2 = await health.checkHealth(mockProvider);
    expect(res2.status).toBe('connected');
    expect(calls).toBe(1); // Provider NOT called again

    // Forcing refresh bypasses cache
    const res3 = await health.checkHealth(mockProvider, true);
    expect(res3.status).toBe('connected');
    expect(calls).toBe(2);
  });

  it('applies exponential backoff to offline and degraded providers', async () => {
    const health = new IntegrationHealthService(mockVault, { freshnessMs: 10 });
    let calls = 0;

    const mockProvider = {
      integrationId: 'failing-service',
      testConnection: async () => {
        calls++;
        throw new Error('connect ECONNREFUSED 127.0.0.1:443');
      },
    };

    const res1 = await health.checkHealth(mockProvider);
    expect(res1.status).toBe('offline');
    expect(calls).toBe(1);

    // Immediate subsequent check without force is suppressed by backoff
    const res2 = await health.checkHealth(mockProvider);
    expect(res2.status).toBe('offline');
    expect(calls).toBe(1);
  });
});
