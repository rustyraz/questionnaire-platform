import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('survey_submissions')
export class SurveySubmissionEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'uuid' })
    questionnaireId!: string;

    @Column({ type: 'int' })
    questionnaireVersion!: number;

    @Column({ type: 'jsonb' })
    answers!: Record<string, unknown>;

    @Column({ type: 'jsonb', nullable: true })
    metadata!: Record<string, unknown> | null;

    @CreateDateColumn()
    createdAt!: Date;
}