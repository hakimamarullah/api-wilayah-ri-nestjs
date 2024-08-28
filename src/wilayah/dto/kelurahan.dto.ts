import { IsNumber, ValidateIf } from 'class-validator';

export class KelurahanDto {
  private _id: number;

  @ValidateIf(
    (o, value) => value !== null && value !== undefined && value !== '',
  )
  private _name: string;

  @IsNumber()
  private _kecamatanId: number;

  get kecamatanId(): number {
    return this._kecamatanId;
  }

  set kecamatanId(value: number) {
    this._kecamatanId = value;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }
}
