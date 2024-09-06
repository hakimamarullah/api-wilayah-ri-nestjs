import { Module } from '@nestjs/common';
import { ApiThrottlerGuardService } from './api-throttler-guard.service';
import { ThrottlerModule } from '@nestjs/throttler';
import { HttpClientService } from '../http-client/http-client.service';

@Module({
  providers: [ApiThrottlerGuardService, HttpClientService],
  exports: [ApiThrottlerGuardService],
  imports: [ThrottlerModule.forRoot()],
})
export class ApiThrottlerGuardModule {}
