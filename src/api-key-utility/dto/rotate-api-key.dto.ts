import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RotateApiKeyDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Old API Key is required' })
  @IsString()
  apiKey: string;
}
