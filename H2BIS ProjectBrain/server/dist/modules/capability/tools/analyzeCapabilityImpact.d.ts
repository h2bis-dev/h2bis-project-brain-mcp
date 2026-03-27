import { z } from 'zod';
import { analyzeCapabilityImpactSchema } from '../schemas/capability.schemas.js';
export declare function analyzeCapabilityImpact({ nodeId }: z.infer<typeof analyzeCapabilityImpactSchema>): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
//# sourceMappingURL=analyzeCapabilityImpact.d.ts.map