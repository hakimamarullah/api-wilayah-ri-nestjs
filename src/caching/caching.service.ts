import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CacheConstant } from './cache.constant';

export declare interface CacheOptions {
  persist?: boolean;
}
@Injectable()
export class CachingService {
  private readonly logger: Logger = new Logger(CachingService.name);
  constructor(@Inject(CACHE_MANAGER) readonly cacheManager: Cache) {}

  async getDataOrElseReturn(
    key: string,
    defaultGetter: () => any,
    options?: CacheOptions,
  ): Promise<any> {
    let data;
    const { persist = true } = options ?? {};
    try {
      data = (await this.cacheManager.get(key)) as any;
      if (!data && defaultGetter) {
        data = await defaultGetter();
        if (data && persist) {
          await this.cacheManager.set(key, data);
        }
      }
    } catch (error) {
      this.logger.error(`Error getting data from cache`);
      if (error.name.startsWith('Prisma')) {
        throw error;
      }
    }
    return data;
  }
  async resetAllValuesKeyStartWith(prefix: string): Promise<void> {
    const allKeys: string[] =
      (await this.cacheManager.store.keys(prefix)) ?? [];
    await this.cacheManager.store.mdel(...allKeys);
  }

  async resetProvinsi() {
    await this.resetAllValuesKeyStartWith(CacheConstant.CacheKey.PROVINSI);
  }

  async resetKabupaten() {
    await this.resetAllValuesKeyStartWith(CacheConstant.CacheKey.KABUPATEN);
  }

  async resetKecamatan() {
    await this.resetAllValuesKeyStartWith(CacheConstant.CacheKey.KECAMATAN);
  }

  async resetKelurahan() {
    await this.resetAllValuesKeyStartWith(CacheConstant.CacheKey.KELURAHAN);
  }
}
