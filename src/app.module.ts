import { Module } from '@nestjs/common';
import { WilayahModule } from './wilayah/wilayah.module';
import { ConfigModule } from '@nestjs/config';
import { PrismadbModule } from './prismadb/prismadb.module';
import { CachingModule } from './caching/caching.module';
import { RateLimitingModule } from './rate-limiting/rate-limiting.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    WilayahModule,
    PrismadbModule,
    CachingModule,
    RateLimitingModule,
  ],
})
export class AppModule {}
