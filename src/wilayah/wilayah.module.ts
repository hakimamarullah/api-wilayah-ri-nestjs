import { Module } from '@nestjs/common';
import { WilayahService } from './wilayah.service';
import { WilayahController } from './wilayah.controller';
import { PrismadbModule } from '../prismadb/prismadb.module';
import { APP_GUARD } from '@nestjs/core';
import { ApiThrottlerGuardService } from '../api-throttler-guard/api-throttler-guard.service';
import { RateLimitingService } from '../rate-limiting/rate-limiting.service';
import { AppPropertiesService } from '../app-properties/app-properties.service';
import {
  CachingModule,
  CachingService,
} from '@hakimamarullah/commonbundle-nestjs';

@Module({
  providers: [
    WilayahService,
    AppPropertiesService,
    RateLimitingService,
    CachingService,
    {
      provide: APP_GUARD,
      useClass: ApiThrottlerGuardService,
    },
  ],
  imports: [PrismadbModule, CachingModule],
  controllers: [WilayahController],
  exports: [WilayahService],
})
export class WilayahModule {}
