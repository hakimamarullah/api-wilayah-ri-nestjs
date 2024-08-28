import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProvinsiDto } from './dto/provinsi.dto';
import { Kabupaten } from '@prisma/client';
import { PrismaService } from '../prismadb/prisma.service';
import { ApiResponse } from '../dto/apiResponse.dto';
import { ProvinsiResponse } from './dto/response/provinsi.response';
import { KabupatenDto } from './dto/kabupaten.dto';
import { KabupatenResponse } from './dto/response/kabupaten.response';
import { KecamatanResponse } from './dto/response/kecamatan.response';
import { KelurahanResponse } from './dto/response/kelurahan.response';
import { KelurahanDto } from './dto/kelurahan.dto';
import { KecamatanDto } from './dto/kecamatan.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CachingService } from '../caching/caching.service';
import { CacheConstant } from '../caching/cache.constant';

@Injectable()
export class WilayahService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private prismaService: PrismaService,
    private cachingService: CachingService,
  ) {}

  async createBatchProvinsi(provinsiDtos: ProvinsiDto[]): Promise<ApiResponse> {
    const response: ApiResponse = ApiResponse.getSuccessResponse();
    response.responseCode = HttpStatus.CREATED;

    response.responseData =
      await this.prismaService.provinsi.createManyAndReturn({
        data: provinsiDtos,
      });
    void this.cachingService.resetProvinsi();
    return response;
  }

  async getAllProvinsi(): Promise<ApiResponse> {
    const response: ApiResponse = ApiResponse.getSuccessResponse();
    const provinces = async () => {
      return this.prismaService.provinsi.findMany({
        include: {
          _count: {
            select: {
              Kabupaten: true, // Count the related kabupatens
            },
          },
        },
      });
    };
    const data = await this.cachingService.getDataOrElseReturn(
      CacheConstant.CacheKey.PROVINSI_ALL,
      provinces,
    );
    response.responseData = data?.map((item: any) => {
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
    const getProvinsi = async () => {
      return this.prismaService.provinsi.findFirst({
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
    };

    const provinsi = await this.cachingService.getDataOrElseReturn(
      `provinsi-${provinceId}`,
      getProvinsi,
    );

    if (!provinsi) {
      throw new NotFoundException('Data tidak ditemukan');
    }

    const provinsiResponse: ProvinsiResponse = new ProvinsiResponse();
    const kabupaten: Kabupaten[] = provinsi.Kabupaten ?? [];

    provinsiResponse.id = provinsi.id;
    provinsiResponse.nama = provinsi.name;
    provinsiResponse.kabupaten = kabupaten.map((item: any) =>
      KabupatenResponse.toResponse(item),
    );
    provinsiResponse.jumlahKabupaten = provinsiResponse.kabupaten.length;
    provinsiResponse.createdAt = provinsi.createdAt;
    provinsiResponse.updatedAt = provinsi.updatedAt;
    response.responseData = provinsiResponse;

    return response;
  }

  async deleteProvinsiById(provinceId: number): Promise<ApiResponse> {
    const response: ApiResponse = ApiResponse.getSuccessResponse();
    response.responseData = await this.prismaService.provinsi.delete({
      where: {
        id: provinceId,
      },
    });
    void this.cachingService.resetProvinsi();
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
    void this.cachingService.resetProvinsi();
    return response;
  }

  async createBatchKabupaten(
    kabupatenDtos: KabupatenDto[],
  ): Promise<ApiResponse> {
    const response: ApiResponse = ApiResponse.getSuccessResponse();
    const dbResult = await this.prismaService.kabupaten.createManyAndReturn({
      data: kabupatenDtos,
    });
    response.responseData = dbResult?.map((item) => {
      const kabupatenResponse = new KabupatenDto();
      kabupatenResponse.id = item.id;
      kabupatenResponse.name = item.name;
      kabupatenResponse.provinsiId = item.provinsiId;
      return kabupatenResponse;
    });
    void this.cachingService.resetKabupaten();
    return response;
  }

  async getKabupatenDetailsById(kabupatenId: number): Promise<ApiResponse> {
    const response: ApiResponse = ApiResponse.getSuccessResponse();
    const getKabupaten = async () => {
      await this.prismaService.kabupaten.findFirst({
        where: {
          id: kabupatenId,
        },
        include: {
          Kecamatan: {
            include: {
              Kelurahan: true,
            },
          },
        },
      });
    };
    const kabupaten = await this.cachingService.getDataOrElseReturn(
      `${CacheConstant.CacheKey.KABUPATEN}-${kabupatenId}`,
      getKabupaten,
    );
    if (!kabupaten) {
      throw new NotFoundException('Data tidak ditemukan');
    }

    response.responseData = KabupatenResponse.toResponse(kabupaten);
    return response;
  }

  async deleteKabupatenById(kabupatenId: number): Promise<ApiResponse> {
    const response: ApiResponse = ApiResponse.getSuccessResponse();
    response.responseData = await this.prismaService.kabupaten.delete({
      where: {
        id: kabupatenId,
      },
    });
    void this.cachingService.resetKabupaten();
    return response;
  }

  async createBatchKecamatan(
    kecamatanDtos: KecamatanDto[],
  ): Promise<ApiResponse> {
    const response: ApiResponse = ApiResponse.getSuccessResponse();
    const insertedData = await this.prismaService.kecamatan.createManyAndReturn(
      {
        data: kecamatanDtos,
      },
    );
    response.responseData = insertedData?.map((item) => {
      KecamatanResponse.toResponse(item);
    });
    void this.cachingService.resetKecamatan();
    return response;
  }

  async getKecamatanDetailsById(kecamatanId: number): Promise<ApiResponse> {
    const response: ApiResponse = ApiResponse.getSuccessResponse();
    const getKecamatan = async () => {
      return this.prismaService.kecamatan.findFirst({
        where: {
          id: kecamatanId,
        },
        include: {
          Kelurahan: true,
        },
      });
    };

    const kecamatan = await this.cachingService.getDataOrElseReturn(
      `${CacheConstant.CacheKey.KECAMATAN}-${kecamatanId}`,
      getKecamatan,
    );

    if (!kecamatan) {
      throw new NotFoundException('Data tidak ditemukan');
    }
    response.responseData = KecamatanResponse.toResponse(kecamatan);
    return response;
  }

  async deleteKecamatanById(kecamatanId: number): Promise<ApiResponse> {
    const response: ApiResponse = ApiResponse.getSuccessResponse();
    response.responseData = await this.prismaService.kecamatan.delete({
      where: {
        id: kecamatanId,
      },
    });
    void this.cachingService.resetKecamatan();
    return response;
  }

  async createBatchKelurahan(
    kelurahanDtos: KelurahanDto[],
  ): Promise<ApiResponse> {
    const response: ApiResponse = ApiResponse.getSuccessResponse();
    const insertedData = await this.prismaService.kelurahan.createManyAndReturn(
      {
        data: kelurahanDtos,
      },
    );
    response.responseData = insertedData?.map((item) => {
      KelurahanResponse.toKelurahanResponse(item);
    });
    void this.cachingService.resetKelurahan();
    return response;
  }

  async getKelurahanDetailsById(kelurahanId: number): Promise<ApiResponse> {
    const response: ApiResponse = ApiResponse.getSuccessResponse();
    const getKelurahan = async () => {
      return this.prismaService.kelurahan.findFirst({
        where: {
          id: kelurahanId,
        },
      });
    };

    const kelurahan = await this.cachingService.getDataOrElseReturn(
      `${CacheConstant.CacheKey.KELURAHAN}-${kelurahanId}`,
      getKelurahan,
    );

    if (!kelurahan) {
      throw new NotFoundException('Data tidak ditemukan');
    }
    response.responseData = KelurahanResponse.toKelurahanResponse(kelurahan);
    return response;
  }

  async deleteKelurahanById(kelurahanId: number): Promise<ApiResponse> {
    const response: ApiResponse = ApiResponse.getSuccessResponse();
    response.responseData = await this.prismaService.kelurahan.delete({
      where: {
        id: kelurahanId,
      },
    });
    void this.cachingService.resetKelurahan();
    return response;
  }
}
