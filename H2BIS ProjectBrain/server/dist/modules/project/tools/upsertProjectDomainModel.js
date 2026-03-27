import * as projectService from '../services/project.service.js';
export async function upsertProjectDomainModel(args) {
    try {
        const { projectId, ...modelPayload } = args;
        await projectService.upsertDomainModel(projectId, modelPayload);
        return text(`Domain model '${args.name}' successfully upserted into project '${projectId}'.`);
    }
    catch (error) {
        return text(`Error upserting domain model: ${error instanceof Error ? error.message : String(error)}`);
    }
}
function text(message) {
    return { content: [{ type: 'text', text: message }] };
}
//# sourceMappingURL=upsertProjectDomainModel.js.map