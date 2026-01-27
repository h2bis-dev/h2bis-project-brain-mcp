import type { UseCaseGenerationInput } from '../types/use-case-generation.types.js';

export const createUserPrompt = (input: UseCaseGenerationInput): string => {
    let prompt = `generate a complete Use Case based on the following description:\n\n`;
    prompt += `description:\n${input.description}\n\n`;

    if (input.existingData && Object.keys(input.existingData).length > 0) {
        prompt += `use the following EXISTING DATA as the source of truth. Do NOT overwrite these fields. fill in the missing gaps around them:\n`;
        prompt += JSON.stringify(input.existingData, null, 2);
    } else {
        prompt += `generate the Use Case from scratch based on the description.`;
    }

    return prompt;
};
