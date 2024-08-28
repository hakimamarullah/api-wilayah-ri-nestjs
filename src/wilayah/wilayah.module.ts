import { Module } from '@nestjs/common';
import { WilayahService } from './wilayah.service';
import { WilayahController } from './wilayah.controller';
import { PrismadbModule } from '../prismadb/prismadb.module';
import { CachingModule } from '../caching/caching.module';

@Module({
  providers: [WilayahService],
  imports: [PrismadbModule, CachingModule],
  controllers: [WilayahController],
})
export class WilayahModule {}
