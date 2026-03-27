import { z } from 'zod';
import { findDocumentSchema } from '../schemas/knowledge.schemas.js';
export declare function findDocument({ collectionName, filter }: z.infer<typeof findDocumentSchema>): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
//# sourceMappingURL=findDocument.d.ts.map