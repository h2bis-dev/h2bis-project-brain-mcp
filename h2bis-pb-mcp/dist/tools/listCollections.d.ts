import { z } from 'zod';
export declare const listCollectionsSchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
export declare function listCollections(_args: z.infer<typeof listCollectionsSchema>): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
//# sourceMappingURL=listCollections.d.ts.map