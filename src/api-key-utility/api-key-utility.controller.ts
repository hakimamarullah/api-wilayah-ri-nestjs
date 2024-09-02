import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiKeyUtilityService } from './api-key-utility.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiBaseResponse } from '../common/swagger/decorators/customSwagger.decorator';
import { ApiKeyResponseDto } from './dto/api-key-response.dto';
import { ApiKeyTierDto } from './dto/api-key-tier.dto';
import { RotateApiKeyDto } from './dto/rotate-api-key.dto';

@ApiTags('Api Keys Utility')
@Controller('api-keys')
export class ApiKeyUtilityController {
  constructor(private apiKeyUtilityService: ApiKeyUtilityService) {}

  @Get('generate/:tierId')
  @ApiOperation({ summary: 'Create new API Key with the given tier' })
  @HttpCode(HttpStatus.OK)
  @ApiBaseResponse({ model: ApiKeyResponseDto })
  async generateApiKey(@Param('tierId', ParseIntPipe) tierId: number) {
    return this.apiKeyUtilityService.generateApiKey(tierId);
  }

  @Get('tiers')
  @ApiOperation({ summary: 'List available tiers' })
  @HttpCode(HttpStatus.OK)
  @ApiBaseResponse({ model: ApiKeyTierDto, isArray: true })
  async getAvailableTiers() {
    return this.apiKeyUtilityService.getAvailableTiers();
  }

  @Post('rotate')
  @ApiOperation({ summary: 'Rotate API Key' })
  @HttpCode(HttpStatus.OK)
  @ApiBaseResponse({ model: ApiKeyResponseDto })
  @ApiBody({ type: RotateApiKeyDto })
  async rotateApiKey(@Body() apiKey: RotateApiKeyDto) {
    return this.apiKeyUtilityService.rotateKey(apiKey);
  }
}
