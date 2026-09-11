import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { QuestionnaireEntity } from './questionnaire.entity.js';
export type QuestionnaireStatus = 'draft' | 'published' | 'archived';

@Entity('questions')
export class QuestionEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'uuid' })
    questionnaireId!: string;

    @ManyToOne(() => QuestionnaireEntity, (questionnaire) => questionnaire.questions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'questionnaireId' })
    questionnaire!: QuestionEntity;

    @Column({ type: 'varchar' })
    key!: string;

    @Column({ type: 'varchar' })
    label!: string;

    @Column({ type: 'varchar' })
    type!: string;

    @Column({ type: 'int' })
    order!: number;

    @Column({ type: 'jsonb', nullable: true })
    options!: unknown | null;

    @Column({ type: 'jsonb', nullable: true })
    validation!: unknown | null;

    @Column({ type: 'jsonb', nullable: true })
    visibleWhen!: unknown | null;
}