import type { ProjectContext } from 'h2bis-pb-ai';

/**
 * Builds a ProjectContext from a fetched project document.
 * Only includes attributes that meaningfully help the AI generate
 * contextually accurate use cases.
 *
 * Excluded intentionally:
 *  - lifecycle (project status, not relevant to UC content)
 *  - authStrategy (authentication approach; too high-level for UC generation)
 *  - deployment (CI/CD config; not relevant to UC content)
 *  - qualityGates (project-wide policy; redundant in UC context)
 */
export function buildProjectContext(project: any): ProjectContext {
    const meta = project.metadata ?? {};
    const ctx: ProjectContext = {};

    if (project.name) ctx.projectName = project.name;

    const arch = meta.architecture;
    if (arch?.style || arch?.overview) {
        ctx.architecture = {};
        if (arch.style)    ctx.architecture.style = arch.style;
        if (arch.overview) ctx.architecture.overview = arch.overview;
    }

    const stds = meta.standards;
    if (stds?.namingConventions?.length || stds?.errorHandling?.length) {
        ctx.standards = {};
        if (stds.namingConventions?.length) ctx.standards.namingConventions = stds.namingConventions;
        if (stds.errorHandling?.length)     ctx.standards.errorHandling = stds.errorHandling;
    }

    if (meta.externalServices?.length) {
        ctx.externalServices = meta.externalServices.map((s: any) => ({
            name: s.name,
            purpose: s.purpose || undefined
        }));
    }

    // API registry — helps the AI avoid duplicating existing endpoints
    if (project.developedEndpoints?.length) {
        ctx.developedEndpoints = project.developedEndpoints.map((e: any) => ({
            endpoint: e.endpoint,
            method: e.method,
            service: e.service,
            description: e.description || undefined
        }));
    }

    // Domain catalog — lightweight summary so the AI references existing models
    if (project.domainCatalog?.length) {
        ctx.domainCatalog = project.domainCatalog.map((m: any) => ({
            name: m.name,
            layer: m.layer || undefined,
            description: m.description || undefined
        }));
    }

    // Project services — helps the AI scope use cases to the right app or service
    if (meta.services?.length) {
        ctx.services = meta.services.map((s: any) => ({
            id: s.id,
            name: s.name,
            type: s.type,
            language: s.language || undefined,
            framework: s.framework || undefined,
            techStack: s.techStack?.length ? s.techStack : undefined,
            description: s.description || undefined,
            goals: s.goals || undefined
        }));
    }

    return ctx;
}
