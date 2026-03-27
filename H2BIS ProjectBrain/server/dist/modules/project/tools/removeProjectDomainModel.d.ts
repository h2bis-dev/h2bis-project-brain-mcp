import { z } from 'zod';
import { removeProjectDomainModelSchema } from '../schemas/project.schemas.js';
export declare function removeProjectDomainModel(args: z.infer<typeof removeProjectDomainModelSchema>): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
//# sourceMappingURL=removeProjectDomainModel.d.ts.map