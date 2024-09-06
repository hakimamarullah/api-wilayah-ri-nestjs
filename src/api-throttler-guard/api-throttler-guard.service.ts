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
import { HttpClientService } from '../http-client/http-client.service';
import { BaseResponse } from '../dto/baseResponse.dto';

@Injectable()
export class ApiThrottlerGuardService extends ThrottlerGuard {
  private readonly logger: Logger = new Logger(ApiThrottlerGuardService.name);

  @Inject(HttpClientService)
  private httpClient: HttpClientService;

  async handleRequest(requestProps: ThrottlerRequest): Promise<boolean> {
    let hitCount;
    try {
      const { context, limit, ttl, throttler } = requestProps;
      const request = context.switchToHttp().getRequest<Request>();
      if (this.shouldIgnore(request.url)) {
        return true;
      }
      const apiKey = request.get('x-api-key');
      const { responseData } = await this.httpClient.get<BaseResponse<any>>(
        `/api-key-manager/validate${apiKey}`,
      );

      if (throttler.name && responseData?.tier?.name === throttler.name) {
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

  shouldIgnore(url: string) {
    const ignoredPathPatterns: RegExp[] = this.mapToRegex(['^/api/api-keys/*']);
    return ignoredPathPatterns.some((pattern) => pattern.test(url));
  }

  private mapToRegex(paths: string[]): RegExp[] {
    return paths.map((path) => new RegExp(path));
  }
}
