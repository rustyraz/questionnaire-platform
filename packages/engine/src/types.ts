//Domain types

export type Result<T, E> = 
    | { readonly ok: true; readonly data: T }
    | { readonly ok: false; readonly errors: readonly E[] };

export const ok = <T>(data: T): Result<T, never> => ({ ok: true, data });
export const err = <E>(errors: readonly E[]): Result<never, E> => ({ ok:false, errors });

export type QuestionType = 'text' | 'number' | 'boolean' | 'select' | 'date';

export type ComparisonOperator = 
    | 'equals'
    | 'notEquals'
    | 'greaterThan'
    | 'lessThan'
    | 'contains'
    | 'isEmpty'
    | 'isNotEmpty';

export interface LeafCondition {
    readonly kind: 'leaf';
    readonly questionKey: string;
    readonly operator: ComparisonOperator;
    readonly value?: unknown;
}

export interface CompositeCondition {
    readonly kind: 'and' | 'or';
    readonly conditions: readonly BranchingRule[];
}

export type BranchingRule = LeafCondition | CompositeCondition;

export interface QuestionOption {
    readonly value: string;
    readonly label: string;
}

export interface Question {
    readonly id: string;
    readonly key: string;
    readonly label: string;
    readonly type: QuestionType;
    readonly order: number;
    readonly options?: readonly QuestionOption[];
    readonly required?: boolean;
    readonly visibleWhen?: BranchingRule;
}

export type AnswerMap = Record<string, unknown>;

export interface ValidatioError {
    readonly questionKey: string;
    readonly message: string;
}

export interface GraphError {
    readonly questionKey: string;
    readonly kind: 'danglingReference' | 'cycle';
    readonly message: string;
}
