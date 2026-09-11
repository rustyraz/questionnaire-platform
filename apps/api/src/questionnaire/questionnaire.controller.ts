import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CreateQuestionnaireDto } from './dto/create-questionnaire.dto.js';
import { ListQuestionnairesQueryDto } from './dto/list-questionnaires.dto.js';
import { SetBranchingDto } from './dto/set-branching.dto.js';
import { UpsertQuestionsDto } from './dto/upsert-question.dto.js';
import { QuestionnaireService } from './questionnaire.service.js';

@Controller('admin/questionnaires')
@UseGuards(JwtAuthGuard)
export class QuestionnaireController {
  constructor(private readonly service: QuestionnaireService) {}

  @Post()
  create(@Body() dto: CreateQuestionnaireDto) {
    return this.service.createDraft(dto.title);
  }

  @Get()
  list(@Query() query: ListQuestionnairesQueryDto) {
    return this.service.list(query.status, query.page, query.pageSize);
  }

  @Get(':id')
  getOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.getById(id);
  }

  @Put(':id/questions')
  upsertQuestions(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: UpsertQuestionsDto) {
    return this.service.upsertQuestions(id, dto.questions as unknown as Record<string, unknown>[]);
  }

  @Put(':id/questions/:questionId/branching')
  setBranching(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('questionId', new ParseUUIDPipe()) questionId: string,
    @Body() dto: SetBranchingDto,
  ) {
    return this.service.setBranching(id, questionId, dto.visibleWhen);
  }

  @Post(':id/publish')
  publish(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.publish(id);
  }

  @Post(':id/archive')
  archive(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.archive(id);
  }

  @Get(':id/submissions')
  submissions(@Param('id', new ParseUUIDPipe()) id: string, @Query() query: ListQuestionnairesQueryDto) {
    return this.service.listSubmissions(id, query.page, query.pageSize);
  }
}