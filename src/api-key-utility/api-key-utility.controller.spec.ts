import { Test, TestingModule } from '@nestjs/testing';
import { ApiKeyUtilityController } from './api-key-utility.controller';

describe('ApiKeyUtilityController', () => {
  let controller: ApiKeyUtilityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiKeyUtilityController],
    }).compile();

    controller = module.get<ApiKeyUtilityController>(ApiKeyUtilityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
