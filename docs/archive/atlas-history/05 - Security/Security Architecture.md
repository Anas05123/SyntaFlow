> Historical archive — Atlas was the former working name of CoreDesk.
> This document is not a current source of truth.

---

﻿---
title: Security Architecture
project: Project Atlas
product: AI Agency OS
version: 1.0
status: Approved Foundation
owners:
  - Founder
  - CTO
last_updated: 2026-08-03
---

# Security Architecture

## 1. Purpose

This document defines the security boundaries, controls, permissions, threat model, and mandatory implementation rules for AI Agency OS.

Security is a product requirement, not optional polish.

The system must protect:

- User data
- Business and client information
- AI memory
- Generated website projects
- Deployment credentials
- Optional API keys
- Local files
- Database integrity
- Application updates
- The user’s computer

---

## 2. Core Security Principles

1. Secure by default.
2. Least privilege.
3. Defense in depth.
4. Local-first data ownership.
5. Deny access unless explicitly allowed.
6. Never trust external content.
7. Never expose secrets to the renderer.
8. Never expose secrets to generated websites.
9. Validate every IPC request.
10. Validate all AI-generated structured output.
11. Sensitive actions require user approval.
12. Security failures must fail safely.
13. Logs must never expose credentials.
14. Dependencies must be reviewed and updated.
15. Generated code must run outside the main application environment.

---

## 3. Protected Assets

### Critical Assets

- Deployment tokens
- API keys
- Optional cloud AI credentials
- Database contents
- Atlas memory
- Client contact information
- Generated website source code
- Backup archives
- Plugin permissions
- Application signing credentials

### Sensitive Assets

- Campaign notes
- Business research
- Outreach drafts
- User preferences
- Website briefs
- Uploaded logos and images
- AI prompts and generated responses
- Local activity history

### Public or Low-Sensitivity Assets

- Public business names
- Public business websites
- Public business addresses
- Publicly available website content
- Non-sensitive templates

Public information must still be handled responsibly.

---

## 4. Main Threats

The architecture must defend against:

- Malicious websites
- Cross-site scripting
- Renderer compromise
- Unsafe Electron configuration
- Malicious IPC requests
- Exposed API keys
- Prompt injection
- Malicious generated code
- Unsafe dependencies
- Plugin abuse
- Path traversal
- Command injection
- SQL injection
- Server-side request forgery
- Untrusted file uploads
- Database corruption
- Unauthorized deployment
- Destructive AI actions
- Malicious updates
- Backup theft
- Sensitive information inside logs

---

## 5. Trust Boundaries

```text
User
  ↓
Trusted Application UI
  ↓
Preload Security Bridge
  ↓
Main Process and Application Services
  ↓
Database / Files / Workers / Secure Storage

External Boundaries:
- Business websites
- Discovery providers
- Ollama
- Optional cloud AI providers
- Deployment providers
- Plugins
- Generated website projects
- Imported files
```

Everything crossing a trust boundary must be validated.

---

## 6. Electron Security Configuration

Every application window must use secure settings.

```typescript
const window = new BrowserWindow({
  webPreferences: {
    preload: preloadPath,
    nodeIntegration: false,
    contextIsolation: true,
    sandbox: true,
    webSecurity: true,
    allowRunningInsecureContent: false,
    experimentalFeatures: false,
  },
});
```

Mandatory rules:

- `nodeIntegration` remains disabled.
- `contextIsolation` remains enabled.
- Renderer sandboxing remains enabled.
- `webSecurity` must never be disabled.
- Insecure mixed content is forbidden.
- Experimental browser features are disabled.
- Remote content never receives Node.js access.
- Electron APIs are never exposed directly.
- Only narrow, typed preload functions may be exposed.
- New window creation is denied by default.
- Navigation outside approved locations is denied.
- External links are validated before opening.
- Unexpected permissions are denied.
- A restrictive Content Security Policy is required.
- The application must use a supported Electron version.

---

## 7. Content Security Policy

The production application must use a restrictive Content Security Policy.

Foundation policy:

```text
default-src 'self';
script-src 'self';
style-src 'self';
img-src 'self' data: blob:;
font-src 'self';
connect-src 'self' http://127.0.0.1:*;
object-src 'none';
frame-src 'none';
base-uri 'none';
form-action 'none';
```

Rules:

- No `unsafe-eval` in production.
- No unrestricted remote scripts.
- No remote JavaScript CDNs.
- No inline executable scripts unless securely handled.
- Allowed network destinations must be explicit.
- Development exceptions must never enter production builds.

---

## 8. Preload Bridge

The preload bridge exposes only approved functions.

Bad design:

```typescript
contextBridge.exposeInMainWorld("electron", {
  ipcRenderer,
  fs,
  shell,
});
```

Approved design:

```typescript
contextBridge.exposeInMainWorld("atlas", {
  campaigns: {
    list: () => ipcRenderer.invoke("campaigns:list"),
    read: (id: string) => ipcRenderer.invoke("campaigns:read", { id }),
  },
});
```

Rules:

- Never expose complete Electron modules.
- Never expose Node.js filesystem access.
- Never expose shell execution.
- Never expose unrestricted IPC.
- Every function must have a narrow purpose.
- Every argument must be validated in the main process.
- Returned data must follow typed schemas.

---

## 9. IPC Security

Every IPC channel must define:

- Channel name
- Allowed sender
- Input schema
- Output schema
- Required permission
- Possible errors
- Audit behavior

Example:

```typescript
interface SecureIPCHandler<TInput, TOutput> {
  channel: string;
  permission: Permission;
  inputSchema: Schema<TInput>;
  outputSchema: Schema<TOutput>;
  handler: (input: TInput, context: IPCContext) => Promise<TOutput>;
}
```

Rules:

- Validate the sender.
- Validate every input.
- Reject unknown fields when appropriate.
- Never trust renderer-provided file paths.
- Never trust renderer-provided commands.
- Never trust renderer-provided URLs.
- Use identifiers instead of raw filesystem paths.
- Return safe errors without internal secrets.
- Destructive IPC requests require confirmation tokens.

---

## 10. Secret Storage

Secrets include:

- API keys
- Deployment tokens
- OAuth tokens
- Provider credentials
- Encryption keys
- Future licensing credentials

Rules:

- Secrets must never be hard-coded.
- Secrets must never be committed to Git.
- Secrets must never appear in frontend code.
- Secrets must never be sent to generated websites.
- Secrets must never appear in logs.
- Secrets must never be stored as plain text in SQLite.
- Production secrets must not depend on `.env` files.
- `.env` files are permitted only for local development.
- Development `.env` files must be ignored by Git.

Version 1 will use operating-system-protected credential storage through a dedicated Secure Storage Service.

```text
Application Module
        ↓
Credential Service
        ↓
Electron Safe Storage / OS Protection
```

Only the owning integration receives access to its credential.

The UI may display:

```text
Vercel Token: Connected
```

The UI must never display the complete secret again.

---

## 11. Credential Permissions

Every credential must define:

- Provider
- Purpose
- Creation date
- Last-used date
- Allowed capabilities
- Environment
- Revocation state

Credentials should use the minimum required provider permissions.

The user must be able to:

- Add a credential
- Test it
- Replace it
- Revoke it
- Delete it
- See where it is used

---

## 12. Database Security

SQLite is the local source of truth for Version 1.

Rules:

- The renderer never accesses SQLite directly.
- Database access occurs through repositories.
- All queries use parameterized statements.
- Migrations are versioned.
- Destructive migrations require backups.
- Multi-record changes use transactions.
- Database files use restrictive operating-system permissions.
- Database corruption checks run during startup and backup.
- Sensitive secrets remain outside the database.
- Imported database files are never trusted automatically.

Version 1 must not falsely claim complete database encryption.

Before commercial release, we will evaluate:

- SQLCipher
- Field-level encryption
- User-password-protected workspaces

---

## 13. Filesystem Security

All application-owned files must remain inside approved directories.

Example:

```text
Project Atlas Data/
├── database/
├── projects/
├── assets/
├── backups/
├── exports/
├── logs/
├── cache/
└── temporary/
```

Rules:

- Normalize and validate every path.
- Reject path traversal such as `../`.
- Use generated internal identifiers for files.
- Never allow arbitrary writes outside approved directories.
- Imported files are copied into controlled storage.
- Temporary files are deleted after use.
- File extensions are not trusted as proof of file type.
- Maximum file sizes must be enforced.
- Dangerous executable files are rejected.

---

## 14. Uploaded Asset Security

Supported assets may include:

- Images
- Logos
- Text documents
- Approved website assets

Rules:

- Validate file type using content inspection.
- Validate file size.
- Sanitize filenames.
- Generate a new internal filename.
- Remove unnecessary metadata when appropriate.
- Never execute uploaded files.
- Never load uploaded HTML as trusted application UI.
- SVG files must be sanitized or converted before trusted display.

---

## 15. Generated Website Isolation

Generated websites are untrusted until validated.

They must never run inside the privileged application renderer.

```text
AI Output
    ↓
Isolated Project Workspace
    ↓
Dependency Validation
    ↓
Static Analysis
    ↓
Build Process
    ↓
Sandboxed Preview
    ↓
User Approval
```

Generated websites must not access:

- AI Agency OS source code
- Local database
- Credential storage
- User documents
- Application configuration
- Deployment tokens
- GitHub credentials
- Other generated projects

---

## 16. Generated Code Rules

Generated code must pass:

- Dependency allowlist checks
- Secret scanning
- Static analysis
- Build validation
- Path validation
- Script validation
- Content Security Policy checks
- Basic accessibility tests
- Link safety checks

Forbidden by default:

- Arbitrary shell commands
- Post-install scripts from unknown dependencies
- Reading environment secrets
- Accessing parent directories
- Unapproved network destinations
- Dynamic remote script loading
- Hidden cryptocurrency mining
- Obfuscated code
- Automatic deployment

---

## 17. Website Preview Security

Website previews must use an isolated environment.

Rules:

- No Node.js integration.
- No access to application preload APIs.
- No access to application cookies.
- No application credentials.
- Separate session partition.
- Navigation is restricted.
- Popup creation is denied.
- Downloads are disabled unless approved.
- External links open only after validation.
- Preview crashes must not crash the main application.

---

## 18. AI Security

All external content provided to AI is untrusted.

Examples:

- Website text
- Imported documents
- Business descriptions
- Plugin output
- Search results
- Generated code
- User-provided files

Prompt-injection defenses:

- External content is marked as untrusted data.
- Retrieved text cannot override system rules.
- Tool permissions are enforced outside the model.
- The model never receives direct credentials.
- The model never decides its own permissions.
- Sensitive actions require application-level approval.
- AI output is validated before saving.
- AI suggestions are not automatically treated as facts.

---

## 19. Atlas Tool Security

Atlas tools are separated by permission level.

### Read

- Read campaign
- Search businesses
- Read website version
- Read CRM status
- Search knowledge

### Draft

- Draft outreach
- Draft website brief
- Draft proposal
- Suggest next actions

### Modify

- Update business record
- Save campaign note
- Create website version

### External

- Send outreach
- Deploy website
- Connect provider
- Publish content

### Destructive

- Delete campaign
- Delete business
- Remove project
- Revoke credential
- Delete backup

External and destructive actions always require explicit confirmation.

---

## 20. Discovery and Enrichment Security

Business discovery retrieves untrusted external information.

Rules:

- Use HTTPS where available.
- Apply request timeouts.
- Apply response-size limits.
- Restrict redirects.
- Validate destination URLs.
- Block local network destinations.
- Block private IP ranges.
- Block file protocols.
- Block unsupported protocols.
- Sanitize retrieved text before display.
- Never execute website scripts during enrichment.
- Never download arbitrary executables.

---

## 21. SSRF Protection

The application must prevent external URLs from reaching protected local services.

Block requests to:

- `localhost`
- `127.0.0.0/8`
- Private IPv4 ranges
- Link-local addresses
- Private IPv6 ranges
- Cloud metadata endpoints
- `file://`
- `ftp://`
- Unsupported protocols

Redirect destinations must be checked again after every redirect.

---

## 22. Plugin Security

Plugins are not trusted automatically.

Every plugin must declare:

- Plugin identifier
- Version
- Publisher
- Requested permissions
- Network access
- Filesystem access
- AI access
- Database capabilities
- External providers
- Update source

Permission examples:

```text
businesses.read
businesses.write
campaigns.read
ai.request
network.request
deployment.execute
files.export
```

Rules:

- Plugins receive only approved capabilities.
- Plugins never receive raw database access.
- Plugins never receive unrestricted filesystem access.
- Plugins never receive complete credential storage access.
- Plugin permissions are visible to the user.
- Removing a plugin must not corrupt core data.
- Plugin execution must be isolated where practical.
- Unsigned plugins require a clear warning.

The public plugin marketplace is outside Version 1.

---

## 23. Deployment Security

Before deployment, the system must validate:

- Target provider
- Project identity
- Build result
- Environment variables
- Secret references
- Deployment destination
- User approval
- Rollback information

Rules:

- Deployment tokens remain inside Secure Storage.
- Tokens are injected only into the deployment process.
- Tokens are never written into generated files.
- Deployment logs redact secrets.
- Failed deployment preserves the previous live version.
- Automatic deployment is disabled by default.
- Production deployment requires confirmation.

---

## 24. Network Security

Rules:

- Prefer HTTPS and WSS.
- Reject invalid TLS certificates.
- Apply connection timeouts.
- Apply retry limits.
- Apply response-size limits.
- Use provider-specific allowlists where possible.
- Do not silently disable certificate checks.
- Do not send user data to optional providers unless enabled.
- Display what information will leave the computer.

---

## 25. Logging Security

Logs may contain:

- Event time
- Operation identifier
- Module
- Result
- Error code
- Duration
- Retry count
- Non-sensitive diagnostic information

Logs must never contain:

- API keys
- Passwords
- Access tokens
- Complete private messages
- Deployment secrets
- Encryption keys
- Hidden AI reasoning
- Unnecessary personal data

Logs must support:

- Redaction
- Rotation
- Maximum size
- Retention limits
- User deletion
- Export for debugging

---

## 26. Audit Events

Security-relevant actions must produce audit events.

Examples:

- Credential added
- Credential tested
- Credential deleted
- Provider enabled
- External AI enabled
- Website deployed
- Outreach sent
- Plugin installed
- Plugin permission changed
- Backup restored
- Destructive deletion confirmed
- Security setting changed

Audit history must not store secret values.

---

## 27. Backup Security

Backups may contain sensitive business information.

Rules:

- Backups are created from consistent database states.
- Backup integrity is verified.
- Existing backups are never silently overwritten.
- Backup location is visible to the user.
- Password-protected encrypted backup export will be supported.
- Restore operations require confirmation.
- A safety backup is created before restoration.
- Failed restoration returns to the previous valid state.

---

## 28. Update and Release Security

Production releases must use:

- Reproducible build configuration
- Dependency lockfiles
- Automated tests
- Security checks
- Signed release artifacts
- Verified update metadata
- Controlled release channels
- Rollback capability

The application must never install an update from an unverified source.

Release channels:

```text
Development
Beta
Stable
```

Stable releases must not automatically install untested development builds.

---

## 29. Dependency Security

Before adding a dependency, Codex must document:

- Purpose
- Why existing code cannot handle it
- Maintenance status
- License
- Package size
- Security risk
- Replacement difficulty

Rules:

- Use exact lockfiles.
- Remove unused dependencies.
- Avoid abandoned packages.
- Avoid unnecessary native modules.
- Review install scripts.
- Run dependency security checks.
- Keep Electron, Chromium and Node dependencies updated.
- Critical vulnerabilities block release.

---

## 30. Development Security

Development rules:

- No secrets in source control.
- No production credentials in test data.
- Separate development and production configurations.
- Branch protection before commercial release.
- Every security-sensitive change receives review.
- Tests must include permission failures.
- Test fixtures use fake data.
- Debug features are disabled in production.
- Developer tools are not automatically exposed in production.
- Production builds remove verbose internal errors.

---

## 31. Security Testing

Required security tests:

- IPC input validation
- IPC sender validation
- Path traversal
- SQL injection
- Command injection
- XSS
- Content Security Policy
- Navigation blocking
- Popup blocking
- External-link validation
- Secret redaction
- Credential access control
- Plugin permission checks
- Generated project isolation
- SSRF protection
- Backup integrity
- Restore recovery
- Update verification

---

## 32. Incident Response

When a security issue is discovered:

1. Record the issue privately.
2. Identify affected versions.
3. Determine exposed assets.
4. Disable the dangerous feature if necessary.
5. Produce a fix.
6. Test the fix.
7. Rotate affected credentials.
8. Release a signed security update.
9. Inform affected users clearly.
10. Document prevention actions.

Security issues must not be hidden or silently ignored.

---

## 33. Security Severity Levels

| Severity | Meaning                                                                  |
| -------- | ------------------------------------------------------------------------ |
| Critical | Credential theft, remote code execution, destructive unauthorized access |
| High     | Sensitive data exposure, authentication bypass, deployment compromise    |
| Medium   | Limited unauthorized access, privacy leak, unsafe default                |
| Low      | Minor information exposure or hardening weakness                         |

Critical and High vulnerabilities block release.

---

## 34. Security Acceptance Criteria

- [ ] Renderer processes have no direct Node.js access.
- [ ] Context isolation is enabled.
- [ ] Renderer sandboxing is enabled.
- [ ] A restrictive CSP is configured.
- [ ] Navigation and popup creation are restricted.
- [ ] IPC senders and inputs are validated.
- [ ] Secrets use Secure Storage.
- [ ] Secrets never appear in logs.
- [ ] UI code cannot access the database directly.
- [ ] Generated websites run separately from the application.
- [ ] Generated code cannot access application credentials.
- [ ] Atlas permissions are enforced outside the model.
- [ ] External AI providers are disabled by default.
- [ ] Plugins use explicit permissions.
- [ ] Deployment requires approval.
- [ ] Backups are integrity-checked.
- [ ] Updates are signed before commercial release.
- [ ] Critical vulnerabilities block releases.
- [ ] Security tests run before release.

---

## 35. Architecture Decisions

### ADR-SEC-001 — Secure Electron Renderer

**Decision:** Renderer processes use context isolation, sandboxing and no Node.js integration.

**Reason:** A compromised interface must not gain direct operating-system access.

### ADR-SEC-002 — OS-Protected Secret Storage

**Decision:** Credentials are stored through a dedicated OS-protected Secure Storage Service.

**Reason:** Plain-text storage and frontend access are unacceptable.

### ADR-SEC-003 — Generated Projects Are Untrusted

**Decision:** Generated website projects run in isolated workspaces.

**Reason:** AI-generated code must never inherit application privileges.

### ADR-SEC-004 — Permission Enforcement Outside AI

**Decision:** Atlas permissions are enforced by application services, not model instructions.

**Reason:** AI instructions alone are not a security boundary.

### ADR-SEC-005 — External Providers Are Opt-In

**Decision:** Cloud AI and external integrations remain disabled until explicitly enabled.

**Reason:** The user controls data leaving the computer.

### ADR-SEC-006 — No False Encryption Claims

**Decision:** Version 1 will not claim complete local database encryption unless it is implemented and verified.

**Reason:** Honest security guarantees are more important than marketing language.

---

## 36. Next Action

Create the Module and Plugin Architecture after this security foundation is approved.

