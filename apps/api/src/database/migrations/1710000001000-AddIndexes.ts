import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndexes1710000001000 implements MigrationInterface {
  name = 'AddIndexes1710000001000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE INDEX "idx_submissions_answers_gin"
      ON "survey_submissions" USING GIN ("answers");
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_submissions_questionnaire_created"
      ON "survey_submissions" ("questionnaireId", "createdAt");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "idx_submissions_questionnaire_created";`);
    await queryRunner.query(`DROP INDEX "idx_submissions_answers_gin";`);
  }
}