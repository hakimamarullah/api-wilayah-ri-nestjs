import { Injectable } from '@nestjs/common';
import { ProvinsiDto } from './dto/provinsi.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prismadb/prisma.service';
import { ApiResponse } from '../dto/apiResponse.dto';
import { getZonedDateTime } from '../utils/date.util';

@Injectable()
export class WilayahService {
  constructor(private prismaService: PrismaService) {}

  async createProvinsi(provinsiDto: ProvinsiDto): Promise<ApiResponse> {
    const provinsi: Prisma.ProvinsiCreateInput = {
      name: provinsiDto.name,
      createdAt: getZonedDateTime(new Date()),
      updatedAt: getZonedDateTime(new Date()),
    };
    const data = await this.prismaService.provinsi.create({
      data: provinsi,
    });

    const response: ApiResponse = new ApiResponse();
    response.responseCode = 201;
    response.responseMessage = 'Provinsi created';
    response.responseData = data;
    return response;
  }
}
