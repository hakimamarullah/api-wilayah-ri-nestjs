import { Module } from '@nestjs/common';
import { ApiThrottlerGuardService } from './api-throttler-guard.service';
import { ThrottlerModule } from '@nestjs/throttler';
import { ApiKeyUtilityModule } from '../api-key-utility/api-key-utility.module';
import { ApiKeyUtilityService } from '../api-key-utility/api-key-utility.service';

@Module({
  providers: [ApiThrottlerGuardService, ApiKeyUtilityService],
  exports: [ApiThrottlerGuardService],
  imports: [ThrottlerModule.forRoot(), ApiKeyUtilityModule],
})
export class ApiThrottlerGuardModule {}
