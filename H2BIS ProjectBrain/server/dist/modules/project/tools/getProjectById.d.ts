import { z } from 'zod';
import { getProjectByIdSchema } from '../schemas/project.schemas.js';
export declare function getProjectById(args: z.infer<typeof getProjectByIdSchema>): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
//# sourceMappingURL=getProjectById.d.ts.map