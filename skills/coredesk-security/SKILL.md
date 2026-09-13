---
name: coredesk-security
description: Use for CoreDesk sandboxing, preload bridge contracts, guest review authorization, access grants, and secret management.
---

# CoreDesk Security Skill

## Purpose
Use when auditing process boundaries, modifying access grants, configuring guest review tokens, or handling authentication secrets.

## Required Reading (Read First)
1. [`docs/security/SECURITY_MODEL.md`](file:///c:/Users/Anas/Desktop/CoreDesk/docs/security/SECURITY_MODEL.md)
2. [`docs/security/ACCESS_MODEL.md`](file:///c:/Users/Anas/Desktop/CoreDesk/docs/security/ACCESS_MODEL.md)
3. [`docs/architecture/ELECTRON_ARCHITECTURE.md`](file:///c:/Users/Anas/Desktop/CoreDesk/docs/architecture/ELECTRON_ARCHITECTURE.md)

## Key Source Directories
- `apps/desktop/electron/preload.cjs`
- `apps/desktop/src/screens/ShareSetupScreen.tsx`
- `apps/desktop/src/screens/guest/`
- `tests/security/`

## Non-Negotiable Rules
- **Non-Transitive Access**: Access to one document or project never grants access to sibling resources.
- **Private Note Redaction**: Operator private notes (`client.privateNote`, `document.internalNote`) must be strictly stripped before any payload is sent to guest review views.
- **Preload Isolation**: Keep the context bridge minimal. Validate all parameters with Zod schemas.
- **No Token Logging**: Never log plain-text access tokens or authentication secrets to the console or disk logs.

## Validation Commands
```bash
npm run test:security
```

## Post-Work Documentation Updates
- Update [`docs/security/SECURITY_MODEL.md`](file:///c:/Users/Anas/Desktop/CoreDesk/docs/security/SECURITY_MODEL.md) if threat models or mitigations change.
- Update [`docs/security/ACCESS_MODEL.md`](file:///c:/Users/Anas/Desktop/CoreDesk/docs/security/ACCESS_MODEL.md) if permission roles or grant lifecycles change.
