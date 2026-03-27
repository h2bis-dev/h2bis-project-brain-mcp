import { z } from 'zod';
// ── Shared sub-schemas ─────────────────────────────────────────────────────
export const UseCaseLifecycleSchema = z.enum([
    'idea',
    'planned',
    'in_development',
    'ai_generated',
    'human_reviewed',
    'completed',
]);
export const UseCaseStatusSchema = z.object({
    lifecycle: UseCaseLifecycleSchema.optional(),
    reviewedByHuman: z.boolean().optional(),
    generatedByAI: z.boolean().optional(),
});
export const UseCaseFunctionalRequirementsSchema = z.object({
    must: z.array(z.string()).optional(),
    should: z.array(z.string()).optional(),
    wont: z.array(z.string()).optional(),
});
export const UseCaseScopeSchema = z.object({
    inScope: z.array(z.string()).optional(),
    outOfScope: z.array(z.string()).optional(),
    assumptions: z.array(z.string()).optional(),
    constraints: z.array(z.string()).optional(),
});
export const UseCaseEndpointSchema = z.object({
    method: z.string().min(1),
    path: z.string().min(1),
    request: z.string().optional(),
    response: z.string().optional(),
});
export const UseCaseInterfacesSchema = z.object({
    type: z.enum(['REST', 'GraphQL', 'Event', 'UI']).default('REST'),
    endpoints: z.array(UseCaseEndpointSchema).optional().default([]),
    events: z.array(z.string()).optional().default([]),
});
export const UseCaseKnownErrorSchema = z.object({
    condition: z.string().min(1),
    expectedBehavior: z.string().min(1),
});
export const UseCaseErrorHandlingSchema = z.object({
    knownErrors: z.array(UseCaseKnownErrorSchema).optional().default([]),
});
export const UseCaseQualitySchema = z.object({
    testTypes: z.array(z.enum(['unit', 'integration', 'e2e', 'security'])).optional().default([]),
    performanceCriteria: z.array(z.string()).optional().default([]),
    securityConsiderations: z.array(z.string()).optional().default([]),
});
export const UseCaseAIDirectivesSchema = z.object({
    generationLevel: z.enum(['skeleton', 'partial', 'full']).default('partial'),
    overwritePolicy: z.enum(['never', 'ifEmpty', 'always']).default('ifEmpty'),
});
export const UseCaseFlowSchema = z.object({
    name: z.string().min(1),
    steps: z.array(z.string()).min(1),
    type: z.enum(['main', 'alternative', 'error']).default('main'),
});
export const UseCaseCollectionSchema = z.object({
    name: z.string().min(1),
    purpose: z.string().min(1),
    operations: z.array(z.enum(['CREATE', 'READ', 'UPDATE', 'DELETE'])).optional().default([]),
});
export const UseCaseBackendSurfaceSchema = z.object({
    repos: z.array(z.string()).optional().default([]),
    endpoints: z.array(z.string()).optional().default([]),
    collections: z.array(UseCaseCollectionSchema).optional().default([]),
});
export const UseCaseFrontendSurfaceSchema = z.object({
    repos: z.array(z.string()).optional().default([]),
    routes: z.array(z.string()).optional().default([]),
    components: z.array(z.string()).optional().default([]),
});
export const UseCaseTechnicalSurfaceSchema = z.object({
    backend: UseCaseBackendSurfaceSchema.optional(),
    frontend: UseCaseFrontendSurfaceSchema.optional(),
});
export const UseCaseRelationshipSchema = z.object({
    type: z.enum(['depends_on', 'extends', 'implements', 'conflicts_with', 'related_to']),
    targetType: z.string().min(1),
    targetKey: z.string().min(1),
    reason: z.string().optional(),
});
export const UseCaseImplementationRiskSchema = z.object({
    rule: z.string().min(1),
    normative: z.boolean().default(false),
});
export const UseCaseAIMetadataSchema = z.object({
    estimatedComplexity: z.enum(['low', 'medium', 'high']).optional(),
    implementationRisk: z.array(z.string()).optional().default([]),
    testStrategy: z.array(z.string()).optional().default([]),
    nonFunctionalRequirements: z.array(z.string()).optional().default([]),
    suggestedOrder: z.number().optional(),
    normativeMode: z.boolean().optional(),
    insufficiencyReasons: z.array(z.string()).optional(),
});
// ── Tool schemas ───────────────────────────────────────────────────────────
export const listUseCasesSchema = z.object({
    projectId: z
        .string()
        .optional()
        .describe('Filter use cases by project ID'),
    limit: z
        .number()
        .int()
        .positive()
        .default(50)
        .describe('Maximum number of use cases to return'),
    offset: z
        .number()
        .int()
        .min(0)
        .default(0)
        .describe('Number of use cases to skip (for pagination)'),
});
export const getUseCaseByIdSchema = z.object({
    useCaseId: z
        .string()
        .min(1)
        .describe('The unique identifier (_id) of the use case to retrieve'),
});
export const createUseCaseSchema = z.object({
    key: z
        .string()
        .min(1)
        .describe('Unique key for the use case (e.g., "UC-LOGIN")'),
    projectId: z
        .string()
        .optional()
        .describe('Project ID to associate the use case with (triggers capability generation)'),
    name: z
        .string()
        .min(1)
        .describe('Name of the use case'),
    description: z
        .string()
        .min(1)
        .describe('Detailed description of the use case'),
    businessValue: z
        .string()
        .optional()
        .describe('Business value or justification'),
    primaryActor: z
        .string()
        .optional()
        .describe('Primary actor (e.g., "User", "Admin")'),
    acceptanceCriteria: z
        .array(z.string())
        .optional()
        .describe('List of acceptance criteria'),
    stakeholders: z
        .array(z.string())
        .optional()
        .describe('List of stakeholders'),
    status: UseCaseStatusSchema.optional(),
    functionalRequirements: UseCaseFunctionalRequirementsSchema.optional(),
    scope: UseCaseScopeSchema.optional(),
    interfaces: UseCaseInterfacesSchema.optional(),
    errorHandling: UseCaseErrorHandlingSchema.optional(),
    quality: UseCaseQualitySchema.optional(),
    aiDirectives: UseCaseAIDirectivesSchema.optional(),
    flows: z.array(UseCaseFlowSchema).optional(),
    technicalSurface: UseCaseTechnicalSurfaceSchema.optional(),
    relationships: z.array(UseCaseRelationshipSchema).optional(),
    implementationRisk: z.array(UseCaseImplementationRiskSchema).optional(),
    tags: z.array(z.string()).optional(),
    normative: z.boolean().optional(),
    aiMetadata: UseCaseAIMetadataSchema.optional(),
});
export const updateUseCaseSchema = z.object({
    useCaseId: z
        .string()
        .min(1)
        .describe('The unique identifier (_id) of the use case to update'),
    name: z.string().optional().describe('Update the name'),
    description: z.string().optional().describe('Update the description'),
    businessValue: z.string().optional(),
    primaryActor: z.string().optional(),
    acceptanceCriteria: z.array(z.string()).optional(),
    stakeholders: z.array(z.string()).optional(),
    status: UseCaseStatusSchema.optional(),
    functionalRequirements: UseCaseFunctionalRequirementsSchema.optional(),
    scope: UseCaseScopeSchema.optional(),
    interfaces: UseCaseInterfacesSchema.optional(),
    errorHandling: UseCaseErrorHandlingSchema.optional(),
    quality: UseCaseQualitySchema.optional(),
    aiDirectives: UseCaseAIDirectivesSchema.optional(),
    flows: z.array(UseCaseFlowSchema).optional(),
    technicalSurface: UseCaseTechnicalSurfaceSchema.optional(),
    relationships: z.array(UseCaseRelationshipSchema).optional(),
    implementationRisk: z.array(UseCaseImplementationRiskSchema).optional(),
    tags: z.array(z.string()).optional(),
    normative: z.boolean().optional(),
    aiMetadata: UseCaseAIMetadataSchema.optional(),
});
export const deleteUseCaseSchema = z.object({
    useCaseId: z
        .string()
        .min(1)
        .describe('The unique identifier (_id) of the use case to delete'),
});
export const enhanceUseCaseSchema = z.object({
    useCaseId: z
        .string()
        .min(1)
        .describe('The unique identifier (_id) of the use case to enhance with AI'),
    enhancementType: z
        .enum(['full', 'partial', 'flows_only', 'technical_only'])
        .optional()
        .describe('Type of enhancement to apply (default: full)'),
});
export const updateUseCaseWithAISchema = z.object({
    useCaseId: z
        .string()
        .min(1)
        .describe('The unique identifier (_id) of the use case to update'),
    instructions: z
        .string()
        .min(1)
        .describe('Natural language instructions for AI-driven changes'),
    preserveHumanEdits: z
        .boolean()
        .optional()
        .default(true)
        .describe('Whether to preserve human-reviewed sections'),
});
export const getUseCaseWithProjectContextSchema = z.object({
    useCaseId: z
        .string()
        .min(1)
        .describe('The unique identifier (_id) of the use case to retrieve together with its full project context'),
});
//# sourceMappingURL=useCase.schemas.js.map