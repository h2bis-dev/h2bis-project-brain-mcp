import { z } from 'zod';
import { getUseCaseByIdSchema } from '../schemas/useCase.schemas.js';
import * as useCaseService from '../services/use-case.service.js';

export async function getUseCaseById(args: z.infer<typeof getUseCaseByIdSchema>) {
    try {
        const useCase = await useCaseService.getUseCaseById(args.useCaseId);

        if (!useCase) {
            return text(`Use case not found: ${args.useCaseId}`);
        }

        return text(`Use case retrieved successfully:\n\n${JSON.stringify(useCase, null, 2)}`);
    } catch (error) {
        return text(`Error retrieving use case: ${error instanceof Error ? error.message : String(error)}`);
    }
}

function text(message: string) {
    return { content: [{ type: 'text', text: message }] };
}
