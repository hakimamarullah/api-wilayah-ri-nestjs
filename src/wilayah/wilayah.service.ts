import { HttpStatus, Injectable } from '@nestjs/common';
import { ProvinsiDto } from './dto/provinsi.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prismadb/prisma.service';
import { ApiResponse } from '../dto/apiResponse.dto';
import { translatePrismaError } from '../utils/common.util';
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
      response = translatePrismaError(e, 'Gagal menambahkan provinsi');
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
    response.responseData = provinces?.map((item) => {
      const provinceResponse = new ProvinsiResponse();
      provinceResponse.id = item.id;
      provinceResponse.nama = item.name;
      provinceResponse.jumlahKabupaten = (item as any)._count.Kabupaten;
      provinceResponse.createdAt = item.createdAt;
      provinceResponse.updatedAt = item.updatedAt;
      return provinceResponse;
    });
    return response;
  }

  async getProvinsiDetailsById(provinceId: number): Promise<ApiResponse> {
    const response: ApiResponse = ApiResponse.getSuccessResponse();
    response.responseData = await this.prismaService.provinsi.findFirst({
      where: {
        id: provinceId,
      },
      include: {
        Kabupaten: {
          include: {
            Kecamatan: {
              include: {
                Kelurahan: true,
              },
            },
          },
        },
      },
    });
    return response;
  }

  async deleteProvinsiById(provinceId: number): Promise<ApiResponse> {
    const response: ApiResponse = ApiResponse.getSuccessResponse();
    response.responseData = await this.prismaService.provinsi.delete({
      where: {
        id: provinceId,
      },
    });
    return response;
  }

  async deleteBatchProvinsiById(provinceIds: number[]): Promise<ApiResponse> {
    const response: ApiResponse = ApiResponse.getSuccessResponse();
    response.responseData = await this.prismaService.provinsi.deleteMany({
      where: {
        id: {
          in: provinceIds,
        },
      },
    });
    return response;
  }
}
