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
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ProvinsiResponse } from './dto/response/provinsi.response';
import { KabupatenResponse } from './dto/response/kabupaten.response';
import { KecamatanResponse } from './dto/response/kecamatan.response';
import { KelurahanResponse } from './dto/response/kelurahan.response';
import {
  ApiBaseResponse,
  ApiNotFoundBaseResponse,
  ApiParamId,
} from '../common/swagger/decorators/customSwagger.decorator';

@ApiTags('WilayahController')
@ApiExtraModels(() => BaseResponse)
@Controller('wilayah')
export class WilayahController {
  constructor(private wilayahService: WilayahService) {}

  @Post('provinsi')
  @ApiOperation({ summary: 'Create provinsi in batch' })
  @ApiBaseResponse({ model: ProvinsiResponse, isArray: true, statusCode: 201 })
  @ApiBody({ type: () => [ProvinsiDto], isArray: true })
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
  @ApiOperation({ summary: 'Get All Provinsi' })
  @ApiBaseResponse({ model: ProvinsiResponse, isArray: true })
  async getAllProvinsi(@Res({ passthrough: true }) res: Response) {
    const response: BaseResponse<ProvinsiResponse[]> =
      await this.wilayahService.getAllProvinsi();
    res.status(response.responseCode).json(response);
  }

  @Get('provinsi/:id')
  @ApiOperation({ summary: 'Get Provinsi By ID' })
  @ApiBaseResponse({ model: ProvinsiResponse })
  @ApiParamId()
  async getDetailsProvinsiById(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const response: BaseResponse<ProvinsiResponse> =
      await this.wilayahService.getProvinsiDetailsById(id);
    res.status(response.responseCode).json(response);
  }

  @Delete('provinsi/:id')
  @ApiOperation({ summary: 'Delete Provinsi By ID' })
  @ApiBaseResponse({ model: Number })
  @ApiParamId()
  async deleteProvinsiById(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response: BaseResponse<any> =
      await this.wilayahService.deleteProvinsiById(id);
    res.status(response.responseCode).json(response);
  }

  @Delete('delete-batch/provinsi')
  @ApiOperation({ summary: 'Batch delete provinsi by ID' })
  @ApiBaseResponse({ model: Number })
  @ApiQuery({ name: 'ids', type: String, example: '1,2,3' })
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
  @ApiOperation({ summary: 'Batch create kabupaten' })
  @ApiBaseResponse({ model: KabupatenDto, isArray: true, statusCode: 201 })
  @ApiBody({ type: () => [KabupatenDto] })
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
  @ApiOperation({ summary: 'Get Details Kabupaten By ID' })
  @ApiBaseResponse({ model: KabupatenResponse })
  @ApiParamId()
  async getKabupatenDetailsById(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response: BaseResponse<KabupatenResponse> =
      await this.wilayahService.getKabupatenDetailsById(id);
    res.status(response.responseCode).json(response);
  }

  @Delete('kabupaten/:id')
  @ApiOperation({ summary: 'Delete Kabupaten By ID' })
  @ApiBaseResponse({ model: Number })
  @ApiParamId()
  async deleteKabupatenById(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response: BaseResponse<any> =
      await this.wilayahService.deleteKabupatenById(id);
    res.status(response.responseCode).json(response);
  }

  @Post('kecamatan')
  @ApiOperation({ summary: 'Batch create kecamatan' })
  @ApiBaseResponse({ model: KecamatanDto, isArray: true, statusCode: 201 })
  @ApiBody({ type: () => [KecamatanDto] })
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
  @ApiOperation({ summary: 'Get Details Kecamatan By ID' })
  @ApiBaseResponse({ model: KecamatanResponse })
  @ApiNotFoundBaseResponse()
  @ApiParamId()
  async getKecamatanDetailsById(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response: BaseResponse<KecamatanResponse> =
      await this.wilayahService.getKecamatanDetailsById(id);
    res.status(response.responseCode).json(response);
  }

  @Delete('kecamatan/:id')
  @ApiOperation({ summary: 'Delete Kecamatan By ID' })
  @ApiBaseResponse({ model: KecamatanResponse })
  @ApiParamId()
  async deleteKecamatanById(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response: BaseResponse<any> =
      await this.wilayahService.deleteKecamatanById(id);
    res.status(response.responseCode).json(response);
  }

  @Post('kelurahan')
  @ApiOperation({ summary: 'Create Batch Kelurahan' })
  @ApiBaseResponse({ model: KelurahanResponse, isArray: true, statusCode: 201 })
  @ApiBody({ type: () => [KelurahanDto] })
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
  @ApiOperation({ summary: 'Get Details Kelurahan By ID' })
  @ApiBaseResponse({ model: KelurahanResponse })
  @ApiParamId()
  async getKelurahanDetailsById(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response: BaseResponse<KelurahanResponse> =
      await this.wilayahService.getKelurahanDetailsById(id);
    res.status(response.responseCode).json(response);
  }

  @Delete('kelurahan/:id')
  @ApiOperation({ summary: 'Delete Kelurahan By ID' })
  @ApiBaseResponse({ model: KelurahanResponse })
  @ApiParamId()
  async deleteKelurahanById(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response: BaseResponse<any> =
      await this.wilayahService.deleteKelurahanById(id);
    res.status(response.responseCode).json(response);
  }
}
