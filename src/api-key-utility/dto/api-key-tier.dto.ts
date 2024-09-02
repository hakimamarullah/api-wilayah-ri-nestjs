import { ApiProperty } from '@nestjs/swagger';

export class ApiKeyTierDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  ttl: number;

  @ApiProperty()
  limit: number;
}
