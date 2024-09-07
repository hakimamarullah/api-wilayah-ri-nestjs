import { Test, TestingModule } from '@nestjs/testing';
import { AuthClientConfigService } from './auth-client-config.service';

describe('AuthClientConfigService', () => {
  let service: AuthClientConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthClientConfigService],
    }).compile();

    service = module.get<AuthClientConfigService>(AuthClientConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
