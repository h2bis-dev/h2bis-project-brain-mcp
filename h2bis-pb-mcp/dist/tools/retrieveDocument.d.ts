import { z } from 'zod';
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
export declare const retrieveDocumentTool: {
    name: string;
    description: string;
    inputSchema: z.ZodObject<{
        collection: z.ZodString;
        query: z.ZodRecord<z.ZodString, z.ZodAny>;
    }, "strip", z.ZodTypeAny, {
        collection: string;
        query: Record<string, any>;
    }, {
        collection: string;
        query: Record<string, any>;
    }>;
    handler: (args: z.infer<typeof retrieveDocumentSchema>) => Promise<{
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
//# sourceMappingURL=retrieveDocument.d.ts.map