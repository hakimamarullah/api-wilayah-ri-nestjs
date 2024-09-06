import { Module } from '@nestjs/common';
import { WilayahService } from './wilayah.service';
import { WilayahController } from './wilayah.controller';
import { PrismadbModule } from '../prismadb/prismadb.module';
import { CachingModule } from '../caching/caching.module';
import { APP_GUARD } from '@nestjs/core';
import { ApiThrottlerGuardService } from '../api-throttler-guard/api-throttler-guard.service';
import { RateLimitingService } from '../rate-limiting/rate-limiting.service';
import { HttpClientService } from '../http-client/http-client.service';
import { HttpModule } from '@nestjs/axios';
import { AppPropertiesModule } from '../app-properties/app-properties.module';
import { HttpConfigService } from '../http-client/http-config.service';
import { AppPropertiesService } from '../app-properties/app-properties.service';

@Module({
  providers: [
    WilayahService,
    HttpClientService,
    AppPropertiesService,
    RateLimitingService,
    {
      provide: APP_GUARD,
      useClass: ApiThrottlerGuardService,
    },
  ],
  imports: [
    PrismadbModule,
    CachingModule,
    HttpModule.registerAsync({
      imports: [AppPropertiesModule],
      useClass: HttpConfigService,
      inject: [AppPropertiesService],
    }),
  ],
  controllers: [WilayahController],
  exports: [WilayahService],
})
export class WilayahModule {}
