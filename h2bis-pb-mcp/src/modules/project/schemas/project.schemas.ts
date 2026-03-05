import { z } from 'zod';

// ── Shared sub-schemas ─────────────────────────────────────────────────────

export const LifecycleSchema = z.enum([
    'planning',
    'in_development',
    'in_review',
    'in_testing',
    'staging',
    'production',
    'maintenance',
    'archived',
]);

export const AccessControlSchema = z.object({
    allowAdmins: z.boolean().optional(),
    allowedRoles: z.array(z.string()).optional(),
});

export const ProjectMetadataSchema = z.object({
    repository: z.string().optional(),
    techStack: z.array(z.string()).optional(),
    language: z.string().optional(),
    framework: z.string().optional(),
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
        documentationStandards: z.string().optional(),
    }).optional(),
});

export const DomainModelFieldSchema = z.object({
    name: z
        .string()
        .min(1)
        .describe('Field name (e.g. "userId", "createdAt")'),
    type: z
        .string()
        .min(1)
        .describe(
            'TypeScript-style type string: "string", "number", "boolean", "Date", "string[]", "ObjectId", or any custom class name'
        ),
    required: z
        .boolean()
        .optional()
        .default(false)
        .describe('Whether the field is mandatory'),
    description: z
        .string()
        .optional()
        .describe('Human-readable description of the field'),
    defaultValue: z
        .string()
        .optional()
        .describe('Default value expressed as a string (e.g. "false", "[]", "null")'),
    constraints: z
        .array(z.string())
        .optional()
        .default([])
        .describe('Validation constraints (e.g. ["unique", "min:0", "max:255"])'),
});

// ── Tool schemas ───────────────────────────────────────────────────────────

export const createProjectSchema = z.object({
    _id: z.string().min(1).describe('Unique project identifier (e.g., "my-project")'),
    name: z.string().min(1).describe('Project name'),
    description: z.string().optional().describe('Project description'),
    lifecycle: LifecycleSchema.optional().describe('Project lifecycle stage'),
    accessControl: AccessControlSchema.optional().describe('Access control settings'),
    metadata: ProjectMetadataSchema.optional().describe('Project metadata including tech stack, architecture, standards, etc.'),
});

export const updateProjectSchema = z.object({
    projectId: z.string().min(1).describe('The unique identifier of the project to update'),
    name: z.string().min(1).optional().describe('Updated project name'),
    description: z.string().optional().describe('Updated project description'),
    lifecycle: LifecycleSchema.optional().describe('Updated project lifecycle stage'),
    accessControl: AccessControlSchema.optional().describe('Updated access control settings'),
    metadata: ProjectMetadataSchema.optional().describe('Updated project metadata'),
});

export const getProjectByIdSchema = z.object({
    projectId: z.string().describe('The unique identifier of the project to retrieve'),
});

export const listProjectsSchema = z.object({
    status: z
        .enum(['active', 'archived', 'deleted'])
        .optional()
        .describe('Filter projects by status'),
    limit: z
        .number()
        .optional()
        .default(50)
        .describe('Maximum number of projects to return'),
    offset: z
        .number()
        .optional()
        .default(0)
        .describe('Number of projects to skip for pagination'),
});

export const upsertProjectDomainModelSchema = z.object({
    projectId: z
        .string()
        .min(1)
        .describe('The _id of the project that owns this domain catalog'),
    name: z
        .string()
        .min(1)
        .describe(
            'Domain model name (e.g. "UserDocument", "ProjectDto"). Case-sensitive — acts as the unique key for upsert.'
        ),
    description: z
        .string()
        .optional()
        .describe('What this model represents'),
    layer: z
        .enum(['data', 'dto', 'domain', 'response', 'request', 'event', 'other'])
        .optional()
        .describe(
            'Architectural layer: data=DB document, dto=transport, domain=domain object, response/request=API shapes, event=async message, other.'
        ),
    fields: z
        .array(DomainModelFieldSchema)
        .optional()
        .default([])
        .describe('Field definitions for this model'),
    usedByUseCases: z
        .array(z.string())
        .optional()
        .default([])
        .describe('List of use case IDs that reference this model'),
    addedBy: z
        .string()
        .optional()
        .describe('Agent or user identifier who is adding/updating this model (defaults to "system-mcp")'),
});

export const removeProjectDomainModelSchema = z.object({
    projectId: z
        .string()
        .min(1)
        .describe('The _id of the project that owns the domain catalog'),
    modelName: z
        .string()
        .min(1)
        .describe(
            'Exact name of the domain model to remove (case-sensitive, e.g. "UserDocument")'
        ),
});
