import * as useCaseService from '../services/use-case.service.js';
export async function updateUseCase(args) {
    try {
        const { useCaseId, ...payload } = args;
        const useCase = await useCaseService.updateUseCase(useCaseId, payload);
        const formatted = {
            id: useCase.id,
            key: useCase.key,
            name: useCase.name,
            description: useCase.description,
            status: useCase.status,
            businessValue: useCase.businessValue,
        };
        return text(`Use case updated successfully:\n\n${JSON.stringify(formatted, null, 2)}`);
    }
    catch (error) {
        return text(`Error updating use case: ${error instanceof Error ? error.message : String(error)}`);
    }
}
function text(message) {
    return { content: [{ type: 'text', text: message }] };
}
//# sourceMappingURL=updateUseCase.js.map