import type { UseCase } from '../../intent-extraction/types/intent-analysis.types.js';

/**
 * Relevant project-level attributes for use case generation.
 * Only includes attributes that help the AI generate contextually accurate use cases.
 * Excludes: lifecycle status, auth strategy, deployment, quality gates (project-wide, not UC-specific).
 */
export interface ProjectContext {
    projectName?: string;
    architecture?: {
        style?: string;
        overview?: string;
    };
    externalServices?: Array<{
        name: string;
        purpose?: string;
    }>;
    standards?: {
        namingConventions?: string[];
        errorHandling?: string[];
    };
    /** Existing API endpoints registry — used to detect duplicates before generating new ones */
    developedEndpoints?: Array<{
        endpoint: string;
        method: string;
        service: string;
        description?: string;
    }>;
    /** Existing domain models catalog — used to reference rather than re-define entities */
    domainCatalog?: Array<{
        name: string;
        layer?: string;
        description?: string;
    }>;
    /** Applications and services that make up the project (web app, mobile app, API, data service, etc.) */
    services?: Array<{
        id: string;
        name: string;
        type: string;
        language?: string;
        framework?: string;
        techStack?: string[];
        description?: string;
        goals?: string;
    }>;
}

export interface UseCaseGenerationInput {
    description: string;
    existingData?: Partial<UseCase>;
    /** Project context enriches AI generation with tech stack, architecture, existing APIs, and domain models */
    projectContext?: ProjectContext;
}

export interface UseCaseGenerationResult {
    useCase: Partial<UseCase>;
    generatedFields: string[];
    confidence: number;
    reasoning?: string;
}
