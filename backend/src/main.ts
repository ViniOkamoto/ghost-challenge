import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { RequestLoggingInterceptor } from './common/interceptors/request.logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Apply global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Apply global logging interceptor
  app.useGlobalInterceptors(new RequestLoggingInterceptor());

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('GhostPay API')
    .setDescription('Payment processing API for GhostPay checkout flow')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3333);
}

bootstrap();
