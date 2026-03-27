import { z } from 'zod';
import { deleteUseCaseSchema } from '../schemas/useCase.schemas.js';
export declare function deleteUseCase(args: z.infer<typeof deleteUseCaseSchema>): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
//# sourceMappingURL=deleteUseCase.d.ts.map