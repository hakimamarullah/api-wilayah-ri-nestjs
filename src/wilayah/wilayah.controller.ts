import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { WilayahService } from './wilayah.service';
import { ProvinsiDto } from './dto/provinsi.dto';
import { ApiResponse } from '../dto/apiResponse.dto';
import { Response } from 'express';

@Controller('wilayah')
export class WilayahController {
  constructor(private wilayahService: WilayahService) {}

  @Post('provinsi')
  async createProvinsi(
    @Body() provinsiDto: ProvinsiDto[],
    @Res({ passthrough: true }) res: Response,
  ) {
    const response: ApiResponse =
      await this.wilayahService.createBatchProvinsi(provinsiDto);
    res.status(response.responseCode).json(response);
  }

  @Get('provinsi')
  async getAllProvinsi(@Res({ passthrough: true }) res: Response) {
    const response: ApiResponse = await this.wilayahService.getAllProvinsi();
    res.status(response.responseCode).json(response);
  }

  @Get('provinsi/:id')
  async getDetailsProvinsiById(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response: ApiResponse =
      await this.wilayahService.getProvinsiDetailsById(id);
    res.status(response.responseCode).json(response);
  }

  @Delete('provinsi/:id')
  async deleteProvinsiById(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response: ApiResponse =
      await this.wilayahService.deleteProvinsiById(id);
    res.status(response.responseCode).json(response);
  }

  @Delete('provinsi/batch-delete')
  async deleteBatchProvinsi(
    @Query(
      'ids',
      new ParseArrayPipe({
        items: Number,
        separator: ',',
      }),
    )
    provinsiIds: number[],
  ) {
    return await this.wilayahService.deleteBatchProvinsiById(provinsiIds);
  }
}
