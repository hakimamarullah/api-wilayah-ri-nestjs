import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class KecamatanDto {
  id: number;

  @IsString({ message: 'name must be a string' })
  @IsNotEmpty({ message: 'name cannot be empty' })
  name: string;
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'kabupatenId must be a number' },
  )
  kabupatenId: number;
  zipCode: string;
}
