# CoreDesk Web Boundary

> **Status**: Reserved boundary only.  
> **Phase**: Planned (Future Phase).  
> **Notice**: No website application dependencies or code are implemented here during Phase 1 consolidation.

---

## 1. Scope & Future Responsibilities

`apps/web` is the designated location for the future CoreDesk marketing website, client portal, and browser-based authentication services:

- **Marketing & Product Narrative**: Value proposition, interactive product tours, and high-fidelity screenshots for prospective agency principals.
- **Pricing & Subscriptions**: Tiered license management, checkout flows, and Stripe customer portal integrations.
- **Application Downloads**: Code-signed release distribution channels for macOS and Windows desktop binaries.
- **Documentation & Customer Support**: Public knowledge base, guides, and onboarding material.
- **Browser-Based Authentication**: Web authentication flows with email magic links, passkeys, and OAuth providers.
- **Desktop Deep-Link Callback**: Secure browser-to-desktop handoff protocol (`coredesk://auth/callback?token=...`) allowing users to authenticate via their browser and seamlessly return to `apps/desktop`.
- **Account & Billing Management**: Organization seat management, invoices, and cloud synchronization settings.

---

## 2. Architecture Invariants

1. **No Shared Privilege**: The web application will run in a standard browser sandbox with no direct access to the local desktop filesystem or SQLite database.
2. **Standard Protocol Handshake**: Desktop authentication transitions must strictly adhere to the deep-link verification protocol outlined in `docs/security/SECURITY_MODEL.md` and `docs/architecture/SYSTEM_ARCHITECTURE.md`.
3. **No Premature Implementation**: Website code (Next.js, Tailwind, marketing components) will be initialized only when explicitly scheduled.
