/**
 * Syntaflow Integrations Credential & Token Vault
 *
 * Secure credential storage situated exclusively inside the Electron privileged main process.
 *
 * Security Invariants:
 * - Sensitive credentials (access tokens, refresh tokens, API keys, MCP secrets) are NEVER stored in plaintext.
 * - Production vault (SafeStorageCredentialVault) uses Electron safeStorage (OS Keychain / DPAPI / libsecret).
 * - In production, if safeStorage is unavailable, the vault FAILS SECURE and NEVER silently downgrades to weak crypto.
 * - TestCredentialVault is strictly isolated and guarded: only allowed when NODE_ENV === 'test'.
 * - Renderer has zero access to vault files, safeStorage, Node crypto, or raw tokens.
 * - Secrets are strictly redacted and never returned to the renderer or console.
 */

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { safeStorage } = require('electron');

class BaseCredentialVault {
  constructor(userDataPath) {
    this.userDataPath = userDataPath;
    this.vaultPath = path.join(userDataPath, 'integrations-vault.json');
    this.data = this._loadVault();
  }

  _loadVault() {
    try {
      if (fs.existsSync(this.vaultPath)) {
        const raw = fs.readFileSync(this.vaultPath, 'utf8');
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && parsed.connections) {
          return parsed;
        }
      }
    } catch (_err) {
      // Fresh store on corrupt or unreadable file
    }

    const initial = {
      version: 2,
      connections: {},
      tokens: {},
    };

    try {
      fs.mkdirSync(this.userDataPath, { recursive: true });
      fs.writeFileSync(this.vaultPath, JSON.stringify(initial, null, 2), 'utf8');
    } catch (_err) {}

    return initial;
  }

  _saveVault() {
    try {
      fs.mkdirSync(this.userDataPath, { recursive: true });
      fs.writeFileSync(this.vaultPath, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (_err) {}
  }

  _encrypt(_secret) {
    throw new Error('_encrypt must be implemented by vault subclass');
  }

  _decrypt(_record) {
    throw new Error('_decrypt must be implemented by vault subclass');
  }

  saveTokens(integrationId, tokens) {
    if (!integrationId || !tokens) return;
    this.data.tokens[integrationId] = this._encrypt(tokens);
    this._saveVault();
  }

  getTokens(integrationId) {
    const record = this.data.tokens[integrationId];
    if (!record) return null;
    return this._decrypt(record);
  }

  deleteTokens(integrationId) {
    if (this.data.tokens[integrationId]) {
      delete this.data.tokens[integrationId];
      this._saveVault();
    }
  }

  saveConnectionState(integrationId, connection) {
    if (!integrationId || !connection) return;
    const safeConnection = {
      integrationId,
      state: connection.state || 'disconnected',
      accountLabel: connection.accountLabel,
      accountEmail: connection.accountEmail,
      connectedAt: connection.connectedAt,
      lastCheckedAt: connection.lastCheckedAt || new Date().toISOString(),
      grantedScopes: Array.isArray(connection.grantedScopes) ? connection.grantedScopes : [],
      transport: connection.transport || 'api',
      agentAccess: connection.agentAccess || { enabled: false, allowedCapabilities: [] },
      error: connection.error,
      metadata: connection.metadata,
    };

    this.data.connections[integrationId] = safeConnection;
    this._saveVault();
    return safeConnection;
  }

  getConnectionState(integrationId) {
    return this.data.connections[integrationId] || null;
  }

  listConnectionStates() {
    return Object.values(this.data.connections);
  }

  updateAgentAccess(integrationId, agentAccess) {
    const conn = this.data.connections[integrationId];
    if (!conn) return null;
    conn.agentAccess = {
      enabled: Boolean(agentAccess.enabled),
      allowedCapabilities: Array.isArray(agentAccess.allowedCapabilities)
        ? agentAccess.allowedCapabilities
        : [],
      elevatedConfirmed: Boolean(agentAccess.elevatedConfirmed),
    };
    this._saveVault();
    return conn;
  }

  disconnect(integrationId) {
    this.deleteTokens(integrationId);
    const existing = this.data.connections[integrationId];
    const updated = {
      integrationId,
      state: 'disconnected',
      grantedScopes: [],
      transport: existing ? existing.transport : 'api',
      agentAccess: { enabled: false, allowedCapabilities: [] },
      lastCheckedAt: new Date().toISOString(),
    };
    this.data.connections[integrationId] = updated;
    this._saveVault();
    return updated;
  }
}

/**
 * Production-grade SafeStorage vault backed by OS Keychain / DPAPI / libsecret.
 * Fails securely if OS-level encryption is unavailable.
 */
class SafeStorageCredentialVault extends BaseCredentialVault {
  get isEncryptionAvailable() {
    return Boolean(
      safeStorage &&
      typeof safeStorage.isEncryptionAvailable === 'function' &&
      safeStorage.isEncryptionAvailable()
    );
  }

  _encrypt(secret) {
    if (!this.isEncryptionAvailable) {
      throw new Error(
        'Secure credential storage is unavailable on this device. Integration credentials cannot be stored securely.'
      );
    }

    if (typeof secret !== 'string') {
      secret = JSON.stringify(secret);
    }

    const encryptedBuffer = safeStorage.encryptString(secret);
    return {
      encrypted: true,
      ciphertext: encryptedBuffer.toString('base64'),
    };
  }

  _decrypt(record) {
    if (!record || !record.ciphertext) return null;

    if (!this.isEncryptionAvailable) {
      throw new Error(
        'Secure credential storage is unavailable on this device. Integration credentials cannot be decrypted.'
      );
    }

    try {
      const buffer = Buffer.from(record.ciphertext, 'base64');
      const raw = safeStorage.decryptString(buffer);
      try {
        return JSON.parse(raw);
      } catch {
        return raw;
      }
    } catch (_e) {
      return null;
    }
  }
}

/**
 * TestCredentialVault is strictly for automated test suites (NODE_ENV === 'test').
 * Provides deterministic AES-256-GCM encryption in test runtimes where OS Keychain is absent.
 */
class TestCredentialVault extends BaseCredentialVault {
  constructor(userDataPath) {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error(
        'TestCredentialVault is forbidden in production. It may only be instantiated when NODE_ENV === "test".'
      );
    }
    super(userDataPath);
  }

  get isEncryptionAvailable() {
    return true;
  }

  _encrypt(secret) {
    if (typeof secret !== 'string') {
      secret = JSON.stringify(secret);
    }

    const key = crypto
      .createHash('sha256')
      .update(this.userDataPath + ':syntaflow:test-vault:v2')
      .digest();
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    let enc = cipher.update(secret, 'utf8', 'hex');
    enc += cipher.final('hex');
    const tag = cipher.getAuthTag().toString('hex');

    return {
      encrypted: true,
      isTestCipher: true,
      ciphertext: `${iv.toString('hex')}:${tag}:${enc}`,
    };
  }

  _decrypt(record) {
    if (!record || !record.ciphertext) return null;

    try {
      const parts = record.ciphertext.split(':');
      if (parts.length !== 3) return null;
      const [ivHex, tagHex, encHex] = parts;
      const key = crypto
        .createHash('sha256')
        .update(this.userDataPath + ':syntaflow:test-vault:v2')
        .digest();
      const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(ivHex, 'hex'));
      decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
      let dec = decipher.update(encHex, 'hex', 'utf8');
      dec += decipher.final('utf8');
      try {
        return JSON.parse(dec);
      } catch {
        return dec;
      }
    } catch (_e) {
      return null;
    }
  }
}

/**
 * Factory creating the appropriate vault based on runtime environment.
 */
function createCredentialVault(userDataPath) {
  if (process.env.NODE_ENV === 'test') {
    return new TestCredentialVault(userDataPath);
  }
  return new SafeStorageCredentialVault(userDataPath);
}

/**
 * Facade preserving backward compatibility with existing IntegrationsVault imports.
 */
class IntegrationsVault {
  constructor(userDataPath) {
    this._delegate = createCredentialVault(userDataPath);
  }

  get isEncryptionAvailable() {
    return this._delegate.isEncryptionAvailable;
  }

  saveTokens(integrationId, tokens) {
    return this._delegate.saveTokens(integrationId, tokens);
  }

  getTokens(integrationId) {
    return this._delegate.getTokens(integrationId);
  }

  deleteTokens(integrationId) {
    return this._delegate.deleteTokens(integrationId);
  }

  saveConnectionState(integrationId, connection) {
    return this._delegate.saveConnectionState(integrationId, connection);
  }

  getConnectionState(integrationId) {
    return this._delegate.getConnectionState(integrationId);
  }

  listConnectionStates() {
    return this._delegate.listConnectionStates();
  }

  updateAgentAccess(integrationId, agentAccess) {
    return this._delegate.updateAgentAccess(integrationId, agentAccess);
  }

  disconnect(integrationId) {
    return this._delegate.disconnect(integrationId);
  }
}

module.exports = {
  BaseCredentialVault,
  SafeStorageCredentialVault,
  TestCredentialVault,
  IntegrationsVault,
  createCredentialVault,
};
