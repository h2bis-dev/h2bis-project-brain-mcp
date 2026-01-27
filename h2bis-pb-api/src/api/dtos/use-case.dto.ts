import { z } from 'zod';

// ==================== Request DTOs ====================

/**
 * Create Use Case Request DTO
 * Validates incoming create use case requests
 */
export const CreateUseCaseRequestDto = z.object({
    type: z.literal('use_case').default('use_case'),
    key: z.string().min(1, 'Key is required').regex(/^[a-z0-9-]+$/, 'Key must be lowercase alphanumeric with hyphens'),
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),

    status: z.object({
        lifecycle: z.enum([
            'idea',
            'planned',
            'in_development',
            'ai_generated',
            'human_reviewed',
            'completed'
        ]).default('idea'),
        reviewedByHuman: z.boolean().default(false),
        generatedByAI: z.boolean().default(false)
    }).default({
        lifecycle: 'idea',
        reviewedByHuman: false,
        generatedByAI: false
    }),

    businessValue: z.string().min(1, 'Business value is required'),
    primaryActor: z.string().min(1, 'Primary actor is required'),

    acceptanceCriteria: z.array(z.string()).default([]),

    stakeholders: z.array(z.string()).optional(),

    functionalRequirements: z.object({
        must: z.array(z.string()).default([]),
        should: z.array(z.string()).default([]),
        wont: z.array(z.string()).default([])
    }).optional(),

    scope: z.object({
        inScope: z.array(z.string()).default([]),
        outOfScope: z.array(z.string()).default([]),
        assumptions: z.array(z.string()).default([]),
        constraints: z.array(z.string()).default([])
    }).optional(),

    domainModel: z.object({
        entities: z.array(z.object({
            name: z.string(),
            description: z.string().optional(),
            fields: z.array(z.object({
                name: z.string(),
                type: z.string(),
                required: z.boolean(),
                constraints: z.array(z.string()).default([])
            })).default([])
        })).default([])
    }).optional(),

    interfaces: z.object({
        type: z.enum(['REST', 'GraphQL', 'Event', 'UI']),
        endpoints: z.array(z.object({
            method: z.string(),
            path: z.string(),
            request: z.string().optional(),
            response: z.string().optional()
        })).default([]),
        events: z.array(z.string()).default([])
    }).optional(),

    errorHandling: z.object({
        knownErrors: z.array(z.object({
            condition: z.string(),
            expectedBehavior: z.string()
        })).default([])
    }).optional(),

    architecture: z.object({
        style: z.enum(['layered', 'clean', 'hexagonal', 'event-driven']),
        patterns: z.array(z.string()).default([])
    }).optional(),

    technologyConstraints: z.object({
        backend: z.string().optional(),
        frontend: z.string().optional(),
        database: z.string().optional(),
        messaging: z.string().optional(),
        auth: z.string().optional()
    }).optional(),

    configuration: z.object({
        envVars: z.array(z.string()).default([]),
        featureFlags: z.array(z.string()).default([])
    }).optional(),

    quality: z.object({
        testTypes: z.array(z.enum(['unit', 'integration', 'e2e', 'security'])).default([]),
        performanceCriteria: z.array(z.string()).default([]),
        securityConsiderations: z.array(z.string()).default([])
    }).optional(),

    aiDirectives: z.object({
        generationLevel: z.enum(['skeleton', 'partial', 'full']),
        overwritePolicy: z.enum(['never', 'ifEmpty', 'always'])
    }).optional(),

    flows: z.array(z.object({
        name: z.string(),
        steps: z.array(z.string()),
        type: z.enum(['main', 'alternative', 'error']).default('main')
    })).default([]),

    technicalSurface: z.object({
        backend: z.object({
            repos: z.array(z.string()),
            endpoints: z.array(z.string()).default([]),
            collections: z.array(z.object({
                name: z.string(),
                purpose: z.string(),
                operations: z.array(z.enum(['CREATE', 'READ', 'UPDATE', 'DELETE']))
            })).default([])
        }),
        frontend: z.object({
            repos: z.array(z.string()),
            routes: z.array(z.string()).default([]),
            components: z.array(z.string()).default([])
        })
    }),

    relationships: z.array(z.object({
        type: z.enum(['depends_on', 'extends', 'implements', 'conflicts_with', 'related_to']),
        targetType: z.string(),
        targetKey: z.string(),
        reason: z.string().optional()
    })).default([]),

    implementationRisk: z.array(z.object({
        rule: z.string(),
        normative: z.boolean().default(false)
    })).default([]),

    tags: z.array(z.string()).default([]),
    normative: z.boolean().default(false),

    aiMetadata: z.object({
        estimatedComplexity: z.enum(['low', 'medium', 'high']).default('medium'),
        implementationRisk: z.array(z.string()).default([]),
        suggestedOrder: z.number().optional(),
        testStrategy: z.array(z.string()).default([]),
        nonFunctionalRequirements: z.array(z.string()).default([]),
        skipValidation: z.boolean().optional(),
        normativeMode: z.boolean().optional(),
        insufficiencyReasons: z.array(z.string()).optional() // Feedback channel for validation failures
    }).optional()
});

export type CreateUseCaseRequestDto = z.infer<typeof CreateUseCaseRequestDto>;

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
    stakeholders?: string[];
    functionalRequirements?: {
        must: string[];
        should: string[];
        wont: string[];
    };
    scope?: {
        inScope: string[];
        outOfScope: string[];
        assumptions: string[];
        constraints: string[];
    };
    domainModel?: {
        entities: Array<{
            name: string;
            description?: string;
            fields: Array<{
                name: string;
                type: string;
                required: boolean;
                constraints: string[];
            }>;
        }>;
    };
    interfaces?: {
        type: 'REST' | 'GraphQL' | 'Event' | 'UI';
        endpoints: Array<{
            method: string;
            path: string;
            request?: string;
            response?: string;
        }>;
        events: string[];
    };
    errorHandling?: {
        knownErrors: Array<{
            condition: string;
            expectedBehavior: string;
        }>;
    };
    architecture?: {
        style: 'layered' | 'clean' | 'hexagonal' | 'event-driven';
        patterns: string[];
    };
    technologyConstraints?: {
        backend?: string;
        frontend?: string;
        database?: string;
        messaging?: string;
        auth?: string;
    };
    configuration?: {
        envVars: string[];
        featureFlags: string[];
    };
    quality?: {
        testTypes: ('unit' | 'integration' | 'e2e' | 'security')[];
        performanceCriteria: string[];
        securityConsiderations: string[];
    };
    aiDirectives?: {
        generationLevel: 'skeleton' | 'partial' | 'full';
        overwritePolicy: 'never' | 'ifEmpty' | 'always';
    };
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

/**
 * Create Use Case Response DTO
 */
export interface CreateUseCaseResponseDto {
    id: string;
    key: string;
    message: string;
    capabilityGenerated: boolean;
    capabilityId?: string | null;
    mode?: string;
    insufficiencyReport?: any;
    validationReport?: any;
}

export const GenerateUseCaseRequestDto = z.object({
    description: z.string().min(1, 'Description is required'),
    existingData: z.record(z.any()).optional()
});

export type GenerateUseCaseRequestDto = z.infer<typeof GenerateUseCaseRequestDto>;

export interface GenerateUseCaseResponseDto {
    useCase: any; // Partial<UseCase>
    generatedFields: string[];
    confidence: number;
}
