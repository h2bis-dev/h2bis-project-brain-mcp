import { z } from 'zod';
import { getUseCaseByIdSchema } from '../schemas/useCase.schemas.js';
export declare function getUseCaseById(args: z.infer<typeof getUseCaseByIdSchema>): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
//# sourceMappingURL=getUseCaseById.d.ts.map