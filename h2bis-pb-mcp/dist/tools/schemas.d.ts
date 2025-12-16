import { z } from 'zod';
/**
 * Zod schemas for MCP tool inputs
 */
export declare const retrieveDocumentSchema: z.ZodObject<{
    collection: z.ZodString;
    query: z.ZodRecord<z.ZodString, z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    collection: string;
    query: Record<string, any>;
}, {
    collection: string;
    query: Record<string, any>;
}>;
export declare const retrieveDocumentsSchema: z.ZodObject<{
    collection: z.ZodString;
    query: z.ZodRecord<z.ZodString, z.ZodAny>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    collection: string;
    query: Record<string, any>;
}, {
    collection: string;
    query: Record<string, any>;
    limit?: number | undefined;
}>;
export type RetrieveDocumentInput = z.infer<typeof retrieveDocumentSchema>;
export type RetrieveDocumentsInput = z.infer<typeof retrieveDocumentsSchema>;
//# sourceMappingURL=schemas.d.ts.map