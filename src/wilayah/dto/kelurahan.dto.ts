import { IsNotEmpty, IsNumber } from 'class-validator';

export class KelurahanDto {
  id: number;

  @IsNotEmpty({ message: 'name is required' })
  name: string;

  @IsNumber({ allowNaN: false }, { message: 'kabupatenId must be a number' })
  kecamatanId: number;
}
