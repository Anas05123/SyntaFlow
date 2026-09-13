/**
 * CoreDesk Authentication Providers
 *
 * Provides a pluggable authentication provider architecture:
 * - AuthProvider (Interface / Abstract Base)
 * - LocalAuthProvider (CURRENT: local scrypt hashing + safeStorage session encryption)
 * - WebAuthProvider (FUTURE: browser OAuth / coredesk:// deep-link callback)
 *
 * Security Invariants:
 * - Passwords are NEVER stored in plaintext.
 * - Password verification uses crypto.timingSafeEqual to mitigate timing attacks.
 * - Session tokens are encrypted using Electron safeStorage (OS-backed DPAPI / Keychain).
 * - React renderer has no direct access to credentials, Node crypto, filesystem, or safeStorage.
 * - Sign out invalidates the session without deleting local workspace data.
 */

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { safeStorage } = require('electron');

/**
 * Base AuthProvider interface contract
 */
class AuthProvider {
  async getSession() {
    throw new Error('Not implemented');
  }
  async signIn(_credentials) {
    throw new Error('Not implemented');
  }
  async signUp(_payload) {
    throw new Error('Not implemented');
  }
  async signOut() {
    throw new Error('Not implemented');
  }
}

/**
 * LocalAuthProvider: Current desktop-only secure local authentication provider.
 */
class LocalAuthProvider extends AuthProvider {
  constructor(userDataPath) {
    super();
    this.userDataPath = userDataPath;
    this.storePath = path.join(userDataPath, 'auth-store.json');
    this.data = this._loadStore();
  }

  _loadStore() {
    try {
      if (fs.existsSync(this.storePath)) {
        const raw = fs.readFileSync(this.storePath, 'utf8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.users)) {
          return parsed;
        }
      }
    } catch (_e) {
      // Ignore parse error and initialize fresh
    }

    // Initialize fresh store with default seed account if empty
    const initialStore = {
      version: 1,
      users: [],
      activeSession: null,
    };

    // Seed default workspace owner account with salted scrypt hash
    const seedSalt = crypto.randomBytes(16).toString('hex');
    const seedHash = crypto.scryptSync('NorthlightPass2026!', seedSalt, 64, {
      N: 16384,
      r: 8,
      p: 1,
    }).toString('hex');

    initialStore.users.push({
      id: 'usr_owner_default',
      email: 'anas@northlight.studio',
      name: 'Anas Ayari',
      workspaceName: 'Northlight Studio',
      salt: seedSalt,
      passwordHash: seedHash,
      createdAt: new Date().toISOString(),
    });

    // Also add secondary demo alias for seamless testing
    const demoSalt = crypto.randomBytes(16).toString('hex');
    const demoHash = crypto.scryptSync('NorthlightPass2026!', demoSalt, 64, {
      N: 16384,
      r: 8,
      p: 1,
    }).toString('hex');

    initialStore.users.push({
      id: 'usr_nadia_demo',
      email: 'nadia@northlightstudio.com',
      name: 'Nadia Rahman',
      workspaceName: 'Northlight Studio',
      salt: demoSalt,
      passwordHash: demoHash,
      createdAt: new Date().toISOString(),
    });

    try {
      fs.mkdirSync(this.userDataPath, { recursive: true });
      fs.writeFileSync(this.storePath, JSON.stringify(initialStore, null, 2), 'utf8');
    } catch (_err) {}

    return initialStore;
  }

  _saveStore() {
    try {
      fs.mkdirSync(this.userDataPath, { recursive: true });
      fs.writeFileSync(this.storePath, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (_e) {}
  }

  _encryptToken(token) {
    if (safeStorage && typeof safeStorage.isEncryptionAvailable === 'function' && safeStorage.isEncryptionAvailable()) {
      try {
        const encryptedBuffer = safeStorage.encryptString(token);
        return {
          encrypted: true,
          ciphertext: encryptedBuffer.toString('base64'),
        };
      } catch (_e) {}
    }
    // Fallback when OS encryption is not available in environment
    const hash = crypto.createHash('sha256').update(this.userDataPath).digest();
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', hash, iv);
    let enc = cipher.update(token, 'utf8', 'hex');
    enc += cipher.final('hex');
    const tag = cipher.getAuthTag().toString('hex');
    return {
      encrypted: false,
      fallback: true,
      ciphertext: `${iv.toString('hex')}:${tag}:${enc}`,
    };
  }

  _decryptToken(record) {
    if (!record || !record.ciphertext) return null;
    if (record.encrypted && safeStorage && typeof safeStorage.decryptString === 'function') {
      try {
        const buffer = Buffer.from(record.ciphertext, 'base64');
        return safeStorage.decryptString(buffer);
      } catch (_e) {
        return null;
      }
    }
    if (record.fallback) {
      try {
        const parts = record.ciphertext.split(':');
        if (parts.length !== 3) return null;
        const [ivHex, tagHex, encHex] = parts;
        const hash = crypto.createHash('sha256').update(this.userDataPath).digest();
        const decipher = crypto.createDecipheriv('aes-256-gcm', hash, Buffer.from(ivHex, 'hex'));
        decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
        let dec = decipher.update(encHex, 'hex', 'utf8');
        dec += decipher.final('utf8');
        return dec;
      } catch (_e) {
        return null;
      }
    }
    return null;
  }

  _hashPassword(password, salt) {
    return crypto.scryptSync(password, salt, 64, {
      N: 16384,
      r: 8,
      p: 1,
    }).toString('hex');
  }

  _verifyPassword(password, salt, storedHash) {
    try {
      const calculatedHash = this._hashPassword(password, salt);
      const calculatedBuffer = Buffer.from(calculatedHash, 'hex');
      const storedBuffer = Buffer.from(storedHash, 'hex');
      if (calculatedBuffer.length !== storedBuffer.length) return false;
      return crypto.timingSafeEqual(calculatedBuffer, storedBuffer);
    } catch (_e) {
      return false;
    }
  }

  normalizeEmail(email) {
    return String(email || '').trim().toLowerCase();
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async getSession() {
    const sessionRecord = this.data.activeSession;
    if (!sessionRecord) return null;

    // Check expiration (30 days)
    if (new Date(sessionRecord.expiresAt).getTime() <= Date.now()) {
      this.data.activeSession = null;
      this._saveStore();
      return null;
    }

    const token = this._decryptToken(sessionRecord.tokenEnvelope);
    if (!token) {
      this.data.activeSession = null;
      this._saveStore();
      return null;
    }

    const user = this.data.users.find((u) => u.id === sessionRecord.userId);
    if (!user) {
      this.data.activeSession = null;
      this._saveStore();
      return null;
    }

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        workspaceName: user.workspaceName || 'Northlight Studio',
      },
      expiresAt: sessionRecord.expiresAt,
    };
  }

  async signIn({ email, password }) {
    const normalized = this.normalizeEmail(email);
    if (!normalized || !password) {
      return { success: false, error: 'Please provide both email and password.' };
    }

    const user = this.data.users.find((u) => u.email === normalized);
    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }

    const valid = this._verifyPassword(password, user.salt, user.passwordHash);
    if (!valid) {
      return { success: false, error: 'Invalid credentials' };
    }

    // Create session
    const token = `cd_sess_${Date.now().toString(36)}_${crypto.randomBytes(16).toString('hex')}`;
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const tokenEnvelope = this._encryptToken(token);

    this.data.activeSession = {
      userId: user.id,
      tokenEnvelope,
      createdAt: new Date().toISOString(),
      expiresAt,
    };
    this._saveStore();

    return {
      success: true,
      session: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          workspaceName: user.workspaceName || 'Northlight Studio',
        },
        expiresAt,
      },
    };
  }

  async signUp({ email, password, confirmPassword, name, workspaceName }) {
    const normalized = this.normalizeEmail(email);

    if (!normalized) {
      return { success: false, error: 'Please enter your work email.' };
    }
    if (!this.isValidEmail(normalized)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!password || password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters.' };
    }
    if (password !== confirmPassword) {
      return { success: false, error: 'Passwords do not match' };
    }

    const exists = this.data.users.some((u) => u.email === normalized);
    if (exists) {
      return { success: false, error: 'Account already exists' };
    }

    // Derive display name from email if not given
    let displayName = name ? String(name).trim() : '';
    if (!displayName) {
      const parts = normalized.split('@')[0].split(/[._-]/);
      displayName = parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = this._hashPassword(password, salt);
    const userId = `usr_${Date.now().toString(36)}_${crypto.randomBytes(4).toString('hex')}`;

    const newUser = {
      id: userId,
      email: normalized,
      name: displayName || 'CoreDesk Operator',
      workspaceName: workspaceName ? String(workspaceName).trim() : 'Primary Workspace',
      salt,
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    this.data.users.push(newUser);

    // Automatically create and persist authenticated session
    const token = `cd_sess_${Date.now().toString(36)}_${crypto.randomBytes(16).toString('hex')}`;
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const tokenEnvelope = this._encryptToken(token);

    this.data.activeSession = {
      userId: newUser.id,
      tokenEnvelope,
      createdAt: new Date().toISOString(),
      expiresAt,
    };
    this._saveStore();

    return {
      success: true,
      session: {
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          workspaceName: newUser.workspaceName,
        },
        expiresAt,
      },
    };
  }

  async signOut() {
    this.data.activeSession = null;
    this._saveStore();
    return { success: true };
  }
}

/**
 * WebAuthProvider: Placeholder / Future interface for browser-based OAuth / coredesk:// deep-links.
 */
class WebAuthProvider extends AuthProvider {
  constructor(apiBaseUrl = 'https://coredesk.app/api') {
    super();
    this.apiBaseUrl = apiBaseUrl;
  }

  async getSession() {
    // In future phase: validates stored web JWT with API server
    return null;
  }

  async signIn(_credentials) {
    // In future phase: triggers system browser authorization flow
    return { success: false, error: 'Web authentication is scheduled for upcoming phase.' };
  }

  async signUp(_payload) {
    return { success: false, error: 'Web registration is scheduled for upcoming phase.' };
  }

  async signOut() {
    return { success: true };
  }
}

module.exports = {
  AuthProvider,
  LocalAuthProvider,
  WebAuthProvider,
};
