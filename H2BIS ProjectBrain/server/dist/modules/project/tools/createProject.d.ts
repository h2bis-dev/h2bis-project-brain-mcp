import { z } from 'zod';
import { createProjectSchema } from '../schemas/project.schemas.js';
export declare function createProject(args: z.infer<typeof createProjectSchema>): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
//# sourceMappingURL=createProject.d.ts.map