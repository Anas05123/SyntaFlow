# CoreDesk — Authentication System & Session Lifecycle

> **Status:** IMPLEMENTED (LocalAuthProvider) / SPECIFIED (WebAuthProvider)  
> **Last verified:** 2026-09-14  
> **Relevant source areas:** `apps/desktop/electron/auth/`, `apps/desktop/src/app/authService.ts`, `apps/desktop/src/screens/AuthScreen.tsx`, `tests/unit/auth-service.spec.ts`  
> **Owner domain:** Desktop Security & Authentication  

---

## 1. System Purpose & Architecture

CoreDesk employs a decoupled authentication architecture ensuring that the React renderer remains agnostic of whether credentials and sessions are handled locally or via cloud services.

```
┌─────────────────────────────────────────────────────────┐
│ React Renderer (Unprivileged Sandbox)                   │
│                                                         │
│  AuthScreen.tsx / AccountMenu.tsx                       │
│        │                                                │
│        ▼                                                │
│  authService.ts (Client Abstraction)                    │
└────────┼────────────────────────────────────────────────┘
         │ window.coreDeskDesktop.auth (Preload Bridge)
         ▼
┌─────────────────────────────────────────────────────────┐
│ Electron Main Process (Privileged Node.js)              │
│                                                         │
│  AuthService (Backend Coordinator & Input Validation)   │
│        │                                                │
│        ▼                                                │
│  AuthProvider (Abstract Interface)                      │
│        ├── LocalAuthProvider    [CURRENT: Desktop-Only] │
│        └── WebAuthProvider      [FUTURE: Cloud/API]     │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Current Implementation: `LocalAuthProvider`

For the desktop-only operational phase, email and password authentication is fully functional, secure, and self-contained on the operator's machine.

### Security Invariants:
1. **Zero Plaintext Passwords:** Passwords are never written to disk or logged. They are hashed using Node.js `crypto.scrypt` with a cryptographically secure 16-byte random salt (`N=16384, r=8, p=1`).
2. **Timing-Safe Verification:** Password verification uses `crypto.timingSafeEqual` over fixed-length hash buffers to prevent timing side-channel attacks.
3. **Encrypted Session Material:** Active session tokens (`cd_sess_...`) are persisted in `userData/auth-store.json`. The token is encrypted using Electron's OS-backed `safeStorage` (Windows DPAPI, macOS Keychain, Linux Secret Service).
4. **Data Preservation on Sign-Out:** Signing out clears the active session record in `auth-store.json` but never deletes or resets local workspace SQLite or relational store data.
5. **Session Expiry:** Sessions have an enforced 30-day lifespan. Expired sessions are automatically cleared upon startup resolution.

### Local Auth Data Model (`userData/auth-store.json`)
```json
{
  "version": 1,
  "users": [
    {
      "id": "usr_owner_default",
      "email": "anas@northlight.studio",
      "name": "Anas Ayari",
      "workspaceName": "Northlight Studio",
      "salt": "<16_BYTE_HEX_SALT>",
      "passwordHash": "<64_BYTE_SCRYPT_HEX_HASH>",
      "createdAt": "2026-09-14T00:00:00.000Z"
    }
  ],
  "activeSession": {
    "userId": "usr_owner_default",
    "tokenEnvelope": {
      "encrypted": true,
      "ciphertext": "<BASE64_SAFESTORAGE_BLOB>"
    },
    "createdAt": "2026-09-14T00:00:00.000Z",
    "expiresAt": "2026-10-14T00:00:00.000Z"
  }
}
```

---

## 3. UI States & Form Lifecycle

The authentication card in `AuthScreen.tsx` provides both **Sign In** and **Create Account** modes while maintaining CoreDesk's graphite aesthetic and lifecycle orbit visual:

| State / Error | Trigger | Displayed Response |
|---|---|---|
| **Signing in...** | Submitting credentials in Sign In mode | Disabled submit button with spinning status glyph |
| **Creating account...** | Submitting details in Create Account mode | Disabled submit button with spinning status glyph |
| **Invalid credentials** | Email not found or scrypt hash mismatch | Inline alert badge: *"Invalid email or password."* |
| **Account already exists** | Sign-up with pre-existing normalized email | Inline alert badge: *"Account already exists"* |
| **Passwords do not match** | Password mismatch in sign-up form | Inline alert badge: *"Passwords do not match"* |
| **Session expired** | Restoring a session where `expiresAt <= Date.now()` | Redirects to Auth screen |
| **Unexpected local auth error** | IPC or filesystem error in main process | Inline alert badge: *"Unexpected local auth error"* |

---

## 4. Future Implementation: `WebAuthProvider` (Migration Path)

In future phases where CoreDesk integrates with a hosted marketing website and cloud sync:
1. `WebAuthProvider` will implement the existing `AuthProvider` interface without modifying `AuthScreen` or `authService.ts`.
2. Flow:
   ```
   User clicks Sign In
         ↓
   System opens browser to https://coredesk.app/signin
         ↓
   User authorizes account on website
         ↓
   Browser redirects to custom protocol: coredesk://auth?token=<JWT>
         ↓
   Electron app receives protocol deep link via second-instance / open-url
         ↓
   WebAuthProvider validates JWT and encrypts into local safeStorage
   ```
3. The local and web providers can coexist or transition seamlessly behind the same IPC contract.
