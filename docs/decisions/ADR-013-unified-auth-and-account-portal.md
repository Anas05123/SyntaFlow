# ADR-013: Unified Web Identity & Decoupled Account Portal Architecture

- **Status:** Accepted
- **Date:** 2026-09-17
- **Relevant areas:** `apps/web/src/App.tsx`, `apps/web/src/components/account/`, `apps/web/src/pages/auth/`, `apps/web/src/pages/onboarding/`, `apps/web/src/content/pricingConfig.ts`
- **Owner:** Web Platform & Authentication Architecture

---

## Context

Syntaflow requires a unified identity foundation across:
1. Public marketing and documentation (`syntaflow.tech`).
2. Syntaflow Desktop runtime pairing (`syntaflow://auth/callback`).
3. Account management, device session management, and license verification (`app.syntaflow.tech` / `/account`).

The previous web implementation suffered from visual and structural conflation: marketing headers and footers leaked into authentication and account views, competing CTAs ("Download" vs "Get Syntaflow") fractured user attention, and pricing tiers lacked a single canonical configuration.

---

## Decision

1. **Four Decoupled Visual Layout Environments:**
   - **Public Marketing Website**: Minimal, focused navigation (`Features`, `Integrations`, `Docs`, `Pricing`, single `Sign in` button). Animated `FlowCanvas` hero pipeline communicating context flow across the client lifecycle.
   - **Dedicated Cinematic Auth Shell (`AuthLayout`)**: Split-screen layout for `/login`, `/signup`, `/forgot-password`, and `/auth/desktop` with ambient atmospheric lighting, zero marketing navigation or footer leakage, and explicit return redirection sanitization.
   - **Guided Multi-Step Onboarding (`OnboardingFlow`)**: 5-step interactive journey (`/onboarding`) with progress bar, role selection, workspace naming, desktop download card, and ready checklist.
   - **Dedicated Account Application Shell (`AccountShell`)**: Modern application sidebar with categorized navigation (Overview, Account, Product, Resources), desktop installer teaser card, user avatar/plan badge popover, and dedicated views for Home, Profile, Plan & Billing, Active Sessions, Downloads, Tutorials, and Desktop Connection.

2. **Canonical Pricing & Capabilities Configuration (`pricingConfig.ts`):**
   - Both the public `/pricing` page and the authenticated `/account/plan` page consume a shared immutable configuration.
   - Accurately conveys that Syntaflow is in free public Desktop Preview ($0), while Pro and Team tiers are planned for GA. Zero fake card processing or deceptive checkout flows.

3. **Gated Download Architecture:**
   - Public `/download` page educates visitors and requires signing in to download (`Sign in to download →`), redirecting to `/account/downloads` where operators receive verified installer links, SHA-256 integrity hashes, system requirements, and installation guides.

4. **Subdomain Infrastructure & Routing (`app.syntaflow.tech`):**
   - The authenticated account portal is served on a dedicated subdomain: `https://app.syntaflow.tech`.
   - Hosted on Appwrite Sites (`6aa9e72b0015dc2d9493`) with CNAME alias `app` pointing to `appwrite.network` on Name.com.
   - Appwrite Web Platform settings configured to accept CORS, session cookies, and OAuth callbacks across both origins.
   - Unauthenticated visitors hitting `app.syntaflow.tech` are immediately and safely bounced to `https://syntaflow.tech/login?returnTo=...` via `AccountShell` auth guard.
   - Post-authentication return URL is validated by `sanitizeReturnUrl` in `urlSecurity.ts` to allow trusted Syntaflow hostnames while strictly blocking open redirect vulnerabilities.
   - All `app.syntaflow.tech` surfaces inject `robots: noindex, nofollow` to isolate private operator data from search indexing.

5. **Security & OAuth Scoping:**
   - Google OAuth is strictly limited to identity scopes (`openid`, `email`, `profile`). Third-party Google Workspace scopes (Drive, Gmail, Calendar) remain managed strictly inside the local desktop app via DPAPI-encrypted credential vaults.

---

## Consequences

- Clean separation of concerns between marketing acquisition (`syntaflow.tech`) and operational account management (`app.syntaflow.tech`).
- Complete visual consistency with modern software standards (dark graphite, cyan/cobalt atmospheric glow, responsive across all viewports).
- Zero regression across 39 routes and 7 viewports verified via Playwright.
