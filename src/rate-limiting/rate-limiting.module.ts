import { Module } from '@nestjs/common';
import { RateLimitingService } from './rate-limiting.service';
import { AppPropertiesService } from '../app-properties/app-properties.service';

@Module({
  providers: [RateLimitingService, AppPropertiesService],
  exports: [RateLimitingService],
})
export class RateLimitingModule {}
