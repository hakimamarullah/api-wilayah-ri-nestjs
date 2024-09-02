import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prismadb/prisma.service';
import {
  ThrottlerModuleOptions,
  ThrottlerOptionsFactory,
} from '@nestjs/throttler';
import * as process from 'process';

@Injectable()
export class RateLimitingService implements ThrottlerOptionsFactory {
  private readonly logger: Logger = new Logger(RateLimitingService.name);
  constructor(readonly prismaService: PrismaService) {}

  async loadRateLimiting() {
    const resultDb = (await this.prismaService.apiKeyTier.findMany()) || [];
    const rateLimitingConfig = resultDb.map((item) => ({
      ttl: item.ttl,
      limit: item.limit,
      name: item.name,
    })) as ThrottlerModuleOptions;

    if (!resultDb?.length) {
      this.logger.fatal(
        'Rate limiting not configured. Should at least provide 1 rate limiting configuration',
      );
      process.exit(1);
    }

    return rateLimitingConfig;
  }

  /**
   * Creates the throttler module options
   */
  createThrottlerOptions():
    | Promise<ThrottlerModuleOptions>
    | ThrottlerModuleOptions {
    return this.loadRateLimiting();
  }
}
