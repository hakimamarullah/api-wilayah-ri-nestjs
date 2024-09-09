import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProvinsiDto } from './dto/provinsi.dto';
import { PrismaService } from '../prismadb/prisma.service';
import { BaseResponse } from '../dto/baseResponse.dto';
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

  async createBatchProvinsi(
    provinsiDtos: ProvinsiDto[],
  ): Promise<BaseResponse<ProvinsiResponse[]>> {
    const response: BaseResponse<ProvinsiResponse[]> =
      BaseResponse.getSuccessResponse<ProvinsiResponse[]>();
    response.responseCode = HttpStatus.CREATED;

    const insertedData = await this.prismaService.provinsi.createManyAndReturn({
      data: provinsiDtos,
    });
    response.responseData = insertedData?.map((item: any) =>
      ProvinsiResponse.build(item),
    );
    void this.cachingService.resetProvinsi();
    return response;
  }

  async getAllProvinsi(
    provinsiName?: string,
  ): Promise<BaseResponse<ProvinsiResponse[]>> {
    const response: BaseResponse<ProvinsiResponse[]> =
      BaseResponse.getSuccessResponse<ProvinsiResponse[]>();
    const provinces = async () => {
      return this.prismaService.provinsi.findMany({
        where: {
          name: {
            contains: provinsiName?.toUpperCase(),
          },
        },
        include: {
          _count: {
            select: {
              Kabupaten: true, // Count the related kabupatens
            },
          },
        },
      });
    };
    const data = await this.cachingService.getDataOrThrow(
      provinsiName
        ? `${CacheConstant.CacheKey.PROVINSI}-${provinsiName}`
        : CacheConstant.CacheKey.PROVINSI_ALL,
      provinces,
    );
    response.responseData = data?.map((item: any) => {
      const provinceResponse = new ProvinsiResponse();
      provinceResponse.id = item.id;
      provinceResponse.name = item.name;
      provinceResponse.jumlahKabupaten = item._count.Kabupaten;
      provinceResponse.createdAt = item.createdAt;
      provinceResponse.updatedAt = item.updatedAt;
      return provinceResponse;
    });
    return response;
  }

  async getProvinsiDetailsById(
    provinceId: number,
  ): Promise<BaseResponse<ProvinsiResponse>> {
    const response: BaseResponse<ProvinsiResponse> =
      BaseResponse.getSuccessResponse<ProvinsiResponse>();
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
      `${CacheConstant.CacheKey.PROVINSI}-${provinceId}`,
      getProvinsi,
    );

    if (!provinsi) {
      throw new NotFoundException('Data tidak ditemukan');
    }

    const provinsiResponse: ProvinsiResponse = new ProvinsiResponse();
    const kabupaten = provinsi.Kabupaten ?? [];

    provinsiResponse.id = provinsi.id;
    provinsiResponse.name = provinsi.name;
    provinsiResponse.kabupaten = kabupaten.map((item: any) =>
      KabupatenResponse.toResponse(item),
    );
    provinsiResponse.jumlahKabupaten = provinsiResponse.kabupaten.length;
    provinsiResponse.createdAt = provinsi.createdAt;
    provinsiResponse.updatedAt = provinsi.updatedAt;
    response.responseData = provinsiResponse;

    return response;
  }

  async deleteProvinsiById(provinceId: number): Promise<BaseResponse<any>> {
    const response: BaseResponse<any> = BaseResponse.getSuccessResponse<any>();
    response.responseData = (await this.prismaService.provinsi.delete({
      where: {
        id: provinceId,
      },
    })) as any;
    void this.cachingService.resetProvinsi();
    return response;
  }

  async deleteBatchProvinsiById(
    provinceIds: number[],
  ): Promise<BaseResponse<any>> {
    const response: BaseResponse<any> = BaseResponse.getSuccessResponse();
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
  ): Promise<BaseResponse<KabupatenDto[]>> {
    const response: BaseResponse<KabupatenDto[]> =
      BaseResponse.getSuccessResponse<KabupatenDto[]>();
    const dbResult = await this.prismaService.kabupaten.createManyAndReturn({
      data: kabupatenDtos,
    });
    response.responseData = dbResult?.map((item: any) =>
      KabupatenDto.build(item),
    ) as KabupatenDto[];
    void this.cachingService.resetKabupaten();
    return response;
  }

  async getKabupatenDetailsById(
    kabupatenId: number,
  ): Promise<BaseResponse<KabupatenResponse>> {
    const response: BaseResponse<KabupatenResponse> =
      BaseResponse.getSuccessResponse<KabupatenResponse>();
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

  async deleteKabupatenById(kabupatenId: number): Promise<BaseResponse<any>> {
    const response: BaseResponse<any> = BaseResponse.getSuccessResponse();
    response.responseData = (await this.prismaService.kabupaten.delete({
      where: {
        id: kabupatenId,
      },
    })) as any;
    void this.cachingService.resetKabupaten();
    return response;
  }

  async createBatchKecamatan(
    kecamatanDtos: KecamatanDto[],
  ): Promise<BaseResponse<KecamatanResponse[]>> {
    const response: BaseResponse<KecamatanResponse[]> =
      BaseResponse.getSuccessResponse<KecamatanResponse[]>();
    const insertedData = await this.prismaService.kecamatan.createManyAndReturn(
      {
        data: kecamatanDtos,
      },
    );
    response.responseData = insertedData?.map((item: any) =>
      KecamatanResponse.toResponse(item),
    );
    void this.cachingService.resetKecamatan();
    return response;
  }

  async getKecamatanDetailsById(
    kecamatanId: number,
  ): Promise<BaseResponse<KecamatanResponse>> {
    const response: BaseResponse<KecamatanResponse> =
      BaseResponse.getSuccessResponse<KecamatanResponse>();
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

  async deleteKecamatanById(kecamatanId: number): Promise<BaseResponse<any>> {
    const response: BaseResponse<any> = BaseResponse.getSuccessResponse<any>();
    response.responseData = (await this.prismaService.kecamatan.delete({
      where: {
        id: kecamatanId,
      },
    })) as any;
    void this.cachingService.resetKecamatan();
    return response;
  }

  async createBatchKelurahan(
    kelurahanDtos: KelurahanDto[],
  ): Promise<BaseResponse<KelurahanResponse[]>> {
    const response: BaseResponse<KelurahanResponse[]> =
      BaseResponse.getSuccessResponse<KelurahanResponse[]>();
    const insertedData = await this.prismaService.kelurahan.createManyAndReturn(
      {
        data: kelurahanDtos,
      },
    );
    response.responseData = insertedData?.map((item: any) =>
      KelurahanResponse.toKelurahanResponse(item),
    );
    void this.cachingService.resetKelurahan();
    return response;
  }

  async getKelurahanDetailsById(
    kelurahanId: number,
  ): Promise<BaseResponse<KelurahanResponse>> {
    const response: BaseResponse<KelurahanResponse> =
      BaseResponse.getSuccessResponse<KelurahanResponse>();
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

  async deleteKelurahanById(kelurahanId: number): Promise<BaseResponse<any>> {
    const response: BaseResponse<any> = BaseResponse.getSuccessResponse<any>();
    response.responseData = (await this.prismaService.kelurahan.delete({
      where: {
        id: kelurahanId,
      },
    })) as any;
    void this.cachingService.resetKelurahan();
    return response;
  }
}
