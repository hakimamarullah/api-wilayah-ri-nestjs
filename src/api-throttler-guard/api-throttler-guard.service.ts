import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  ThrottlerException,
  ThrottlerGuard,
  ThrottlerRequest,
} from '@nestjs/throttler';
import { Request } from 'express';
import { PrismaService } from '../prismadb/prisma.service';
import { CachingService } from '../caching/caching.service';
import { CacheConstant } from '../caching/cache.constant';

@Injectable()
export class ApiThrottlerGuardService extends ThrottlerGuard {
  private readonly logger: Logger = new Logger(ApiThrottlerGuardService.name);
  @Inject(PrismaService)
  private prismaService: PrismaService;

  @Inject(CachingService)
  private cachingService: CachingService;

  async handleRequest(requestProps: ThrottlerRequest): Promise<boolean> {
    let hitCount;
    try {
      const { context, limit, ttl, throttler } = requestProps;
      const request = context.switchToHttp().getRequest<Request>();
      const apiKey = await this.validateApiKey(request.get('x-api-key'));

      if (throttler.name && apiKey?.tier?.name === throttler.name) {
        const key = this.generateKey(context, <string>apiKey, throttler.name);
        const { totalHits } = await this.storageService.increment(
          key,
          ttl,
          limit,
          <number>throttler.blockDuration,
          throttler.name,
        );
        hitCount = totalHits;
      }
    } catch (error) {
      if (error instanceof ThrottlerException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.FORBIDDEN);
    }
    if (hitCount && hitCount > requestProps.limit) {
      throw new ThrottlerException();
    }

    return true;
  }

  protected async validateApiKey(apiKey?: string) {
    if (!apiKey) {
      throw new Error('Missing API Key');
    }
    const getApiKeyDb = async () => {
      return this.prismaService.apiKey.findFirstOrThrow({
        where: {
          apiKey: {
            equals: apiKey,
          },
        },
        include: {
          tier: true,
        },
      });
    };

    return await this.cachingService.getDataOrThrow(
      `${CacheConstant.CacheKey.API_KEY}-${apiKey}`,
      getApiKeyDb,
    );
  }
}
