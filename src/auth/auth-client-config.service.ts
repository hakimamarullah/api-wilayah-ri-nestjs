import { Injectable } from '@nestjs/common';
import { AppPropertiesService } from '../app-properties/app-properties.service';

import { HttpModuleOptions, HttpModuleOptionsFactory } from '@nestjs/axios';

@Injectable()
export class AuthClientConfigService implements HttpModuleOptionsFactory {
  constructor(private appProperties: AppPropertiesService) {}

  createHttpOptions(): Promise<HttpModuleOptions> | HttpModuleOptions {
    return {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.appProperties.getAuthServiceToken()}`,
      },
      timeout: this.appProperties.getAuthServiceHttpTimeout(),
    };
  }
}
