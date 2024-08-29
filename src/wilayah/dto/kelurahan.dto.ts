import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class KelurahanDto {
  id: number;

  @IsString({ message: 'name must be a string' })
  @IsNotEmpty({ message: 'name is required' })
  name: string;

  @IsNumber({ allowNaN: false }, { message: 'kabupatenId must be a number' })
  kecamatanId: number;
}
