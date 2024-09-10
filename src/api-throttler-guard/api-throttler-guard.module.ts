import { Module } from '@nestjs/common';
import { ApiThrottlerGuardService } from './api-throttler-guard.service';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  providers: [ApiThrottlerGuardService],
  exports: [ApiThrottlerGuardService],
  imports: [ThrottlerModule.forRoot()],
})
export class ApiThrottlerGuardModule {}
