import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { QuestionEntity } from './question.entity.js';
export type QuestionnaireStatus = 'draft' | 'published' | 'archived';

@Entity('questionnaires')
export class QuestionnaireEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar' })
    title!: string;

    @Column({ type: 'varchar', default: 'draft' })
    status!: string;

    @Column({ type: 'int', default: 1 })
    version!: number;

    @Column({ type: 'jsonb', nullable: true })
    publishedSchema!: unknown | null;

    @OneToMany(() => QuestionEntity, (question) => question.questionnaire)
    questions!: QuestionEntity[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}