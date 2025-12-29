# H2BIS-PB-AI

AI layer for H2BIS ProjectBrain - Intelligent agents for intent extraction and software development.

## Features

-  **Intent Extraction Agent**: Semantic analysis of use case narratives using LLM
- **Provider-Agnostic LLM Service**: Support for OpenAI (with extensibility for Anthropic, Google)
- **Intelligent Caching**: Reduce costs by caching extraction results
- **Validation**: 4 critical checks ensure extraction quality
- **Retry Logic**: Automatic retry with exponential backoff

## Architecture

```
h2bis-pb-ai/
├── src/
│   ├── agents/
│   │   └── intent-extraction/     # Intent Extraction Agent
│   ├── services/
│   │   ├── llm/                   # LLM service (OpenAI)
│   │   └── cache/                 # Caching service
│   ├── config/                    # Configuration
│   └── utils/                     # Utilities
└── tests/                         # Unit & integration tests
```

## Setup

### 1. Install Dependencies

```bash
cd h2bis-pb-ai
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:

```env
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-your-actual-api-key-here
INTENT_EXTRACTION_MODEL=gpt-4-turbo
CACHE_ENABLED=true
LOG_LEVEL=info
```

### 3. Build

```bash
npm run build
```

## Usage

### Basic Intent Extraction

```typescript
import { IntentExtractionAgent } from './src/agents/intent-extraction/intent-extraction.agent.js';
import { UseCase } from './src/agents/intent-extraction/types/intent-analysis.types.js';

// Create agent
const agent = new IntentExtractionAgent();

// Prepare use case
const useCase: UseCase = {
    type: 'use_case',
    key: 'uc-user-login',
    name: 'User Login',
    description: 'Allows users to log in using email and password',
    // ... other fields
};

// Extract intent
const analysis = await agent.extractIntent(useCase);

console.log('User Goal:', analysis.userGoal);
console.log('System Responsibilities:', analysis.systemResponsibilities);
console.log('Confidence:', analysis.confidenceLevel);
```

### Output Structure

```typescript
{
    userGoal: "Access the system using valid credentials",
    systemResponsibilities: [
        "Validate email and password against stored credentials",
        "Create authenticated session",
        "Redirect user to dashboard"
    ],
    technicalComponents: {
        frontend: { routes: ["/login"], components: ["LoginForm"] },
        backend: { endpoints: ["/api/auth/login"], services: ["auth-service"] },
        data: [{ entity: "users", operations: ["READ"] }]
    },
    acceptanceCriteria: [...],
    assumptions: ["Assuming bcrypt password hashing"],
    ambiguities: ["Session timeout duration not specified"],
    securityConsiderations: ["Implement rate limiting", "Use secure session tokens"],
    confidenceLevel: "high",
    confidenceJustification: "Requirements are clear with explicit flows"
}
```

## Testing

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests
npm run test:integration
```

## Cost Management

**Typical Cost per Extraction:**
- GPT-4-turbo: ~$0.03-0.05
- GPT-3.5-turbo: ~$0.002

**With 80% Cache Hit Rate:**
- Average: ~$0.01 per extraction
- 100 extractions/day: ~$1/day = $30/month

**Cost Controls:**
- Maximum cost per request enforced
- Caching enabled by default (24-hour TTL)
- Configurable model selection

## Agent Instructions

The LLM agent follows comprehensive instructions documented in:
`src/agents/intent-extraction/AGENT_INSTRUCTIONS.md`

Key guidelines:
- Extract semantic intent, not just copy fields
- Separate user goals from system responsibilities
- Flag ambiguities and assumptions honestly
- Only extract explicitly mentioned technical components
- Provide realistic confidence assessments

## Validation

4 critical checks ensure quality:

1. ✓ `userGoal` exists and not empty
2. ✓ `systemResponsibilities` has at least 1 item
3. ✓ `acceptanceCriteria` count matches input
4. ✓ `confidenceLevel` is not "low"

Failed validation triggers:
- **Retry**: If 3+ critical issues
- **Manual Review**: If 1-2 critical issues
- **Proceed**: If warnings only

## Development

```bash
# Development mode with hot reload
npm run dev

# Build TypeScript
npm run build

# Check types
npx tsc --noEmit
```

## Integration with h2bis-pb-api

The Intent Extraction Agent will be integrated with the API server to replace naive field mapping:

**Current Flow:**
```
UseCase → Direct Mapping → Capability
(name → userGoal, description → systemResponsibility)
```

**New Flow:**
```
UseCase → Intent Extraction Agent → IntentAnalysis → Capability
(Semantic extraction with LLM)
```

See `intent-agent-implementation.md` for integration plan.

## Troubleshooting

### OpenAI API Key Not Found

```
Error: OpenAI API key not configured
```

**Solution**: Set `OPENAI_API_KEY` in `.env`

### JSON Parse Error

```
Error: Invalid JSON response from LLM
```

**Solution**: Agent automatically retries. If persistent, check LLM response format.

### Low Confidence Extractions

```
Warning: Manual review required - confidence is low
```

**Solution**: Review use case for clarity. Add missing details to improve extraction quality.

## Next Steps

1. ✅ Intent Extraction Agent implemented
2. ⏳ Integrate with h2bis-pb-api
3. ⏳ Add async job processing
4. ⏳ Implement Software Development Agent

## License

MIT
