import { Global, Module, type Provider } from '@nestjs/common';
import { AppDataSource } from './data-source.js';
import { createQuestionnaireRepository } from './repositories/questionnaire.repository.js';

export const DATA_SOURCE = 'DATA_SOURCE';
export const QUESTIONNAIRE_REPOSITORY = 'QUESTIONNAIRE_REPOSITORY';

const dataSourceProvider: Provider = {
    provide: DATA_SOURCE,
    useFactory: async () => {
        if (!AppDataSource.isInitialized) await AppDataSource.initialize();
        return AppDataSource;
    },
};

const questionnaireRepositoryProvider: Provider = {
    provide: QUESTIONNAIRE_REPOSITORY,
    inject: [DATA_SOURCE],
    useFactory: createQuestionnaireRepository,
};

@Global()
@Module({
    providers: [dataSourceProvider, questionnaireRepositoryProvider],
    exports: [DATA_SOURCE, QUESTIONNAIRE_REPOSITORY],
})
export class DatabaseModule {}