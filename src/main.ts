import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppFilter } from './app.filter';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);

  // class validator dto 전역설정
  app.useGlobalPipes(new ValidationPipe());

  // '/api' 경로로 들어오는 요청에 대한 전역 접두사 설정
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new AppFilter(httpAdapter), new HttpExceptionFilter());

  await app.listen(3000);
}
bootstrap();
