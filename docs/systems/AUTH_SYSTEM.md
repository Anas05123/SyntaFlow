# Syntaflow — Unified Authentication System & Session Lifecycle

> **Status:** IMPLEMENTED (Unified Appwrite Auth + RFC 8252 Desktop Loopback + LocalAuthProvider)  
> **Last verified:** 2026-09-16  
> **Relevant source areas:**
> - Web: `apps/web/src/services/auth/`, `apps/web/src/pages/auth/`, `apps/web/src/pages/AccountPage.tsx`
> - Desktop: `apps/desktop/electron/auth/`, `apps/desktop/src/app/authService.ts`, `apps/desktop/src/screens/AuthScreen.tsx`
> - Shared Contracts: `packages/contracts/src/auth.ts`, `tests/security/urlSecurity.test.ts`
> **Owner domain:** Identity, Access Control & Security Architecture  

---

## 1. System Purpose & Architecture

Syntaflow employs a unified authentication architecture that connects identity seamlessly across:
1. **Web Platform (`https://syntaflow.tech`):** Appwrite Cloud identity backend, Google OAuth 2.0 PKCE, Email/Password, Account Center (`/account`), Password Recovery (`/forgot-password`), and Desktop Handshake (`/auth/desktop`).
2. **Desktop Client (Syntaflow Desktop on Windows/Electron):** RFC 8252 loopback receiver (`http://127.0.0.1:<port>/callback`), state token CSRF validation, OS `safeStorage` token encryption (DPAPI/Keychain), and offline continuity with preserved local accounts.

```
┌────────────────────────────────────────────────────────────────────────┐
│ Web Platform (syntaflow.tech)                                          │
│                                                                        │
│  /signup  /login  /forgot-password  /account  /auth/desktop            │
│        │                                                               │
│        ▼                                                               │
│  AuthContext.tsx ──► appwriteClient.ts ──► Appwrite Cloud Auth API     │
└────────┬───────────────────────────────────────────────────────────────┘
         │ (RFC 8252 BCP-212 Loopback Handshake on 127.0.0.1:<port>/callback)
         ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Desktop Runtime (Electron Main Process)                                │
│                                                                        │
│  AuthScreen.tsx ──► authService.ts ──► preload.cjs (contextBridge)    │
│                                              │                         │
│                                              ▼                         │
│  main.cjs ──► AuthService ──► LocalAuthProvider (with loopback server) │
│                                      │                                 │
│                                      ▼                                 │
│                   safeStorage DPAPI encrypted auth-store.json          │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Architectural & Security Rules

1. **Google Identity Scope Isolation (Non-Negotiable):**
   - Google Sign-In requests **STRICTLY** identity scopes: `['openid', 'email', 'profile']`.
   - Never request Workspace permissions (`gmail.modify`, `calendar`, `drive.file`) during identity login. Workspace integrations are connected separately inside the desktop Settings panel.
2. **RFC 8252 BCP-212 Compliance:**
   - Desktop launches an ephemeral HTTP server on `127.0.0.1:<port>/callback` with an unprivileged port ($ge 1024$).
   - Cryptographically random single-use state token prevents CSRF.
   - Redirect URIs are strictly validated against `isValidLoopbackRedirect` to prevent open redirect vulnerabilities.
3. **OS-Backed Credential Encryption:**
   - Appwrite JWT session tokens and local credentials are encrypted using Electron's OS-backed `safeStorage` (Windows DPAPI, macOS Keychain).
   - In environments without OS keychain, falls back to AES-256-GCM using hashed machine path keys.
4. **Offline First & Continuity:**
   - Cached sessions in `safeStorage` permit instant offline access to local workspaces with zero network dependency.
   - Local accounts (`usr_owner_default`) are linked and preserved alongside browser-authenticated accounts.
5. **No Billing / Unrestricted Preview ($0):**
   - The active account tier is `Desktop Preview` ($0 Active).
   - Unconstrained access to local-first client management, SQLite sovereignty, and review pipelines.

---

## 3. Web Pages & Endpoints

| Route | Functionality | Security & Features |
|---|---|---|
| `/login` | Sign in via Email/Password or Google OAuth | Google branding compliant, `returnTo` validation, auto-redirect if session active |
| `/signup` | Register new account (Name, Email, Password) | Password minimum 8 chars, terms consent, automatic session setup |
| `/forgot-password` | Request recovery email & reset token flow | Detects `userId` & `secret` query params; updates password via Appwrite |
| `/account` | Minimalist developer Account Center | Display name editing, email view, password change, active Preview ($0) plan badge, connected device sessions list with remote revocation, desktop installer download |
| `/auth/desktop` | Operator approval for desktop client | Handshake visualization, verifies loopback redirect URI, generates Appwrite session code, fallback manual code copy |

---

## 4. Verification & Status

- **Shared Contracts:** `packages/contracts/src/auth.ts` validates `UserProfile`, `AccountPlan`, `DeviceSession`, and `checkEntitlement()`.
- **URL Security Tests:** `tests/security/urlSecurity.test.ts` validates open redirect prevention, RFC 8252 loopback validation, and custom protocols.
- **Production Build:** `npm --prefix apps/web run build` and `npm --prefix apps/desktop run build` pass with 0 errors.
