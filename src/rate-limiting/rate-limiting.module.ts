import { Module } from '@nestjs/common';
import { RateLimitingService } from './rate-limiting.service';
import { HttpClientService } from '../http-client/http-client.service';
import { HttpModule } from '@nestjs/axios';
import { AppPropertiesModule } from '../app-properties/app-properties.module';
import { HttpConfigService } from '../http-client/http-config.service';
import { AppPropertiesService } from '../app-properties/app-properties.service';

@Module({
  providers: [RateLimitingService, HttpClientService, AppPropertiesService],
  imports: [
    HttpModule.registerAsync({
      imports: [AppPropertiesModule],
      useClass: HttpConfigService,
      inject: [AppPropertiesService],
    }),
  ],
  exports: [RateLimitingService],
})
export class RateLimitingModule {}
