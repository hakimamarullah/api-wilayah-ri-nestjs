import { IsNotEmpty, IsString } from 'class-validator';
import { ApiHideProperty } from '@nestjs/swagger';

export class ProvinsiDto {
  @ApiHideProperty()
  id: number;

  @IsString({ message: 'Provinsi name must be a string' })
  @IsNotEmpty({ message: 'Provinsi name is required' })
  name: string;
}
