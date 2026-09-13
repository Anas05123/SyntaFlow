# CoreDesk — Documentation Map

```
docs/
├── README.md                            # Master routing index for AI agents and developers
│
├── 00-start-here/                       # Onboarding & vault orientation
│   ├── CoreDesk Home.md                 # Obsidian dashboard & entry point
│   ├── Development Status.md            # Live implementation status & verification logs
│   ├── Documentation Map.md             # Structural document map (this file)
│   └── GLOSSARY.md                      # Canonical domain vocabulary
│
├── product/                             # Product requirements & business lifecycle
│   ├── PRODUCT_VISION.md                # Core purpose, target user, 5 acceptance gates
│   ├── CLIENT_LIFECYCLE.md              # 9-stage commercial journey graph
│   ├── PRODUCT_ARCHITECTURE.md          # Entity model & operational hierarchy
│   ├── DOMAIN_RULES.md                  # Strict invariants (Preconditions/Side-effects)
│   └── WEBSITE_HANDOFF.md               # Future web marketing & browser auth handoff
│
├── architecture/                        # Software engineering & system design
│   ├── SYSTEM_ARCHITECTURE.md           # Layered boundaries & IPC contracts
│   ├── DATA_MODEL.md                    # Entity schema & relational rules
│   ├── ELECTRON_ARCHITECTURE.md         # BrowserWindow, chrome row, sandbox security
│   ├── AI_ARCHITECTURE.md               # AI Engine TaskRouter & provider pipeline
│   ├── CODING_STANDARDS.md              # TypeScript rules & code conventions
│   ├── TESTING_STRATEGY.md              # Verification levels & layout test harness
│   └── FILE_STRUCTURE.md                # Workspace directory structure & ownership
│
├── systems/                             # Operational application subsystems
│   ├── TASK_SYSTEM.md                   # 3D task model, dependencies, responsive inspector
│   ├── DOCUMENT_SYSTEM.md               # Editor, working drafts, immutable snapshots
│   ├── REVIEW_DELIVERY_SYSTEM.md        # Review requests, decisions, delivery packages
│   ├── SEARCH_COMMAND_SYSTEM.md         # Universal search & ⌘K palette
│   ├── SETTINGS_APPEARANCE.md           # Themes, wallpapers, acrylic glass blur
│   └── ERROR_RECOVERY.md                # Failure recovery patterns & resilience
│
├── design/                              # Visual design system & UX specifications
│   ├── UI_UX_SYSTEM.md                  # Desktop layouts, split views, popovers
│   └── DESIGN_SYSTEM.md                 # Dark graphite tokens, materials, typography
│
├── security/                            # Security governance & access control
│   ├── SECURITY_MODEL.md                # Threat model & mitigation matrix
│   └── ACCESS_MODEL.md                  # Non-inherited guest access grants
│
├── roadmap/                             # Product planning & technical debt
│   ├── ROADMAP.md                       # NOW, NEXT, LATER, EXPERIMENTAL phases
│   └── KNOWN_ISSUES.md                  # Tracked limitations & technical debt
│
├── decisions/                           # Architecture Decision Records
│   ├── DECISIONS.md                     # Master index of ADRs
│   ├── ADR-001-electron-desktop-first.md
│   ├── ADR-002-sqlite-canonical-store.md
│   ├── ADR-003-typed-ipc-boundary.md
│   ├── ADR-004-immutable-document-versions.md
│   ├── ADR-005-exact-version-review.md
│   ├── ADR-006-delivery-gate-enforcement.md
│   ├── ADR-007-three-dimensional-status.md
│   ├── ADR-008-ai-engine-task-router.md
│   ├── ADR-009-dark-graphite-design-system.md
│   ├── ADR-010-responsive-workspace-layout.md
│   ├── ADR-011-single-canonical-record.md
│   └── ADR-012-modular-ai-documentation.md
│
├── research/                            # Historical & strategic research
│   ├── CoreDesk-Phase1-Research-Brief.md
│   └── CoreDesk-Product-Context.md
│
├── migration/                           # Consolidation records & audit trails
│   ├── REPOSITORY_AUDIT.md              # Pre-migration inventory & git state
│   ├── ATLAS_REMAINDERS.md              # Audited acceptable Atlas remnants
│   └── REPOSITORY_MIGRATION_REPORT.md   # Final consolidation report
│
└── archive/                             # Archived historical material
    ├── atlas-history/                   # Retired Project Atlas vault notes
    ├── reviews/auth-phase-1/            # Phase 1 screenshots & script
    └── prototypes/coredesk-design/      # Early standalone HTML prototype
```
