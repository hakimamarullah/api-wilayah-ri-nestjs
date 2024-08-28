import { IsNotEmpty, IsNumber } from 'class-validator';

export class KecamatanDto {
  id: number;
  @IsNotEmpty({ message: 'name cannot be empty' })
  name: string;
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'kabupatenId must be a number' },
  )
  kabupatenId: number;
  zipCode: string;
}
