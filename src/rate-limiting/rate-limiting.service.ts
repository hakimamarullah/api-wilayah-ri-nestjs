import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prismadb/prisma.service';
import { ThrottlerModuleOptions } from '@nestjs/throttler';

@Injectable()
export class RateLimitingService {
  constructor(readonly prismaService: PrismaService) {}

  async loadRateLimiting() {
    const resultDb = (await this.prismaService.apiKeyTier.findMany()) || [];
    return resultDb.map((item) => ({
      ttl: item.ttl,
      limit: item.limit,
      name: item.name,
    })) as ThrottlerModuleOptions;
  }
}
