import { describe, expect, it } from 'vitest'
import { BranchingRule, Question } from './types.js';
import { evaluateRule, resolveVisibleQuestions } from './branching-evaluator.js';

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

    it('handles isEmpty/isNotEmpty on missing answers', () => {
        const rule: BranchingRule = { kind: 'leaf', questionKey: 'nickname', operator:'isEmpty' };
        expect(evaluateRule(rule, {})).toBe(true);
        expect(evaluateRule(rule, { nickname: 'Pete' })).toBe(false);
    });
});

describe('resolveVisibleQuestions', () => {
    const questions: readonly Question[] = [
        { id: '1', key: 'country', 'label': 'Country', type: 'text', order: 0 },
        {
            id: '2',
            key: 'visaType',
            label: 'Visa Type',
            type: 'text',
            order: 1,
            visibleWhen: { kind: 'leaf', questionKey: 'country', operator: 'notEquals', value: 'DE' }
        }
    ];

    it('prunes hidden questions based on current answers', () => {
        expect(resolveVisibleQuestions(questions, { country: 'DE' }).map((q) => q.key)).toEqual(['country']);
        expect(resolveVisibleQuestions(questions, { country: 'FR' }).map((q) => q.key)).toEqual([
            'country',
            'visaType'
        ]);
    });
});