import { Test, TestingModule } from '@nestjs/testing';
import { WilayahService } from './wilayah.service';
import { CacheModule } from '@nestjs/cache-manager';
import { CachingModule } from '../caching/caching.module';
import { PrismadbModule } from '../prismadb/prismadb.module';

describe('WilayahService', () => {
  let service: WilayahService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WilayahService],
      imports: [CacheModule.register(), CachingModule, PrismadbModule],
    }).compile();

    service = module.get<WilayahService>(WilayahService) as WilayahService;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
