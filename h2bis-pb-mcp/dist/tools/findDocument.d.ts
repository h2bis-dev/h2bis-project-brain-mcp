import { z } from 'zod';
export declare const findDocumentSchema: z.ZodObject<{
    collectionName: z.ZodString;
    filter: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    collectionName: string;
    filter: string;
}, {
    collectionName: string;
    filter?: string | undefined;
}>;
export declare function findDocument({ collectionName, filter }: z.infer<typeof findDocumentSchema>): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
//# sourceMappingURL=findDocument.d.ts.map