import { Module } from '@nestjs/common';
import { WilayahModule } from './wilayah/wilayah.module';
import { ConfigModule } from '@nestjs/config';
import { PrismadbModule } from './prismadb/prismadb.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    WilayahModule,
    PrismadbModule,
  ],
})
export class AppModule {}
