import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class KabupatenDto {
  id: number;

  @IsString({ message: 'name must be a string' })
  @IsNotEmpty({ message: 'name is required' })
  name: string;

  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'provinsiId must be a number' },
  )
  provinsiId: number;

  static build(kabupaten: any): KabupatenDto {
    const kabupatenDto = new KabupatenDto();
    kabupatenDto.id = kabupaten.id;
    kabupatenDto.name = kabupaten.name;
    kabupatenDto.provinsiId = kabupaten.provinsiId;
    return kabupatenDto;
  }
}
