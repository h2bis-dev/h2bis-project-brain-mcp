import { z } from 'zod';
import { createUseCaseSchema } from '../schemas/useCase.schemas.js';
export declare function createUseCase(args: z.infer<typeof createUseCaseSchema>): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
//# sourceMappingURL=createUseCase.d.ts.map