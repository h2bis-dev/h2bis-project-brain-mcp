import { z } from 'zod';
import { enhanceUseCaseSchema } from '../schemas/useCase.schemas.js';
import * as useCaseService from '../services/use-case.service.js';

export async function enhanceUseCase(args: z.infer<typeof enhanceUseCaseSchema>) {
    try {
        const useCase = await useCaseService.enhanceUseCase(args);

        const formatted = {
            id: useCase.id,
            key: useCase.key,
            name: useCase.name,
            status: useCase.status,
            functionalRequirements: useCase.functionalRequirements,
            flows: useCase.flows,
            technicalSurface: useCase.technicalSurface,
        };

        return text(`Use case enhanced successfully:\n\n${JSON.stringify(formatted, null, 2)}`);
    } catch (error) {
        return text(`Error enhancing use case: ${error instanceof Error ? error.message : String(error)}`);
    }
}

function text(message: string) {
    return { content: [{ type: 'text', text: message }] };
}
