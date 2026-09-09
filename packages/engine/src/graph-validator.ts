import { BranchingRule, err, GraphError, ok, Question, Result } from "./types.js";

const collectReferencedKeys = (rule: BranchingRule): readonly string[] => 
    rule.kind === 'leaf' ? [rule.questionKey] : rule.conditions.flatMap(collectReferencedKeys);

const findDanglingReferences = (questions: readonly Question[]): readonly GraphError[] => {
    const validkeys = new Set(questions.map((q) => q.key));
    const errors: GraphError[] = [];

    for (const question of questions) {
        if (!question.visibleWhen) continue;
        for (const referencedKey of collectReferencedKeys(question.visibleWhen)) {
            if (!validkeys.has(referencedKey)) {
                errors.push({
                    questionKey: question.key,
                    kind: 'danglingReference',
                    message: `"${question.key}" references unknown question key "${referencedKey}"`,
                })
            }
        }
    }
    return errors;
};

const findCycles = (questions: readonly Question[]): readonly GraphError[] => {
    const dependsOn = new Map<string, readonly string[]>(
        questions.map((q) => [q.key, q.visibleWhen ? collectReferencedKeys(q.visibleWhen) : []]),
    );

    const errors: GraphError[] = [];
    const visiting = new Set<string>();
    const resolved = new Set<string>();

    const visit = (key:string, path: readonly string[]): void => {
        if (resolved.has(key)) return;
        if (visiting.has(key)) {
            errors.push({
                questionKey: key,
                kind: 'cycle',
                message: `Circular visibility dependency: ${[...path, key].join(' -> ')}`,
            });
            return;
        }
        visiting.add(key);
        for (const dependency of dependsOn.get(key) ?? []) {
            if (dependsOn.has(dependency)) visit(dependency, [...path, key]);
        }
        visiting.delete(key);
        resolved.add(key);
    };

    for (const key of dependsOn.keys()) visit(key, []);
    return errors;
};

export const validateQuestionnaireGraph = (questions: readonly Question[]): Result<void, GraphError> => {
    const errors = [...findDanglingReferences(questions), ...findCycles(questions)];
    return errors.length === 0 ? ok(undefined) : err(errors);
};