import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ErrorFilter } from './common/exceptions/error.filter';

async function bootstrap() {
  const logger: Logger = new Logger('ApiWilayahRiApp');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new ErrorFilter());
  const configService: ConfigService = app.get<ConfigService>(
    ConfigService,
  ) as ConfigService;

  const port: number = configService.get('SERVER_PORT', 3000);
  app.listen(port).then(() => logger.log(`Server started on port ${port}`));
}

bootstrap();
