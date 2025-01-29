import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation pipes for DTO validation
  app.useGlobalPipes(new ValidationPipe());

  // Enable CORS for frontend communication
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
