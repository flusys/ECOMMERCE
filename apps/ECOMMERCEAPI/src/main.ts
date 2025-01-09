/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:8100','http://localhost:8200'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
  });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const port = process.env.PORT || 8000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
