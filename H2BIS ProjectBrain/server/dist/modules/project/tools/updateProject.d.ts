import { z } from 'zod';
import { updateProjectSchema } from '../schemas/project.schemas.js';
export declare function updateProject(args: z.infer<typeof updateProjectSchema>): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
//# sourceMappingURL=updateProject.d.ts.map