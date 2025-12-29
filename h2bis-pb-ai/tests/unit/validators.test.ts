import { describe, it, expect } from 'vitest';
import { validateIntentExtraction } from '../../src/utils/validators.js';
import { IntentAnalysis, UseCase } from '../../src/agents/intent-extraction/types/intent-analysis.types.js';

describe('validators', () => {
    const sampleUseCase: UseCase = {
        type: 'use_case',
        key: 'uc-test',
        name: 'Test',
        description: 'Test',
        businessValue: 'Test',
        primaryActor: 'User',
        status: { lifecycle: 'planned', reviewedByHuman: true, generatedByAI: false },
        acceptanceCriteria: ['Criterion 1', 'Criterion 2'],
        flows: [{ name: 'Main', type: 'main', steps: ['Step 1'] }],
        technicalSurface: {
            frontend: { repos: [], routes: [], components: [] },
            backend: { repos: [], endpoints: [], services: [], collections: [] }
        },
        relationships: [],
        tags: []
    };

    const validAnalysis: IntentAnalysis = {
        userGoal: 'Test user goal',
        systemResponsibilities: ['Responsibility 1', 'Responsibility 2'],
        businessContext: 'Test context',
        businessValue: 'Test value',
        technicalComponents: {
            frontend: { routes: [], components: [] },
            backend: { endpoints: [], services: [] },
            data: []
        },
        userFlows: [{ name: 'Main', type: 'main', steps: ['Step 1'] }],
        acceptanceCriteria: ['Criterion 1', 'Criterion 2'],
        assumptions: [],
        ambiguities: [],
        missingInformation: [],
        constraints: [],
        securityConsiderations: [],
        implementationRisks: [],
        confidenceLevel: 'high',
        confidenceJustification: 'Test justification',
        extractedAt: new Date(),
        llmModel: 'gpt-4-turbo',
        promptVersion: '1.0.0'
    };

    it('should pass validation for valid analysis', () => {
        const result = validateIntentExtraction(validAnalysis, sampleUseCase);

        expect(result.valid).toBe(true);
        expect(result.criticalIssues.length).toBe(0);
        expect(result.recommendation).toBe('proceed');
    });

    it('should fail if userGoal is empty', () => {
        const invalidAnalysis = { ...validAnalysis, userGoal: '' };
        const result = validateIntentExtraction(invalidAnalysis, sampleUseCase);

        expect(result.valid).toBe(false);
        expect(result.criticalIssues).toContain('userGoal is empty');
    });

    it('should fail if systemResponsibilities is empty', () => {
        const invalidAnalysis = { ...validAnalysis, systemResponsibilities: [] };
        const result = validateIntentExtraction(invalidAnalysis, sampleUseCase);

        expect(result.valid).toBe(false);
        expect(result.criticalIssues).toContain('systemResponsibilities is empty');
    });

    it('should fail if acceptance criteria count mismatch', () => {
        const invalidAnalysis = { ...validAnalysis, acceptanceCriteria: ['Only one'] };
        const result = validateIntentExtraction(invalidAnalysis, sampleUseCase);

        expect(result.valid).toBe(false);
        expect(result.criticalIssues[0]).toContain('Acceptance criteria count mismatch');
    });

    it('should fail if confidence is low', () => {
        const invalidAnalysis = { ...validAnalysis, confidenceLevel: 'low' as const };
        const result = validateIntentExtraction(invalidAnalysis, sampleUseCase);

        expect(result.valid).toBe(false);
        expect(result.criticalIssues).toContain('Confidence level is low');
    });

    it('should recommend retry for multiple failures', () => {
        const invalidAnalysis = {
            ...validAnalysis,
            userGoal: '',
            systemResponsibilities: [],
            confidenceLevel: 'low' as const
        };
        const result = validateIntentExtraction(invalidAnalysis, sampleUseCase);

        expect(result.recommendation).toBe('retry');
    });

    it('should recommend manual review for few failures', () => {
        const invalidAnalysis = { ...validAnalysis, userGoal: '' };
        const result = validateIntentExtraction(invalidAnalysis, sampleUseCase);

        expect(result.recommendation).toBe('manual_review');
    });

    it('should warn about missing technical components', () => {
        const result = validateIntentExtraction(validAnalysis, sampleUseCase);

        expect(result.warnings).toContain('No technical components extracted');
    });

    it('should warn about security tags without considerations', () => {
        const securityUseCase = { ...sampleUseCase, tags: ['auth', 'security'] };
        const result = validateIntentExtraction(validAnalysis, securityUseCase);

        expect(result.warnings).toContain('Security-sensitive feature but no security considerations noted');
    });
});
