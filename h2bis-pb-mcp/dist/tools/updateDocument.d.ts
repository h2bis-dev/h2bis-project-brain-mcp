import { z } from 'zod';
export declare const updateDocumentSchema: z.ZodObject<{
    collectionName: z.ZodString;
    filter: z.ZodDefault<z.ZodString>;
    update: z.ZodString;
}, "strip", z.ZodTypeAny, {
    collectionName: string;
    filter: string;
    update: string;
}, {
    collectionName: string;
    update: string;
    filter?: string | undefined;
}>;
export declare function updateDocument({ collectionName, filter, update }: z.infer<typeof updateDocumentSchema>): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
//# sourceMappingURL=updateDocument.d.ts.map