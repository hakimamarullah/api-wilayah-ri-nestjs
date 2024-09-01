import { Test, TestingModule } from '@nestjs/testing';
import { ApiThrottlerGuardService } from './api-throttler-guard.service';

describe('ApiThrottlerGuardService', () => {
  let service: ApiThrottlerGuardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiThrottlerGuardService],
    }).compile();

    service = module.get<ApiThrottlerGuardService>(
      ApiThrottlerGuardService,
    ) as ApiThrottlerGuardService;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
