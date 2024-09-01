import { Module } from '@nestjs/common';
import { RateLimitingService } from './rate-limiting.service';
import { PrismaService } from '../prismadb/prisma.service';

@Module({
  providers: [RateLimitingService, PrismaService],
  exports: [RateLimitingService],
})
export class RateLimitingModule {}
