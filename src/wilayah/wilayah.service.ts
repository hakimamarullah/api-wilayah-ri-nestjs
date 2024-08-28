import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProvinsiDto } from './dto/provinsi.dto';
import { Kabupaten, Prisma } from '@prisma/client';
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

@Injectable()
export class WilayahService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private prismaService: PrismaService,
    private cachingService: CachingService,
  ) {}

  async createBatchProvinsi(provinsiDtos: ProvinsiDto[]): Promise<ApiResponse> {
    const provinces = provinsiDtos.map((item) => {
      const provinsi: Prisma.ProvinsiCreateInput = {
        name: item.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return provinsi;
    });

    const response: ApiResponse = ApiResponse.getSuccessResponse();
    response.responseCode = HttpStatus.CREATED;

    response.responseData =
      await this.prismaService.provinsi.createManyAndReturn({
        data: provinces,
      });

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
      'all-provinsi',
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

    const provinsiResult = provinsi as any;
    const provinsiResponse: ProvinsiResponse = new ProvinsiResponse();
    const kabupaten: Kabupaten[] = provinsiResult.Kabupaten ?? [];

    provinsiResponse.id = provinsiResult.id;
    provinsiResponse.nama = provinsiResult.name;
    provinsiResponse.kabupaten = kabupaten.map((item: any) =>
      KabupatenResponse.toResponse(item),
    );
    provinsiResponse.jumlahKabupaten = provinsiResponse.kabupaten.length;
    provinsiResponse.createdAt = provinsiResult.createdAt;
    provinsiResponse.updatedAt = provinsiResult.updatedAt;
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

  async createBatchKabupaten(
    kabupatenDtos: KabupatenDto[],
  ): Promise<ApiResponse> {
    const response: ApiResponse = ApiResponse.getSuccessResponse();
    const kabupaten: Prisma.KabupatenCreateManyInput[] = kabupatenDtos.map(
      (item) => {
        const kabupaten: Prisma.KabupatenCreateManyInput = {
          name: item.name,
          provinsiId: item.provinsiId,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        return kabupaten;
      },
    );
    const kabupatens = await this.prismaService.kabupaten.createManyAndReturn({
      data: kabupaten,
    });
    response.responseData = kabupatens?.map((item) => {
      const kabupatenResponse = new KabupatenDto();
      kabupatenResponse.id = item.id;
      kabupatenResponse.name = item.name;
      kabupatenResponse.provinsiId = item.provinsiId;
      return kabupatenResponse;
    });

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
      `kabupaten-${kabupatenId}`,
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
    return response;
  }

  async createBatchKecamatan(
    kecamatanDtos: KecamatanDto[],
  ): Promise<ApiResponse> {
    const response: ApiResponse = ApiResponse.getSuccessResponse();
    const kecamatan: Prisma.KecamatanCreateManyInput[] = kecamatanDtos.map(
      (item) => {
        const kecamatan: Prisma.KecamatanCreateManyInput = {
          name: item.name,
          kabupatenId: item.kabupatenId,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        return kecamatan;
      },
    );
    const insertedData = await this.prismaService.kecamatan.createManyAndReturn(
      {
        data: kecamatan,
      },
    );
    response.responseData = insertedData?.map((item) => {
      KecamatanResponse.toResponse(item);
    });
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
      `kecamatan-${kecamatanId}`,
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
    return response;
  }

  async createBatchKelurahan(
    kelurahanDtos: KelurahanDto[],
  ): Promise<ApiResponse> {
    const response: ApiResponse = ApiResponse.getSuccessResponse();
    const kelurahan: Prisma.KelurahanCreateManyInput[] = kelurahanDtos.map(
      (item) => {
        const kelurahan: Prisma.KelurahanCreateManyInput = {
          name: item.name,
          kecamatanId: item.kecamatanId,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        return kelurahan;
      },
    );
    const insertedData = await this.prismaService.kelurahan.createManyAndReturn(
      {
        data: kelurahan,
      },
    );
    response.responseData = insertedData?.map((item) => {
      KelurahanResponse.toKelurahanResponse(item);
    });
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
      `kelurahan-${kelurahanId}`,
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
    return response;
  }
}
