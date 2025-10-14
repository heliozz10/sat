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
  
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
