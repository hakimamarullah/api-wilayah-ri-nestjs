import {
  ExecutionContext,
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
import { NO_THROTTLE } from './decorators/noThrottler.decorator';
import { AppPropertiesService } from '../app-properties/app-properties.service';

import axios, { AxiosInstance } from 'axios';
import { BaseResponse } from '@hakimamarullah/commonbundle-nestjs';

@Injectable()
export class ApiThrottlerGuardService extends ThrottlerGuard {
  private readonly logger: Logger = new Logger(ApiThrottlerGuardService.name);

  @Inject(AppPropertiesService)
  private appProperties: AppPropertiesService;

  private httpClient: AxiosInstance;

  async handleRequest(requestProps: ThrottlerRequest): Promise<boolean> {
    let hitCount;
    try {
      const { context, limit, ttl, throttler } = requestProps;
      const request = context.switchToHttp().getRequest<Request>();
      const apiKey = request.get('x-api-key');

      const responseData = await this.validateApiKey(apiKey);
      if (throttler.name && responseData?.tierName === throttler.name) {
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

  private async validateApiKey(apiKey: string | undefined): Promise<any> {
    if (!apiKey) {
      throw new HttpException('missing api key', HttpStatus.FORBIDDEN);
    }
    const { data } = await this.httpClient.get<BaseResponse<any>>(
      `${this.appProperties.getApiKeyServiceBaseUrl()}/api-key-manager/validate/${apiKey}`,
    );
    const { responseData, responseCode } = data;
    if (responseCode !== 200) {
      throw new HttpException('invalid api key', HttpStatus.FORBIDDEN);
    }

    return responseData;
  }

  onModuleInit(): Promise<void> {
    this.httpClient = axios.create({
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${this.appProperties.getAuthServiceToken()}`,
      },
      validateStatus: () => true,
    });

    return super.onModuleInit();
  }

  protected shouldSkip(_context: ExecutionContext): Promise<boolean> {
    const request = _context.switchToHttp().getRequest<Request>();

    const noThrottle = this.reflector.getAllAndOverride<boolean>(NO_THROTTLE, [
      _context.getHandler(),
      _context.getClass(),
    ]);

    return Promise.resolve(this.shouldIgnore(request.url) || noThrottle);
  }
}
