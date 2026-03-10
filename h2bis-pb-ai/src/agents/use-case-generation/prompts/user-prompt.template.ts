import type { UseCaseGenerationInput, ProjectContext } from '../types/use-case-generation.types.js';

const buildProjectContextSection = (ctx: ProjectContext): string => {
    const lines: string[] = [];
    lines.push(`--- PROJECT CONTEXT ---`);
    lines.push(`Use the following project information to make the generated use case coherent with the existing codebase.\n`);

    if (ctx.projectName) lines.push(`Project: ${ctx.projectName}`);
    if (ctx.language)    lines.push(`Language: ${ctx.language}`);
    if (ctx.framework)   lines.push(`Framework: ${ctx.framework}`);
    if (ctx.techStack?.length) lines.push(`Tech Stack: ${ctx.techStack.join(', ')}`);

    if (ctx.architecture?.style || ctx.architecture?.overview) {
        lines.push(`\nArchitecture:`);
        if (ctx.architecture.style)    lines.push(`  Style: ${ctx.architecture.style}`);
        if (ctx.architecture.overview) lines.push(`  Overview: ${ctx.architecture.overview}`);
    }

    if (ctx.standards?.namingConventions?.length || ctx.standards?.errorHandling?.length) {
        lines.push(`\nCoding Standards:`);
        if (ctx.standards.namingConventions?.length) lines.push(`  Naming Conventions: ${ctx.standards.namingConventions.join(', ')}`);
        if (ctx.standards.errorHandling?.length)     lines.push(`  Error Handling: ${ctx.standards.errorHandling.join(', ')}`);
    }

    if (ctx.externalServices?.length) {
        lines.push(`\nAvailable External Services:`);
        ctx.externalServices.forEach(s => {
            lines.push(`  - ${s.name}${s.purpose ? `: ${s.purpose}` : ''}`);
        });
    }

    if (ctx.developedEndpoints?.length) {
        lines.push(`\nExisting API Endpoints (DO NOT duplicate these):`);
        ctx.developedEndpoints.forEach(e => {
            lines.push(`  - [${e.method}] ${e.endpoint}${e.description ? ` — ${e.description}` : ''}`);
        });
    }

    if (ctx.domainCatalog?.length) {
        lines.push(`\nExisting Domain Models (REFERENCE these instead of redefining):`);
        ctx.domainCatalog.forEach(m => {
            lines.push(`  - ${m.name}${m.layer ? ` (${m.layer})` : ''}${m.description ? `: ${m.description}` : ''}`);
        });
    }

    if (ctx.services?.length) {
        lines.push(`\nProject Applications & Services (SCOPE your use case to the relevant service):`);
        ctx.services.forEach(s => {
            const tech = [s.language, s.framework, ...(s.techStack ?? [])].filter(Boolean).join(', ');
            lines.push(`  - [${s.type}] ${s.name}${tech ? ` (${tech})` : ''}${s.description ? `: ${s.description}` : ''}`);
        });
    }

    lines.push(`--- END PROJECT CONTEXT ---`);
    return lines.join('\n');
};

export const createUserPrompt = (input: UseCaseGenerationInput): string => {
    let prompt = `Generate a complete Use Case based on the following description:\n\n`;
    prompt += `Description:\n${input.description}\n\n`;

    if (input.projectContext && Object.keys(input.projectContext).length > 0) {
        prompt += buildProjectContextSection(input.projectContext);
        prompt += `\n\n`;
    }

    if (input.existingData && Object.keys(input.existingData).length > 0) {
        prompt += `Use the following EXISTING DATA as the source of truth. Do NOT overwrite these fields. Fill in the missing gaps around them:\n`;
        prompt += JSON.stringify(input.existingData, null, 2);
    } else {
        prompt += `Generate the Use Case from scratch based on the description.`;
    }

    return prompt;
};
