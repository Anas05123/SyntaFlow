# Syntaflow Official Website (`apps/web`)

The official public website for **Syntaflow** (`syntaflow.tech`) — connected intelligence that moves work forward.

---

## 1. Operating Rules & Truth Invariants

1. **Truthful Representation**: This website strictly markets what exists in the product today. Planned platform capabilities (Autonomous Agents, Multi-tenant Cloud, Public REST/GraphQL APIs, SDKs) are sequestered strictly on the dedicated `/roadmap` page with explicit `PLANNED DIRECTION` status badges.
2. **Strict Canonical Domain**: Exclusively `https://syntaflow.tech`. Never uses `.com`.
3. **No Fabricated Compliance**: Zero unearned compliance badges (SOC 2, ISO 27001, HIPAA). Security documentation truthfully presents SQLite local sandboxing, scrypt hashing, OS keychain (`safeStorage`) encryption, and verifiable local-first boundaries.
4. **Desktop Privilege Boundary**: The web application executes purely within the standard browser sandbox. It has zero direct access to the local desktop filesystem, SQLite database, or Node runtime.
5. **Authentic Brand Mark**: Uses the approved Syntaflow brand marks from `assets/brand/syntaflow/` (`logo-icon.png`, `logo-full.png`, `logo-full-color.png`, `logo-full-4k.png`).

---

## 2. Technology Stack

- **Runtime & Bundler**: Vite 8 (`vite@^8.3.0`)
- **Framework**: React 19 (`react@^19.2.8`, `react-dom@^19.2.8`)
- **Language**: TypeScript 6 (`typescript@^6.0.2`) with strict mode
- **Linter**: Oxlint 1.81 (`oxlint@^1.81.0`)
- **Styling**: Vanilla CSS Design Tokens (`tokens.css`, `reset.css`, `global.css`)
- **Typography**: Sora (Display Headings), Inter (Body & UI), JetBrains Mono (Technical/Status Data)

---

## 3. Directory Structure

```
apps/web/
├── public/
│   ├── brand/               # Official brand marks (PNG/ICO)
│   ├── robots.txt           # Crawler instructions & sitemap link
│   └── sitemap.xml          # Canonical XML sitemap (24 URLs)
├── src/
│   ├── assets/brand/        # Brand assets bundled with Vite
│   ├── components/
│   │   ├── brand/           # SyntaflowLogo, SyntaflowIcon
│   │   ├── marketing/       # PageHero, FeatureRail, LifecycleStepper, Diagrams
│   │   ├── navigation/      # SiteHeader, MegaMenu, MobileNav, SiteFooter
│   │   ├── seo/             # SEOHead (title, OG, Twitter, JSON-LD schema)
│   │   └── ui/              # Button, Badge, StatusBadge, Container, SectionHeading, Card, Tabs, Accordion
│   ├── content/             # Nav, Roadmap, Changelog, FAQ, Legal data
│   ├── pages/               # 15 Page components covering 24 distinct routes
│   ├── router/              # RouterContext, RouterProvider, Link, usePath, useRouter
│   ├── styles/              # tokens.css, reset.css, global.css
│   ├── App.tsx              # Root component & route switcher
│   └── main.tsx             # Entry point
├── index.html               # Shell HTML with preconnect fonts & OG tags
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── .oxlintrc.json
```

---

## 4. Routes Implemented

| Path | Purpose / Category |
| :--- | :--- |
| `/` | Homepage (Silos problem, Synthesis+Flow, 7-stage lifecycle stepper, human control, security) |
| `/product` | Product Overview & Architectural philosophy |
| `/product/client-operations` | Stage 0-1: Intake & Onboarding |
| `/product/projects-tasks` | Stage 2-3: Scoping & Active Execution |
| `/product/documents-reviews` | Stage 4-5: Document drafting, immutable DocVersion, review cycles |
| `/product/delivery-approvals` | Stage 6: Delivery gating & immutable acceptance sign-off |
| `/solutions` | Overview of target audiences & operational models |
| `/solutions/freelancers` | Solo operators requiring client continuity |
| `/solutions/agencies` | Multi-client delivery teams requiring review accountability |
| `/solutions/consultants` | Advisory & audit workflows with gated deliverable sign-offs |
| `/solutions/studios` | Creative and technical production pipelines |
| `/security` | Cryptographic sandboxing, scrypt, safeStorage, and zero fake-compliance pledge |
| `/privacy` | Offline local-first privacy guarantee, zero analytics/telemetry |
| `/data-handling` | Immutable version records, SQLite schema migration, Danger Zone resets |
| `/faq` | Categorized interactive FAQ accordion |
| `/changelog` | Release notes and desktop application version log |
| `/about` | Origin, mission, purpose, and founding principles |
| `/roadmap` | Transparent roadmap isolating planned platform & AI features |
| `/download` | Desktop client downloads (Windows x64 installer & preview launcher instructions) |
| `/contact` | Form inquiry & direct email routing |
| `/terms` | Software Terms of Service |
| `/legal/privacy` | Privacy Policy |
| `/cookies` | Cookie Notice (Zero tracking cookies) |
| `/acceptable-use` | Acceptable Use Policy |

---

## 5. Development & Verification Commands

```bash
# Install dependencies
npm install

# Run Oxlint (linter)
npm run lint

# Compile TypeScript & Build Production Bundle
npm run build

# Preview Production Build locally (served at http://localhost:4173)
npm run preview
```
