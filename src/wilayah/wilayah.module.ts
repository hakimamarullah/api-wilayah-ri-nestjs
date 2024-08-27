import { Module } from '@nestjs/common';
import { WilayahService } from './wilayah.service';
import { WilayahController } from './wilayah.controller';
import { PrismadbModule } from '../prismadb/prismadb.module';

@Module({
  providers: [WilayahService],
  imports: [PrismadbModule],
  controllers: [WilayahController],
})
export class WilayahModule {}
