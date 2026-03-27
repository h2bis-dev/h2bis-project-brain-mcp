import { z } from 'zod';
import { updateUseCaseWithAISchema } from '../schemas/useCase.schemas.js';
export declare function updateUseCaseWithAI(args: z.infer<typeof updateUseCaseWithAISchema>): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
//# sourceMappingURL=updateUseCaseWithAI.d.ts.map