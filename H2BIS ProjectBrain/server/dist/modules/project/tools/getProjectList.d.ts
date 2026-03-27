import { z } from 'zod';
import { getProjectListSchema } from '../schemas/project.schemas.js';
export declare function getProjectList(args?: z.infer<typeof getProjectListSchema>): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
//# sourceMappingURL=getProjectList.d.ts.map