export interface UseCaseFieldDefinition {
    key: string;
    label: string;
    description: string;
    aiInstruction: string;
    defaultValue: any;
    type: 'string' | 'string[]' | 'object' | 'array_of_objects' | 'enum' | 'boolean';
    options?: string[]; // for enum
}

export const USE_CASE_DEFINITIONS: Record<string, UseCaseFieldDefinition> = {
    // Basic Information
    key: {
        key: 'key',
        label: 'Key',
        description: 'Unique identifier',
        aiInstruction: 'Unique kebab-case key (e.g., uc-login).',
        defaultValue: '',
        type: 'string'
    },
    name: {
        key: 'name',
        label: 'Name',
        description: 'Human-readable name',
        aiInstruction: 'Clear, concise title.',
        defaultValue: '',
        type: 'string'
    },
    description: {
        key: 'description',
        label: 'Description',
        description: 'Summary of functionality',
        aiInstruction: 'Comprehensive summary of functionality.',
        defaultValue: '',
        type: 'string'
    },
    businessValue: {
        key: 'businessValue',
        label: 'Business Value',
        description: 'Business impact/ROI',
        aiInstruction: 'Business impact and ROI.',
        defaultValue: '',
        type: 'string'
    },
    primaryActor: {
        key: 'primaryActor',
        label: 'Primary Actor',
        description: 'Main user/system',
        aiInstruction: 'Primary role/system triggering the use case.',
        defaultValue: '',
        type: 'string'
    },
    stakeholders: {
        key: 'stakeholders',
        label: 'Stakeholders',
        description: 'Interested parties',
        aiInstruction: '3-5 key stakeholders (roles).',
        defaultValue: [],
        type: 'string[]'
    },

    // Requirements
    'functionalRequirements.must': {
        key: 'functionalRequirements.must',
        label: 'Must Have',
        description: 'Critical requirements',
        aiInstruction: 'Critical "Must Have" requirements.',
        defaultValue: [''],
        type: 'string[]'
    },
    'functionalRequirements.should': {
        key: 'functionalRequirements.should',
        label: 'Should Have',
        description: 'Important requirements',
        aiInstruction: 'Important "Should Have" requirements.',
        defaultValue: [''],
        type: 'string[]'
    },
    'functionalRequirements.wont': {
        key: 'functionalRequirements.wont',
        label: 'Wont Have',
        description: 'Out of scope items',
        aiInstruction: '"Won\'t Have" items (out of scope).',
        defaultValue: [''],
        type: 'string[]'
    },

    // Acceptance Criteria
    acceptanceCriteria: {
        key: 'acceptanceCriteria',
        label: 'Acceptance Criteria',
        description: 'Completion conditions',
        aiInstruction: '3-5 testable criteria.',
        defaultValue: [''],
        type: 'string[]'
    },

    // Scope
    'scope.inScope': {
        key: 'scope.inScope',
        label: 'In Scope',
        description: 'Items in scope',
        aiInstruction: 'Items IN scope.',
        defaultValue: [''],
        type: 'string[]'
    },
    'scope.outOfScope': {
        key: 'scope.outOfScope',
        label: 'Out of Scope',
        description: 'Items out of scope',
        aiInstruction: 'Items OUT of scope.',
        defaultValue: [''],
        type: 'string[]'
    },
    'scope.assumptions': {
        key: 'scope.assumptions',
        label: 'Assumptions',
        description: 'Key assumptions',
        aiInstruction: 'Key assumptions.',
        defaultValue: [''],
        type: 'string[]'
    },
    'scope.constraints': {
        key: 'scope.constraints',
        label: 'Constraints',
        description: 'Limitations',
        aiInstruction: 'Business/Technical constraints.',
        defaultValue: [''],
        type: 'string[]'
    },

    // Domain Model
    'domainModel.entities': {
        key: 'domainModel.entities',
        label: 'Domain Entities',
        description: 'Data entities',
        aiInstruction: 'Key domain entities with name, description, and fields (name, type).',
        defaultValue: [],
        type: 'array_of_objects'
    },

    // Interfaces
    'interfaces.type': {
        key: 'interfaces.type',
        label: 'Interface Type',
        description: 'Primary interface',
        aiInstruction: 'Interface type (REST, GraphQL, Event, UI).',
        defaultValue: 'REST',
        type: 'enum',
        options: ['REST', 'GraphQL', 'Event', 'UI']
    },
    'interfaces.endpoints': {
        key: 'interfaces.endpoints',
        label: 'Endpoints',
        description: 'API Endpoints',
        aiInstruction: 'Necessary API endpoints (method, path).',
        defaultValue: [],
        type: 'array_of_objects'
    },
    'interfaces.events': {
        key: 'interfaces.events',
        label: 'Events',
        description: 'Domain events',
        aiInstruction: 'Emitted/consumed domain events.',
        defaultValue: [],
        type: 'string[]'
    },

    // Config
    'configuration.envVars': {
        key: 'configuration.envVars',
        label: 'Env Vars',
        description: 'Environment variables',
        aiInstruction: 'Required env vars.',
        defaultValue: [],
        type: 'string[]'
    },
    'configuration.featureFlags': {
        key: 'configuration.featureFlags',
        label: 'Feature Flags',
        description: 'Feature toggles',
        aiInstruction: 'Potential feature flags.',
        defaultValue: [],
        type: 'string[]'
    },

    // Quality
    'quality.testTypes': {
        key: 'quality.testTypes',
        label: 'Test Types',
        description: 'Testing strategy',
        aiInstruction: 'Test types (unit, integration, e2e, security).',
        defaultValue: ['unit'],
        type: 'string[]'
    },
    'quality.securityConsiderations': {
        key: 'quality.securityConsiderations',
        label: 'Security',
        description: 'Risks/Mitigations',
        aiInstruction: 'Security risks and mitigations.',
        defaultValue: [],
        type: 'string[]'
    }
};

/**
 * Generates a concise system prompt part describing the expected fields.
 */
export function generateUseCasePromptInstructions(): string {
    let prompt = "Generate a Use Case with these specific fields:\n";

    // Group By Categories (concise list)
    for (const [key, def] of Object.entries(USE_CASE_DEFINITIONS)) {
        prompt += `- ${key}: ${def.aiInstruction}\n`;
    }

    prompt += "\nOutput valid JSON only.";
    return prompt;
}
