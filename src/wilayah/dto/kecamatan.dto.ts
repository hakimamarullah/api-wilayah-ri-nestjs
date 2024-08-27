export class KecamatanDto {
  private _id: number;
  private _name: string;
  private _kabupatenId: number;
  private _zipCode: string;

  get zipCode(): string {
    return this._zipCode;
  }

  set zipCode(value: string) {
    this._zipCode = value;
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

  get kabupatenId(): number {
    return this._kabupatenId;
  }

  set kabupatenId(value: number) {
    this._kabupatenId = value;
  }
}
