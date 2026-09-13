/**
 * CoreDesk Backend AuthService
 *
 * Sits in the Electron privileged main process between IPC handlers and the active
 * AuthProvider (currently LocalAuthProvider).
 *
 * Enforces boundary validation and error shielding so unhandled errors never crash
 * the main process or leak internal stack traces to the renderer.
 */

const { LocalAuthProvider } = require('./auth-provider.cjs');

class AuthService {
  constructor(provider) {
    this.provider = provider;
  }

  static createDefault(userDataPath) {
    const provider = new LocalAuthProvider(userDataPath);
    return new AuthService(provider);
  }

  async getSession() {
    try {
      return await this.provider.getSession();
    } catch (err) {
      console.error('[AuthService] getSession failed:', err);
      return null;
    }
  }

  async signIn(credentials) {
    try {
      if (!credentials || typeof credentials !== 'object') {
        return { success: false, error: 'Invalid credentials payload' };
      }
      const { email, password } = credentials;
      if (!email || !password) {
        return { success: false, error: 'Invalid credentials' };
      }
      return await this.provider.signIn({ email, password });
    } catch (err) {
      console.error('[AuthService] signIn failed:', err);
      return { success: false, error: 'Unexpected local auth error' };
    }
  }

  async signUp(payload) {
    try {
      if (!payload || typeof payload !== 'object') {
        return { success: false, error: 'Invalid registration payload' };
      }
      return await this.provider.signUp(payload);
    } catch (err) {
      console.error('[AuthService] signUp failed:', err);
      return { success: false, error: 'Unexpected local auth error' };
    }
  }

  async signOut() {
    try {
      return await this.provider.signOut();
    } catch (err) {
      console.error('[AuthService] signOut failed:', err);
      return { success: false, error: 'Failed to complete sign out' };
    }
  }
}

module.exports = {
  AuthService,
};
