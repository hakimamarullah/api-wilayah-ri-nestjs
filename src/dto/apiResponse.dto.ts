export class ApiResponse {
  private _responseCode: number;
  private _responseMessage: string;
  private _responseData: any;

  get responseCode(): number {
    return this._responseCode;
  }

  set responseCode(value: number) {
    this._responseCode = value;
  }

  get responseMessage(): string {
    return this._responseMessage;
  }

  set responseMessage(value: string) {
    this._responseMessage = value;
  }

  get responseData(): any {
    return this._responseData;
  }

  set responseData(value: any) {
    this._responseData = value;
  }
}
