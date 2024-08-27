import { Body, Controller, Post, Res } from '@nestjs/common';
import { WilayahService } from './wilayah.service';
import { ProvinsiDto } from './dto/provinsi.dto';
import { ApiResponse } from '../dto/apiResponse.dto';
import { Response } from 'express';

@Controller('wilayah')
export class WilayahController {
  constructor(private wilayahService: WilayahService) {}

  @Post('provinsi')
  async createProvinsi(
    @Body() provinsiDto: ProvinsiDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response: ApiResponse =
      await this.wilayahService.createProvinsi(provinsiDto);
    res.status(response.responseCode).json(response);
  }
}
