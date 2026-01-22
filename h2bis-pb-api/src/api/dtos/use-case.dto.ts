import { z } from 'zod';

// ==================== Response DTOs ====================

/**
 * Use Case Summary Response DTO
 * Used for list endpoints - contains essential fields only
 */
export interface UseCaseResponseDto {
    id: string;
    key: string;
    name: string;
    description: string;
    status: {
        lifecycle: string;
        reviewedByHuman: boolean;
        generatedByAI: boolean;
    };
    businessValue: string;
    primaryActor: string;
    tags: string[];
    aiMetadata?: {
        estimatedComplexity: string;
    };
}

/**
 * Use Case Detail Response DTO
 * Used for single use case endpoint - contains all fields
 */
export interface UseCaseDetailResponseDto {
    id: string;
    key: string;
    name: string;
    description: string;
    status: {
        lifecycle: string;
        reviewedByHuman: boolean;
        generatedByAI: boolean;
    };
    businessValue: string;
    primaryActor: string;
    acceptanceCriteria: string[];
    flows: Array<{
        name: string;
        steps: string[];
        type: string;
    }>;
    technicalSurface: {
        backend: {
            repos: string[];
            endpoints: string[];
            collections: Array<{
                name: string;
                purpose: string;
                operations: string[];
            }>;
        };
        frontend: {
            repos: string[];
            routes: string[];
            components: string[];
        };
    };
    relationships: Array<{
        type: string;
        targetType: string;
        targetKey: string;
        reason?: string;
    }>;
    implementationRisk: Array<{
        rule: string;
        normative: boolean;
    }>;
    tags: string[];
    normative: boolean;
    aiMetadata?: {
        estimatedComplexity: string;
        implementationRisk: string[];
        testStrategy: string[];
        nonFunctionalRequirements: string[];
        suggestedOrder?: number;
        normativeMode?: boolean;
        insufficiencyReasons?: string[];
    };
    audit?: {
        createdAt: Date;
        updatedAt: Date;
        createdBy: string;
        updatedBy: string;
    };
}
