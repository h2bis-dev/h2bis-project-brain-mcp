import { z } from 'zod';
import { updateUseCaseWithAISchema } from '../schemas/useCase.schemas.js';
import * as useCaseService from '../services/use-case.service.js';

export async function updateUseCaseWithAI(args: z.infer<typeof updateUseCaseWithAISchema>) {
    try {
        const useCase = await useCaseService.updateUseCaseWithAI(args);

        const formatted = {
            id: useCase.id,
            key: useCase.key,
            name: useCase.name,
            description: useCase.description,
            status: useCase.status,
        };

        return text(`Use case updated with AI successfully:\n\n${JSON.stringify(formatted, null, 2)}`);
    } catch (error) {
        return text(`Error updating use case with AI: ${error instanceof Error ? error.message : String(error)}`);
    }
}

function text(message: string) {
    return { content: [{ type: 'text', text: message }] };
}
