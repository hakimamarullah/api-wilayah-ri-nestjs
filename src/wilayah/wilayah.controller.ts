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
import { BaseResponse } from '../dto/baseResponse.dto';
import { Response } from 'express';
import { KabupatenDto } from './dto/kabupaten.dto';
import { KelurahanDto } from './dto/kelurahan.dto';
import { KecamatanDto } from './dto/kecamatan.dto';
import { ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProvinsiResponse } from './dto/response/provinsi.response';
import { KabupatenResponse } from './dto/response/kabupaten.response';
import { KecamatanResponse } from './dto/response/kecamatan.response';
import { KelurahanResponse } from './dto/response/kelurahan.response';
import { ApiBaseResponse } from '../common/swagger/decorators/apiBaseResponse.decorator';

@ApiTags('WilayahController')
@ApiExtraModels(() => BaseResponse)
@Controller('wilayah')
export class WilayahController {
  constructor(private wilayahService: WilayahService) {}

  @Post('provinsi')
  @ApiOperation({ description: 'Create provinsi in batch' })
  @ApiBaseResponse(ProvinsiResponse, true)
  async createProvinsi(
    @Body(new ParseArrayPipe({ items: ProvinsiDto }))
    provinsiDto: ProvinsiDto[],
    @Res({ passthrough: true }) res: Response,
  ) {
    const response: BaseResponse<ProvinsiResponse[]> =
      await this.wilayahService.createBatchProvinsi(provinsiDto);
    res.status(response.responseCode).json(response);
  }

  @Get('provinsi')
  async getAllProvinsi(@Res({ passthrough: true }) res: Response) {
    const response: BaseResponse<ProvinsiResponse[]> =
      await this.wilayahService.getAllProvinsi();
    res.status(response.responseCode).json(response);
  }

  @Get('provinsi/:id')
  async getDetailsProvinsiById(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response: BaseResponse<ProvinsiResponse> =
      await this.wilayahService.getProvinsiDetailsById(id);
    res.status(response.responseCode).json(response);
  }

  @Delete('provinsi/:id')
  async deleteProvinsiById(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response: BaseResponse<any> =
      await this.wilayahService.deleteProvinsiById(id);
    res.status(response.responseCode).json(response);
  }

  @Delete('delete-batch/provinsi')
  async deleteBatchProvinsi(
    @Query('ids', new ParseArrayPipe({ items: Number, separator: ',' }))
    provinsiIds: number[],
    @Res() res: Response,
  ) {
    const response: BaseResponse<any> =
      await this.wilayahService.deleteBatchProvinsiById(provinsiIds);
    res.status(response.responseCode).json(response);
  }

  @Post('kabupaten')
  async createBatchKabupaten(
    @Body(new ParseArrayPipe({ items: KabupatenDto }))
    kabupatenDtos: KabupatenDto[],
    @Res() res: Response,
  ) {
    const response: BaseResponse<KabupatenDto[]> =
      await this.wilayahService.createBatchKabupaten(kabupatenDtos);
    res.status(response.responseCode).json(response);
  }

  @Get('kabupaten/:id')
  async getKabupatenDetailsById(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response: BaseResponse<KabupatenResponse> =
      await this.wilayahService.getKabupatenDetailsById(id);
    res.status(response.responseCode).json(response);
  }

  @Delete('kabupaten/:id')
  async deleteKabupatenById(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response: BaseResponse<any> =
      await this.wilayahService.deleteKabupatenById(id);
    res.status(response.responseCode).json(response);
  }

  @Post('kecamatan')
  async createBatchKecamatan(
    @Body(new ParseArrayPipe({ items: KecamatanDto }))
    kecamatanDtos: KecamatanDto[],
    @Res() res: Response,
  ) {
    const response: BaseResponse<KecamatanResponse[]> =
      await this.wilayahService.createBatchKecamatan(kecamatanDtos);
    res.status(response.responseCode).json(response);
  }

  @Get('kecamatan/:id')
  async getKecamatanDetailsById(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response: BaseResponse<KecamatanResponse> =
      await this.wilayahService.getKecamatanDetailsById(id);
    res.status(response.responseCode).json(response);
  }

  @Delete('kecamatan/:id')
  async deleteKecamatanById(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response: BaseResponse<any> =
      await this.wilayahService.deleteKecamatanById(id);
    res.status(response.responseCode).json(response);
  }

  @Post('kelurahan')
  async createBatchKelurahan(
    @Body(new ParseArrayPipe({ items: KelurahanDto }))
    kelurahanDto: KelurahanDto[],
    @Res() res: Response,
  ) {
    const response: BaseResponse<KelurahanResponse[]> =
      await this.wilayahService.createBatchKelurahan(kelurahanDto);
    res.status(response.responseCode).json(response);
  }

  @Get('kelurahan/:id')
  async getKelurahanDetailsById(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response: BaseResponse<KelurahanResponse> =
      await this.wilayahService.getKelurahanDetailsById(id);
    res.status(response.responseCode).json(response);
  }

  @Delete('kelurahan/:id')
  async deleteKelurahanById(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response: BaseResponse<any> =
      await this.wilayahService.deleteKelurahanById(id);
    res.status(response.responseCode).json(response);
  }
}
