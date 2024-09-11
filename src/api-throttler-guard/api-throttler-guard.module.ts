import { Module } from '@nestjs/common';
import { ApiThrottlerGuardService } from './api-throttler-guard.service';

@Module({
  providers: [ApiThrottlerGuardService],
  exports: [ApiThrottlerGuardService],
  imports: [],
})
export class ApiThrottlerGuardModule {}
