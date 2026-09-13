# CoreDesk — Product Roadmap & Execution Phases

> **Status:** AUDITED & STRUCTURED  
> **Last verified:** 2026-09-13  
> **Relevant source areas:** `docs/product/`, `docs/architecture/`  
> **Owner domain:** Product Strategy  

---

## 1. Roadmap Phasing Strategy

CoreDesk strictly separates immediate desktop foundations from future network extensions. V1, V2, and V3 capabilities are never conflated:

```
[ NOW: V1 Desktop Core ] ──► [ NEXT: Persistence & Local AI ] ──► [ LATER: Web & Cloud Sync ] ──► [ EXPERIMENTAL: Autonomous Team ]
```

---

## 2. Phase Breakdown

### Phase 1: NOW — V1 Desktop Core (`COMPLETED / STABILIZING`)
- [x] **Desktop Shell & Frameless Chrome**: Multi-mode Electron runtime with custom top command bar.
- [x] **Operator Cockpit (Home)**: 3-pillar command center (Approvals & Blockers, Focus Queue, Client Pulse).
- [x] **Clients Master-Detail Workspace**: 40/60 split pane with deep dossiers.
- [x] **Apple-Style Client Onboarding Drawer**: Slide-over intake studio.
- [x] **Blueprint Scoping Studio**: Pre-packaged project templates (Brand, Web, Advisory).
- [x] **Tasks Workspace & Inspector**: Dual Board/List views, dynamic grouping, prerequisite dependencies, and side-by-side inspector.
- [x] **Universal Search (`⌘K`)**: Omnipresent search palette across all entities.
- [x] **Appearance Engine**: Wallpapers, blur/dim controls, adaptive graphite surfaces.

---

### Phase 2: NEXT — SQLite Migration & Local AI Wiring (`IMMEDIATE NEXT PHASE`)
- [ ] **Full SQLite Database Migration**: Replace `localStorage` in `apps/desktop` with typed IPC bridge to SQLite database (`database/migrations/`).
- [ ] **Ollama AI Integration in UI**: Connect the `TaskRouter` and prompt registry to interactive scoping and document drafting triggers.
- [ ] **Native PDF Generation**: Implement Electron headless `printToPDF` for proposals, briefs, and deliverables.
- [ ] **File Asset Management**: Dedicated local disk directory (`userData/files/`) for linked task and project attachments.

---

### Phase 3: LATER — Web Portal & Secure Sync (`V2 COMMERCIAL RELEASE`)
- [ ] **Marketing Website & Download Portal**: Shipped via `https://coredesk.app`.
- [ ] **Browser Authentication & Callback**: `coredesk://auth/callback` deep link handler.
- [ ] **Hosted Guest Review Portal**: Cloud relay allowing clients to review documents without local network port forwarding.
- [ ] **Cryptographic Access Tokens**: Ed25519 signed access grants for guest review links.

---

### Phase 4: EXPERIMENTAL — Autonomous Specialized Agents (`V3 EXPLORATION`)
- [ ] **Background Research Sidecar**: Autonomous fact-checking and client website enrichment.
- [ ] **Milestone Risk Predictor**: LLM-based timeline and budget drift detector.
- [ ] **Autonomous Document Polishing**: Formatting and typography auditing against style rules.
