import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppPropertiesService {
  constructor(private configService: ConfigService) {}

  public getApiKeyServiceBaseUrl(): string {
    return this.configService.get<string>(
      'API_KEY_MANAGER_BASE_URL',
      'http://localhost:3001',
    );
  }

  public getApiKeyServiceTimeout(): number {
    return this.configService.get<number>(
      'API_KEY_MANAGER_HTTP_CLIENT_TIMEOUT',
      5000,
    );
  }

  public getApiKeyServiceBearerToken(): string {
    return this.configService.get<string>('AUTH_BEARER_TOKEN', '');
  }

  public getAuthServiceBaseUrl() {
    return this.configService.get('AUTH_BASE_URL', 'http://localhost:3001');
  }
  public getAuthServiceToken() {
    return this.configService.get('AUTH_BEARER_TOKEN', 'token');
  }

  public getAuthServiceHttpTimeout() {
    return this.configService.get<number>('AUTH_SERVICE_HTTP_TIMEOUT', 10000);
  }
}
