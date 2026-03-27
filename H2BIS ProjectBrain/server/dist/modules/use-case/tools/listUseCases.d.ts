import { z } from 'zod';
import { listUseCasesSchema } from '../schemas/useCase.schemas.js';
export declare function listUseCases(args: z.infer<typeof listUseCasesSchema>): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
//# sourceMappingURL=listUseCases.d.ts.map