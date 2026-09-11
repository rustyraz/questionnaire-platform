import { Type } from 'class-transformer';
import { IsArray, IsIn, IsInt, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";


const QUESTION_TYPES = ['text', 'number', 'boolean', 'select', 'date'] as const;

export class UpsertQuestionDto {
    @IsOptional()
    @IsString()
    id?: string;

    @IsString()
    key!: string;

    @IsString()
    label!: string;

    @IsIn(QUESTION_TYPES)
    type!: (typeof QUESTION_TYPES)[number];

    @IsInt()
    order!: number;

    @IsOptional()
    options?: Record<string, unknown>;

    @IsOptional()
    @IsObject()
    validation?: Record<string, unknown>;

    @IsOptional()
    @IsObject()
    visibleWhen?: Record<string, unknown>;
}

export class UpsertQuestionsDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpsertQuestionDto)
    questions!: UpsertQuestionDto[];
}