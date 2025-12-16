import { z } from 'zod';
export declare const deleteDocumentSchema: z.ZodObject<{
    collectionName: z.ZodString;
    filter: z.ZodString;
}, "strip", z.ZodTypeAny, {
    collectionName: string;
    filter: string;
}, {
    collectionName: string;
    filter: string;
}>;
export declare function deleteDocument({ collectionName, filter }: z.infer<typeof deleteDocumentSchema>): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
//# sourceMappingURL=deleteDocument.d.ts.map