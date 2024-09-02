import { Module } from '@nestjs/common';
import { ApiKeyUtilityService } from './api-key-utility.service';
import { ApiKeyUtilityController } from './api-key-utility.controller';
import { PrismaService } from '../prismadb/prisma.service';
import { CachingService } from '../caching/caching.service';

@Module({
  providers: [ApiKeyUtilityService, PrismaService, CachingService],
  controllers: [ApiKeyUtilityController],
  exports: [ApiKeyUtilityService],
})
export class ApiKeyUtilityModule {}
