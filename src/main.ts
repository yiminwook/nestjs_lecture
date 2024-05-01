import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // '/api' 경로로 들어오는 요청에 대한 전역 접두사 설정
  app.setGlobalPrefix('api');

  await app.listen(3000);
}
bootstrap();
