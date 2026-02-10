import { z } from 'zod';

export const GetProjectsQuerySchema = z.object({
    status: z.enum(['active', 'archived', 'deleted']).optional(),
    limit: z.string().optional().default('50'),
    offset: z.string().optional().default('0'),
});

export const CreateProjectRequestSchema = z.object({
    _id: z.string().min(1).max(100),
    name: z.string().min(1).max(255),
    description: z.string().max(1000).optional(),
    lifecycle: z.enum(['planning', 'in_development', 'in_review', 'in_testing', 'staging', 'production', 'maintenance', 'archived']).optional().default('planning'),
    accessControl: z.object({
        allowAdmins: z.boolean().optional().default(true),
        allowedRoles: z.array(z.string()).optional().default([]),
    }).optional(),
    metadata: z.object({
        repository: z.string().optional().default(''),
        techStack: z.array(z.string()).optional().default([]),
        language: z.string().optional().default(''),
        framework: z.string().optional().default(''),
        architecture: z.object({
            overview: z.string().optional().default(''),
            style: z.string().optional().default(''),
            directoryStructure: z.string().optional().default(''),
            stateManagement: z.array(z.string()).optional().default([])
        }).optional(),
        authStrategy: z.object({
            approach: z.string().optional().default(''),
            implementation: z.array(z.string()).optional().default([])
        }).optional(),
        deployment: z.object({
            environment: z.string().optional().default(''),
            cicd: z.array(z.string()).optional().default([])
        }).optional(),
        externalServices: z.array(z.object({
            name: z.string(),
            purpose: z.string().optional().default(''),
            apiDocs: z.string().optional().default('')
        })).optional().default([]),
        standards: z.object({
            codingStyle: z.object({
                guide: z.string().optional().default(''),
                linter: z.array(z.string()).optional().default([])
            }).optional(),
            namingConventions: z.string().optional().default(''),
            errorHandling: z.array(z.string()).optional().default([]),
            loggingConvention: z.array(z.string()).optional().default([])
        }).optional(),
        qualityGates: z.object({
            definitionOfDone: z.array(z.string()).optional().default([]),
            codeReviewChecklist: z.array(z.string()).optional().default([]),
            testingRequirements: z.object({
                coverage: z.number().min(0).max(100).optional().default(0),
                testTypes: z.array(z.string()).optional().default([]),
                requiresE2ETests: z.boolean().optional().default(false)
            }).optional(),
            documentationStandards: z.string().optional().default('')
        }).optional()
    }).optional(),
});

export const UpdateProjectRequestSchema = z.object({
    name: z.string().min(1).max(255).optional(),
    description: z.string().max(1000).optional(),
    lifecycle: z.enum(['planning', 'in_development', 'in_review', 'in_testing', 'staging', 'production', 'maintenance', 'archived']).optional(),
    accessControl: z.object({
        allowAdmins: z.boolean().optional(),
        allowedRoles: z.array(z.string()).optional(),
    }).optional(),
    metadata: z.object({
        repository: z.string().optional(),
        techStack: z.array(z.string()).optional(),
        language: z.string().optional(),
        framework: z.string().optional(),
        architecture: z.object({
            overview: z.string().optional(),
            style: z.string().optional(),
            directoryStructure: z.string().optional(),
            stateManagement: z.array(z.string()).optional()
        }).optional(),
        authStrategy: z.object({
            approach: z.string().optional(),
            implementation: z.array(z.string()).optional()
        }).optional(),
        deployment: z.object({
            environment: z.string().optional(),
            cicd: z.array(z.string()).optional()
        }).optional(),
        externalServices: z.array(z.object({
            name: z.string(),
            purpose: z.string().optional(),
            apiDocs: z.string().optional()
        })).optional(),
        standards: z.object({
            codingStyle: z.object({
                guide: z.string().optional(),
                linter: z.array(z.string()).optional()
            }).optional(),
            namingConventions: z.string().optional(),
            errorHandling: z.array(z.string()).optional(),
            loggingConvention: z.array(z.string()).optional()
        }).optional(),
        qualityGates: z.object({
            definitionOfDone: z.array(z.string()).optional(),
            codeReviewChecklist: z.array(z.string()).optional(),
            testingRequirements: z.object({
                coverage: z.number().min(0).max(100).optional(),
                testTypes: z.array(z.string()).optional(),
                requiresE2ETests: z.boolean().optional()
            }).optional(),
            documentationStandards: z.string().optional()
        }).optional()
    }).optional(),
});

export const AddProjectMemberRequestSchema = z.object({
    userId: z.string().min(1),
    role: z.enum(['owner', 'admin', 'moderator', 'viewer']).default('viewer'),
});

export const UpdateProjectMemberRequestSchema = z.object({
    role: z.enum(['admin', 'moderator', 'viewer']),
});

// DTOs
export interface ProjectMemberDto {
    userId: string;
    role: 'owner' | 'admin' | 'moderator' | 'viewer';
    addedAt: string;
}

export interface ProjectAccessControlDto {
    allowAdmins: boolean;
    allowedRoles: string[];
}

export interface ProjectResponseDto {
    _id: string;
    name: string;
    description: string;
    owner: string;
    members: ProjectMemberDto[];
    accessControl: ProjectAccessControlDto;
    status: 'active' | 'archived' | 'deleted';
    lifecycle: 'planning' | 'in_development' | 'in_review' | 'in_testing' | 'staging' | 'production' | 'maintenance' | 'archived';
    type: 'software_development';
    developedEndpoints: string[];
    metadata: {
        repository: string;
        techStack: string[];
        language: string;
        framework: string;
        architecture: {
            overview: string;
            style: string;
            directoryStructure: string;
            stateManagement: string[];
        };
        authStrategy: {
            approach: string;
            implementation: string[];
        };
        deployment: {
            environment: string;
            cicd: string[];
        };
        externalServices: Array<{
            name: string;
            purpose: string;
            apiDocs: string;
        }>;
        standards: {
            codingStyle: {
                guide: string;
                linter: string[];
            };
            namingConventions: string;
            errorHandling: string[];
            loggingConvention: string[];
        };
        qualityGates: {
            definitionOfDone: string[];
            codeReviewChecklist: string[];
            testingRequirements: {
                coverage: number;
                testTypes: string[];
                requiresE2ETests: boolean;
            };
            documentationStandards: string;
        };
    };
    stats: {
        useCaseCount: number;
        capabilityCount: number;
        completionPercentage: number;
    };
    createdAt: string;
    updatedAt: string;
}

export interface GetProjectsResponseDto {
    projects: ProjectResponseDto[];
    total: number;
    limit: number;
    offset: number;
}

export interface GetProjectByIdResponseDto extends ProjectResponseDto {
    userRole?: 'owner' | 'admin' | 'moderator' | 'viewer' | null;
    canManage: boolean;
}

// Type exports
export type GetProjectsQueryDto = z.infer<typeof GetProjectsQuerySchema>;
export type CreateProjectRequestDto = z.infer<typeof CreateProjectRequestSchema>;
export type UpdateProjectRequestDto = z.infer<typeof UpdateProjectRequestSchema>;
export type AddProjectMemberRequestDto = z.infer<typeof AddProjectMemberRequestSchema>;
export type UpdateProjectMemberRequestDto = z.infer<typeof UpdateProjectMemberRequestSchema>;
