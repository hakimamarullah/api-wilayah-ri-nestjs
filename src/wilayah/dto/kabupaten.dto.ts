import { IsNumber, ValidateIf } from 'class-validator';

export class KabupatenDto {
  id: number;

  @ValidateIf(
    (o, value) => value !== null && value !== undefined && value !== '',
  )
  name: string;

  @IsNumber()
  provinsiId: number;
}
