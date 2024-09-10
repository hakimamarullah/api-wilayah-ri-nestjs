import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import {
  ErrorFilter,
  LoggingInterceptor,
} from '@hakimamarullah/commonbundle-nestjs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get<ConfigService>(ConfigService);
  const logger: Logger = new Logger(
    configService.get('APP_NAME', 'API-Wilayah-RI'),
  );

  const server = app.getHttpServer();

  app.setGlobalPrefix(configService.get<string>('PREFIX_PROXY', ''));
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new ErrorFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  // Http Timeout
  server.requestTimeout = configService.get<number>(
    'SERVER_REQUEST_TIMEOUT',
    4000,
  );
  server.keepAliveTimeout = configService.get<number>(
    'SERVER_KEEP_ALIVE_TIMEOUT',
    10000,
  );

  const port: number = configService.get('SERVER_PORT', 3000);
  const config = new DocumentBuilder()
    .setTitle(configService.get<string>('SWAGGER_TITLE', 'API Wilayah RI'))
    .setDescription(
      configService.get<string>('SWAGGER_DESCRIPTION', 'API Wilayah RI'),
    )
    .setVersion(configService.get<string>('APP_VERSION', '1.0'))
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/swagger', app, document, {
    jsonDocumentUrl: 'swagger/json',
    useGlobalPrefix: true,
  });
  app.listen(port).then(() => logger.log(`Server started on port ${port}`));
}

(async () => await bootstrap())();
