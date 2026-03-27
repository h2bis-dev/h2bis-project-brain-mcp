import { z } from 'zod';
import { enhanceUseCaseSchema } from '../schemas/useCase.schemas.js';
export declare function enhanceUseCase(args: z.infer<typeof enhanceUseCaseSchema>): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
//# sourceMappingURL=enhanceUseCase.d.ts.map