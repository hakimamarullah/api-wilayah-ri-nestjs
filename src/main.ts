import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ErrorFilter } from './common/exceptions/error.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const logger: Logger = new Logger('ApiWilayahRiApp');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const server = app.getHttpServer();

  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new ErrorFilter());
  app.useGlobalPipes(new ValidationPipe());
  const configService: ConfigService = app.get<ConfigService>(
    ConfigService,
  ) as ConfigService;

  // Http Timeout
  server.requestTimeout = configService.get<number>(
    'SERVER_REQUEST_TIMEOUT',
    4000,
  );
  server.timeout = configService.get<number>('SERVER_TIMEOUT', 4000);
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
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/swagger', app, document, {
    jsonDocumentUrl: 'swagger/json',
  });
  app.listen(port).then(() => logger.log(`Server started on port ${port}`));
}

bootstrap();
