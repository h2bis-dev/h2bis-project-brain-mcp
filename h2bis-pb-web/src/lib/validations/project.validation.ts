import { z } from 'zod';

/**
 * Validation schema for creating a new project
 */
export const createProjectSchema = z.object({
    _id: z.string()
        .min(3, "Project ID must be at least 3 characters")
        .max(50, "Project ID must be less than 50 characters")
        .regex(/^[a-z0-9-]+$/, "ID must contain only lowercase letters, numbers, and hyphens")
        .transform(val => val.toLowerCase().trim()),

    name: z.string()
        .min(1, "Project name is required")
        .max(100, "Project name must be less than 100 characters")
        .trim(),

    description: z.string()
        .max(500, "Description must be less than 500 characters")
        .optional(),

    lifecycle: z.enum([
        'planning',
        'in_development',
        'in_review',
        'in_testing',
        'staging',
        'production',
        'maintenance',
        'archived'
    ]),

    metadata: z.object({
        repository: z.string().optional(),
        architecture: z.object({
            overview: z.string().optional(),
            style: z.string().optional(),
            directoryStructure: z.string().optional(),
            stateManagement: z.array(z.string()).optional(),
        }).optional(),
        authStrategy: z.object({
            approach: z.string().optional(),
            implementation: z.array(z.string()).optional(),
        }).optional(),
        deployment: z.object({
            environment: z.string().optional(),
            cicd: z.array(z.string()).optional(),
        }).optional(),
        externalServices: z.array(z.object({
            name: z.string(),
            purpose: z.string().optional(),
            apiDocs: z.string().optional(),
        })).optional(),
        standards: z.object({
            namingConventions: z.array(z.string()).optional(),
            errorHandling: z.array(z.string()).optional(),
            loggingConvention: z.array(z.string()).optional(),
        }).optional(),
        qualityGates: z.object({
            definitionOfDone: z.array(z.string()).optional(),
            codeReviewChecklist: z.array(z.string()).optional(),
            testingRequirements: z.object({
                coverage: z.number().min(0).max(100).optional(),
                testTypes: z.array(z.string()).optional(),
                requiresE2ETests: z.boolean().optional(),
            }).optional(),
            documentationStandards: z.array(z.string()).optional(),
        }).optional(),
    }).optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
