import { Injectable, Logger } from '@nestjs/common';
import {
  ThrottlerModuleOptions,
  ThrottlerOptionsFactory,
} from '@nestjs/throttler';
import * as process from 'process';
import { AppPropertiesService } from '../app-properties/app-properties.service';
import {
  HttpClientBase,
  HttpMethod,
} from '@hakimamarullah/commonbundle-nestjs';

@Injectable()
export class RateLimitingService
  extends HttpClientBase
  implements ThrottlerOptionsFactory
{
  constructor(private appProperties: AppPropertiesService) {
    super();
    this.logger = new Logger(RateLimitingService.name);
    this.initConfig({
      enableLogger: true,
      options: {
        baseURL: this.appProperties.getApiKeyServiceBaseUrl(),
        headers: {
          Authorization: `Bearer ${this.appProperties.getAuthServiceToken()}`,
        },
      },
    });
  }

  async loadRateLimiting() {
    const { responseData } = await this.handleRequest(
      HttpMethod.GET,
      `/api-key-manager/tiers`,
    );
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
