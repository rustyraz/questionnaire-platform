import { describe, expect, it } from "vitest";
import { Question } from "./types.js";
import { validateSubmission } from "./schema-validator.js";

const questions: readonly Question[] = [
    { id: '1', key: 'email', label: 'Email', type: 'text', order: 0, required: true },
    { id: '2', key: 'age', label: 'Age', type: 'number', order: 1 },
    {
        id: '3',
        key: 'plan',
        label: 'Plan',
        type: 'select',
        order: 2,
        options: [{ value: 'basic', label: 'basic' }, { value: 'pro', label: 'Pro' }],
    }
];

describe('validateSubmission', () => {
    it('accepts a valid payload', () => {
        const result = validateSubmission(questions, { email: 'a@b.com', age: 30, plan: 'pro' });
        expect(result.ok).toBe(true);
    });

    it('rejects a missing required field', () => {
        const result = validateSubmission(questions, { age: 30 });
        expect(result.ok).toBe(false);
        if (!result.ok) expect(result.errors.some((e) => e.questionKey === 'email')).toBe(true); 
    });

    it('rejects a value outside the selected options', () => {
        const result = validateSubmission(questions, { email: 'a@b.com', plan: 'enterprise' });
        expect(result.ok).toBe(false);
    });

    it('ignores answers for questions outside the visible set', () => {
        const result = validateSubmission(
            questions.filter((q) => q.key != 'age'),
            { email: 'a@b.com', plan: 'basic' },
        );
        expect(result.ok).toBe(true);
    });
});