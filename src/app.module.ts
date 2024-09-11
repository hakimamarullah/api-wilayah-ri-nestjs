import { Module } from '@nestjs/common';
import { WilayahModule } from './wilayah/wilayah.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismadbModule } from './prismadb/prismadb.module';
import { RateLimitingModule } from './rate-limiting/rate-limiting.module';

import { AppPropertiesService } from './app-properties/app-properties.service';
import { AppPropertiesModule } from './app-properties/app-properties.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import {
  AuthGuard,
  AuthModule,
  CachingModule,
  CachingService,
  JwtConfigService,
} from '@hakimamarullah/commonbundle-nestjs';
import { ThrottlerModule } from '@nestjs/throttler';
import { RateLimitingService } from './rate-limiting/rate-limiting.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    JwtModule.registerAsync({
      imports: [AuthModule, HttpModule, AppPropertiesModule],
      useClass: JwtConfigService,
      inject: [JwtConfigService, AppPropertiesService],
    }),
    ThrottlerModule.forRootAsync({
      imports: [RateLimitingModule, AppPropertiesModule],
      inject: [AppPropertiesService],
      useClass: RateLimitingService,
    }),
    WilayahModule,
    PrismadbModule,
    CachingModule,
    RateLimitingModule,
  ],
  providers: [
    AppPropertiesService,
    CachingService,
    ConfigService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
