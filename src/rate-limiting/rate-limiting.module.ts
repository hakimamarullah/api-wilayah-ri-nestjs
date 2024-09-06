import { Module } from '@nestjs/common';
import { RateLimitingService } from './rate-limiting.service';
import { HttpClientService } from '../http-client/http-client.service';

@Module({
  providers: [RateLimitingService, HttpClientService],
  exports: [RateLimitingService],
})
export class RateLimitingModule {}
