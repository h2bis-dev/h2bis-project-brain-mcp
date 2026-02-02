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
    accessControl: z.object({
        allowAdmins: z.boolean().optional().default(true),
        allowedRoles: z.array(z.string()).optional().default([]),
    }).optional(),
    metadata: z.object({
        repository: z.string().optional().default(''),
        techStack: z.array(z.string()).optional().default([]),
        language: z.string().optional().default(''),
        framework: z.string().optional().default('')
    }).optional().default({
        repository: '',
        techStack: [],
        language: '',
        framework: ''
    }),
});

export const UpdateProjectRequestSchema = z.object({
    name: z.string().min(1).max(255).optional(),
    description: z.string().max(1000).optional(),
    accessControl: z.object({
        allowAdmins: z.boolean().optional(),
        allowedRoles: z.array(z.string()).optional(),
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
    type: 'software_development';
    metadata: {
        repository: string;
        techStack: string[];
        language: string;
        framework: string;
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
