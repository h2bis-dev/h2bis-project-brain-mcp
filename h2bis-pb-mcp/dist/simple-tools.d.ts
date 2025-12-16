import { z } from 'zod';
declare const retrieveDocumentsSchema: z.ZodObject<{
    collection: z.ZodString;
    query: z.ZodRecord<z.ZodString, z.ZodAny>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    collection: string;
    query: Record<string, any>;
    limit: number;
}, {
    collection: string;
    query: Record<string, any>;
    limit?: number | undefined;
}>;
type RetrieveDocumentsInput = z.infer<typeof retrieveDocumentsSchema>;
declare function retrieveDocuments(input: RetrieveDocumentsInput): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
export declare const tools: {
    name: string;
    description: string;
    inputSchema: any;
    handler: typeof retrieveDocuments;
}[];
export {};
//# sourceMappingURL=simple-tools.d.ts.map