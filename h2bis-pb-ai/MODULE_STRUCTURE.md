# h2bis-pb-ai — Module Structure Guide

> **For AI agents:** Read this file first. This package provides LLM-powered agents consumed by h2bis-pb-api. Each agent under `agents/` is fully self-contained with its own prompts, types, and logic.

## Architecture

**Agent-first architecture** — each AI agent is a self-contained module with its own prompts, types, and orchestration logic. Shared LLM infrastructure lives in `core/`.

```
src/
├── index.ts                    # Public barrel file — re-exports all agents, services, and types
│
├── core/                       # Shared AI infrastructure (no domain logic)
│   ├── config/
│   │   ├── config.ts           # Environment variables (OPENAI_API_KEY, model names, cache/logging flags)
│   │   └── prompts.config.ts   # Prompt version constant (for cache invalidation)
│   ├── services/
│   │   ├── llm/
│   │   │   ├── llm.service.ts  # Provider-agnostic LLM wrapper (retries, JSON parsing, cost tracking)
│   │   │   ├── providers/
│   │   │   │   └── openai.provider.ts  # OpenAI API integration (chat completions, cost calculation)
│   │   │   └── types/
│   │   │       └── llm.types.ts  # LLMOptions, LLMResponse, ChatMessage interfaces
│   │   └── cache/
│   │       └── cache.service.ts  # In-memory Map cache with TTL expiry
│   └── utils/
│       ├── logger.ts           # Simple 4-level console logger (debug/info/warn/error)
│       └── validators.ts      # Intent extraction result validator (critical checks + warnings)
│
└── agents/                     # Self-contained AI agent modules
    ├── intent-extraction/      # Extracts structured intent from use case narratives
    │   ├── intent-extraction.agent.ts  # Main agent class (retry logic, caching, validation)
    │   ├── prompts/
    │   │   ├── system-prompt.ts         # System prompt (normal + strict normative mode)
    │   │   └── user-prompt.template.ts  # User prompt builder (formats use case data)
    │   └── types/
    │       └── intent-analysis.types.ts # IntentAnalysis, UseCase, ValidationResult
    │
    ├── transformation-validation/  # Validates AI didn't hallucinate during capability generation
    │   ├── transformation-validation.agent.ts  # Hallucination scoring (Categories A-D, 95% threshold)
    │   └── prompts/
    │       └── validation-prompt.ts
    │
    ├── surgical-fix/           # Makes targeted fixes to specific fields (vs full regeneration)
    │   ├── surgical-fix.agent.ts  # Field-level fix with deep merge
    │   └── prompts/
    │       └── surgical-fix-prompt.ts
    │
    └── use-case-generation/    # Generates complete Use Case JSON from text descriptions
        ├── use-case-generation.agent.ts
        ├── prompts/
        │   ├── system-prompt.ts
        │   └── user-prompt.template.ts
        └── types/
            └── use-case-generation.types.ts  # UseCaseGenerationInput, UseCaseGenerationResult
```

## Agent Anatomy

Each agent follows a consistent pattern:

```
agents/{name}/
├── {name}.agent.ts             # Agent class with execute() method
├── prompts/                    # LLM prompt templates (system + user)
│   ├── system-prompt.ts
│   └── user-prompt.template.ts
└── types/                      # Input/output type definitions (optional)
    └── {name}.types.ts
```

## Agent Quick Reference

### intent-extraction/
- **Purpose:** Parses use case narratives into structured IntentAnalysis objects
- **Input:** Raw use case text
- **Output:** `IntentAnalysis` with actors, preconditions, main flow, alt flows, data requirements
- **Special:** Has strict normative mode, result caching with prompt version keys, automatic validation

### transformation-validation/
- **Purpose:** Verifies capability generation preserved original intent without hallucination
- **Input:** Original use case + generated capabilities
- **Output:** `TransformationValidationResult` with hallucination scores (Categories A-D) and pass/fail
- **Threshold:** 95% confidence required to pass

### surgical-fix/
- **Purpose:** Makes targeted fixes to specific capability fields instead of full regeneration
- **Input:** Capability object + `ValidationIssue[]` (from transformation-validation)
- **Output:** `SurgicalFixResult` with deep-merged corrections
- **Cross-agent dependency:** Imports `ValidationIssue` type from transformation-validation

### use-case-generation/
- **Purpose:** Generates complete Use Case JSON structures from textual descriptions
- **Input:** `UseCaseGenerationInput` with description + optional existing data
- **Output:** `UseCaseGenerationResult` with full structured JSON
- **Cross-agent dependency:** Imports `UseCase` type from intent-extraction

## Import Conventions

- **All imports use `.js` extension** (ESM module resolution)
- **Agent → Core:** `import { LLMService } from '../../core/services/llm/llm.service.js'`
- **Agent → Agent types:** Direct relative imports (e.g., surgical-fix imports from transformation-validation)
- **External packages:** `openai` (only in provider), `dotenv` (only in config)

## Public API (index.ts exports)

```typescript
// Agents
IntentExtractionAgent, TransformationValidationAgent, SurgicalFixAgent, UseCaseGenerationAgent

// Services  
LLMService, CacheService

// Utilities
logger, validateIntentExtraction

// Types (re-exported)
IntentAnalysis, UseCase, ValidationResult, ValidationInput, ValidationIssue,
TransformationValidationResult, SurgicalFixRequest, SurgicalFixResult,
UseCaseGenerationInput, UseCaseGenerationResult
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| LLM Provider | OpenAI (via openai npm package) |
| Validation | Zod (listed but currently unused in code) |
| Caching | In-memory Map with TTL |
| Testing | Vitest |
| Build | tsc → dist/ |
