import { Type } from "class-transformer";
import { IsIn, IsInt, IsOptional, Min } from "class-validator";

export class ListQuestionnairesQueryDto {
    @IsOptional()
    @IsIn(['draft', 'published', 'archived'])
    status?: 'draft' | 'published' | 'archived';

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    pageSize: number = 20;
}