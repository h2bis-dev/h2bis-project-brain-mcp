import { z } from 'zod';
import { deleteUseCaseSchema } from '../schemas/useCase.schemas.js';
import * as useCaseService from '../services/use-case.service.js';

export async function deleteUseCase(args: z.infer<typeof deleteUseCaseSchema>) {
    try {
        await useCaseService.deleteUseCase(args.useCaseId);

        return text(`Use case deleted successfully: ${args.useCaseId}`);
    } catch (error) {
        return text(`Error deleting use case: ${error instanceof Error ? error.message : String(error)}`);
    }
}

function text(message: string) {
    return { content: [{ type: 'text', text: message }] };
}
