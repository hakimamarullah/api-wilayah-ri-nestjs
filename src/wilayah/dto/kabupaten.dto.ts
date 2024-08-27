export class KabupatenDto {
  private _id: number;
  private _name: string;
  private _provinsiId: number;

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

  get provinsiId(): number {
    return this._provinsiId;
  }

  set provinsiId(value: number) {
    this._provinsiId = value;
  }
}
