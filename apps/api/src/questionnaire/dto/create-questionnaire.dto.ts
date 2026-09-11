import { IsString, MinLength } from "class-validator";

export class CreateQuestionnaireDto {
    @IsString()
    @MinLength(1)
    title!: string;
}