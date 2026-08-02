---
title: Module and Plugin Architecture
project: Project Atlas
product: AI Agency OS
version: 1.0
status: Approved Foundation
owners:
  - Founder
  - CTO
last_updated: 2026-08-03
---

# Module and Plugin Architecture

## 1. Purpose

This document defines how AI Agency OS is divided into independent modules and how optional plugins may extend the application safely.

The architecture must prevent the application from becoming one large, tightly connected codebase.

Every major capability must have:

- Clear ownership
- Defined inputs and outputs
- Stable interfaces
- Explicit permissions
- Independent tests
- Controlled dependencies
- Replaceable infrastructure adapters

---

## 2. Core Architecture Rule

Modules communicate through approved contracts.

They must not access another module’s internal files, database repositories or implementation details directly.

```text
User Interface
      ↓
Application Services
      ↓
Module Public Contract
      ↓
Module Domain Logic
      ↓
Module Infrastructure Adapters
```

Forbidden:

```text
Campaign UI
      ↓
Direct Business Database Query
      ↓
Direct Ollama Request
      ↓
Direct Deployment API Call
```

Approved:

```text
Campaign UI
      ↓
Campaign Application Service
      ↓
Business Module Contract
      ↓
AI Engine Contract
      ↓
Deployment Module Contract
```

---

## 3. Module Categories

### 3.1 Core Modules

Core modules are required for the application to start.

- Application Shell
- Settings
- Database
- Filesystem
- Background Jobs
- Logging
- Audit
- Security
- Notifications

Core modules cannot be removed through the plugin system.

---

### 3.2 Product Modules

Product modules provide user-facing business features.

- Campaigns
- Businesses
- Business Discovery
- Business Enrichment
- Atlas AI
- Website Projects
- Website Generation
- CRM
- Outreach
- Deployment
- Templates
- Analytics
- Backup and Restore

Product modules may depend on core services but must remain isolated from one another.

---

### 3.3 Provider Modules

Provider modules connect the application to external or local services.

Examples:

- Ollama AI provider
- OpenAI provider
- OpenStreetMap discovery provider
- Nominatim geocoding provider
- Vercel deployment provider
- Static export provider
- Email provider
- Future WhatsApp provider

Provider modules implement stable interfaces defined by the core application.

---

### 3.4 Optional Plugins

Plugins extend existing capabilities without modifying the core source code.

Possible plugin types:

- AI provider
- Discovery source
- Deployment provider
- Outreach provider
- Import or export provider
- Analytics provider
- Storage provider
- Website component pack
- Template pack
- Industry playbook

A public plugin marketplace is outside Version 1.

---

## 4. Approved Version 1 Modules

| Module            | Responsibility                                                 |
| ----------------- | -------------------------------------------------------------- |
| App Shell         | Desktop window, navigation and application lifecycle           |
| Settings          | User preferences, model settings and integration configuration |
| Campaigns         | Campaign creation, organization, progress and activity         |
| Businesses        | Business records, contacts, tags and status                    |
| Discovery         | Search providers, location resolution and result normalization |
| Enrichment        | Website inspection and public contact-information enrichment   |
| AI Engine         | Provider-independent AI requests, routing and validation       |
| Atlas             | Campaign intelligence, assistant chat and approved memory      |
| Website Projects  | Website briefs, specifications, assets and versions            |
| Website Generator | Structured generation and deterministic compilation            |
| Templates         | Design systems, sections, prompts and industry playbooks       |
| CRM               | Deals, pipeline stages, follow-ups and client conversion       |
| Outreach          | Message drafts, history and approved sending integrations      |
| Deployment        | Preview, export, publishing and deployment history             |
| Jobs              | Background task queue, retries, cancellation and recovery      |
| Audit             | Security and important business events                         |
| Backup            | Backup creation, verification, restore and recovery            |

---

## 5. Module Structure

Every module follows the same internal structure.

```text
modules/
└── campaigns/
    ├── application/
    │   ├── commands/
    │   ├── queries/
    │   ├── services/
    │   └── dto/
    ├── domain/
    │   ├── entities/
    │   ├── value-objects/
    │   ├── events/
    │   ├── policies/
    │   └── errors/
    ├── infrastructure/
    │   ├── repositories/
    │   ├── mappers/
    │   └── adapters/
    ├── presentation/
    │   ├── components/
    │   ├── screens/
    │   └── state/
    ├── contracts/
    │   ├── public-api.ts
    │   └── events.ts
    └── tests/
```

Rules:

- Domain logic must not depend on React, Electron or provider SDKs.
- Application services coordinate use cases.
- Infrastructure implements database and provider contracts.
- Presentation contains user-interface code.
- Contracts define what other modules may use.
- Tests remain close to the module they verify.

---

## 6. Public Module Contract

Every module exposes one public contract.

Example:

```typescript
export interface CampaignModule {
  createCampaign(input: CreateCampaignInput): Promise<CreateCampaignResult>;

  getCampaign(campaignId: CampaignId): Promise<CampaignView>;

  listCampaigns(query: CampaignQuery): Promise<PaginatedResult<CampaignSummary>>;

  archiveCampaign(campaignId: CampaignId): Promise<void>;
}
```

Rules:

- Other modules import only from the public contract.
- Internal repositories remain private.
- Internal entities are not returned directly to the UI.
- Contracts use typed request and response objects.
- Breaking contract changes require versioning and migration.

---

## 7. Dependency Rules

Allowed dependency direction:

```text
Presentation
      ↓
Application
      ↓
Domain

Infrastructure
      ↓
Domain Contracts
```

The domain layer must not depend on:

- Electron
- React
- SQLite libraries
- Ollama
- Vercel
- Network clients
- Operating-system APIs

Cross-module dependencies must use:

- Public contracts
- Domain events
- Shared primitive types
- Application-level orchestration

Direct cross-module database access is forbidden.

---

## 8. Shared Kernel

The Shared Kernel contains only stable concepts used by many modules.

Allowed examples:

- Identifier types
- Date and time types
- Pagination
- Result types
- Common error structure
- Permission identifiers
- Audit metadata
- Money and currency value objects

The Shared Kernel must not become a folder for random reusable code.

Before adding something to it, the item must be:

- Used by at least two modules
- Stable
- Business-neutral
- Free of module-specific logic

---

## 9. Module Communication

Modules communicate through three approved methods.

### 9.1 Direct Contract Call

Used when one module needs an immediate result.

```text
Website Project Module
        ↓
Business Module Contract
        ↓
Business Details
```

---

### 9.2 Domain Event

Used when multiple modules may react to an event.

Example:

```text
WebsiteDeployed
      ↓
CRM updates deal activity
      ↓
Audit records deployment
      ↓
Analytics records outcome
```

The module producing an event must not know every consumer.

---

### 9.3 Background Job

Used for long-running operations.

Examples:

- Business discovery
- Website enrichment
- AI generation
- Embedding creation
- Website builds
- Deployment
- Backup creation

Long-running work must not block the user interface.

---

## 10. Event Architecture

Events describe completed facts.

Examples:

```text
CampaignCreated
BusinessesDiscovered
BusinessEnriched
LeadScoreCalculated
WebsiteBriefApproved
WebsiteVersionGenerated
WebsiteDeployed
OutreachDraftCreated
OutreachSent
DealStageChanged
ClientConverted
BackupCompleted
```

Event rules:

- Event names use past tense.
- Events are immutable.
- Every event has an identifier.
- Events include creation time.
- Events include the responsible module.
- Sensitive information is excluded where possible.
- Failed event consumers must not corrupt the original transaction.
- Important consumers support retry and idempotency.

Example:

```typescript
interface DomainEvent<TPayload> {
  eventId: string;
  eventType: string;
  version: number;
  occurredAt: string;
  sourceModule: string;
  aggregateId?: string;
  payload: TPayload;
}
```

---

## 11. Module Registry

The application maintains a registry of available modules.

```typescript
interface ModuleDefinition {
  id: string;
  version: string;
  type: "core" | "product" | "provider" | "plugin";
  dependencies: ModuleDependency[];
  permissions: Permission[];
  healthCheck(): Promise<ModuleHealth>;
  initialize(context: ModuleContext): Promise<void>;
  shutdown(): Promise<void>;
}
```

The registry is responsible for:

- Dependency validation
- Initialization order
- Health status
- Version compatibility
- Shutdown order
- Duplicate module prevention

---

## 12. Module Lifecycle

```text
Discovered
    ↓
Validated
    ↓
Dependencies Checked
    ↓
Initialized
    ↓
Active
    ↓
Stopping
    ↓
Stopped
```

Failure states:

```text
Invalid
Incompatible
Permission Denied
Initialization Failed
Disabled
Quarantined
```

A failed optional module must not prevent the core application from opening.

---

## 13. Capability System

Modules declare capabilities instead of depending on specific providers.

Examples:

```text
ai.chat
ai.structured-output
ai.embeddings
ai.vision
discovery.business-search
discovery.geocoding
deployment.static-export
deployment.hosted
outreach.email
outreach.whatsapp
storage.backup
```

The application requests a capability.

The module registry selects a compatible provider.

Example:

```text
Website Generator requests:
ai.structured-output

Configured provider:
OllamaProvider
```

This prevents provider names from becoming part of product logic.

---

## 14. Provider Interfaces

### 14.1 AI Provider

```typescript
interface AIProvider {
  id: string;
  capabilities: AICapability[];

  healthCheck(): Promise<ProviderHealth>;

  execute<TInput, TOutput>(request: ProviderAIRequest<TInput>): Promise<ProviderAIResult<TOutput>>;
}
```

---

### 14.2 Discovery Provider

```typescript
interface DiscoveryProvider {
  id: string;

  search(request: BusinessDiscoveryRequest): Promise<BusinessDiscoveryResult>;

  normalize(record: unknown): NormalizedBusinessCandidate;
}
```

---

### 14.3 Deployment Provider

```typescript
interface DeploymentProvider {
  id: string;

  validateConfiguration(): Promise<ValidationResult>;

  deploy(request: DeploymentRequest): Promise<DeploymentResult>;

  getStatus(deploymentId: string): Promise<DeploymentStatus>;

  rollback?(deploymentId: string): Promise<RollbackResult>;
}
```

---

## 15. Plugin Manifest

Every plugin requires a manifest.

Example:

```json
{
  "id": "com.projectatlas.example-provider",
  "name": "Example Provider",
  "version": "1.0.0",
  "apiVersion": "1",
  "publisher": "Verified Publisher",
  "description": "Example provider plugin",
  "type": "provider",
  "entry": "dist/index.js",
  "capabilities": ["deployment.hosted"],
  "permissions": ["network.request", "credentials.use", "deployments.write"],
  "compatibleAppVersions": ">=1.0.0 <2.0.0"
}
```

Required manifest fields:

- Unique plugin identifier
- Name
- Version
- API version
- Publisher
- Description
- Plugin type
- Entry point
- Capabilities
- Permissions
- Compatible application versions
- Integrity information
- Update source

---

## 16. Plugin Permissions

Possible permission categories:

### Data Permissions

```text
campaigns.read
campaigns.write
businesses.read
businesses.write
websites.read
websites.write
crm.read
crm.write
```

### System Permissions

```text
network.request
files.read-approved
files.export
notifications.create
background-jobs.create
```

### AI Permissions

```text
ai.request
ai.embeddings
ai.vision
```

### Sensitive Permissions

```text
credentials.use
deployment.execute
outreach.send
```

Rules:

- Permissions are denied by default.
- Plugins receive only declared permissions.
- The user sees requested sensitive permissions.
- Permission changes require confirmation.
- Plugins never access the raw database.
- Plugins never receive unrestricted filesystem access.
- Credentials are accessed through controlled services.
- Permission violations disable the operation and create an audit event.

---

## 17. Plugin Installation

Installation flow:

```text
Plugin Selected
      ↓
Manifest Read
      ↓
Publisher and Integrity Checked
      ↓
Compatibility Checked
      ↓
Permissions Displayed
      ↓
User Approval
      ↓
Plugin Installed Disabled
      ↓
Health Check
      ↓
Plugin Enabled
```

Plugins must not become active before validation completes.

Version 1 may support internal trusted plugins only.

---

## 18. Plugin Isolation

Plugins are considered untrusted unless included with the official application.

Isolation requirements:

- No direct Electron main-process access.
- No unrestricted Node.js APIs.
- No raw database connection.
- No unrestricted filesystem access.
- No unrestricted network access.
- No access to other plugin internals.
- No direct access to credentials.
- No ability to modify the application source code.
- No ability to disable security controls.

Where practical, plugins run in a separate process or restricted worker.

---

## 19. Plugin Data Storage

Plugins may store data only through an approved storage service.

```typescript
interface PluginStorage {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}
```

Rules:

- Storage is namespaced by plugin identifier.
- Storage quotas are enforced.
- Plugin deletion offers data cleanup.
- Plugin data cannot overwrite core records.
- Core data remains valid when the plugin is removed.

---

## 20. Plugin Removal

Removing a plugin must:

1. Disable the plugin.
2. Stop active jobs.
3. Revoke runtime permissions.
4. Preserve core application data.
5. Offer export or deletion of plugin-owned data.
6. Remove plugin files.
7. Record an audit event.
8. Confirm no required core module depended on it.

A plugin must never own data required to open the application.

---

## 21. Plugin Updates

Plugin updates require:

- Compatible API version
- Valid integrity information
- Permission comparison
- Migration plan
- Rollback plan
- User approval when permissions expand

A plugin update that requests new sensitive permissions must be treated as a new approval.

---

## 22. Versioning Rules

AI Agency OS uses semantic versioning.

```text
MAJOR.MINOR.PATCH
```

- Major: breaking contract changes
- Minor: backward-compatible features
- Patch: backward-compatible fixes

Module and plugin contracts also define an API version.

Breaking changes require:

- Migration documentation
- Compatibility checks
- Deprecation period where practical
- Updated tests
- Updated Engineering Handbook

---

## 23. Error Contract

Modules return structured errors.

```typescript
interface ApplicationError {
  code: string;
  message: string;
  category:
    "validation" | "permission" | "not-found" | "conflict" | "provider" | "security" | "system";
  retryable: boolean;
  userAction?: string;
  details?: Record<string, unknown>;
}
```

Rules:

- UI messages must be understandable.
- Internal stack traces are not shown to normal users.
- Secrets are removed from errors.
- Provider errors are translated into application errors.
- Retryable failures clearly show retry options.

---

## 24. Health Checks

Every provider and optional module implements a health check.

Possible states:

```text
healthy
degraded
unavailable
misconfigured
incompatible
disabled
```

Health checks must not expose credentials.

The Settings screen displays:

- Module name
- Status
- Version
- Last checked
- Required action

---

## 25. Module Configuration

Configuration is managed through typed schemas.

Rules:

- Configuration has defaults.
- Invalid configuration is rejected.
- Sensitive settings use Secure Storage.
- Configuration migrations are versioned.
- UI forms are generated from approved schemas where practical.
- Modules do not read arbitrary environment variables in production.

---

## 26. Feature Flags

Feature flags may control:

- Experimental modules
- Beta functionality
- Advanced AI generation
- New deployment providers
- Internal testing tools

Rules:

- Feature flags do not replace permissions.
- Disabled features do not expose hidden active services.
- Production defaults remain safe.
- Experimental features display a clear warning.
- Removed flags are cleaned from the codebase.

---

## 27. Module Testing

Every module requires:

- Unit tests for domain logic
- Contract tests
- Repository tests
- Permission tests
- Error-path tests
- Migration tests
- Integration tests for provider adapters
- Acceptance tests for user workflows

Provider plugins require mock or sandbox testing.

Tests must not use real production credentials.

---

## 28. Module Documentation

Every module must contain:

```text
README.md
public-api.ts
permissions.md
events.md
errors.md
testing.md
```

The module README must explain:

- Purpose
- Ownership
- Public contract
- Dependencies
- Capabilities
- Permissions
- Events produced
- Events consumed
- Failure behavior
- Acceptance criteria

---

## 29. Codex Implementation Rules

Codex must not create a module before its specification is approved.

For each module, Codex must:

1. Read the Engineering Handbook.
2. Read this architecture.
3. Read the module specification.
4. Identify public contracts.
5. Confirm dependencies.
6. Implement domain logic first.
7. Implement infrastructure adapters.
8. Implement presentation last.
9. Add tests.
10. Update documentation.
11. Report files changed and remaining risks.

Codex must not:

- Access another module’s internal repository.
- Introduce circular dependencies.
- Add global mutable state.
- Create provider-specific logic in product modules.
- Add unapproved permissions.
- Install unnecessary dependencies.
- bypass validation or audit requirements.

---

## 30. Initial Source Structure

```text
src/
├── core/
│   ├── app-shell/
│   ├── security/
│   ├── settings/
│   ├── database/
│   ├── filesystem/
│   ├── jobs/
│   ├── audit/
│   └── notifications/
├── modules/
│   ├── campaigns/
│   ├── businesses/
│   ├── discovery/
│   ├── enrichment/
│   ├── atlas/
│   ├── website-projects/
│   ├── website-generator/
│   ├── templates/
│   ├── crm/
│   ├── outreach/
│   ├── deployment/
│   └── backup/
├── providers/
│   ├── ai/
│   │   └── ollama/
│   ├── discovery/
│   │   ├── openstreetmap/
│   │   └── nominatim/
│   └── deployment/
│       ├── static-export/
│       └── vercel/
├── plugins/
│   ├── runtime/
│   ├── registry/
│   ├── permissions/
│   └── storage/
└── shared/
    ├── kernel/
    ├── contracts/
    └── testing/
```

---

## 31. Acceptance Criteria

- [ ] Every major capability has a defined module owner.
- [ ] Product modules expose public contracts.
- [ ] Internal repositories are not imported across modules.
- [ ] Circular dependencies are prevented.
- [ ] Provider-specific code remains inside adapters.
- [ ] Long-running work uses background jobs.
- [ ] Domain events are versioned.
- [ ] Plugins declare capabilities and permissions.
- [ ] Plugins cannot access the raw database.
- [ ] Plugins cannot access unrestricted filesystem APIs.
- [ ] Plugin removal does not corrupt core data.
- [ ] Optional module failures do not prevent application startup.
- [ ] Contracts have automated tests.
- [ ] Breaking changes require migrations and documentation.
- [ ] Codex follows module boundaries during implementation.

---

## 32. Architecture Decisions

### ADR-MOD-001 — Modular Monolith

**Decision:** Version 1 will use a modular monolith rather than microservices.

**Reason:** The application is local-first and single-user. A modular monolith provides strong boundaries without unnecessary network and deployment complexity.

### ADR-MOD-002 — Contract-Based Communication

**Decision:** Modules communicate through public contracts and events.

**Reason:** This prevents direct dependency on internal implementations.

### ADR-MOD-003 — Capability-Based Providers

**Decision:** Product modules request capabilities instead of named providers.

**Reason:** Providers can be replaced without changing product logic.

### ADR-MOD-004 — Plugins Are Denied by Default

**Decision:** Plugin permissions are explicitly declared and denied unless approved.

**Reason:** Optional extensions must not weaken the security architecture.

### ADR-MOD-005 — Internal Plugins First

**Decision:** Version 1 supports official internal extensions before a public plugin ecosystem.

**Reason:** The contract and security model must mature before untrusted third-party plugins are allowed.

### ADR-MOD-006 — No Microservices in Version 1

**Decision:** Microservices are rejected for the initial desktop product.

**Reason:** They would increase complexity, failure points and maintenance without improving the current product.

---

## 33. Next Action

Create the Engineering Standards and Codex Rules document.
