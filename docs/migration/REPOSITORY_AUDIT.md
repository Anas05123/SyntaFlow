# CoreDesk — Repository Audit & Classification

**Date**: 2026-09-13  
**Auditor**: Antigravity Agent  
**Status**: Pre-Migration Baseline  

---

## 1. Git Repositories Audit

A comprehensive scan of the workspace for `.git` directories revealed:

- **Total Repositories Detected**: 1
- **Repository Root**: `C:\Users\Anas\Desktop\CoreDesk\project-atlas`
- **Active Branch**: `master`
- **Current HEAD**: `566498646b08baac40e618dd64c36823bfd3aadc` (`feat(ai-engine): add Ollama provider adapter`)
- **CoreDesk Root (`C:\Users\Anas\Desktop\CoreDesk`)**: Not an independent Git repository.
- **`coredesk-app` (`C:\Users\Anas\Desktop\CoreDesk\coredesk-app`)**: Not an independent Git repository.

### Modified Files in `project-atlas`:
- `apps/desktop/package.json`
- `apps/desktop/src/core/settings/settings-service.test.ts`
- `apps/desktop/src/core/settings/settings-service.ts`
- `apps/desktop/src/main/index.ts`
- `apps/desktop/src/preload/index.ts`
- `apps/desktop/src/renderer/app/App.test.ts`
- `apps/desktop/src/renderer/app/App.tsx`
- `apps/desktop/src/renderer/styles/global.css`
- `package.json`
- `packages/ai-engine/src/application/task-router.test.ts`
- `packages/ai-engine/src/application/task-router.ts`
- `packages/ai-engine/src/domain/contracts.ts`
- `packages/ai-engine/src/ollama.ts`
- `packages/ai-engine/src/prompts/prompt-registry.test.ts`
- `packages/ai-engine/src/prompts/prompt-registry.ts`
- `packages/ai-engine/src/providers/fake-ai-provider.ts`
- `packages/ai-engine/src/providers/ollama/ollama-provider.test.ts`
- `packages/ai-engine/src/providers/ollama/ollama-provider.ts`
- `packages/contracts/src/index.test.ts`
- `packages/contracts/src/index.ts`
- `pnpm-lock.yaml`
- `tests/end-to-end/desktop-smoke.spec.ts`
- `tests/security/ai-engine-boundary.spec.ts`
- `tests/security/preload-contract.spec.ts`

### Untracked Files in `project-atlas`:
- `.mcp.json`
- `apps/desktop/src/main/atlas-ai/`
- `apps/desktop/src/main/ipc/atlas-ai-ipc.test.ts`
- `apps/desktop/src/main/ipc/atlas-ai-ipc.ts`
- `apps/desktop/src/preload/atlas-ai-bridge.test.ts`
- `apps/desktop/src/renderer/app/AtlasAiPage.tsx`
- `apps/desktop/src/renderer/app/LocalAiStatus.tsx`
- `apps/desktop/src/renderer/app/OllamaSettings.tsx`
- `docs/codex-tasks/ATLAS-CODE-007 - Atlas AI Vertical Slice.md`
- `opencode.json`
- `package-lock.json`
- `packages/contracts/src/atlas-ai.ts`
- `tests/integration/atlas-ai.spec.ts`

---

## 2. Complete Classification of Workspace Root Items (26 Items)

| Item | Type | Classification | Destination / Action | Rationale |
|---|---|---|---|---|
| `.claude/` | Dir | **KEEP** | Root `.claude/` | Developer tooling configuration for Anthropic Claude / Claude Code. |
| `.figma-read/` | Dir | **MOVE** | `assets/design/figma-provenance/` | Contains Figma slices, JSON exports, and diagram exports. Valuable design provenance. |
| `.obsidian/` | Dir | **KEEP / CONFIGURE** | `.obsidian/` & `docs/.obsidian/` | Directs Obsidian to the unified documentation vault in `docs/`. |
| `.phase1-review/` | Dir | **ARCHIVE** | `docs/archive/reviews/auth-phase-1/` | Historical screenshots and capture script from Phase 1 authentication audit. |
| `.pnpm-store/` | Dir | **GENERATED / IGNORE** | `.gitignore` (remove from root) | Reproducible package manager cache; must not be tracked in source control. |
| `.rsh/` | Dir | **KEEP** | Root `.rsh/` | Shared AI agent log (`.rsh/threads.md`). Protected by workspace rules. |
| `coredesk-app/` | Dir | **MOVE** | `apps/desktop/` | The active, canonical CoreDesk Electron + React desktop application (33 routes verified). |
| `coredesk-design/` | Dir | **ARCHIVE** | `docs/archive/prototypes/coredesk-design/` | Standalone HTML/CSS/JS prototype developed during initial Figma handoff. |
| `docs/` | Dir | **REORGANIZE / MERGE** | `docs/` (unified vault) | Modular CoreDesk docs reorganized into `00-start-here/`, `product/`, `architecture/`, `systems/`, `design/`, `security/`, `roadmap/`, `decisions/`, `research/`, `migration/`, `archive/`. |
| `Project Atlas/` | Dir | **MERGE & RETIRE** | `docs/archive/atlas-history/` & `docs/` | Old Obsidian vault (43 markdown notes). Active knowledge merged into `docs/`; historical notes archived with disclaimer banner. Directory retired. |
| `project-atlas/` | Dir | **MIGRATE ACTIVE & RETIRE** | `packages/`, `database/migrations/`, `node_modules/` | Active subsystems (`packages/ai-engine`, `packages/contracts`, `migrations/`, `scripts/database/`, `tests/security/`) migrated; packages renamed `@coredesk/*`; directory retired. |
| `skills/` | Dir | **KEEP / UPDATE PATHS** | `skills/` | 7 CoreDesk AI skills updated to point to `apps/desktop/` and `packages/`. |
| `tools/` | Dir | **KEEP / EXPAND** | `tools/` | Already contains `tools/frame-analysis/`; will also house `tools/brand/`, `tools/launch/`. |
| `.mcp.json` | File | **KEEP** | Root `.mcp.json` | MCP configuration for developer environment. |
| `AGENTS.md` | File | **KEEP / UPDATE** | Root `AGENTS.md` | Universal AI instructions. Preserve Nexa header; update routing to `apps/desktop/` and new `docs/`. |
| `CLAUDE.md` | File | **KEEP / UPDATE** | Root `CLAUDE.md` | Points to `AGENTS.md` and `docs/README.md`. |
| `CoreDesk.exe` | File | **MOVE** | `tools/launch/CoreDesk.exe` | 6KB Windows launcher executable. |
| `CoreDesk-Phase1-Research-Brief.md` | File | **MOVE** | `docs/research/CoreDesk-Phase1-Research-Brief.md` | Comprehensive research brief on solo agency operations and cognitive load. |
| `CoreDesk-Product-Context.md` | File | **MOVE** | `docs/research/CoreDesk-Product-Context.md` | 44KB early product context. Referenced in `docs/product/`. |
| `fullLogo.png` | File | **MOVE / RENAME** | `assets/brand/coredesk-logo-full.png` | Official horizontal brand logo. |
| `IconLogo.png` | File | **MOVE / RENAME** | `assets/brand/coredesk-icon.png` | Official app icon mark. |
| `gen-mark.mjs` | File | **MOVE** | `tools/brand/gen-mark.mjs` | Vector brand mark generator script. |
| `Launch-CoreDesk.bat` | File | **MOVE & RETAIN CONVENIENCE** | `tools/launch/Launch-CoreDesk.bat` & root wrapper | Convenience batch file updated to launch `apps/desktop/electron/main.cjs`. |
| `opencode.json` | File | **KEEP** | Root `opencode.json` | OpenCode configuration. |
| `Project_Atlas_Product_Strategy.pdf` | File | **MOVE** | `docs/archive/atlas-history/Project_Atlas_Product_Strategy.pdf` | Historical strategy presentation. |
| `render-mark.mjs` | File | **MOVE** | `tools/brand/render-mark.mjs` | Vector brand mark render script. |

---

## 3. Subsystem Migration Mapping

### Active Subsystems in `project-atlas/`
1. `packages/ai-engine/` $\rightarrow$ `packages/ai-engine/`
   - Scope rename: `@atlas/ai-engine` $\rightarrow$ `@coredesk/ai-engine`
   - Internal symbol rename: `atlas.foundation.*` $\rightarrow$ `coredesk.foundation.*`
   - Verification: all 7 test files (32 tests) pass via `vitest`.
2. `packages/contracts/` $\rightarrow$ `packages/contracts/`
   - Scope rename: `@atlas/contracts` $\rightarrow$ `@coredesk/contracts`
   - File rename: `src/atlas-ai.ts` $\rightarrow$ `src/ai.ts`
   - Type renames: `AtlasAi*` $\rightarrow$ `CoreDeskAi*`, `AtlasPreloadApi` $\rightarrow$ `CoreDeskPreloadApi`
   - Verification: `src/index.test.ts` passes via `vitest`.
3. `migrations/` $\rightarrow$ `database/migrations/`
   - `0001_foundation_metadata.sql`: Preserved intact. The `-- atlas:statement-breakpoint` delimiter is documented as an internal Drizzle/Atlas CLI parser marker.
   - `metadata.json`: Preserved intact.
4. `scripts/database/` $\rightarrow$ `database/scripts/`
   - `backup.mjs`, `migrate.mjs`, `status.mjs`.
5. `tests/security/` $\rightarrow$ `tests/security/`
   - Preload contract, secret redaction, AI engine boundary, electron security.
6. `node_modules/` $\rightarrow$ Root `node_modules/`
   - Preserves `electron`, `playwright`, `vitest`, `zod`, `typescript` and related dependencies without re-downloading.

### Desktop Application Consolidation
- Source: `coredesk-app/`
- Destination: `apps/desktop/`
- Verification standard:
  - `npm run build`: 0 TypeScript / Vite bundling errors.
  - `npm run lint`: oxlint passes with 0 errors.
  - `node verify-app.mjs`: 33/33 routes render with 0 console errors and 0 problems.
  - `Launch-CoreDesk.bat`: Electron boots into the built desktop UI without errors.

---

## 4. Documentation & Obsidian Vault Architecture

`docs/` is the single source of truth for humans, agents, and Obsidian.

```
docs/
├── README.md                          # Master documentation router
├── 00-start-here/
│   ├── CoreDesk Home.md               # Visual dashboard / Obsidian home
│   ├── Development Status.md          # Real-time implementation status
│   └── Documentation Map.md           # Visual architecture map
├── product/
│   ├── PRODUCT_VISION.md              # Purpose, agency principal persona, 5 acceptance gates
│   ├── CLIENT_LIFECYCLE.md            # Commercial journey graph & state transitions
│   └── PRODUCT_ARCHITECTURE.md        # System structure & entity hierarchy
├── architecture/
│   ├── SYSTEM_ARCHITECTURE.md         # Layered boundaries & IPC contracts
│   ├── DATA_MODEL.md                  # Canonical schema for all 18+ entities
│   ├── ELECTRON_ARCHITECTURE.md       # BrowserWindow, sandbox, preload bridge
│   └── AI_ARCHITECTURE.md             # CoreDesk AI Engine pipeline
├── systems/
│   ├── TASK_SYSTEM.md                 # 3-dimensional task model, dependencies, inspector
│   ├── DOCUMENT_SYSTEM.md             # Document studio & immutable versioning
│   ├── REVIEW_DELIVERY_SYSTEM.md      # Review requests & delivery gates
│   ├── SEARCH_COMMAND_SYSTEM.md       # Universal search & ⌘K palette
│   ├── SETTINGS_APPEARANCE.md         # Wallpaper engine, themes, surface opacity
│   └── ERROR_RECOVERY.md              # Failure modes & recovery protocols
├── design/
│   ├── UI_UX_SYSTEM.md                # Desktop spatial hierarchy & layouts
│   └── DESIGN_SYSTEM.md               # Dark graphite tokens, materials, typography
├── security/
│   ├── SECURITY_MODEL.md              # Threat model & mitigation matrix
│   └── ACCESS_MODEL.md                # Non-inherited access grant protocol
├── roadmap/
│   └── ROADMAP.md                     # NOW, NEXT, LATER, EXPERIMENTAL phases
├── decisions/
│   ├── DECISIONS.md                   # Master ADR index
│   └── ADR-001 through ADR-012        # Discrete architecture decision records
├── research/
│   ├── CoreDesk-Phase1-Research-Brief.md
│   └── CoreDesk-Product-Context.md
├── migration/
│   ├── REPOSITORY_AUDIT.md            # This inventory & safety contract
│   ├── ATLAS_REMAINDERS.md            # Justified non-active Atlas occurrences
│   └── REPOSITORY_MIGRATION_REPORT.md # Post-migration report
└── archive/
    ├── atlas-history/                 # Retired Project Atlas notes with disclaimer banner
    ├── reviews/auth-phase-1/          # Phase 1 review screenshots & scripts
    └── prototypes/coredesk-design/    # Early standalone HTML prototype
```
