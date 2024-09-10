import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import {
  ThrottlerException,
  ThrottlerGuard,
  ThrottlerRequest,
} from '@nestjs/throttler';
import { Request } from 'express';
import { AppPropertiesService } from '../app-properties/app-properties.service';
import { BaseResponse } from '@hakimamarullah/commonbundle-nestjs';
import { NO_THROTTLE } from './decorators/noThrottler.decorator';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class ApiThrottlerGuardService
  extends ThrottlerGuard
  implements OnModuleInit
{
  private readonly logger: Logger = new Logger(ApiThrottlerGuardService.name);

  @Inject(AppPropertiesService)
  private appProperties: AppPropertiesService;

  private httpClient: AxiosInstance;

  async handleRequest(requestProps: ThrottlerRequest): Promise<boolean> {
    let hitCount;
    try {
      const { context, limit, ttl, throttler } = requestProps;
      const request = context.switchToHttp().getRequest<Request>();

      const noThrottle = this.reflector.getAllAndOverride<boolean>(
        NO_THROTTLE,
        [context.getHandler(), context.getClass()],
      );

      if (this.shouldIgnore(request.url) || noThrottle) {
        return true;
      }
      const apiKey = request.get('x-api-key');
      const { data } = await this.httpClient.get<BaseResponse<any>>(
        `${this.appProperties.getApiKeyServiceBaseUrl()}/api-key-manager/validate/${apiKey}`,
      );
      const { responseData } = data;

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

  async onModuleInit(): Promise<void> {
    this.httpClient = axios.create({
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${this.appProperties.getAuthServiceToken()}`,
      },
    });
  }
}
