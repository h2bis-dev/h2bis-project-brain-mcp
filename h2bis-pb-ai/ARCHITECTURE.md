# Intent Extraction Agent - Architecture Reference

**Version:** 1.0.0  
**Purpose:** Semantic extraction of intent from business use case narratives using LLM  
**Status:** Implementation Complete  

---

## Overview

The Intent Extraction Agent replaces naive field mapping with semantic understanding, transforming business analyst use case narratives into structured, machine-readable intent analysis for capability generation.

**Problem Solved:**
- Naive mapping: `name → userGoal` (just copies "UC-14 - Login")
- New approach: LLM extracts actual user intent ("Access system using valid credentials")

---

## Architecture

### System Components

```
IntentExtractionAgent
    ↓
LLMService (provider-agnostic)
    ↓
OpenAIProvider (GPT-4-turbo)
    ↓
CacheService (cost optimization)
```

### Data Flow

```
UseCase Input
    ↓
1. Check Cache
    ↓ (cache miss)
2. Build Prompt (System + User template)
    ↓
3. Call LLM (via LLMService)
    ↓
4. Parse JSON Response
    ↓
5. Add Metadata (timestamp, model, version)
    ↓
6. Validate (4 critical checks)
    ↓
7. Retry if validation fails (exponential backoff)
    ↓
8. Cache Result (24h TTL)
    ↓
IntentAnalysis Output
```

---

## Core Components

### 1. IntentExtractionAgent
**File:** `src/agents/intent-extraction/intent-extraction.agent.ts`

**Responsibilities:**
- Orchestrate intent extraction workflow
- Manage caching and retry logic
- Coordinate LLM calls and validation

**Key Methods:**
```typescript
async extractIntent(useCase: UseCase): Promise<IntentAnalysis>
async validateExtraction(analysis, useCase): Promise<ValidationResult>
async getCachedIntent(key): Promise<IntentAnalysis | null>
```

**Features:**
- 3 retry attempts with exponential backoff (2^n seconds)
- Cache-first approach (checks cache before LLM call)
- Comprehensive logging at each step


### 2. LLMService
**File:** `src/services/llm/llm.service.ts`

**Responsibilities:**
- Provider-agnostic LLM interface
- Cost tracking and enforcement
- Token usage logging
- JSON response parsing

**Key Methods:**
```typescript
async chat(messages, options): Promise<LLMResponse>
async chatJSON<T>(messages, options): Promise<T>
```

**Features:**
- Automatic cost calculation per request
- Max cost per request enforcement ($0.10 default)
- Latency measurement
- Provider abstraction (easy to swap OpenAI/Anthropic/Google)


### 3. OpenAIProvider
**File:** `src/services/llm/providers/openai.provider.ts`

**Responsibilities:**
- OpenAI API integration
- Cost calculation
- Token usage tracking

**Configuration:**
```typescript
{
    model: 'gpt-4-turbo',
    temperature: 0.1,          // Low for consistency
    max_tokens: 2000,
    response_format: { type: 'json_object' }
}
```

**Pricing (Dec 2024):**
- GPT-4-turbo: $0.01/1K input, $0.03/1K output
- GPT-3.5-turbo: $0.0005/1K input, $0.0015/1K output


### 4. CacheService
**File:** `src/services/cache/cache.service.ts`

**Responsibilities:**
- In-memory caching with TTL
- Cache invalidation
- Cost reduction

**Cache Strategy:**
- Key format: `intent:{useCaseKey}`
- TTL: 24 hours (configurable)
- Expected hit rate: 80%
- Cost savings: $0.035 → $0.007 average


### 5. Validation Logic
**File:** `src/utils/validators.ts`

**4 Critical Checks (MUST pass):**

| Check | Requirement | Failure Impact |
|-------|-------------|----------------|
| 1. userGoal | Not empty | Blocks capability generation |
| 2. systemResponsibilities | Length > 0 | Blocks capability generation |
| 3. acceptanceCriteria | Count matches input | Blocks capability generation |
| 4. confidenceLevel | Not "low" | Triggers manual review |

**Recommendations:**
- `proceed`: All checks pass
- `manual_review`: 1-2 failures
- `retry`: 3+ failures

**Quality Warnings (non-blocking):**
- Missing technical components
- Security tags without security considerations

---

## Data Structures

### Input: UseCase

```typescript
interface UseCase {
    type: 'use_case';
    key: string;
    name: string;
    description: string;
    businessValue: string;
    primaryActor: string;
    acceptanceCriteria: string[];
    flows: Flow[];
    technicalSurface: TechnicalSurface;
    tags: string[];
}
```

### Output: IntentAnalysis

```typescript
interface IntentAnalysis {
    // Core semantics (CRITICAL)
    userGoal: string;
    systemResponsibilities: string[];
    
    // Business context
    businessContext: string;
    businessValue: string;
    
    // Technical extraction
    technicalComponents: {
        frontend: { routes: string[]; components: string[] };
        backend: { endpoints: string[]; services: string[] };
        data: { entity: string; operations: CRUD[] }[];
    };
    
    // Behavioral
    userFlows: Flow[];
    acceptanceCriteria: string[];
    
    // Quality indicators
    assumptions: string[];
    ambiguities: string[];
    missingInformation: string[];
    constraints: string[];
    
    // Security & risk
    securityConsiderations: string[];
    implementationRisks: string[];
    
    // Metadata
    confidenceLevel: 'high' | 'medium' | 'low';
    confidenceJustification: string;
    extractedAt: Date;
    llmModel: string;
    promptVersion: string;
}
```

---

## Prompting Strategy

### System Prompt
**File:** `src/agents/intent-extraction/prompts/system-prompt.ts`

**Role:** Expert business analyst and system architect

**Key Instructions:**
- Extract precise, actionable information
- Do NOT hallucinate - flag ambiguities instead
- Separate user goals from system responsibilities
- Note security considerations for auth/payment/PII
- Provide realistic confidence assessment

### User Prompt Template
**File:** `src/agents/intent-extraction/prompts/user-prompt.template.ts`

**Structure:**
1. Use case details (name, description, flows, etc.)
2. Output JSON schema specification
3. Field-by-field instructions
4. Critical rules and examples

**Key Requirements:**
- userGoal = actual user intent (NOT just copied name)
- systemResponsibilities = separated, actionable items
- Only extract explicitly mentioned technical components
- Be honest about ambiguities and assumptions

---

## Configuration

### Prompt Versioning

**File:** `src/config/prompts.config.ts`

```typescript
export const PROMPT_VERSION = {
    intentExtraction: '1.0.0'
};
```

**Purpose:**
- Track prompt evolution
- Enable A/B testing
- Support rollback if quality degrades

---

## Usage

### Basic Usage

```typescript
import { IntentExtractionAgent } from 'h2bis-pb-ai';

const agent = new IntentExtractionAgent();

const useCase = {
    type: 'use_case',
    key: 'uc-user-login',
    name: 'User Login',
    description: 'Allows users to log in using email and password',
    // ... other fields
};

const analysis = await agent.extractIntent(useCase);

console.log(analysis.userGoal);
// "Access the system using valid credentials"

console.log(analysis.systemResponsibilities);
// ["Validate email and password", "Create session", "Redirect to dashboard"]

console.log(analysis.confidenceLevel);
// "high"
```

### Error Handling

```typescript
try {
    const analysis = await agent.extractIntent(useCase);
} catch (error) {
    console.error('Extraction failed after 3 retries:', error);
    // Fallback to manual review
}
```

---

## Cost Analysis

### Per Extraction Cost

**Typical Use Case:**
- Input: ~500 tokens
- Output: ~1000 tokens
- Total: ~1500 tokens

**GPT-4-turbo:**
- Cost = (500/1000 × $0.01) + (1000/1000 × $0.03)
- **Cost = $0.035 per extraction**

**With 80% Cache Hit:**
- Average = 0.2 × $0.035 = **$0.007 per extraction**

**Monthly Projection (1000 extractions):**
- 200 LLM calls × $0.035 = $7/month
- 800 cache hits × $0 = $0
- **Total: $7/month**

---

## Design Decisions

### 1. Provider Abstraction
**Why:** Future-proof for multiple LLM providers
**How:** LLMService interface → Provider implementations
**Benefit:** Can swap OpenAI/Anthropic/Google without changing agent code

### 2. Cache-First Approach
**Why:** Reduce costs by 80%+
**How:** Check cache before calling LLM
**Tradeoff:** Stale data if use case updated (solution: invalidate on update)

### 3. Explicit Validation (No Scoring)
**Why:** Avoid false precision (score 79 vs 81 meaningless)
**How:** 4 clear pass/fail checks
**Benefit:** Actionable, maintainable, no score rebalancing

### 4. Retry with Exponential Backoff
**Why:** Handle transient API failures
**How:** 3 attempts with 2^n second delays
**Benefit:** Resilient to temporary issues

### 5. Prompt Versioning
**Why:** Track prompt evolution and A/B test
**How:** Store version with each extraction
**Benefit:** Can rollback or compare versions

### 6. Honest About Ambiguities
**Why:** Prevent hallucination
**How:** LLM explicitly flags unclear areas
**Benefit:** Humans review only what needs attention

---

## Integration Points

### With h2bis-pb-api (Planned)

**Current Flow:**
```
UseCase → transformUseCaseToCapability → Capability
(naive: name → userGoal)
```

**New Flow:**
```
UseCase → IntentExtractionAgent → IntentAnalysis → transformIntentToCapability → Capability
```

**Integration Options:**

| Option | Approach | Pros | Cons |
|--------|----------|------|------|
| A. Direct Import | Import agent in API | Simple, no network | Coupled |
| B. HTTP Endpoint | Separate AI service | Decoupled | Network overhead |
| C. Message Queue | Async via RabbitMQ | Scalable, reliable | Complex setup |

**Recommended:** Option C (Message Queue) for production

---

## Quality Assurance

### Pre-Extraction
- Use case has required fields
- Acceptance criteria present
- Flows defined

### Post-Extraction
- 4 critical validation checks
- Quality warnings logged
- Confidence assessment

### Human Review Triggers
- Confidence ≠ "high"
- Security tags (auth/payment/security)
- Critical validation failures

---

## Monitoring

### Logged Metrics
- Extraction latency (ms)
- LLM token usage
- Cost per extraction
- Cache hit rate
- Validation failure rate
- Confidence distribution

### Success Indicators
- 80%+ extractions with high confidence
- 80%+ cache hit rate
- $0.01 average cost per extraction
- <5% validation failures requiring retry

---

## Testing

### Unit Tests
**File:** `tests/unit/validators.test.ts`
**Coverage:** All 4 validation checks + edge cases

### Integration Tests
**File:** `tests/integration/intent-extraction.integration.test.ts`
**Coverage:** End-to-end extraction with real LLM

**Run Tests:**
```bash
npm run test:unit          # Fast, mocked
npm run test:integration   # Requires API key
```

---

## Troubleshooting

### Issue: API Key Not Found
```
Error: OpenAI API key not configured
```
**Solution:** Set `OPENAI_API_KEY` in `.env`

### Issue: Low Confidence Extractions
```
Warning: Manual review required - confidence is low
```
**Solution:** Use case likely has ambiguities. Review and clarify requirements.

### Issue: Validation Failures
```
Error: systemResponsibilities is empty
```
**Solution:** LLM failed to extract. Check use case quality or retry with different prompt.

### Issue: High Costs
```
Warning: Request exceeded cost limit
```
**Solution:** Verify caching enabled. Consider GPT-3.5-turbo for non-critical extractions.

---

## Future Enhancements

### V1.1 - Multi-Provider Support
- Add Anthropic provider (Claude)
- Add Google provider (Gemini)
- Provider selection based on cost/quality

### V1.2 - Streaming Responses
- Stream LLM output for faster perceived latency
- Progressive UI updates

### V1.3 - Fine-Tuning
- Collect high-quality extraction examples
- Fine-tune GPT-3.5-turbo for lower cost
- Evaluate quality vs base model

### V2.0 - Software Development Agent
- Implement code generation from capabilities
- Test generation from acceptance criteria
- Review and iteration loop

---

## Related Documentation

- **Agent Instructions:** `src/agents/intent-extraction/AGENT_INSTRUCTIONS.md`  
  Human-readable guide for the LLM agent

- **README:** `README.md`  
  Setup, usage, and troubleshooting

- **Implementation Plan:** `intent-agent-implementation.md` (artifacts)  
  Detailed implementation specifications

- **Architecture Overview:** `ai-layer-architecture.md` (artifacts)  
  Complete system architecture including Software Dev Agent

---

## Quick Reference

**Main Entry Point:**
```typescript
IntentExtractionAgent.extractIntent(useCase)
```

**Cost per Extraction:**
- GPT-4-turbo: $0.035
- With cache: $0.007 avg

**Validation Checks:**
1. userGoal not empty
2. systemResponsibilities.length > 0
3. acceptanceCriteria count matches
4. confidenceLevel ≠ "low"

**Cache Key:**
```
intent:{useCaseKey}
```

**Retry Logic:**
- Max attempts: 3
- Backoff: 2^n seconds

**Dependencies:**
- openai: ^4.20.0
- zod: ^3.22.4
- dotenv: ^16.3.1

---

**Last Updated:** 2025-12-29  
**Maintained By:** H2BIS ProjectBrain Team
