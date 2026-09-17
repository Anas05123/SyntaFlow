/**
 * Open Redirect & Handshake URL Protection Utilities
 *
 * Validates 'returnTo', internal redirects, loopback URLs (RFC 8252),
 * and custom desktop protocols to prevent open redirect vulnerabilities.
 */

export function sanitizeReturnUrl(returnTo?: string | null, fallback: string = '/account'): string {
  if (!returnTo || typeof returnTo !== 'string') {
    return fallback;
  }

  const trimmed = returnTo.trim();

  // Allow trusted absolute Syntaflow URLs (e.g. cross-domain handshakes between syntaflow.tech and app.syntaflow.tech)
  if (trimmed.startsWith('https://') || trimmed.startsWith('http://')) {
    try {
      const parsed = new URL(trimmed);
      const isTrustedHost =
        parsed.hostname === 'syntaflow.tech' ||
        parsed.hostname === 'app.syntaflow.tech' ||
        parsed.hostname === 'docs.syntaflow.tech' ||
        parsed.hostname === 'localhost' ||
        parsed.hostname === '127.0.0.1';

      if (isTrustedHost) {
        if (parsed.pathname === '/login' || parsed.pathname === '/signup') {
          return fallback;
        }
        return parsed.toString();
      }
      return fallback;
    } catch {
      return fallback;
    }
  }

  // Must begin with a single slash and not protocol-relative double slash
  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) {
    return fallback;
  }

  // Must not contain scheme indicators (:) or backslashes (\)
  if (trimmed.includes(':') || trimmed.includes('\\')) {
    return fallback;
  }

  // Verify it can be parsed as a safe relative path
  try {
    const dummyBase = 'https://syntaflow.tech';
    const parsed = new URL(trimmed, dummyBase);

    // Host must match dummyBase (strictly relative)
    if (parsed.origin !== dummyBase) {
      return fallback;
    }

    // Path must not point to auth loops (/login, /signup)
    if (parsed.pathname === '/login' || parsed.pathname === '/signup') {
      return fallback;
    }

    return parsed.pathname + parsed.search + parsed.hash;
  } catch {
    return fallback;
  }
}

export const sanitizeInternalRedirect = sanitizeReturnUrl;

/**
 * Validates whether a redirect URI conforms strictly to RFC 8252 BCP 212 Section 7.3
 * (Loopback Interface Redirection)
 */
export function isValidLoopbackRedirect(uriString: string): boolean {
  if (!uriString || typeof uriString !== 'string') return false;
  try {
    const url = new URL(uriString);
    if (url.protocol !== 'http:') return false;
    // Strictly IPv4 loopback literal per RFC 8252
    if (url.hostname !== '127.0.0.1') return false;
    // Port must be present and valid
    const port = Number(url.port);
    if (!port || port < 1024 || port > 65535) return false;
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates whether a custom protocol redirect URI is syntaflow://auth/callback
 */
export function isSafeCustomProtocol(uriString: string): boolean {
  if (!uriString || typeof uriString !== 'string') return false;
  try {
    const url = new URL(uriString);
    return url.protocol === 'syntaflow:' && (url.pathname === '//auth/callback' || url.pathname === '/auth/callback' || url.host === 'auth');
  } catch {
    return false;
  }
}
