import { Test, TestingModule } from '@nestjs/testing';
import { ApiKeyUtilityService } from './api-key-utility.service';

describe('ApiKeyUtilityService', () => {
  let service: ApiKeyUtilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiKeyUtilityService],
    }).compile();

    service = module.get<ApiKeyUtilityService>(ApiKeyUtilityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
