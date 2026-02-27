/**
 * Project Metadata Constants
 * Predefined dropdown values and tag suggestions for project metadata forms
 */

export const PROJECT_METADATA_CONSTANTS = {
    // Lifecycle status options (used in dropdown)
    lifecycleStatuses: [
        { value: 'planning', label: 'Planning', color: 'gray' },
        { value: 'in_development', label: 'In Development', color: 'blue' },
        { value: 'in_review', label: 'In Review', color: 'yellow' },
        { value: 'in_testing', label: 'In Testing', color: 'purple' },
        { value: 'staging', label: 'Staging', color: 'orange' },
        { value: 'production', label: 'Production', color: 'green' },
        { value: 'maintenance', label: 'Maintenance', color: 'cyan' },
        { value: 'archived', label: 'Archived', color: 'slate' },
    ],

    // Programming languages (used in dropdown)
    languages: [
        'TypeScript',
        'JavaScript',
        'Python',
        'Java',
        'Go',
        'C#',
        'Ruby',
        'PHP',
        'Rust',
        'Kotlin',
        'Swift',
        'Other',
    ],

    // Frameworks (used in dropdown)
    frameworks: [
        'Express',
        'NestJS',
        'Next.js',
        'React',
        'Vue',
        'Angular',
        'Django',
        'Spring',
        'FastAPI',
        'Laravel',
        'Rails',
        'Other',
    ],

    // Tech stack tags (predefined + allow custom)
    techStack: [
        'TypeScript',
        'JavaScript',
        'React',
        'Next.js',
        'Node.js',
        'Express',
        'MongoDB',
        'PostgreSQL',
        'MySQL',
        'Redis',
        'GraphQL',
        'REST',
        'Docker',
        'Kubernetes',
        'AWS',
        'Azure',
        'TailwindCSS',
        'ShadCN UI',
        'Prisma',
        'Mongoose',
    ],

    // Architecture overview tags
    architectureOverview: [
        'Monolithic',
        'Microservices',
        'Layered',
        'Event-Driven',
        'Serverless',
        'Service-Oriented',
    ],

    // Architecture style tags
    architectureStyle: [
        'Clean Architecture',
        'Hexagonal',
        'MVC',
        'MVVM',
        'CQRS',
        'DDD',
        'Onion',
        'Ports and Adapters',
    ],

    // State management tags
    stateManagement: [
        'Redux',
        'Context API',
        'Zustand',
        'MobX',
        'Recoil',
        'Jotai',
        'Valtio',
        'XState',
    ],

    // Authentication approach tags
    authApproach: [
        'JWT',
        'OAuth2',
        'Session-based',
        'API Keys',
        'SAML',
        'OpenID Connect',
        'Passport.js',
    ],

    // Deployment environment tags
    deploymentEnvironment: [
        'AWS',
        'Azure',
        'GCP',
        'Local',
        'Docker',
        'Kubernetes',
        'Heroku',
        'Vercel',
        'Netlify',
        'DigitalOcean',
    ],

    // CI/CD tools tags
    cicdTools: [
        'GitHub Actions',
        'Jenkins',
        'GitLab CI',
        'CircleCI',
        'Travis CI',
        'Azure DevOps',
        'Bitbucket Pipelines',
    ],

    // Error handling patterns tags
    errorHandlingPatterns: [
        'Try-Catch',
        'Error Boundaries',
        'Global Handler',
        'Custom Errors',
        'Error Codes',
        'Result Type',
    ],

    // Logging tools tags
    loggingTools: [
        'Winston',
        'Pino',
        'Bunyan',
        'Console',
        'Custom',
        'Log4j',
        'Serilog',
    ],

    // Test types tags
    testTypes: [
        'Unit',
        'Integration',
        'E2E',
        'Security',
        'Performance',
        'Smoke',
        'Regression',
        'Acceptance',
    ],
};

// Type exports for TypeScript
export type LifecycleStatus = typeof PROJECT_METADATA_CONSTANTS.lifecycleStatuses[number]['value'];
