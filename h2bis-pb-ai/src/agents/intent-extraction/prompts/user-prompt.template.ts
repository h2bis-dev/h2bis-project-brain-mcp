import { UseCase } from '../types/intent-analysis.types.js';

export function createUserPrompt(useCase: UseCase): string {
    return `Analyze this use case and extract structured intent:

Use Case Details:
- Name: ${useCase.name}
- Description: ${useCase.description}
- Business Value: ${useCase.businessValue}
- Primary Actor: ${useCase.primaryActor}
- Acceptance Criteria: ${JSON.stringify(useCase.acceptanceCriteria, null, 2)}
- Flows: ${JSON.stringify(useCase.flows, null, 2)}
- Technical Surface: ${JSON.stringify(useCase.technicalSurface, null, 2)}
- Tags: ${useCase.tags.join(', ')}

Extract the following information and return as JSON:

{
    "userGoal": "What the user wants to achieve (not just the name)",
    "systemResponsibilities": ["What the system must do (separate items)"],
    "businessContext": "Business background and motivation",
    "businessValue": "Why this matters to the business",
    "technicalComponents": {
        "frontend": { "routes": [], "components": [] },
        "backend": { "endpoints": [], "services": [] },
        "data": [{ "entity": "", "operations": [] }]
    },
    "userFlows": [{ "name": "", "type": "main|alternative|error", "steps": [] }],
    "acceptanceCriteria": ["Copy from input"],
    "assumptions": ["What you're assuming"],
    "ambiguities": ["What's unclear or not specified"],
    "missingInformation": ["What's missing"],
    "constraints": ["Limitations or requirements"],
    "securityConsiderations": ["Security implications"],
    "implementationRisks": ["Potential implementation issues"],
    "confidenceLevel": "high|medium|low",
    "confidenceJustification": "Why this confidence level"
}

Important:
- userGoal should be the user's actual intent, not just copying the name
- systemResponsibilities should be actionable system behaviors
- Only extract technical components explicitly mentioned
- Be honest about ambiguities and missing information
- Assess your confidence realistically`;
}
