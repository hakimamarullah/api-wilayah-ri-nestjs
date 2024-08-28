import { IsNotEmpty, IsNumber } from 'class-validator';

export class KabupatenDto {
  id: number;

  @IsNotEmpty({ message: 'name is required' })
  name: string;

  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'provinsiId must be a number' },
  )
  provinsiId: number;
}
