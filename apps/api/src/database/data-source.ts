import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { QuestionnaireEntity } from './entities/questionnaire.entity.js';
import { QuestionEntity } from './entities/question.entity.js';
import { SurveySubmissionEntity } from './entities/survey-submission.entity.js';

export const AppDataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL ?? 'postgres://postgres:postgres@localhost:5432/questionnaire_db',
    synchronize: false,
    entities: [QuestionnaireEntity, QuestionEntity, SurveySubmissionEntity],
    migrations: ['src/database/migrations/*.ts']
});