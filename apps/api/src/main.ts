import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';

const bootstrap = async (): Promise<void> => {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
    const port = Number(process.env.PORT ?? 3000);
    await app.listen(port);
    console.log(`api listening on ${port}`);
};

bootstrap();
