import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppFilter } from './app.filter';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';
import { urlencoded, json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);

  // class validator dto 전역설정
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 요청 데이터가 없을때 초기값으로 변환
      transformOptions: {
        enableImplicitConversion: true, // 요청데이터 타입변경
      },
      whitelist: true, // 요청 데이터에 없는 속성은 제거
      forbidNonWhitelisted: true, // 요청 데이터에 없는 속성이 있을시 에러
    }),
  );

  // '/api' 경로로 들어오는 요청에 대한 전역 접두사 설정
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new AppFilter(httpAdapter), new HttpExceptionFilter());

  app.use(json({ limit: '500mb' }));
  app.use(urlencoded({ extended: true, limit: '500mb' }));

  // cors 허용
  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  await app.listen(8080);
}
bootstrap();
