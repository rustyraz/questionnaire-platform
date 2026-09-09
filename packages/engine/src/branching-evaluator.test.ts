import { describe, expect, it } from 'vitest'
import { BranchingRule } from './types.js';
import { evaluateRule } from './branching-evaluator.js';

describe('evaluateRule', () => {
    it('evaluates a leaf equals condition', () => {
        const rule: BranchingRule = { kind: 'leaf', questionKey: 'age', operator: 'equals', value: 30 };
        expect(evaluateRule(rule, { age: 30 })).toBe(true);
        expect(evaluateRule(rule, { age: 31 })).toBe(false);
    });

    it('evaluates nested AND/OR trees', () => {
        const rule: BranchingRule = {
            kind: 'and',
            conditions: [
                { kind: 'leaf', questionKey: 'country', operator: 'equals', value: 'DE' },
                {
                    kind: 'or',
                    conditions: [
                        { kind: 'leaf', questionKey: 'age', operator: 'greaterThan', value: 18 },
                        { kind: 'leaf', questionKey: 'hasGuardianConsent', operator: 'equals', value: true }
                    ]
                }
            ]
        };
        expect(evaluateRule(rule, { country: 'DE', age: 20 })).toBe(true);
        expect(evaluateRule(rule, { country: 'DE', age: 15, hasGuardianConsent: true })).toBe(true);
        expect(evaluateRule(rule, { country: 'DE', age: 15, hasGuardianConsent: true })).toBe(true);
        expect(evaluateRule(rule, { country: 'FR', age: 20 })).toBe(false);
    });
});