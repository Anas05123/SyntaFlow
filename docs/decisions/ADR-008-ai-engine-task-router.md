# ADR-008: AI Engine TaskRouter & Provider Abstraction

> **Date:** 2026-08-14  
> **Status:** Accepted  
> **Scope:** Architecture & Domain Governance  

---

## Context
Embedding raw LLM API calls in UI components creates vendor lock-in, untracked costs, and privacy leaks.

## Decision
Route all AI operations through the backend TaskRouter, PromptRegistry, and ProviderAdapter (defaulting to local Ollama with FakeProvider fallback).

## Consequences
Zero client data leaves the machine without explicit configuration; prompts are version-locked.
