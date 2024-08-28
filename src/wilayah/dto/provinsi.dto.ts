import { IsNotEmpty } from 'class-validator';

export class ProvinsiDto {
  id: number;

  @IsNotEmpty({ message: 'Provinsi name is required' })
  name: string;
}
