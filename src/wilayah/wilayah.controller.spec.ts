import { Test, TestingModule } from '@nestjs/testing';
import { WilayahController } from './wilayah.controller';

describe('WilayahController', () => {
  let controller: WilayahController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WilayahController],
    }).compile();

    controller = module.get<WilayahController>(WilayahController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
