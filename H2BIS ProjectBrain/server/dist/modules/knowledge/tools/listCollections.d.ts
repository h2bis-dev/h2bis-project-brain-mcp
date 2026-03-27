import { z } from 'zod';
import { listCollectionsSchema } from '../schemas/knowledge.schemas.js';
export declare function listCollections(_args: z.infer<typeof listCollectionsSchema>): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
//# sourceMappingURL=listCollections.d.ts.map