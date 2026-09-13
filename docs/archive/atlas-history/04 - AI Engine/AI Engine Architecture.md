> Historical archive — Atlas was the former working name of CoreDesk.
> This document is not a current source of truth.

---

﻿---
title: AI Engine Architecture
project: Project Atlas
product: AI Agency OS
version: 1.0
status: Approved Foundation
owners:
  - Founder
  - CTO
last_updated: 2026-08-03
---

# AI Engine Architecture

## 1. Purpose

The AI Engine is the single controlled gateway between AI Agency OS and all local or optional cloud AI models.

No application module may communicate directly with Ollama or another AI provider.

```text
Application Feature
        ↓
AI Gateway
        ↓
Task Router
        ↓
Context Builder
        ↓
Prompt Registry
        ↓
Provider Adapter
        ↓
Local or Optional Cloud Model
        ↓
Output Validator
        ↓
Application Feature
2. Core Principles
Ollama is the default local AI runtime.
AI Agency OS must remain usable when Ollama is unavailable.
Cloud AI providers are optional and disabled by default.
No mandatory AI subscription is permitted.
Every AI request must pass through the AI Engine.
Important AI outputs must use validated structured formats.
AI may recommend actions but cannot perform sensitive actions without user approval.
Models must remain replaceable through configuration.
Prompts must be stored and versioned separately from application code.
Atlas memory stores approved facts and decisions, not hidden AI reasoning.
AI-generated websites must use a controlled production pipeline.
User data remains local unless the user explicitly enables an external provider.
3. AI Engine Components
3.1 AI Gateway
The AI Gateway is the only public interface used by other modules.
Responsibilities:
Receive AI requests.
Validate permissions.
Select the correct task profile.
Build the required context.
Select a compatible model.
Execute the request.
Validate the result.
Log performance and failures.
Return a typed result.
3.2 Provider Adapters
AIProvider
├── OllamaProvider
├── OpenAIProvider        Optional future provider
├── AnthropicProvider     Optional future provider
├── GeminiProvider        Optional future provider
└── CustomProvider        Optional user-configured provider
Rules:
Provider-specific code stays inside its adapter.
Product modules never import provider libraries directly.
Removing one provider must not break the rest of the application.
Ollama remains the default provider for Version 1.
3.3 Model Registry
The Model Registry stores:
Provider name
Model identifier
Supported capabilities
Context capacity
Vision support
Tool support
Structured-output support
Estimated hardware requirements
User-enabled status
Health status
Benchmark results
Recommended task profiles
The application must not depend permanently on one specific model.
3.4 Task Router
The Task Router chooses the correct AI profile according to:
Task type
Required capability
Privacy mode
Quality mode
Available hardware
Context size
Model availability
User settings
Timeout limits
Quality modes:
Fast
Balanced
Quality
3.5 Context Builder
The Context Builder prepares only the information needed for the current task.
Possible context sources:
Current campaign
Selected business
Website brief
Brand information
Previous approved decisions
User preferences
Relevant templates
Relevant project versions
Retrieved knowledge
Recent conversation summary
The Context Builder must not send the full database or complete project history unnecessarily.
3.6 Prompt Registry
Prompts are stored as versioned Markdown files.
prompts/
├── atlas/
│   ├── campaign-summary/
│   ├── next-actions/
│   └── assistant-chat/
├── businesses/
│   ├── analyze/
│   ├── score/
│   └── summarize/
├── outreach/
│   ├── whatsapp/
│   ├── email/
│   └── follow-up/
└── websites/
    ├── brief/
    ├── design-direction/
    ├── section-plan/
    ├── copy/
    ├── revision/
    └── quality-review/
Every prompt must define:
Purpose
Inputs
Required output format
Forbidden behavior
Example input
Example output
Version number
Evaluation cases
Prompts must never be hard-coded inside UI components.
3.7 Output Validator
Important AI responses must pass:
Schema validation
Domain validation
Permission validation
Reference validation
Safety validation
Size validation
Invalid output may be repaired once automatically.
Repeated failures must be shown to the user and must never be silently accepted.
4. AI Request Contract
interface AIRequest<TInput> {
  requestId: string;
  taskType: AITaskType;
  input: TInput;
  contextReferences: ContextReference[];
  privacyMode: "local-only" | "external-approved";
  qualityMode: "fast" | "balanced" | "quality";
  permissions: AIPermission[];
  timeoutMs: number;
}

interface AIResult<TOutput> {
  requestId: string;
  status: "success" | "failed" | "cancelled";
  output?: TOutput;
  provider: string;
  model: string;
  promptVersion: string;
  durationMs: number;
  warnings: string[];
  error?: AIError;
}
5. Version 1 AI Task Profiles
Profile	Responsibility	Default Mode
Atlas Chat	Answer questions about campaigns, businesses and projects	Balanced
Campaign Summary	Summarize activity, progress and next actions	Fast
Business Analysis	Analyze business strengths, weaknesses and opportunities	Balanced
Lead Scoring	Produce an evidence-based opportunity score	Fast
Website Brief	Convert business information into a structured brief	Balanced
Design Direction	Select layout, visual style and content hierarchy	Balanced
Website Copy	Generate structured website copy	Balanced
Website Revision	Convert user instructions into controlled changes	Balanced
Outreach Writing	Draft personalized WhatsApp, email and follow-up messages	Fast
Summarization	Summarize records, notes and activity	Fast
Embeddings	Create vectors for local semantic retrieval	Background
Vision Analysis	Analyze logos, screenshots and visual assets	Optional

6. Local Model Profiles
Exact models will be selected after testing them on the founder’s computer.
Required profiles:
Fast Profile
Used for:
Atlas chat
Summaries
Outreach
Lead scoring
Business analysis
Website briefs
Balanced Profile
Used for:
Website planning
Design direction
Structured copy
Complex business analysis
Controlled revisions
Vision Profile
Used for:
Logo analysis
Screenshot analysis
Website visual review
Asset categorization
This profile is optional in Version 1.
Embedding Profile
Used for:
Handbook search
Campaign memory
Business similarity
Template retrieval
Semantic search
Coding Profile
Used for advanced website-generation tasks.
It is optional and must not be required for normal Version 1 operation.
7. Website Generation Architecture
Rejected Approach
Business Information
        ↓
One Large Prompt
        ↓
AI Generates Entire Repository
This approach is rejected because it is difficult to control, validate, secure and maintain.
Approved Approach
Business Information
        ↓
Structured Website Brief
        ↓
Design Fingerprint
        ↓
Page and Section Plan
        ↓
Approved Component Selection
        ↓
Structured Content Generation
        ↓
Deterministic Website Compiler
        ↓
Local Preview
        ↓
Automated Quality Checks
        ↓
User Review
        ↓
Controlled Revisions
        ↓
Export or Deployment
7.1 Website Specification
The AI produces a structured specification.
interface WebsiteSpecification {
  businessId: string;
  industry: string;
  primaryGoal: string;
  audience: string[];
  pages: PageSpecification[];
  designFingerprint: DesignFingerprint;
  brand: BrandSpecification;
  content: ContentSpecification;
  assets: AssetRequirement[];
  seo: SEOSettings;
}
7.2 Deterministic Website Compiler
The compiler creates the final website using:
Approved components
Design tokens
Layout rules
Responsive rules
Accessibility rules
Validated dependencies
Secure templates
Approved content
The language model does not receive unrestricted control over the complete application repository.
7.3 Advanced Generation Mode
Free-form code generation may be added later.
Requirements:
Isolated workspace
Dependency validation
Security checks
Automated testing
Preview before approval
No access to application secrets
No automatic deployment
8. Design Fingerprint System
Every generated website receives a design fingerprint.
The fingerprint includes:
Layout family
Navigation style
Hero composition
Content density
Section rhythm
Typography direction
Color strategy
Shape language
Image treatment
Animation intensity
Call-to-action pattern
Footer structure
The system compares new fingerprints with recent generated websites.
Highly similar fingerprints must be rejected or adjusted.
The goal is to avoid repetitive AI-looking websites.
9. Atlas Memory
Atlas memory has four layers.
Layer 1 — Session Context
Temporary information used during the current interaction.
Layer 2 — Campaign Memory
Approved information connected to one campaign.
Examples:
Target market
Campaign goals
Preferred business types
Rejected strategies
Successful outreach style
Layer 3 — User Preferences
Long-term approved preferences.
Examples:
Preferred deployment provider
Preferred communication tone
Preferred website style
Default technology stack
Preferred design directions
Layer 4 — Knowledge Library
Indexed project knowledge.
Examples:
Engineering Handbook
Architecture decisions
Templates
Campaign notes
Previous successful outputs
Industry playbooks
Memory Rules
Important memories must show their source.
Users can edit or delete memories.
AI suggestions are not automatically saved as facts.
Hidden AI reasoning is never stored.
Sensitive information requires explicit approval.
Memory remains local by default.
Deleted memory must not remain active in retrieval.
10. Retrieval Architecture
Version 1 uses hybrid retrieval.
User Request
        ↓
Metadata Filters
        ↓
Full-Text Search
        +
Vector Similarity Search
        ↓
Ranking
        ↓
Deduplication
        ↓
Context Builder
Indexed content may include:
Engineering Handbook
Campaign notes
Approved Atlas memories
Business descriptions
Website briefs
Templates
Previous approved outputs
Architecture decisions
SQLite remains the source of truth.
The vector storage implementation must remain replaceable.
11. Atlas Tools
Atlas may access only registered tools.
Read-only tools:
campaign.read
campaign.search
business.read
business.search
website.read
website.compareVersions
crm.readPipeline
job.readStatus
knowledge.search
Higher-risk tools:
website.deploy
outreach.send
business.delete
campaign.delete
credentials.use
plugin.install
Higher-risk tools require explicit user approval.
12. Permission Levels
Level	Behavior
Read	Retrieve approved local information
Draft	Prepare content without saving or sending
Modify	Requires approval before saving changes
External	Requires approval before sending data outside the application
Destructive	Requires confirmation and a recovery plan

AI must never bypass these permission levels.
13. Context Management
Context priority:
Current task instructions
Selected business or campaign
Approved user constraints
Relevant retrieved knowledge
Recent conversation summary
Older history only when required
Large content must be:
Chunked
Summarized
Retrieved selectively
Referenced by identifier
Loaded only when needed
The system must not depend on extremely large prompts.
14. AI Job States
queued
preparing_context
loading_model
generating
validating
repairing
completed
failed
cancelled
Every AI operation lasting longer than one second must show visible progress.
Long-running jobs must run outside the main user-interface process.
15. Failure Handling
Required failure types:
Ollama unavailable
Model not installed
Model failed to load
Request timed out
Invalid structured output
Insufficient context
Hardware memory error
User cancellation
Provider authentication failure
External provider rate limit
Recovery rules:
Preserve user input.
Preserve completed work.
Show an understandable error.
Provide retry options.
Allow selection of another compatible model.
Keep non-AI features working.
Record technical details in local logs.
Never expose secrets in logs.
16. Privacy Modes
Local-Only Mode
All requests use local models.
No private content leaves the computer.
External providers remain disabled.
Local logs avoid unnecessary private content.
External Provider Mode
Before enabling an external provider, the application must display:
Provider name
Data categories that may be sent
Credential requirements
Possible cost
Privacy warning
Features that will use the provider
The user must explicitly enable the provider.
17. AI Evaluation
Every production prompt must have repeatable evaluation cases.
Evaluation categories:
Schema validity
Factual grounding
Instruction following
Relevance
Tone
Safety
Repetition
Website uniqueness
Business usefulness
Latency
Hardware usage
Evaluation cases must include:
Restaurants
Clinics
Wholesalers
Retailers
Professional services
Businesses with no website
Businesses with weak websites
Incomplete business records
Multilingual business information
18. Observability
Store locally:
Request identifier
Task type
Provider
Model
Prompt version
Duration
Input size
Output size
Validation result
Retry count
Final status
Non-sensitive error information
Never log:
API keys
Passwords
Deployment credentials
Hidden AI reasoning
Unnecessary personal information
19. Performance Rules
Only one large generation job runs by default.
Embedding tasks run in a background queue.
Model health checks are cached.
Models unload according to user settings.
Output may stream to the interface when appropriate.
Structured tasks may use non-streaming output for easier validation.
Context size is configured per task.
The application warns before loading a model that may exceed available hardware resources.
20. Proposed Source Structure
src/
└── ai/
    ├── application/
    │   ├── ai-gateway.ts
    │   ├── task-router.ts
    │   └── ai-job-service.ts
    ├── domain/
    │   ├── ai-request.ts
    │   ├── ai-result.ts
    │   ├── model-profile.ts
    │   └── ai-errors.ts
    ├── infrastructure/
    │   ├── providers/
    │   │   ├── ollama/
    │   │   └── optional/
    │   ├── embeddings/
    │   ├── vector-store/
    │   ├── prompts/
    │   └── observability/
    ├── memory/
    ├── context/
    ├── validation/
    ├── evaluation/
    └── tools/
21. Acceptance Criteria

No product module communicates directly with Ollama.

Non-AI features work without Ollama.

Models can be replaced through configuration.

Important outputs use validated schemas.

Tool permissions are enforced.

Atlas memory is editable and traceable.

Website generation uses the controlled specification pipeline.

Failed AI jobs preserve user work.

External providers are optional.

AI tests use repeatable evaluation cases.

Logs never expose credentials.

The founder’s hardware can run the default profile acceptably.
22. Architecture Decisions
ADR-AI-001 — Provider-Independent AI Engine
Decision: All AI requests use one provider-independent AI Engine.
Reason: Prevent vendor lock-in and direct provider dependencies.
ADR-AI-002 — Ollama-First Runtime
Decision: Ollama is the default Version 1 AI provider.
Reason: Local processing, privacy and no mandatory usage fees.
ADR-AI-003 — Controlled Website Generation
Decision: Website production uses structured specifications and a deterministic compiler.
Reason: This produces safer, more consistent and more testable websites than unrestricted repository generation.
ADR-AI-004 — Transparent Atlas Memory
Decision: Atlas stores approved facts and decisions, not hidden reasoning.
Reason: Memory must remain understandable, editable and privacy-respecting.
ADR-AI-005 — Configurable Models
Decision: Model selection remains configurable.
Reason: Models and hardware capabilities change faster than the application architecture.
23. Next Action
Benchmark local Fast, Balanced, Vision and Embedding model profiles on the founder’s computer before finalizing the default Model Registry.
```

