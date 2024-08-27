import { HttpStatus, Injectable } from '@nestjs/common';
import { ProvinsiDto } from './dto/provinsi.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prismadb/prisma.service';
import { ApiResponse } from '../dto/apiResponse.dto';
import { getErrorResponse } from '../utils/common.util';
import { ProvinsiResponse } from './dto/response/provinsi.response';

@Injectable()
export class WilayahService {
  constructor(private prismaService: PrismaService) {}

  async createBatchProvinsi(provinsiDtos: ProvinsiDto[]): Promise<ApiResponse> {
    const provinces = provinsiDtos.map((item) => {
      const provinsi: Prisma.ProvinsiCreateInput = {
        name: item.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return provinsi;
    });

    let response: ApiResponse = new ApiResponse();
    response.responseCode = HttpStatus.CREATED;
    response.responseMessage = 'Provinces created';

    try {
      response.responseData =
        await this.prismaService.provinsi.createManyAndReturn({
          data: provinces,
        });
    } catch (e: any) {
      response = getErrorResponse(e, 'Gagal menambahkan provinsi');
    }

    return response;
  }

  async getAllProvinsi(): Promise<ApiResponse> {
    const response: ApiResponse = new ApiResponse();
    response.responseCode = HttpStatus.OK;
    response.responseMessage = 'Success';
    const provinces = await this.prismaService.provinsi.findMany({
      include: {
        _count: {
          select: {
            Kabupaten: true, // Count the related kabupatens
          },
        },
      },
    });
    response.responseData = provinces.map((item) => {
      const provinceResponse = new ProvinsiResponse();
      provinceResponse.id = item.id;
      provinceResponse.nama = item.name;
      provinceResponse.jumlahKabupaten = item._count.Kabupaten;
      return provinceResponse;
    });
    return response;
  }
}
