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
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { HttpModule } from '@nestjs/axios';
import { JwtConfigService } from './auth/jwt-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    HttpModule.register({}),
    JwtModule.registerAsync({
      imports: [HttpClientModule, AuthModule, HttpModule, AppPropertiesModule],
      useClass: JwtConfigService,
      inject: [JwtConfigService, HttpClientService, AppPropertiesService],
    }),
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
  providers: [
    HttpClientService,
    AppPropertiesService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
