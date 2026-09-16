import { Client, Account, ID, OAuthProvider } from 'appwrite';
import type { UserProfile, DeviceSession, AccountPlan } from '../../types/auth';

export const APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1';
export const APPWRITE_PROJECT_ID = '6aa9e58700101cabaa45';

// Initialize central Appwrite client
export const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

export const account = new Account(client);

export interface AuthState {
  user: UserProfile | null;
  plan: AccountPlan;
  isLoading: boolean;
  isAuthenticated: boolean;
}

/**
 * Format Appwrite user object to canonical UserProfile
 */
function mapAppwriteUser(appwriteUser: any): UserProfile {
  return {
    userId: appwriteUser.$id,
    name: appwriteUser.name || appwriteUser.email.split('@')[0],
    email: appwriteUser.email,
    createdAt: appwriteUser.registration || appwriteUser.$createdAt,
    updatedAt: appwriteUser.$updatedAt,
  };
}

/**
 * Get current authenticated user session
 */
export async function getCurrentUser(): Promise<UserProfile | null> {
  try {
    const user = await account.get();
    return mapAppwriteUser(user);
  } catch (_err) {
    return null;
  }
}

/**
 * Sign in with email and password
 */
export async function loginWithEmail(email: string, password: string): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  try {
    const cleanEmail = email.trim().toLowerCase();
    await account.createEmailPasswordSession(cleanEmail, password);
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Session could not be established.' };
    }
    return { success: true, user };
  } catch (err: any) {
    const message = err?.message || 'Invalid email or password.';
    return { success: false, error: message };
  }
}

/**
 * Register new user with email and password
 */
export async function signupWithEmail(email: string, password: string, name: string): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const userId = ID.unique();
    await account.create(userId, cleanEmail, password, cleanName);
    // Automatically establish session after account creation
    await account.createEmailPasswordSession(cleanEmail, password);
    const user = await getCurrentUser();
    return { success: true, user: user || undefined };
  } catch (err: any) {
    const message = err?.message || 'Registration failed. Please check your information.';
    return { success: false, error: message };
  }
}

/**
 * Sign in / Sign up with Google OAuth
 *
 * CRITICAL SECURITY INVARIANT:
 * Google Login requests ONLY identity scopes ('openid', 'email', 'profile').
 * Workspace integrations (Gmail, Google Calendar, Google Drive) remain separate.
 */
export function loginWithGoogle(successUrl?: string, failureUrl?: string): void {
  const defaultSuccess = typeof window !== 'undefined' ? `${window.location.origin}/account` : 'https://syntaflow.tech/account';
  const defaultFailure = typeof window !== 'undefined' ? `${window.location.origin}/login?error=oauth` : 'https://syntaflow.tech/login?error=oauth';

  account.createOAuth2Session(
    OAuthProvider.Google,
    successUrl || defaultSuccess,
    failureUrl || defaultFailure,
    ['openid', 'email', 'profile']
  );
}

/**
 * Send password reset email
 */
export async function sendPasswordRecovery(email: string, returnUrl?: string): Promise<{ success: boolean; error?: string }> {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const resetUrl = returnUrl || (typeof window !== 'undefined' ? `${window.location.origin}/forgot-password` : 'https://syntaflow.tech/forgot-password');
    await account.createRecovery(cleanEmail, resetUrl);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Could not send recovery email.' };
  }
}

/**
 * Complete password reset using token secret
 */
export async function completePasswordRecovery(userId: string, secret: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    await account.updateRecovery(userId, secret, password);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Password reset token is invalid or expired.' };
  }
}

/**
 * Update user display name
 */
export async function updateProfileName(name: string): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  try {
    const updated = await account.updateName(name.trim());
    return { success: true, user: mapAppwriteUser(updated) };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update name.' };
  }
}

/**
 * Update user password
 */
export async function changePassword(newPassword: string, oldPassword?: string): Promise<{ success: boolean; error?: string }> {
  try {
    await account.updatePassword(newPassword, oldPassword);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update password.' };
  }
}

/**
 * List all active device sessions for current user
 */
export async function listActiveSessions(): Promise<DeviceSession[]> {
  try {
    const response = await account.listSessions();
    return response.sessions.map((s: any) => ({
      id: s.$id,
      userId: s.userId,
      clientName: s.clientName || 'Syntaflow Client',
      clientVersion: s.clientVersion || '',
      osName: s.osName || s.clientEngine || 'Operating System',
      deviceModel: s.deviceModel || s.deviceBrand || '',
      ip: s.ip || '',
      countryName: s.countryName || '',
      current: Boolean(s.current),
      lastActivity: s.$updatedAt || s.$createdAt,
    }));
  } catch (_err) {
    return [];
  }
}

/**
 * Revoke specific session by ID
 */
export async function revokeSession(sessionId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await account.deleteSession(sessionId);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to revoke session.' };
  }
}

/**
 * Revoke all sessions other than current
 */
export async function revokeAllOtherSessions(): Promise<{ success: boolean; error?: string }> {
  try {
    const sessions = await listActiveSessions();
    const otherSessions = sessions.filter(s => !s.current);
    for (const session of otherSessions) {
      await account.deleteSession(session.id);
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to revoke other sessions.' };
  }
}

/**
 * Sign out current session
 */
export async function logout(): Promise<{ success: boolean }> {
  try {
    await account.deleteSession('current');
    return { success: true };
  } catch (_err) {
    return { success: true };
  }
}

/**
 * Generate desktop authorization token
 * Uses short-lived Appwrite JWT (15 min) or signed one-time code
 */
export async function createDesktopAuthCode(): Promise<{ success: boolean; code?: string; error?: string }> {
  try {
    const jwt = await account.createJWT();
    return { success: true, code: jwt.jwt };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to generate desktop token.' };
  }
}
