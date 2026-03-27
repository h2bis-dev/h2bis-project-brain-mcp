import * as projectService from '../services/project.service.js';
export async function removeProjectDomainModel(args) {
    try {
        await projectService.removeDomainModel(args.projectId, args.modelName);
        return text(`Domain model '${args.modelName}' removed from project '${args.projectId}'.`);
    }
    catch (error) {
        return text(`Error removing domain model: ${error instanceof Error ? error.message : String(error)}`);
    }
}
function text(message) {
    return { content: [{ type: 'text', text: message }] };
}
//# sourceMappingURL=removeProjectDomainModel.js.map