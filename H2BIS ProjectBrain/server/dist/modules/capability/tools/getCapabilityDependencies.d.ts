import { z } from 'zod';
import { getCapabilityDependenciesSchema } from '../schemas/capability.schemas.js';
export declare function getCapabilityDependencies({ nodeId, depth }: z.infer<typeof getCapabilityDependenciesSchema>): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
//# sourceMappingURL=getCapabilityDependencies.d.ts.map