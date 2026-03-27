import { z } from 'zod';
export declare const getCapabilityDependenciesSchema: z.ZodObject<{
    nodeId: z.ZodString;
    depth: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    nodeId: string;
    depth: number;
}, {
    nodeId: string;
    depth?: number | undefined;
}>;
export declare const analyzeCapabilityImpactSchema: z.ZodObject<{
    nodeId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    nodeId: string;
}, {
    nodeId: string;
}>;
export declare const getImplementationOrderSchema: z.ZodObject<{
    nodeIds: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    nodeIds: string[];
}, {
    nodeIds: string[];
}>;
//# sourceMappingURL=capability.schemas.d.ts.map