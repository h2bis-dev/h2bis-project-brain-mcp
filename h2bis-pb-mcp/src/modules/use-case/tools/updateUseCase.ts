import { z } from 'zod';
import { updateUseCaseSchema } from '../schemas/useCase.schemas.js';
import * as useCaseService from '../services/use-case.service.js';
import type { UpdateUseCaseRequest } from '../types/use-case.types.js';

export async function updateUseCase(args: z.infer<typeof updateUseCaseSchema>) {
    try {
        const { useCaseId, ...payload } = args;
        const useCase = await useCaseService.updateUseCase(useCaseId, payload as UpdateUseCaseRequest);

        const formatted = {
            id: useCase.id,
            key: useCase.key,
            name: useCase.name,
            description: useCase.description,
            status: useCase.status,
            businessValue: useCase.businessValue,
        };

        return text(`Use case updated successfully:\n\n${JSON.stringify(formatted, null, 2)}`);
    } catch (error) {
        return text(`Error updating use case: ${error instanceof Error ? error.message : String(error)}`);
    }
}

function text(message: string) {
    return { content: [{ type: 'text', text: message }] };
}
