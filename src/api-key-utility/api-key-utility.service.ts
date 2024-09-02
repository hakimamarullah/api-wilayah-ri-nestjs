import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prismadb/prisma.service';
import { CacheConstant } from '../caching/cache.constant';
import { CachingService } from '../caching/caching.service';
import { generateApiKey, next30Days } from '../utils/common.util';
import { BaseResponse } from '../dto/baseResponse.dto';
import { ApiKeyResponseDto } from './dto/api-key-response.dto';
import { ApiKeyTierDto } from './dto/api-key-tier.dto';
import { RotateApiKeyDto } from './dto/rotate-api-key.dto';

@Injectable()
export class ApiKeyUtilityService {
  constructor(
    private prismaService: PrismaService,
    private cachingService: CachingService,
  ) {}

  async validateApiKey(apiKey?: string) {
    if (!apiKey) {
      throw new Error('Missing API Key');
    }
    const getApiKeyDb = async () => {
      return this.prismaService.apiKey.findFirstOrThrow({
        where: {
          apiKey: {
            equals: apiKey,
          },
        },
        include: {
          tier: true,
        },
      });
    };

    return await this.cachingService.getDataOrThrow(
      `${CacheConstant.CacheKey.API_KEY}-${apiKey}`,
      getApiKeyDb,
    );
  }

  async generateApiKey(apiKeyTier: number) {
    const response: BaseResponse<ApiKeyResponseDto> =
      BaseResponse.getSuccessResponse<ApiKeyResponseDto>();
    const newApiKey: string = generateApiKey();
    const expiryDate: Date = next30Days();
    await this.prismaService.apiKey.create({
      data: {
        apiKey: newApiKey,
        expiredAt: expiryDate,
        tierId: apiKeyTier,
      },
    });

    response.responseData = new ApiKeyResponseDto(newApiKey, expiryDate);
    return response;
  }

  async getAvailableTiers() {
    const response: BaseResponse<ApiKeyTierDto[]> =
      BaseResponse.getSuccessResponse<ApiKeyTierDto[]>();
    response.responseData = await this.prismaService.apiKeyTier.findMany();
    return response;
  }

  async rotateKey(apiKeyDto: RotateApiKeyDto) {
    const response: BaseResponse<ApiKeyResponseDto> =
      BaseResponse.getSuccessResponse<ApiKeyResponseDto>();
    const newApiKey: string = generateApiKey();
    const expiryDate: Date = next30Days();
    await this.prismaService.apiKey.update({
      where: {
        apiKey: apiKeyDto.apiKey,
      },
      data: {
        apiKey: newApiKey,
        expiredAt: expiryDate,
      },
    });
    response.responseData = new ApiKeyResponseDto(newApiKey, expiryDate);
    return response;
  }
}
