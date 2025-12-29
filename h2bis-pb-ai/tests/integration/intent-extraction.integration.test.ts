import { describe, it, expect, beforeEach } from 'vitest';
import { IntentExtractionAgent } from '../../src/agents/intent-extraction/intent-extraction.agent.js';
import { UseCase } from '../../src/agents/intent-extraction/types/intent-analysis.types.js';

describe('IntentExtractionAgent', () => {
    let agent: IntentExtractionAgent;

    beforeEach(() => {
        agent = new IntentExtractionAgent();
    });

    it('should extract intent from use case', async () => {
        // Sample use case
        const useCase: UseCase = {
            type: 'use_case',
            key: 'uc-user-login',
            name: 'User Login',
            description: 'Allows users to log in using email and password. System validates credentials and creates an authenticated session.',
            businessValue: 'Secure access to protected resources',
            primaryActor: 'User',
            status: {
                lifecycle: 'planned',
                reviewedByHuman: true,
                generatedByAI: false
            },
            acceptanceCriteria: [
                'User can log in with valid email and password',
                'Invalid credentials show appropriate error',
                'Account locks after 5 failed attempts'
            ],
            flows: [
                {
                    name: 'Successful Login',
                    type: 'main',
                    steps: [
                        'User navigates to login page',
                        'User enters email and password',
                        'User clicks login button',
                        'System validates credentials',
                        'System creates session',
                        'System redirects to dashboard'
                    ]
                }
            ],
            technicalSurface: {
                frontend: {
                    repos: ['web-app'],
                    routes: ['/login'],
                    components: ['LoginForm', 'LoginButton']
                },
                backend: {
                    repos: ['auth-service'],
                    endpoints: ['/api/auth/login'],
                    services: ['auth-service'],
                    collections: [
                        { name: 'users', purpose: 'Store user credentials', operations: ['READ'] },
                        { name: 'sessions', purpose: 'Store active sessions', operations: ['CREATE'] }
                    ]
                }
            },
            relationships: [],
            tags: ['auth', 'security']
        };

        // Extract intent (requires OpenAI API key in .env)
        const analysis = await agent.extractIntent(useCase);

        // Assertions
        expect(analysis).toBeDefined();
        expect(analysis.userGoal).toBeTruthy();
        expect(analysis.userGoal).not.toBe('User Login'); // Should be semantic, not just copied
        expect(analysis.systemResponsibilities.length).toBeGreaterThan(0);
        expect(analysis.acceptanceCriteria.length).toBe(3); // Must match input
        expect(analysis.confidenceLevel).toBeDefined();
        expect(['high', 'medium', 'low']).toContain(analysis.confidenceLevel);

        // Log for manual verification
        console.log('\n=== Intent Extraction Result ===');
        console.log('User Goal:', analysis.userGoal);
        console.log('System Responsibilities:', analysis.systemResponsibilities);
        console.log('Confidence:', analysis.confidenceLevel);
        console.log('Assumptions:', analysis.assumptions);
        console.log('Ambiguities:', analysis.ambiguities);
        console.log('Security Considerations:', analysis.securityConsiderations);
    }, 30000); // 30s timeout for LLM call

    it('should cache extracted intent', async () => {
        const useCase: UseCase = {
            type: 'use_case',
            key: 'uc-test-cache',
            name: 'Test Feature',
            description: 'Test description',
            businessValue: 'Test value',
            primaryActor: 'User',
            status: { lifecycle: 'planned', reviewedByHuman: true, generatedByAI: false },
            acceptanceCriteria: ['Test criterion'],
            flows: [{ name: 'Main', type: 'main', steps: ['Step 1'] }],
            technicalSurface: {
                frontend: { repos: [], routes: [], components: [] },
                backend: { repos: [], endpoints: [], services: [], collections: [] }
            },
            relationships: [],
            tags: []
        };

        // First call - should hit LLM
        const start1 = Date.now();
        const analysis1 = await agent.extractIntent(useCase);
        const duration1 = Date.now() - start1;

        // Second call - should hit cache
        const start2 = Date.now();
        const analysis2 = await agent.extractIntent(useCase);
        const duration2 = Date.now() - start2;

        expect(analysis1).toEqual(analysis2);
        expect(duration2).toBeLessThan(100); // Cache should be < 100ms
        console.log(`First call: ${duration1}ms, Second call (cached): ${duration2}ms`);
    }, 60000);
});
