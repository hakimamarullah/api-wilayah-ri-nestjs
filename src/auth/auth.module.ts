import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from './jwt-config.service';
import { HttpClientService } from '../http-client/http-client.service';
import { HttpClientModule } from '../http-client/http-client.module';
import { HttpModule } from '@nestjs/axios';
import { AppPropertiesModule } from '../app-properties/app-properties.module';
import { AppPropertiesService } from '../app-properties/app-properties.service';
import { AuthClientConfigService } from './auth-client-config.service';
import { HttpConfigService } from '../http-client/http-config.service';

@Module({
  providers: [
    JwtConfigService,
    HttpClientService,
    HttpConfigService,
    AuthClientConfigService,
  ],
  imports: [
    AppPropertiesModule,
    HttpModule.registerAsync({
      imports: [AppPropertiesModule],
      useClass: AuthClientConfigService,
      inject: [AppPropertiesService],
    }),
    JwtModule.registerAsync({
      imports: [HttpClientModule, HttpModule, AppPropertiesModule],
      useClass: JwtConfigService,
      inject: [JwtConfigService, HttpClientService, AppPropertiesService],
    }),
  ],
})
export class AuthModule {}
