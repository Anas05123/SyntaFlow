/**
 * Syntaflow Desktop OAuth 2.0 PKCE Manager
 *
 * Implements secure desktop authorization flows:
 * - RFC 7636 PKCE (Proof Key for Code Exchange)
 * - Ephemeral loopback HTTP redirect listener (127.0.0.1)
 * - System browser launching via Electron shell.openExternal
 * - Timing and state validation to mitigate CSRF attacks
 * - Auto-teardown of loopback server on completion or timeout
 */

const http = require('node:http');
const crypto = require('node:crypto');
const { shell } = require('electron');

class OAuthManager {
  constructor() {
    this.activeFlows = new Map();
    this.stateStore = new Map();
  }

  /**
   * Generates a cryptographically random PKCE code verifier and code challenge.
   */
  generatePkce() {
    const verifier = crypto.randomBytes(32).toString('base64url');
    const challenge = crypto.createHash('sha256').update(verifier).digest('base64url');
    return { verifier, challenge };
  }

  /**
   * Generates a single-use cryptographically random OAuth state token.
   * Expires in 10 minutes.
   */
  createStateToken(metadata = {}) {
    const state = crypto.randomBytes(32).toString('base64url');
    this.stateStore.set(state, {
      createdAt: Date.now(),
      ...metadata,
    });
    return state;
  }

  /**
   * Validates and immediately burns the state token to prevent replay attacks.
   */
  validateAndConsumeState(state, expectedFlowId = null) {
    if (!state || typeof state !== 'string') return null;
    const record = this.stateStore.get(state);
    // Single-use guarantee: burn immediately
    this.stateStore.delete(state);

    if (!record) return null;

    const STATE_TTL_MS = 10 * 60 * 1000; // 10 minutes
    if (Date.now() - record.createdAt > STATE_TTL_MS) {
      return null;
    }

    if (expectedFlowId && record.flowId && record.flowId !== expectedFlowId) {
      return null;
    }

    return record;
  }

  /**
   * Cancels any active authorization flows for a specific integration, or all flows.
   * Immediately closes the ephemeral loopback server and resolves the promise.
   *
   * @param {string} [integrationId]
   * @returns {boolean} True if any flow was cancelled
   */
  cancelAuthorization(integrationId) {
    let cancelled = false;
    for (const [flowId, flow] of Array.from(this.activeFlows.entries())) {
      if (!integrationId || flow.integrationId === integrationId) {
        cancelled = true;
        if (typeof flow.cleanup === 'function') {
          flow.cleanup();
        }
        if (typeof flow.resolve === 'function') {
          flow.resolve({
            success: false,
            error: {
              code: 'authorization_cancelled',
              message: 'Authorization was cancelled by user.',
            },
          });
        }
      }
    }
    return cancelled;
  }

  /**
   * Starts a desktop OAuth loopback flow.
   *
   * @param {Object} config
   * @param {string} [config.integrationId]
   * @param {string} config.authorizationEndpoint
   * @param {string} config.tokenEndpoint
   * @param {string} config.clientId
   * @param {string} [config.clientSecret]
   * @param {string[]} config.scopes
   * @param {Record<string, string>} [config.extraParams]
   * @param {number} [config.timeoutMs=60000]
   */
  async startAuthorization(config) {
    const {
      integrationId,
      authorizationEndpoint,
      tokenEndpoint,
      clientId,
      clientSecret,
      scopes,
      extraParams = {},
      timeoutMs = 60000,
    } = config;

    // If an authorization is already in flight for this exact integration, cancel it first
    if (integrationId) {
      this.cancelAuthorization(integrationId);
    }

    const flowId = crypto.randomUUID();
    const { verifier, challenge } = this.generatePkce();
    const state = this.createStateToken({ flowId, clientId, tokenEndpoint, integrationId });

    return new Promise((resolve) => {
      let server;
      let timer;

      const cleanup = () => {
        if (timer) clearTimeout(timer);
        this.activeFlows.delete(flowId);
        // Burn any state remaining for this flow
        for (const [s, data] of this.stateStore.entries()) {
          if (data.flowId === flowId) {
            this.stateStore.delete(s);
          }
        }
        if (server) {
          try {
            server.close();
          } catch (_e) {}
        }
      };

      this.activeFlows.set(flowId, {
        flowId,
        integrationId,
        cleanup,
        resolve,
      });

      server = http.createServer(async (req, res) => {
        try {
          const reqUrl = new URL(req.url, `http://127.0.0.1:${server.address().port}`);
          if (reqUrl.pathname !== '/callback') {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not found');
            return;
          }

          const code = reqUrl.searchParams.get('code');
          const incomingState = reqUrl.searchParams.get('state');
          const incomingError = reqUrl.searchParams.get('error');

          if (incomingError) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(this._renderErrorHtml(incomingError));
            cleanup();
            resolve({
              success: false,
              error: {
                code: 'authorization_failed',
                message: `OAuth authorization denied: ${incomingError}`,
              },
            });
            return;
          }

          const validStateRecord = this.validateAndConsumeState(incomingState, flowId);
          if (!code || !validStateRecord) {
            res.writeHead(400, { 'Content-Type': 'text/html' });
            res.end(this._renderErrorHtml('Invalid, expired, or replayed OAuth state parameter'));
            cleanup();
            resolve({
              success: false,
              error: {
                code: 'authorization_failed',
                message: 'Invalid, expired, or already consumed OAuth state parameter',
              },
            });
            return;
          }

          // Exchange authorization code for tokens
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(this._renderSuccessHtml());

          const redirectUri = `http://127.0.0.1:${server.address().port}/callback`;
          const tokenResult = await this._exchangeCodeForTokens({
            tokenEndpoint,
            clientId,
            clientSecret,
            code,
            verifier,
            redirectUri,
          });

          cleanup();
          resolve(tokenResult);
        } catch (err) {
          cleanup();
          resolve({
            success: false,
            error: {
              code: 'authorization_failed',
              message: err.message || 'OAuth token exchange failed',
            },
          });
        }
      });

      server.listen(0, '127.0.0.1', () => {
        const port = server.address().port;
        const redirectUri = `http://127.0.0.1:${port}/callback`;

        const authUrl = new URL(authorizationEndpoint);
        authUrl.searchParams.set('client_id', clientId);
        authUrl.searchParams.set('redirect_uri', redirectUri);
        authUrl.searchParams.set('response_type', 'code');
        authUrl.searchParams.set('scope', scopes.join(' '));
        authUrl.searchParams.set('state', state);
        authUrl.searchParams.set('code_challenge', challenge);
        authUrl.searchParams.set('code_challenge_method', 'S256');
        authUrl.searchParams.set('access_type', 'offline');
        authUrl.searchParams.set('prompt', 'consent');

        for (const [k, v] of Object.entries(extraParams)) {
          authUrl.searchParams.set(k, v);
        }

        // Open system browser
        shell.openExternal(authUrl.toString()).catch((err) => {
          cleanup();
          resolve({
            success: false,
            error: {
              code: 'provider_unavailable',
              message: `Failed to launch system browser: ${err.message}`,
            },
          });
        });

        // Set timeout
        timer = setTimeout(() => {
          cleanup();
          resolve({
            success: false,
            error: {
              code: 'authorization_failed',
              message: 'Authentication request timed out waiting for user completion.',
            },
          });
        }, timeoutMs);
      });
    });
  }

  async _exchangeCodeForTokens({ tokenEndpoint, clientId, clientSecret, code, verifier, redirectUri }) {
    const body = new URLSearchParams();
    body.set('grant_type', 'authorization_code');
    body.set('code', code);
    body.set('redirect_uri', redirectUri);
    body.set('client_id', clientId);
    body.set('code_verifier', verifier);

    if (clientSecret) {
      body.set('client_secret', clientSecret);
    }

    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: body.toString(),
    });

    if (!response.ok) {
      const errText = await response.text();
      return {
        success: false,
        error: {
          code: 'authorization_failed',
          message: `Token endpoint returned status ${response.status}: ${errText.slice(0, 200)}`,
        },
      };
    }

    const data = await response.json();
    return {
      success: true,
      tokens: {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresIn: data.expires_in,
        tokenType: data.token_type || 'Bearer',
        scope: data.scope,
        idToken: data.id_token,
      },
    };
  }

  _renderSuccessHtml() {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Connected to Syntaflow</title>
  <style>
    body {
      background: #0B0D0F;
      color: #E2E8F0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
    }
    .card {
      background: #15191E;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 32px 40px;
      text-align: center;
      max-width: 420px;
      box-shadow: 0 16px 32px rgba(0,0,0,0.5);
    }
    .icon {
      font-size: 32px;
      margin-bottom: 16px;
      color: #38BDF8;
    }
    h1 { font-size: 18px; margin: 0 0 8px 0; color: #FFFFFF; font-weight: 600; }
    p { font-size: 14px; color: #94A3B8; margin: 0 0 20px 0; line-height: 1.5; }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 9999px;
      background: rgba(56, 189, 248, 0.12);
      color: #38BDF8;
      font-size: 12px;
      font-weight: 500;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">✓</div>
    <h1>Authentication Complete</h1>
    <p>Your account has been connected to Syntaflow. You can now close this tab and return to the application.</p>
    <div class="badge">Safe to close window</div>
  </div>
</body>
</html>`;
  }

  _renderErrorHtml(errorMessage) {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Authentication Failed — Syntaflow</title>
  <style>
    body {
      background: #0B0D0F;
      color: #E2E8F0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
    }
    .card {
      background: #15191E;
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 12px;
      padding: 32px 40px;
      text-align: center;
      max-width: 420px;
      box-shadow: 0 16px 32px rgba(0,0,0,0.5);
    }
    .icon { font-size: 32px; margin-bottom: 16px; color: #EF4444; }
    h1 { font-size: 18px; margin: 0 0 8px 0; color: #FFFFFF; }
    p { font-size: 14px; color: #94A3B8; margin: 0 0 16px 0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">✕</div>
    <h1>Connection Failed</h1>
    <p>${String(errorMessage).replace(/[<>]/g, '')}</p>
  </div>
</body>
</html>`;
  }
}

module.exports = {
  OAuthManager,
};
