import { z } from 'zod';
import { upsertProjectDomainModelSchema } from '../schemas/project.schemas.js';
export declare function upsertProjectDomainModel(args: z.infer<typeof upsertProjectDomainModelSchema>): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
//# sourceMappingURL=upsertProjectDomainModel.d.ts.map