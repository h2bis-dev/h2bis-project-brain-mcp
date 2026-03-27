import { z } from 'zod';
import { getImplementationOrderSchema } from '../schemas/capability.schemas.js';
export declare function getImplementationOrder({ nodeIds }: z.infer<typeof getImplementationOrderSchema>): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
//# sourceMappingURL=getImplementationOrder.d.ts.map