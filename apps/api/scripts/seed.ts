import { AppDataSource } from "../src/database/data-source.js";
import { QuestionEntity } from "../src/database/entities/question.entity.js";
import { createQuestionnaireRepository } from "../src/database/repositories/questionnaire.repository.js";

type SeedQuestion = Partial<Omit<QuestionEntity, 'id' | 'questionnaire'>>;

const leaf = (questionKey: string, operator: string, value?: unknown) => ({ kind: 'leaf', questionKey, operator, value });

const seedQuestions: readonly SeedQuestion[] = [
  { key: 'country', label: 'Country of residence', type: 'text', order: 0, validation: { required: true } },
  { key: 'employmentStatus', label: 'Employment status', type: 'select', order: 1,
    options: [{ value: 'employed', label: 'Employed' }, { value: 'unemployed', label: 'Unemployed' }, { value: 'student', label: 'Student' }] },
  { key: 'jobTitle', label: 'Job title', type: 'text', order: 2,
    visibleWhen: leaf('employmentStatus', 'equals', 'employed') },
  { key: 'schoolName', label: 'School name', type: 'text', order: 3,
    visibleWhen: leaf('employmentStatus', 'equals', 'student') },
  { key: 'seekingWork', label: 'Actively seeking work?', type: 'boolean', order: 4,
    visibleWhen: leaf('employmentStatus', 'equals', 'unemployed') },
  { key: 'age', label: 'Age', type: 'number', order: 5, validation: { required: true } },
  { key: 'hasGuardianConsent', label: 'Guardian consent given?', type: 'boolean', order: 6,
    visibleWhen: leaf('age', 'lessThan', 18) },
  { key: 'consentDetails', label: 'Consent details', type: 'text', order: 7,
    visibleWhen: { kind: 'and', conditions: [leaf('age', 'lessThan', 18), leaf('hasGuardianConsent', 'equals', true)] } },
  { key: 'contactEmail', label: 'Contact email', type: 'text', order: 8, validation: { required: true } },
  { key: 'newsletterOptIn', label: 'Subscribe to newsletter?', type: 'boolean', order: 9 },
];

const run = async (): Promise<void> => {
    await AppDataSource.initialize();
    const repo = createQuestionnaireRepository(AppDataSource);

    const questionnaire = await repo.saveQuestionnaire({ title: 'Onboarding Survey (seeded)', status: 'draft' });
    
    await repo.saveQuestions(seedQuestions.map((q) => ({ ...q, questionnaireId: questionnaire.id })));

    console.log(`Seeded questionnaire ${questionnaire.id} with ${seedQuestions.length} questions.`);
    await AppDataSource.destroy();
};

run().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
});