import { Module } from '@nestjs/common';
import { WilayahModule } from './wilayah/wilayah.module';
import { ConfigModule } from '@nestjs/config';
import { PrismadbModule } from './prismadb/prismadb.module';
import { CachingModule } from './caching/caching.module';
import { RateLimitingModule } from './rate-limiting/rate-limiting.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { RateLimitingService } from './rate-limiting/rate-limiting.service';
import { PrismaService } from './prismadb/prisma.service';
import { HttpClientModule } from './http-client/http-client.module';
import { HttpClientService } from './http-client/http-client.service';
import { AppPropertiesService } from './app-properties/app-properties.service';
import { AppPropertiesModule } from './app-properties/app-properties.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    ThrottlerModule.forRootAsync({
      imports: [
        RateLimitingModule,
        PrismadbModule,
        HttpClientModule,
        AppPropertiesModule,
      ],
      inject: [PrismaService, HttpClientService, AppPropertiesService],
      useClass: RateLimitingService,
    }),
    WilayahModule,
    PrismadbModule,
    CachingModule,
    RateLimitingModule,
  ],
})
export class AppModule {}
