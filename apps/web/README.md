# Syntaflow Official Website (`apps/web`)

> **Status**: MASTER BUILD COMPLETE (v3 Verified)  
> **Domain**: `syntaflow.tech` (strictly locked, never `.com`)  
> **Aesthetic Mandate**: Anti-hype restraint. Grounded executive graphite (`#0B0D0F`), Sora display typography, Inter reading scale, and zero generic AI clichés.  
> **Build Target**: React 19, TypeScript 6, Vite 8, Oxlint  

---

## 1. Executive Summary

`apps/web` contains the official production marketing and documentation website for Syntaflow (`syntaflow.tech`). It is engineered with architectural restraint, strict truth-in-advertising discipline, and zero runtime performance bloat:
- **Zero AI Clichés**: Suppressed gradient washes, floating 3D orbs, glowing brains, and fake automation badges.
- **Product Reality**: Primary navigation and homepage features reflect the actual desktop application built today (Clients, Blueprints, Dual-Density Tasks, Paper Canvas Studio, Review Transmissions, and Delivery Gates).
- **Roadmap Discipline**: Planned AI TaskRouter, cloud portals, and developer platforms live exclusively on `/roadmap` tagged as `PLANNED DIRECTION`.
- **Performance & Motion Budget**: Native CSS scroll reveals (`animation-timeline: view()`) with zero JS runtime overhead; complex sequenced motion reserved solely for the 7-stage interactive Product Workflow demonstration.
- **Automated Verification**: Full headless test suite (`verify-web.mjs`) validating 22 routes across 5 canonical viewports (375px to 1920px) with 0 errors.

---

## 2. Information Architecture (31 Canonical Indexable Routes)

- **Homepage**: `/` — Syntaflow — Connected Workspace for Client Work
- **Product Suite**:
  - `/product` — Client Work Management Software | Syntaflow (System Architecture & Full Lifecycle)
  - `/product/client-management` — Client Management Workspace | Syntaflow (Contacts, retainers, decisions, access)
  - `/product/projects` — Client Project Management Software | Syntaflow (Blueprints, dual-density tasks, milestones)
  - `/product/documents` — Client Document Workflow & Version Management | Syntaflow (780px canvas, immutable DocVersions, diffs)
  - `/product/reviews-approvals` — Client Review & Approval Software | Syntaflow (Exact snapshot binding, authority, delivery gate)
  - `/product/ai-workspace` — Context-Aware AI Workspace for Client Work | Syntaflow (Local TaskRouter, zero cloud training, human verification)
- **Solutions Suite**:
  - `/solutions` — Solutions for Client-Facing Work | Syntaflow (Cross-practice overview)
  - `/solutions/agencies` — Client Management Software for Agencies | Syntaflow (Multi-client handoffs, SLA tracking, asset reviews)
  - `/solutions/freelancers` — Client Management Software for Freelancers | Syntaflow (Solo throughput, proposal-to-delivery, offline focus)
  - `/solutions/consultants` — Client Management Software for Consultants | Syntaflow (Meeting notes, advisory deliverables, NDA confidentiality)
  - `/solutions/studios` — Client Management Software for Studios | Syntaflow (Creative context, asset handover)
- **Integrations Suite (Phase 5)**:
  - `/integrations` — Syntaflow Integrations — Connect Your Work Tools
  - `/integrations/gmail` — Gmail Integration for Client Workflows | Syntaflow (OAuth PKCE, email scoping, human send confirmation)
  - `/integrations/google-calendar` — Google Calendar Integration for Client Work | Syntaflow (Milestone scheduling, availability check)
  - `/integrations/google-drive` — Google Drive Integration for Client Deliverables | Syntaflow (drive.file scoped asset linking)
  - `/integrations/github` — GitHub Integration for Client Development | Syntaflow (Repo sync, milestones, review gating)
  - `/integrations/notion` — Notion Integration (Test Preview) | Syntaflow (Briefs, documentation sync)
  - `/integrations/linear` — Linear Integration (Test Preview) | Syntaflow (Issues & sprint cycle mapping)
- **Core Operations**:
  - `/pricing` — Transparent Pricing & Subscription Tiers
  - `/download` — Official Desktop Client Installers
  - `/docs` — Product Documentation & Guides
- **Trust & Security Suite**:
  - `/security` — Security built into the architecture. (Sandboxing, SQLite, safeStorage, PKCE)
  - `/privacy` — Comprehensive 24-section Privacy Policy with Google Limited Use disclosures
  - `/data-handling` — Physical SQLite Storage, JSON Portability & Backups
- **Resources Suite**:
  - `/faq` — Direct, Categorized Technical Answers
  - `/changelog` — Release Notes Tracing Desktop Milestones
- **Company Suite**:
  - `/about` — Origin, Synthesis + Flow Narrative & Mission
  - `/roadmap` — Clearly Labeled Planned Directions (AI TaskRouter, Cloud Review)
  - `/contact` — Direct Public Communication Channels (contact@, privacy@, security@, support@)
- **Legal Suite**:
  - `/terms` — Comprehensive 22-section Terms of Service (Preview disclosures, no invented corporate claims)
  - `/privacy` — Complete Privacy Policy (with `/privacy-policy` and `/cookies` permanent redirects)
- **Non-Indexable Utility & Auth**:
  - `/login`, `/auth/desktop`, `/account`, `/404`

---

## 3. Development & Verification Commands

```bash
# Run local Vite development server
npm run dev

# Run Oxlint linting check (0 errors required)
npm run lint

# Compile production bundle to dist/ (includes automatic sitemap.xml generation)
npm run build

# Run headless 203-check viewport & route verification suite (7 viewports: 375, 390, 430, 768, 1280, 1440, 1920)
npm run verify

# Run headless 233-check Technical SEO & DOM verification suite
npm run verify:seo

# Preview production build locally
npm run preview
```

---

## 4. Technical SEO Foundation (Phases 2–4 Implemented)

- **Canonical Host**: Strictly locked to `https://syntaflow.tech`. `SEOHead` automatically rewrites any incoming host variants to the apex canonical domain.
- **Centralized Metadata**: All 33 routes (25 indexable + 8 utility/aliases) are registered in `apps/web/src/seo/seoConfig.ts` with distinct, human-crafted titles and descriptions.
- **Structured Data (Schema.org)**:
  - `Organization` and `SoftwareApplication` schemas on homepage.
  - `BreadcrumbList` on all hierarchical product and solutions routes.
  - Zero fabricated reviews or aggregate ratings.
- **Crawl Architecture**:
  - `public/robots.txt` explicitly allows public routes, disallows `/login`, `/account`, `/auth/`, and references `sitemap.xml`.
  - `scripts/generate-sitemap.mjs` automatically generates `public/sitemap.xml` with all 25 indexable canonical URLs during every build.
  - Clean path links via `apps/web/src/components/ui/Link.tsx` with SPA pushState interception for instant client-side transitions.
  - Dedicated `NotFoundPage.tsx` with `noindex, nofollow` and recovery links, accompanied by `public/404.html` for edge CDN hosting.
- **Social Sharing**: Standard 1200x630 OpenGraph cards (`/brand/og-image.png`) and Twitter large image cards across all public pages.

---

## 5. Performance, Images & Accessibility (Phase 6 Implemented)

- **Route-Level Code Splitting**: All subpages asynchronously loaded via `React.lazy` and `Suspense`, dropping initial main bundle size by **55%** (from 711 kB down to 319 kB / 87 kB gzip).
- **Core Web Vitals Verified**:
  - **LCP**: 632 ms (well within Google's "Good" 2.5s threshold).
  - **FCP**: 620 ms.
  - **CLS**: 0.0066 (near zero, eliminating footer shift on initial landing).
  - **DOMContentLoaded**: 174 ms.
  - Subsequent SPA route transitions: 8–13 ms.
- **Image Optimization**:
  - `syntaflow-mark.webp`: 6.1 KB (99.1% reduction from 676 KB original PNG).
  - `syntaflow-logo-full.webp`: 16.6 KB (98.4% reduction from 1,068 KB original PNG).
  - `BrandMark.tsx`: Explicit `width`, `height`, `decoding="async"`, and `fetchpriority="high"` preventing cumulative layout shifts.
- **Font Optimization**: Google Fonts request trimmed to active weights (`Inter:400;500;600;700` and `Sora:600;700`) with `display=swap`.
- **Accessibility (WCAG 2.1 AA)**:
  - Form controls in `LoginPage.tsx` and `ContactPage.tsx` explicitly paired with `htmlFor` and `id`.
  - Mobile navigation equipped with `aria-expanded`, `aria-controls`, `role="navigation"`, dynamic `aria-label`, and `Escape` key listener.
  - Distinct 2px cobalt `:focus-visible` keyboard focus indicators.
  - Strict `prefers-reduced-motion: reduce` CSS override for users requesting reduced motion.
- **Multi-Viewport Quality**: Verified zero horizontal overflow and flawless responsive reflow across 7 canonical viewports (`375×812`, `390×844`, `430×932`, `768×1024`, `1280×720`, `1440×900`, `1920×1080`).

---

## 6. Live Production Deployment & Continuous Verification (Phase 7 Implemented)

- **Production Host**: `https://syntaflow.tech` (Apex canonical, enforced via HSTS and Appwrite Sites global CDN).
- **Hosting Platform**: Appwrite Sites (Edge-deployed across global regions with active DDoS protection and automatic SSL).
- **Deployment Pipeline**: Git VCS integration on `origin/master`. Commits pushed to `master` trigger automatic Appwrite builds and instant atomic deployments.
- **Verification Harness**: `npm run verify:live` (`scripts/verify-production-live.mjs`) tests:
  1. Live HTTP 200 responses across all 31 canonical routes and static assets.
  2. Live `robots.txt` canonical sitemap referencing and crawler rules.
  3. Live `sitemap.xml` XML validity and canonical domain enforcement (0 non-apex URLs).
  4. Pre-rendered `privacy.html` and hydrated `/privacy` route compliance with Google API Services User Data Policy and Limited Use requirements.
  5. Playwright headless browser rendering across 5 viewports (375, 768, 1280, 1440, 1920) checking:
     - Correct title, canonical URL, OG tags, and Schema.org JSON-LD scripts.
     - Zero horizontal scroll overflow (`scrollWidth <= innerWidth`).
     - Zero uncaught application console errors.
- **Production Status**: **PASS** (116/116 live checks passed, Active deployment `6aaa25d5255d9e587599`).


