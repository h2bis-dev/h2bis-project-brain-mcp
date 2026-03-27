import { z } from 'zod';
import { createUseCaseSchema } from '../schemas/useCase.schemas.js';
import * as useCaseService from '../services/use-case.service.js';

export async function createUseCase(args: z.infer<typeof createUseCaseSchema>) {
    try {
        const { useCaseId, ...payload } = args as any;
        const useCase = await useCaseService.createUseCase(payload);

        const formatted = {
            id: useCase.id,
            key: useCase.key,
            name: useCase.name,
            description: useCase.description,
            projectId: useCase.projectId,
            status: useCase.status,
            businessValue: useCase.businessValue,
            primaryActor: useCase.primaryActor,
        };

        return text(`Use case created successfully:\n\n${JSON.stringify(formatted, null, 2)}`);
    } catch (error) {
        return text(`Error creating use case: ${error instanceof Error ? error.message : String(error)}`);
    }
}

function text(message: string) {
    return { content: [{ type: 'text', text: message }] };
}
