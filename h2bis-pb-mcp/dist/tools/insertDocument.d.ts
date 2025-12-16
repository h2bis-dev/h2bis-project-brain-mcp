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
export declare function insertDocument({ collectionName, json }: z.infer<typeof insertDocumentSchema>): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
//# sourceMappingURL=insertDocument.d.ts.map