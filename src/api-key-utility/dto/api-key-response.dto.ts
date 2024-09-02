import { ApiProperty } from '@nestjs/swagger';

export class ApiKeyResponseDto {
  constructor(apiKey: string, expiresAt: Date) {
    this.apiKey = apiKey;
    this.expiresAt = expiresAt;
  }
  @ApiProperty({ readOnly: true })
  apiKey: string;

  @ApiProperty({ readOnly: true })
  expiresAt: Date;
}
