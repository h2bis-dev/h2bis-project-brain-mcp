import * as useCaseService from '../services/use-case.service.js';
export async function listUseCases(args) {
    try {
        const { projectId, limit, offset } = args;
        const result = await useCaseService.listUseCases(projectId, limit, offset);
        const formatted = result.useCases.map(uc => ({
            id: uc.id,
            key: uc.key,
            name: uc.name,
            description: uc.description,
            projectId: uc.projectId,
            status: uc.status,
            businessValue: uc.businessValue,
            primaryActor: uc.primaryActor,
        }));
        return text(`Found ${result.total} use case(s)${projectId ? ` for project ${projectId}` : ''}:\n\n` +
            JSON.stringify({ useCases: formatted, total: result.total }, null, 2));
    }
    catch (error) {
        return text(`Error listing use cases: ${error instanceof Error ? error.message : String(error)}`);
    }
}
function text(message) {
    return { content: [{ type: 'text', text: message }] };
}
//# sourceMappingURL=listUseCases.js.map