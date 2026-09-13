# CoreDesk — AI Engine Architecture (Atlas AI)

> **Status:** IMPLEMENTED in `packages/ai-engine` / UI Integration `PLANNED`  
> **Last verified:** 2026-09-13  
> **Relevant source areas:** `project-atlas/packages/ai-engine/`, `project-atlas/packages/contracts/src/atlas-ai.ts`  
> **Owner domain:** AI Engineering & Machine Learning  

---

## 1. Architectural Pipeline

The CoreDesk AI Engine is decoupled from UI rendering screens. Applications features never call LLM providers or Ollama directly. All AI tasks pass through a structured 8-stage pipeline:

```
┌────────────────────────────────────────────────────────┐
│ 1. Application Feature (e.g. Scoping Blueprint / Brief)│
└───────────────────────────┬────────────────────────────┘
                            │ Dispatches typed task request
                            ▼
┌────────────────────────────────────────────────────────┐
│ 2. AI Engine Entrypoint (aiEngine.execute())           │
└───────────────────────────┬────────────────────────────┘
                            │ Routes by capability
                            ▼
┌────────────────────────────────────────────────────────┐
│ 3. Task Router (TaskRouter.ts)                         │
└───────────────────────────┬────────────────────────────┘
                            │ Fetches required data
                            ▼
┌────────────────────────────────────────────────────────┐
│ 4. Context Builder (ContextBuilder.ts)                 │
│    - Assembles client dossier, active project brief    │
│    - Sanitizes private notes & personal identifiers   │
└───────────────────────────┬────────────────────────────┘
                            │ Injects into approved template
                            ▼
┌────────────────────────────────────────────────────────┐
│ 5. Prompt Registry (PromptRegistry.ts)                 │
│    - Versioned system and user prompt templates        │
└───────────────────────────┬────────────────────────────┘
                            │ Dispatches to adapter
                            ▼
┌────────────────────────────────────────────────────────┐
│ 6. Provider Adapter (OllamaProvider / FakeAiProvider)  │
│    - Handles HTTP connection & timeouts (30s)          │
│    - Enforces local loopback (http://127.0.0.1:11434)  │
└───────────────────────────┬────────────────────────────┘
                            │ Raw LLM JSON response
                            ▼
┌────────────────────────────────────────────────────────┐
│ 7. Output Validator (OutputValidator.ts)               │
│    - Validates JSON against Zod schema                 │
│    - Strips hallucinations & unauthorized fields       │
└───────────────────────────┬────────────────────────────┘
                            │ Strongly typed result
                            ▼
┌────────────────────────────────────────────────────────┐
│ 8. Application Feature (Renders validated output)      │
└────────────────────────────────────────────────────────┘
```

---

## 2. Provider Abstraction & Boundaries

### 2.1 Fake AI Provider (`FakeAiProvider.ts`)
- **Purpose**: Fast, deterministic, zero-cost test suite execution.
- **Behavior**: Returns pre-canned, valid Zod-compliant JSON payloads for project blueprints, task breakdowns, and document summaries.
- **Usage**: Automatically selected during CI/CD, unit tests, and security boundary tests.

### 2.2 Ollama Provider (`OllamaProvider.ts`)
- **Purpose**: Production local AI inference without cloud subscription or data privacy risk.
- **Connection**: Binds to `http://127.0.0.1:11434/api/generate`.
- **Default Models**: `llama3.2:latest`, `mistral:7b`, or user-selected local model in Settings.
- **Timeout Policy**: 30-second hard abort timer; graceful fallback to informative error state if Ollama service is stopped.

### 2.3 Future Cloud Provider Adapters (`PLANNED`)
- Architecture allows plugging in opt-in cloud providers (OpenAI, Anthropic, Gemini) via the same `AiProvider` interface without altering application features or prompt registries. Cloud providers remain strictly disabled by default.

---

## 3. Strict Prohibitions

> [!CAUTION]
> 1. **No Direct Fetching from Renderer**: React components must never execute `fetch('http://localhost:11434/...')`. All operations must pass through IPC `atlas-ai:generate`.
> 2. **No Unvalidated AI Output**: Unvalidated string outputs from LLMs must never be directly injected into database state or rendered into HTML (`dangerouslySetInnerHTML`). Every AI response must pass Zod schema verification.
