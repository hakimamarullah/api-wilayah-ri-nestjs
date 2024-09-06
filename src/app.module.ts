import { Module } from '@nestjs/common';
import { WilayahModule } from './wilayah/wilayah.module';
import { ConfigModule } from '@nestjs/config';
import { PrismadbModule } from './prismadb/prismadb.module';
import { CachingModule } from './caching/caching.module';
import { RateLimitingModule } from './rate-limiting/rate-limiting.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { RateLimitingService } from './rate-limiting/rate-limiting.service';
import { PrismaService } from './prismadb/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    ThrottlerModule.forRootAsync({
      imports: [RateLimitingModule, PrismadbModule],
      inject: [PrismaService],
      useClass: RateLimitingService,
    }),
    WilayahModule,
    PrismadbModule,
    CachingModule,
    RateLimitingModule,
  ],
})
export class AppModule {}
