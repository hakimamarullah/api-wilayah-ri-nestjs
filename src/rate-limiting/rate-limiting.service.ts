import { Injectable, Logger } from '@nestjs/common';
import {
  ThrottlerModuleOptions,
  ThrottlerOptionsFactory,
} from '@nestjs/throttler';
import * as process from 'process';
import { HttpClientService } from '../http-client/http-client.service';
import { BaseResponse } from '../dto/baseResponse.dto';
import { AppPropertiesService } from '../app-properties/app-properties.service';

@Injectable()
export class RateLimitingService implements ThrottlerOptionsFactory {
  private readonly logger: Logger = new Logger(RateLimitingService.name);
  constructor(
    private httpClientService: HttpClientService,
    private appProperties: AppPropertiesService,
  ) {}

  async loadRateLimiting() {
    const { responseData } = await this.httpClientService.get<
      BaseResponse<any>
    >(`${this.appProperties.getApiKeyServiceBaseUrl()}/api-key-manager/tiers`);

    if (!responseData?.length) {
      this.logger.fatal(
        'Rate limiting not configured. Should at least provide 1 rate limiting configuration',
      );
      process.exit(1);
    }
    return responseData.map((item: any) => ({
      ttl: item.ttl,
      limit: item.limit,
      name: item.name,
    })) as ThrottlerModuleOptions;
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
