import { Module } from '@nestjs/common';
import { WilayahService } from './wilayah.service';
import { WilayahController } from './wilayah.controller';
import { PrismadbModule } from '../prismadb/prismadb.module';
import { CachingModule } from '../caching/caching.module';
import { APP_GUARD } from '@nestjs/core';
import { ApiThrottlerGuardService } from '../api-throttler-guard/api-throttler-guard.service';
import { RateLimitingService } from '../rate-limiting/rate-limiting.service';

@Module({
  providers: [
    WilayahService,
    RateLimitingService,
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
