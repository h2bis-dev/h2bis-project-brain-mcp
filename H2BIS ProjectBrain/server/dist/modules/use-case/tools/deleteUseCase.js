import * as useCaseService from '../services/use-case.service.js';
export async function deleteUseCase(args) {
    try {
        await useCaseService.deleteUseCase(args.useCaseId);
        return text(`Use case deleted successfully: ${args.useCaseId}`);
    }
    catch (error) {
        return text(`Error deleting use case: ${error instanceof Error ? error.message : String(error)}`);
    }
}
function text(message) {
    return { content: [{ type: 'text', text: message }] };
}
//# sourceMappingURL=deleteUseCase.js.map