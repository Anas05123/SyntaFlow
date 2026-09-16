/**
 * CoreDesk Renderer AuthService
 *
 * Provides a clean authentication boundary for the React UI.
 *
 * Decouples the UI from knowing whether authentication is serviced by the local
 * desktop provider (LocalAuthProvider) or a future web/api provider (WebAuthProvider).
 *
 * Renderer Architecture:
 *   Auth UI (AuthScreen / AccountMenu)
 *          ↓
 *   AuthService (this client abstraction)
 *          ↓
 *   window.coreDeskDesktop.auth (typed Preload IPC bridge)
 *          ↓
 *   Electron Main Process (AuthService -> LocalAuthProvider)
 */

export interface SignInPayload {
  email: string;
  password?: string;
}

export interface SignUpPayload {
  email: string;
  password: string;
  confirmPassword: string;
  name?: string;
  workspaceName?: string;
}

export interface AuthSession {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    workspaceName: string;
  };
  expiresAt?: string;
}

export interface AuthResult {
  success: boolean;
  session?: AuthSession;
  error?: string;
}

interface DesktopAuthBridge {
  getSession: () => Promise<AuthSession | null>;
  signIn: (credentials: SignInPayload) => Promise<AuthResult>;
  signUp: (payload: SignUpPayload) => Promise<AuthResult>;
  signOut: () => Promise<{ success: boolean; error?: string }>;
  startBrowserLogin?: (options?: { timeoutMs?: number }) => Promise<AuthResult>;
  cancelBrowserLogin?: () => Promise<{ success: boolean }>;
}

function getDesktopBridge(): DesktopAuthBridge | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as { coreDeskDesktop?: { auth?: DesktopAuthBridge } };
  return w.coreDeskDesktop?.auth ?? null;
}

// In-memory fallback session for pure browser preview environments
let browserMockSession: AuthSession | null = {
  token: `cd_session_seed_${Date.now().toString(36)}`,
  user: {
    id: 'usr_owner_default',
    email: 'anas@northlight.studio',
    name: 'Anas Ayari',
    workspaceName: 'Northlight Studio',
  },
  expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
};

class AuthServiceClient {
  async getSession(): Promise<AuthSession | null> {
    const bridge = getDesktopBridge();
    if (bridge) {
      return await bridge.getSession();
    }
    return browserMockSession;
  }

  async signIn(payload: SignInPayload): Promise<AuthResult> {
    const email = payload.email.trim();
    const password = payload.password || '';

    if (!email) {
      return { success: false, error: 'Please enter your work email.' };
    }
    if (!email.includes('@') || !email.includes('.')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!password) {
      return { success: false, error: 'Please enter your password.' };
    }

    const bridge = getDesktopBridge();
    if (bridge) {
      return await bridge.signIn({ email, password });
    }

    // Mock browser preview fallback
    await new Promise((resolve) => setTimeout(resolve, 300));
    const namePart = email.split('@')[0].replace(/[._]/g, ' ');
    const formattedName = namePart
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    browserMockSession = {
      token: `mock_session_${Date.now().toString(36)}`,
      user: {
        id: 'usr_preview',
        email,
        name: formattedName || 'Anas Ayari',
        workspaceName: 'Northlight Studio',
      },
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    return { success: true, session: browserMockSession };
  }

  async signUp(payload: SignUpPayload): Promise<AuthResult> {
    const email = payload.email.trim();
    const { password, confirmPassword, name, workspaceName } = payload;

    if (!email) {
      return { success: false, error: 'Please enter your work email.' };
    }
    if (!email.includes('@') || !email.includes('.')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!password || password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters.' };
    }
    if (password !== confirmPassword) {
      return { success: false, error: 'Passwords do not match' };
    }

    const bridge = getDesktopBridge();
    if (bridge) {
      return await bridge.signUp({ email, password, confirmPassword, name, workspaceName });
    }

    // Mock browser preview fallback
    await new Promise((resolve) => setTimeout(resolve, 300));
    browserMockSession = {
      token: `mock_session_${Date.now().toString(36)}`,
      user: {
        id: 'usr_preview',
        email,
        name: name || 'Syntaflow Operator',
        workspaceName: workspaceName || 'Primary Workspace',
      },
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    return { success: true, session: browserMockSession };
  }

  async startBrowserLogin(options?: { timeoutMs?: number }): Promise<AuthResult> {
    const bridge = getDesktopBridge();
    if (bridge && typeof bridge.startBrowserLogin === 'function') {
      return await bridge.startBrowserLogin(options);
    }
    return { success: false, error: 'Browser login is only available in the desktop runtime.' };
  }

  async cancelBrowserLogin(): Promise<{ success: boolean }> {
    const bridge = getDesktopBridge();
    if (bridge && typeof bridge.cancelBrowserLogin === 'function') {
      return await bridge.cancelBrowserLogin();
    }
    return { success: true };
  }

  async signOut(): Promise<void> {
    const bridge = getDesktopBridge();
    if (bridge) {
      await bridge.signOut();
    }
    browserMockSession = null;
  }
}

export const authService = new AuthServiceClient();
