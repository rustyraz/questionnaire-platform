import { z, type ZodTypeAny } from "zod";
import type { AnswerMap, Question, QuestionType, ValidatioError } from './types.js';
import { err, ok } from './types.js';

const typeSchemaBuilders: Record<QuestionType, (question: Question) => ZodTypeAny> = {
    text: () => z.string(),
    number: () => z.number(),
    boolean: () => z.boolean(),
    date: () => z.string().date(),
    select: (question) => {
        const values = (question.options ?? []).map((option) => option.value);
        return values.length > 0 ? z.enum(values as [string, ...string[]]): z.string();
    },
};

export const buildAnswerSchema = (questions: readonly Question[]): z.ZodObject<Record<string, ZodTypeAny>> => {
    const shape: Record<string, ZodTypeAny> = {};
    for (const question of questions) {
        const base = typeSchemaBuilders[question.type](question);
        shape[question.key] = question.required === false ? base.optional() : base;
    }
    return z.object(shape);
};

export const validateSubmission = (
    visibleQuestions: readonly Question[],
    rawAnswers: AnswerMap,
) => {
    const schema = buildAnswerSchema(visibleQuestions);
    const parsed = schema.safeParse(rawAnswers);

    if (parsed.success) {
        return ok(parsed.data);
    }

    const errors: ValidatioError[] = parsed.error.issues.map((issue) => ({
        questionKey: String(issue.path[0] ?? 'unknown'),
        message: issue.message
    }));
    return err(errors)
};
