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
    return this.configService.get<string>('API_KEY_MANAGER_BEARER_TOKEN', '');
  }
}
