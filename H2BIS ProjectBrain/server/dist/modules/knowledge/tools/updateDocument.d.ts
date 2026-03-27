import { z } from 'zod';
import { updateDocumentSchema } from '../schemas/knowledge.schemas.js';
export declare function updateDocument({ collectionName, filter, update }: z.infer<typeof updateDocumentSchema>): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
//# sourceMappingURL=updateDocument.d.ts.map