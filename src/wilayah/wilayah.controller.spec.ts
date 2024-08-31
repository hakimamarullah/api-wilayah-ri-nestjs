import { Test, TestingModule } from '@nestjs/testing';
import { WilayahController } from './wilayah.controller';
import { WilayahService } from './wilayah.service';
import { ProvinsiDto } from './dto/provinsi.dto';
import { BaseResponse } from '../dto/baseResponse.dto';
import { HttpStatus } from '@nestjs/common';

describe('WilayahController', () => {
  let controller: WilayahController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WilayahController],
      providers: [
        {
          provide: WilayahService,
          useValue: mockWilayahService,
        },
      ],
    }).compile();

    controller = module.get<WilayahController>(
      WilayahController,
    ) as WilayahController;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create provinsi in batch successfully', async () => {
    const provinsiDto: ProvinsiDto = new ProvinsiDto();
    provinsiDto.name = 'Aceh';
    const response = await controller.createProvinsi([provinsiDto]);
    expect(response.responseData).toEqual([provinsiDto]);
    expect(response.responseMessage).toEqual('Success');
    expect(response.responseCode).toEqual(HttpStatus.OK);
  });
});

const mockWilayahService = {
  createBatchProvinsi: jest
    .fn()
    .mockImplementation((provinsiDto: ProvinsiDto[]) => {
      return BaseResponse.getSuccessResponse<ProvinsiDto[]>(provinsiDto);
    }),
  getAllProvinsi: jest.fn().mockImplementation((name) => {
    return name;
  }),
  getDetailsProvinsiById: jest.fn().mockImplementation((id) => {
    return id;
  }),
  deleteProvinsiById: jest.fn().mockImplementation((id) => {
    return id;
  }),
  deleteBatchProvinsi: jest.fn().mockImplementation((provinsiIds) => {
    return provinsiIds;
  }),
};
