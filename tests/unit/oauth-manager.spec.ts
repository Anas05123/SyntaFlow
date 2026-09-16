import { describe, expect, it } from 'vitest';
import crypto from 'node:crypto';

const { OAuthManager } = require('../../apps/desktop/electron/integrations/oauth-manager.cjs');

describe('OAuthManager', () => {
  it('generates compliant RFC 7636 PKCE verifier and code challenge', () => {
    const manager = new OAuthManager();
    const { verifier, challenge } = manager.generatePkce();

    expect(verifier).toBeDefined();
    expect(challenge).toBeDefined();

    // Verifier is base64url encoded and sufficient entropy
    expect(verifier.length).toBeGreaterThanOrEqual(43);

    // Challenge is SHA-256 of verifier base64url encoded
    const expectedChallenge = crypto
      .createHash('sha256')
      .update(verifier)
      .digest('base64url');

    expect(challenge).toBe(expectedChallenge);
  });

  it('renders clean sanitized HTML for callback pages without script injections', () => {
    const manager = new OAuthManager();
    const successHtml = manager._renderSuccessHtml();
    expect(successHtml).toContain('Authentication Complete');
    expect(successHtml).toContain('Syntaflow');

    const errorHtml = manager._renderErrorHtml('<script>alert("xss")</script>Access Denied');
    expect(errorHtml).not.toContain('<script>');
    expect(errorHtml).toContain('Access Denied');
  });

  it('enforces cryptographically random, single-use state tokens to prevent replay attacks', () => {
    const manager = new OAuthManager();
    const state = manager.createStateToken({ flowId: 'flow-123', clientId: 'client-test' });

    expect(state).toBeDefined();
    expect(typeof state).toBe('string');
    expect(state.length).toBeGreaterThanOrEqual(32);

    // First validation succeeds and immediately burns state
    const record = manager.validateAndConsumeState(state, 'flow-123');
    expect(record).not.toBeNull();
    expect(record.clientId).toBe('client-test');

    // Second validation with same state must fail (burned)
    const replayAttempt = manager.validateAndConsumeState(state, 'flow-123');
    expect(replayAttempt).toBeNull();
  });

  it('rejects state token when flowId mismatch occurs or when token is expired', () => {
    const manager = new OAuthManager();
    const state = manager.createStateToken({ flowId: 'flow-abc' });

    // Wrong flowId
    const mismatch = manager.validateAndConsumeState(state, 'wrong-flow');
    expect(mismatch).toBeNull();

    // Expired state
    const expiredState = manager.createStateToken({ flowId: 'flow-expired' });
    const stored = manager.stateStore.get(expiredState);
    stored.createdAt = Date.now() - (11 * 60 * 1000); // 11 mins ago

    const expiredCheck = manager.validateAndConsumeState(expiredState, 'flow-expired');
    expect(expiredCheck).toBeNull();
  });

  it('deduplicates concurrent token refresh operations through per-provider lock', async () => {
    const { BaseProvider } = require('../../apps/desktop/electron/integrations/providers/base-provider.cjs');
    const provider = new BaseProvider('test-provider', null, null);

    let refreshExecutionCount = 0;
    const slowRefresh = async () => {
      refreshExecutionCount++;
      await new Promise((r) => setTimeout(r, 40));
      return { success: true, token: 'fresh_token_123' };
    };

    // Trigger 5 simultaneous refresh requests
    const promises = [
      provider.withTokenRefreshLock(slowRefresh),
      provider.withTokenRefreshLock(slowRefresh),
      provider.withTokenRefreshLock(slowRefresh),
      provider.withTokenRefreshLock(slowRefresh),
      provider.withTokenRefreshLock(slowRefresh),
    ];

    const results = await Promise.all(promises);

    // All 5 must receive the same result
    expect(results).toHaveLength(5);
    for (const res of results) {
      expect(res.success).toBe(true);
      expect(res.token).toBe('fresh_token_123');
    }

    // But the actual refresh function was executed exactly ONCE
    expect(refreshExecutionCount).toBe(1);
  });

  it('cancels active authorization immediately without waiting for timeout', async () => {
    const manager = new OAuthManager();

    // Start authorization with a mock endpoint
    const authPromise = manager.startAuthorization({
      integrationId: 'google-calendar',
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenEndpoint: 'https://oauth2.googleapis.com/token',
      clientId: 'mock_client_id',
      scopes: ['calendar.read'],
      timeoutMs: 60000,
    });

    expect(manager.activeFlows.size).toBe(1);

    // Cancel immediately
    const cancelled = manager.cancelAuthorization('google-calendar');
    expect(cancelled).toBe(true);
    expect(manager.activeFlows.size).toBe(0);

    const result = await authPromise;
    expect(result.success).toBe(false);
    expect(result.error?.code).toBe('authorization_cancelled');
    expect(result.error?.message).toContain('cancelled');
  });

  it('runs multiple authorizations concurrently without interference and cancels independently', async () => {
    const manager = new OAuthManager();

    // Start Google Calendar authorization
    const calPromise = manager.startAuthorization({
      integrationId: 'google-calendar',
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenEndpoint: 'https://oauth2.googleapis.com/token',
      clientId: 'mock_client_id_cal',
      scopes: ['calendar.read'],
      timeoutMs: 60000,
    });

    // Start Gmail authorization simultaneously
    const gmailPromise = manager.startAuthorization({
      integrationId: 'gmail',
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenEndpoint: 'https://oauth2.googleapis.com/token',
      clientId: 'mock_client_id_gmail',
      scopes: ['mail.read'],
      timeoutMs: 60000,
    });

    expect(manager.activeFlows.size).toBe(2);

    // Cancel ONLY Google Calendar
    const calCancelled = manager.cancelAuthorization('google-calendar');
    expect(calCancelled).toBe(true);

    // Gmail MUST still be actively listening
    expect(manager.activeFlows.size).toBe(1);
    const remainingFlow = Array.from(manager.activeFlows.values())[0];
    expect(remainingFlow.integrationId).toBe('gmail');

    const calResult = await calPromise;
    expect(calResult.success).toBe(false);
    expect(calResult.error?.code).toBe('authorization_cancelled');

    // Cancel Gmail cleanly
    manager.cancelAuthorization('gmail');
    const gmailResult = await gmailPromise;
    expect(gmailResult.success).toBe(false);
    expect(gmailResult.error?.code).toBe('authorization_cancelled');
    expect(manager.activeFlows.size).toBe(0);
  });
});
