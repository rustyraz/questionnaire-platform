import { IsObject } from "class-validator";

export class SetBranchingDto {
    @IsObject()
    visibleWhen!: Record<string, unknown>;
}