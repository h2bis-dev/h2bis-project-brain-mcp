import { z } from 'zod';
import { deleteDocumentSchema } from '../schemas/knowledge.schemas.js';
export declare function deleteDocument({ collectionName, filter }: z.infer<typeof deleteDocumentSchema>): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
//# sourceMappingURL=deleteDocument.d.ts.map