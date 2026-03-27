import { z } from 'zod';
import { listProjectsSchema } from '../schemas/project.schemas.js';
export declare function listProjects(args?: z.infer<typeof listProjectsSchema>): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
//# sourceMappingURL=listProjects.d.ts.map