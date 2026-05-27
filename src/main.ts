import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ClassTransformerInterceptor } from './interceptor/class-transformer.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }));

  app.useGlobalInterceptors(new ClassTransformerInterceptor());

  app.enableShutdownHooks();

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
  });
  
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
