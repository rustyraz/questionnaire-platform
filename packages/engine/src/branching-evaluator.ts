import { AnswerMap, BranchingRule, ComparisonOperator, Question } from './types.js';

const comparators: Record<ComparisonOperator, (answer: unknown, expected: unknown) => boolean> = {
    equals: (answer, expected) => answer === expected,
    notEquals: (answer, expected) => answer !== expected,
    greaterThan: (answer, expected) => typeof answer === 'number' && typeof expected === 'number' && answer > expected,
    lessThan: (answer, expected) => typeof answer === 'number' && typeof expected === 'number' && answer < expected,
    contains: (answer, expected) =>
        typeof answer === 'string' && typeof expected === 'string' && answer.includes(expected),
    isEmpty: (answer) => answer === undefined || answer === null || answer === '',
    isNotEmpty: (answer) => answer !== undefined && answer !== null && answer !== ''
};

export const evaluateRule = (rule: BranchingRule, answers: AnswerMap): boolean => {
    switch (rule.kind) {
        case 'leaf': {
            const comparator = comparators[rule.operator];
            return comparator(answers[rule.questionKey], rule.value);
        }
        case 'and':
            return rule.conditions.every((condition) => evaluateRule(condition, answers));
        case 'or':
            return rule.conditions.some((condition) => evaluateRule(condition, answers));
    }
};

export const resolveVisibleQuestions = (
    questions: readonly Question[],
    answer: AnswerMap,
): readonly Question[] => 
    questions.filter((question) => !question.visibleWhen || evaluateRule(question.visibleWhen, answer));