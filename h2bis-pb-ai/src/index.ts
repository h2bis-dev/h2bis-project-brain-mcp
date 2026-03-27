// Export main agent
export { IntentExtractionAgent } from './agents/intent-extraction/intent-extraction.agent.js';
export { TransformationValidationAgent } from './agents/transformation-validation/transformation-validation.agent.js';
export { SurgicalFixAgent } from './agents/surgical-fix/surgical-fix.agent.js';

// Export types
export type {
    IntentAnalysis,
    UseCase,
    ValidationResult
} from './agents/intent-extraction/types/intent-analysis.types.js';

export type {
    ValidationInput,
    ValidationIssue,
    TransformationValidationResult
} from './agents/transformation-validation/transformation-validation.agent.js';

export type {
    SurgicalFixRequest,
    SurgicalFixResult
} from './agents/surgical-fix/surgical-fix.agent.js';

// Export services
export { LLMService } from './core/services/llm/llm.service.js';
export { CacheService } from './core/services/cache/cache.service.js';

// Export utilities
export { logger } from './core/utils/logger.js';
export { validateIntentExtraction } from './core/utils/validators.js';

// New Agents
export { UseCaseGenerationAgent } from './agents/use-case-generation/use-case-generation.agent.js';
export type { UseCaseGenerationInput, UseCaseGenerationResult, ProjectContext } from './agents/use-case-generation/types/use-case-generation.types.js';
