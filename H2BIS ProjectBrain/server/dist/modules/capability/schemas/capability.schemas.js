import { z } from 'zod';
export const getCapabilityDependenciesSchema = z.object({
    nodeId: z
        .string()
        .min(1)
        .describe('The ID of the capability node to get dependencies for'),
    depth: z
        .number()
        .min(1)
        .max(10)
        .optional()
        .default(1)
        .describe('How many levels deep to traverse (default: 1)'),
});
export const analyzeCapabilityImpactSchema = z.object({
    nodeId: z
        .string()
        .min(1)
        .describe('The ID of the capability node to analyze'),
});
export const getImplementationOrderSchema = z.object({
    nodeIds: z
        .array(z.string())
        .min(1)
        .describe('Array of capability node IDs to order'),
});
//# sourceMappingURL=capability.schemas.js.map