import type { UseCase } from '../../intent-extraction/types/intent-analysis.types.js';

export interface UseCaseGenerationInput {
    description: string;
    existingData?: Partial<UseCase>;
}

export interface UseCaseGenerationResult {
    useCase: Partial<UseCase>;
    generatedFields: string[];
    confidence: number;
    reasoning?: string;
}
