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

## 2. Information Architecture (22 Verified Routes)

- **Homepage**: `/`
- **Product Suite**:
  - `/product` — System Architecture & Overview
  - `/product/client-ops` — Client Operations & Onboarding Studio
  - `/product/projects-tasks` — Blueprints & Dual-Density Task Boards
  - `/product/documents-reviews` — Paper Canvas & Immutable DocVersion Reviews
  - `/product/delivery-approvals` — Delivery Gate Enforcement & Handover
- **Solutions Suite**:
  - `/solutions/freelancers` — Solo Practitioners & Offline Focus
  - `/solutions/agencies` — Boutique Margins, SLA Tracking & Presentation Shells
  - `/solutions/consultants` — Retainer Management & Uncompromising Confidentiality
  - `/solutions/studios` — Design Systems, Blueprints & Gated Handover
- **Trust & Security Suite**:
  - `/security` — Defense-in-Depth Architecture, Sandboxing & Disclosure
  - `/privacy` — Privacy Charter & Zero-Telemetry Model
  - `/data-handling` — Physical SQLite Storage, JSON Portability & Backups
- **Resources Suite**:
  - `/faq` — Direct, Categorized Technical Answers
  - `/changelog` — Release Notes Tracing Desktop Milestones
- **Company Suite**:
  - `/about` — Origin, Synthesis + Flow Narrative & Mission
  - `/roadmap` — Clearly Labeled Planned Directions (AI TaskRouter, Cloud Review)
  - `/contact` — Client-Validated Inquiry Surface
- **Legal Suite (Draft Structure)**:
  - `/terms` — Draft Terms of Service
  - `/privacy-policy` — Draft Privacy Policy
  - `/cookies` — Zero-Tracking Cookie Declaration
  - `/acceptable-use` — Draft Acceptable Use Policy

---

## 3. Development & Verification Commands

```bash
# Run local Vite development server (port 5174)
npm run dev

# Run Oxlint linting check (0 errors required)
npm run lint

# Compile production bundle to dist/
npm run build

# Run headless 110-check viewport & route verification suite
npm run verify

# Preview production build locally (port 4173)
npm run preview
```
