import { z } from 'zod';
import { updateUseCaseSchema } from '../schemas/useCase.schemas.js';
export declare function updateUseCase(args: z.infer<typeof updateUseCaseSchema>): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
//# sourceMappingURL=updateUseCase.d.ts.map