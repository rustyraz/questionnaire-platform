import { Module } from "@nestjs/common";
import { ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from "./database/database.module.js";
import { AuthModule } from "./auth/aut.module.js";
import { QuestionnaireModule } from "./questionnaire/questionnaire.module.js";

@Module({
    imports: [
        ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
        DatabaseModule,
        AuthModule,
        QuestionnaireModule,
    ],
})
export class AppModule {}