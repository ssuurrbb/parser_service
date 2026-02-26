import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Глобальная валидация (если ещё нет)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Swagger настройка
  const config = new DocumentBuilder()
    .setTitle('MFO Parser Service')
    .setDescription('API для парсинга данных МФО с vsezaimyonline.ru')
    .setVersion('1.0')
    .addTag('mfo', 'Парсинг и получение данных МФО')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customCss: '.swagger-ui .topbar { display: none }', // убирает верхнюю панель, если хочешь
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT || 3000);
  console.log(`Application is running on: http://localhost:${process.env.PORT || 3000}`);
  console.log(`Swagger: http://localhost:${process.env.PORT || 3000}/api`);
}

bootstrap();