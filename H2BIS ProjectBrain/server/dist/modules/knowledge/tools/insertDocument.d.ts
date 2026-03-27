import { z } from 'zod';
import { insertDocumentSchema } from '../schemas/knowledge.schemas.js';
export declare function insertDocument({ collectionName, json }: z.infer<typeof insertDocumentSchema>): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
//# sourceMappingURL=insertDocument.d.ts.map