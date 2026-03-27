import * as useCaseService from '../services/use-case.service.js';
export async function getUseCaseById(args) {
    try {
        const useCase = await useCaseService.getUseCaseById(args.useCaseId);
        if (!useCase) {
            return text(`Use case not found: ${args.useCaseId}`);
        }
        return text(`Use case retrieved successfully:\n\n${JSON.stringify(useCase, null, 2)}`);
    }
    catch (error) {
        return text(`Error retrieving use case: ${error instanceof Error ? error.message : String(error)}`);
    }
}
function text(message) {
    return { content: [{ type: 'text', text: message }] };
}
//# sourceMappingURL=getUseCaseById.js.map