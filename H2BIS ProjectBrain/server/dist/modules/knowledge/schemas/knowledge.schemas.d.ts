import { z } from 'zod';
export declare const insertDocumentSchema: z.ZodObject<{
    collectionName: z.ZodString;
    json: z.ZodString;
}, "strip", z.ZodTypeAny, {
    collectionName: string;
    json: string;
}, {
    collectionName: string;
    json: string;
}>;
export declare const findDocumentSchema: z.ZodObject<{
    collectionName: z.ZodString;
    filter: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    filter: string;
    collectionName: string;
}, {
    collectionName: string;
    filter?: string | undefined;
}>;
export declare const updateDocumentSchema: z.ZodObject<{
    collectionName: z.ZodString;
    filter: z.ZodDefault<z.ZodString>;
    update: z.ZodString;
}, "strip", z.ZodTypeAny, {
    filter: string;
    update: string;
    collectionName: string;
}, {
    update: string;
    collectionName: string;
    filter?: string | undefined;
}>;
export declare const deleteDocumentSchema: z.ZodObject<{
    collectionName: z.ZodString;
    filter: z.ZodString;
}, "strip", z.ZodTypeAny, {
    filter: string;
    collectionName: string;
}, {
    filter: string;
    collectionName: string;
}>;
export declare const listCollectionsSchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
//# sourceMappingURL=knowledge.schemas.d.ts.map