import { z } from 'zod';
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
export declare const retrieveDocumentsTool: {
    name: string;
    description: string;
    inputSchema: z.ZodObject<{
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
    handler: (args: z.infer<typeof retrieveDocumentsSchema>) => Promise<{
        content: {
            type: string;
            text: string;
        }[];
        isError?: undefined;
    } | {
        content: {
            type: string;
            text: string;
        }[];
        isError: boolean;
    }>;
};
//# sourceMappingURL=retrieveDocuments.d.ts.map