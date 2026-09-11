import type { DataSource, QueryDeepPartialEntity } from 'typeorm';
import { QuestionEntity } from '../entities/question.entity.js';
import { QuestionnaireEntity, type QuestionnaireStatus } from '../entities/questionnaire.entity.js';
import { SurveySubmissionEntity } from '../entities/survey-submission.entity.js';

export const createQuestionnaireRepository = (dataSource: DataSource) => {
  const questionnaireRepo = dataSource.getRepository(QuestionnaireEntity);
  const questionRepo = dataSource.getRepository(QuestionEntity);
  const submissionRepo = dataSource.getRepository(SurveySubmissionEntity);

  return {
    saveQuestionnaire: (data: Partial<QuestionnaireEntity>) =>
      questionnaireRepo.save(questionnaireRepo.create(data)),

    saveQuestions: (data: readonly Partial<QuestionEntity>[]) =>
      questionRepo.save(data.map((q) => questionRepo.create(q))),

    findWithQuestions: (id: string) =>
      questionnaireRepo.findOne({ where: { id }, relations: ['questions'] }),

    findMany: (params: { status?: QuestionnaireStatus; page: number; pageSize: number }) =>
      questionnaireRepo.findAndCount({
        where: params.status ? { status: params.status } : {},
        order: { createdAt: 'DESC' },
        skip: (params.page - 1) * params.pageSize,
        take: params.pageSize,
      }),

    updateStatusAndSnapshot: (id: string, status: QuestionnaireStatus, publishedSchema: unknown, version: number) =>
      questionnaireRepo.update(
        id,
        { status, publishedSchema, version } as QueryDeepPartialEntity<QuestionnaireEntity>,
      ),

    updateStatus: (id: string, status: QuestionnaireStatus) => questionnaireRepo.update(id, { status }),

    updateQuestionBranching: (questionId: string, visibleWhen: unknown) =>
      questionRepo.update(questionId, { visibleWhen } as QueryDeepPartialEntity<QuestionEntity>),

    findSubmissions: (questionnaireId: string, page: number, pageSize: number) =>
      submissionRepo.findAndCount({
        where: { questionnaireId },
        order: { createdAt: 'DESC' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
  };
};

export type QuestionnaireRepository = ReturnType<typeof createQuestionnaireRepository>;