import { describe, expect, it } from "vitest";
import { BranchingRule, Question } from "./types.js";
import { validateQuestionnaireGraph } from "./graph-validator.js";
import { Q } from "vitest/dist/chunks/reporters.nr4dxCkA.js";

describe('validateQuestionnaireGraph', () => {
    it('passes a graph with no visibleWhen rules', () => {
        const questions: readonly Question[] = [
            { id: '1', key: 'a', label: 'A', type: 'text', order: 0  }
        ];
        expect(validateQuestionnaireGraph(questions).ok).toBe(true);
    });

    it('flags a dangling reference', () => {
        const questions: readonly Question[] = [
            {
                id: '1',
                key: 'a',
                label: 'A',
                type: 'text',
                order: 0,
                visibleWhen: { kind: 'leaf', questionKey: 'nonexistent', operator: 'equals', value: true }
            }
        ];
        const result = validateQuestionnaireGraph(questions);
        expect(result.ok).toBe(false);
        if (!result.ok) expect(result.errors[0]?.kind).toBe('danglingReference');
    });

    it('flags a direct two-node cycle', () => {
        const questions: readonly Question[] = [
            {
                id: '1',
                key: 'a',
                label: 'A',
                type: 'text',
                order: 0,
                visibleWhen: { kind: 'leaf', questionKey: 'b', operator: 'equals', value: true }
            },
            {
                id: '2',
                key: 'b',
                label: 'B',
                type: 'text',
                order: 1,
                visibleWhen: { kind: 'leaf', questionKey: 'a', operator: 'equals', value: true }
            }
        ];
        const result = validateQuestionnaireGraph(questions);
        expect(result.ok).toBe(false);
        
    });

    it('flags a transitive three-node cycle', () => {
        const rule = (key: string): BranchingRule => ({ kind: 'leaf', questionKey: key, operator: 'equals', value: true });
        const questions: readonly Question[] = [
            { id: '1', key: 'a', label: 'A', type: 'text', order: 0, visibleWhen: rule('b')},
            { id: '2', key: 'b', label: 'B', type: 'text', order: 1, visibleWhen: rule('c')},
            { id: '3', key: 'c', label: 'C', type: 'text', order: 2, visibleWhen: rule('a')},
        ];

        const result = validateQuestionnaireGraph(questions);
        expect(result.ok).toBe(false);
        if (!result.ok) expect(result.errors.some((e) => e.kind === 'cycle')).toBe(true);
    });
});