import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { WilayahService } from './wilayah.service';
import { ProvinsiDto } from './dto/provinsi.dto';
import { BaseResponse } from '../dto/baseResponse.dto';
import { KabupatenDto } from './dto/kabupaten.dto';
import { KelurahanDto } from './dto/kelurahan.dto';
import { KecamatanDto } from './dto/kecamatan.dto';
import {
  ApiBody,
  ApiExtraModels,
  ApiHeader,
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
@ApiHeader({ name: 'x-api-key', required: false })
@Controller('wilayah')
export class WilayahController {
  constructor(private wilayahService: WilayahService) {}

  @Post('provinsi')
  @ApiOperation({ summary: 'Create provinsi in batch' })
  @HttpCode(HttpStatus.CREATED)
  @ApiBaseResponse({ model: ProvinsiResponse, isArray: true, statusCode: 201 })
  @ApiBody({ type: () => [ProvinsiDto], isArray: true })
  async createProvinsi(
    @Body(new ParseArrayPipe({ items: ProvinsiDto }))
    provinsiDto: ProvinsiDto[],
  ) {
    return await this.wilayahService.createBatchProvinsi(provinsiDto);
  }

  @Get('provinsi')
  @ApiOperation({ summary: 'Get All Provinsi (Get by name optional)' })
  @HttpCode(HttpStatus.OK)
  @ApiBaseResponse({ model: ProvinsiResponse, isArray: true })
  @ApiQuery({ name: 'name', required: false, type: String, example: 'Aceh' })
  async getAllProvinsi(@Query('name') name: string) {
    return await this.wilayahService.getAllProvinsi(name);
  }

  @Get('provinsi/:id')
  @ApiOperation({ summary: 'Get Provinsi By ID' })
  @HttpCode(HttpStatus.OK)
  @ApiBaseResponse({ model: ProvinsiResponse })
  @ApiParamId()
  async getDetailsProvinsiById(@Param('id', ParseIntPipe) id: number) {
    return await this.wilayahService.getProvinsiDetailsById(id);
  }

  @Delete('provinsi/:id')
  @ApiOperation({ summary: 'Delete Provinsi By ID' })
  @HttpCode(HttpStatus.OK)
  @ApiBaseResponse({ model: Number })
  @ApiParamId()
  async deleteProvinsiById(@Param('id', ParseIntPipe) id: number) {
    return await this.wilayahService.deleteProvinsiById(id);
  }

  @Delete('delete-batch/provinsi')
  @ApiOperation({ summary: 'Batch delete provinsi by ID' })
  @HttpCode(HttpStatus.OK)
  @ApiBaseResponse({ model: Number })
  @ApiQuery({ name: 'ids', type: String, example: '1,2,3' })
  async deleteBatchProvinsi(
    @Query('ids', new ParseArrayPipe({ items: Number, separator: ',' }))
    provinsiIds: number[],
  ) {
    return await this.wilayahService.deleteBatchProvinsiById(provinsiIds);
  }

  @Post('kabupaten')
  @ApiOperation({ summary: 'Batch create kabupaten' })
  @ApiBaseResponse({ model: KabupatenDto, isArray: true, statusCode: 201 })
  @ApiBody({ type: () => [KabupatenDto] })
  async createBatchKabupaten(
    @Body(new ParseArrayPipe({ items: KabupatenDto }))
    kabupatenDtos: KabupatenDto[],
  ) {
    return await this.wilayahService.createBatchKabupaten(kabupatenDtos);
  }

  @Get('kabupaten/:id')
  @ApiOperation({ summary: 'Get Details Kabupaten By ID' })
  @HttpCode(HttpStatus.OK)
  @ApiNotFoundBaseResponse()
  @ApiBaseResponse({ model: KabupatenResponse })
  @ApiParamId()
  async getKabupatenDetailsById(@Param('id', ParseIntPipe) id: number) {
    return await this.wilayahService.getKabupatenDetailsById(id);
  }

  @Delete('kabupaten/:id')
  @ApiOperation({ summary: 'Delete Kabupaten By ID' })
  @HttpCode(HttpStatus.OK)
  @ApiBaseResponse({ model: Number })
  @ApiParamId()
  async deleteKabupatenById(@Param('id', ParseIntPipe) id: number) {
    return await this.wilayahService.deleteKabupatenById(id);
  }

  @Post('kecamatan')
  @ApiOperation({ summary: 'Batch create kecamatan' })
  @HttpCode(HttpStatus.CREATED)
  @ApiBaseResponse({ model: KecamatanDto, isArray: true, statusCode: 201 })
  @ApiBody({ type: () => [KecamatanDto] })
  async createBatchKecamatan(
    @Body(new ParseArrayPipe({ items: KecamatanDto }))
    kecamatanDtos: KecamatanDto[],
  ) {
    return await this.wilayahService.createBatchKecamatan(kecamatanDtos);
  }

  @Get('kecamatan/:id')
  @ApiOperation({ summary: 'Get Details Kecamatan By ID' })
  @ApiBaseResponse({ model: KecamatanResponse })
  @ApiNotFoundBaseResponse()
  @ApiParamId()
  async getKecamatanDetailsById(@Param('id', ParseIntPipe) id: number) {
    return await this.wilayahService.getKecamatanDetailsById(id);
  }

  @Delete('kecamatan/:id')
  @ApiOperation({ summary: 'Delete Kecamatan By ID' })
  @HttpCode(HttpStatus.OK)
  @ApiBaseResponse({ model: KecamatanResponse })
  @ApiParamId()
  async deleteKecamatanById(@Param('id', ParseIntPipe) id: number) {
    return await this.wilayahService.deleteKecamatanById(id);
  }

  @Post('kelurahan')
  @ApiOperation({ summary: 'Create Batch Kelurahan' })
  @HttpCode(HttpStatus.CREATED)
  @ApiBaseResponse({ model: KelurahanResponse, isArray: true, statusCode: 201 })
  @ApiBody({ type: () => [KelurahanDto] })
  async createBatchKelurahan(
    @Body(new ParseArrayPipe({ items: KelurahanDto }))
    kelurahanDto: KelurahanDto[],
  ) {
    return await this.wilayahService.createBatchKelurahan(kelurahanDto);
  }

  @Get('kelurahan/:id')
  @ApiOperation({ summary: 'Get Details Kelurahan By ID' })
  @HttpCode(HttpStatus.OK)
  @ApiNotFoundBaseResponse()
  @ApiBaseResponse({ model: KelurahanResponse })
  @ApiParamId()
  async getKelurahanDetailsById(@Param('id', ParseIntPipe) id: number) {
    return await this.wilayahService.getKelurahanDetailsById(id);
  }

  @Delete('kelurahan/:id')
  @ApiOperation({ summary: 'Delete Kelurahan By ID' })
  @HttpCode(HttpStatus.OK)
  @ApiBaseResponse({ model: KelurahanResponse })
  @ApiParamId()
  async deleteKelurahanById(@Param('id', ParseIntPipe) id: number) {
    return await this.wilayahService.deleteKelurahanById(id);
  }
}
