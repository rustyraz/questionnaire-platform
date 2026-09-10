import { DataSource } from "typeorm";
import { QuestionnaireEntity } from "../entities/questionnaires.entity.js";
import { QuestionEntity } from "../entities/question.entity.js";


export const createQuestionnaireRepository = (dataSource: DataSource) => {
    const questionnaireRepo = dataSource.getRepository(QuestionnaireEntity);
    const questionRepo = dataSource.getRepository(QuestionEntity);

    return {
        saveQuestionnaire: (data: Partial<QuestionnaireEntity>) => questionnaireRepo.save(questionnaireRepo.create(data)),
        saveQuestions: (data: readonly Partial<QuestionEntity>[]) =>
            questionRepo.save(data.map((q) => questionRepo.create(q))),
        findWithQuestions: (id: string) => 
            questionnaireRepo.findOne({ where: { id }, relations: ['questions'] }),
    };
};

export type QuestionnaireRepository = ReturnType<typeof createQuestionnaireRepository>;