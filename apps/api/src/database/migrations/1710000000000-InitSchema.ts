import type { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1710000000000 implements MigrationInterface {
  name = 'InitSchema1710000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "questionnaires" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "title" varchar NOT NULL,
        "status" varchar NOT NULL DEFAULT 'draft',
        "version" int NOT NULL DEFAULT 1,
        "publishedSchema" jsonb,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "questions" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "questionnaireId" uuid NOT NULL REFERENCES "questionnaires"("id") ON DELETE CASCADE,
        "key" varchar NOT NULL,
        "label" varchar NOT NULL,
        "type" varchar NOT NULL,
        "order" int NOT NULL,
        "options" jsonb,
        "validation" jsonb,
        "visibleWhen" jsonb
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "survey_submissions" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "questionnaireId" uuid NOT NULL,
        "questionnaireVersion" int NOT NULL,
        "answers" jsonb NOT NULL,
        "metadata" jsonb,
        "createdAt" timestamptz NOT NULL DEFAULT now()
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "survey_submissions";`);
    await queryRunner.query(`DROP TABLE "questions";`);
    await queryRunner.query(`DROP TABLE "questionnaires";`);
  }
}