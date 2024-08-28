import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CachingService {
  private readonly logger: Logger = new Logger(CachingService.name);
  constructor(@Inject(CACHE_MANAGER) readonly cacheManager: Cache) {}

  async getDataOrElseReturn(key: string, defaultGetter: () => any) {
    let data;
    try {
      data = (await this.cacheManager.get(key)) as any;
      if (!data && defaultGetter) {
        data = await defaultGetter();
        if (data) {
          await this.cacheManager.set(key, data);
        }
      }
    } catch (error) {
      this.logger.error(`Error getting data from cache: ${error.message}`);
    }
    return data;
  }
}
