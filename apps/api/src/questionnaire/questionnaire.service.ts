import { validateQuestionnaireGraph, type Question } from "@questionnaire-platform/engine";
import { QuestionnaireEntity } from "../database/entities/questionnaire.entity.js";
import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { QUESTIONNAIRE_REPOSITORY } from "../database/database.module.js";
import { QuestionnaireRepository } from "../database/repositories/questionnaire.repository.js";
import type { QuestionnaireStatus } from "../database/entities/question.entity.js";

const toEngineQuestions = (questionnaire: QuestionnaireEntity): readonly Question[] =>
    questionnaire.questions.map((q) => ({
        id: q.id,
        key: q.key,
        label: q.label,
        type: q.type as Question['type'],
        order: q.order,
        options: (q.options as Question['options']) ?? undefined,
        visibleWhen: (q.visibleWhen as Question['visibleWhen']) ?? undefined
    }));

@Injectable()
export class QuestionnaireService {
    constructor(@Inject(QUESTIONNAIRE_REPOSITORY) private readonly repo: QuestionnaireRepository) {}

    createDraft(title: string) {
        return this.repo.saveQuestionnaire({ title, status: 'draft', version: 1 });
    }

    list(status: QuestionnaireStatus | undefined, page: number, pageSize: number) {
        return this.repo.findMany({ status, page, pageSize });
    }

    async getById(id: string) {
        const questionnaire = await this.repo.findWithQuestions(id);
        if (!questionnaire) throw new NotFoundException(`Questionnaire ${id} not found`);
        return questionnaire;
    }

    async upsertQuestions(questionnaireId: string, questions: readonly Record<string, unknown>[]) {
        await this.getById(questionnaireId);
        return this.repo.saveQuestions(questions.map((q) => ({ ...q, questionnaireId })));
    }

    async setBranching(questionnaireId: string, questionId: string, visibleWhen: unknown) {
        await this.getById(questionnaireId);
        return this.repo.updateQuestionBranching(questionId, visibleWhen);
    }

    async publish(id: string) {
        const questionnaire = await this.getById(id);
        const engineQuestions = toEngineQuestions(questionnaire);

        const graphResult = validateQuestionnaireGraph(engineQuestions);
        if (!graphResult.ok) {
        throw new BadRequestException({
            message: 'Questionnaire graph is invalid',
            errors: graphResult.errors,
        });
        }

        const nextVersion = questionnaire.version + 1;
        const snapshot = { version: nextVersion, questions: engineQuestions };
        await this.repo.updateStatusAndSnapshot(id, 'published', snapshot, nextVersion);
        return { id, version: nextVersion, status: 'published' as const };
    }

    async archive(id: string) {
        await this.getById(id);
        await this.repo.updateStatus(id, 'archived');
        return { id, status: 'archived' as const };
    }

    async listSubmissions(questionnaireId: string, page: number, pageSize: number) {
        await this.getById(questionnaireId);
        const [items, total] = await this.repo.findSubmissions(questionnaireId, page, pageSize);
        return { items, total, page, pageSize };
    }
}