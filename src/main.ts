import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { BaseExceptionFilter } from './exceptionFilters/BaseExceptionFilter';
import { BaseTransformInterceptor } from './interceptor/baseInterceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new BaseExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new BaseTransformInterceptor());
  await app.listen(3200);
}

bootstrap().then(() => console.log('this server is running at http://localhost:3200'));
