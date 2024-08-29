import { IsNotEmpty, IsString } from 'class-validator';

export class ProvinsiDto {
  id: number;

  @IsString({ message: 'Provinsi name must be a string' })
  @IsNotEmpty({ message: 'Provinsi name is required' })
  name: string;
}
