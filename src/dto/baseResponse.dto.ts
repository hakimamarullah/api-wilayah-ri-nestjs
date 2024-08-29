import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class BaseResponse<T> {
  responseCode: number;

  responseMessage: string;

  @ApiProperty({ type: () => Object })
  responseData: T | undefined;

  static getSuccessResponse<T>(data?: T, message?: string) {
    const response: BaseResponse<T> = new BaseResponse();
    response.responseCode = HttpStatus.OK;
    response.responseMessage = message ?? 'Success';
    response.responseData = data ?? undefined;
    return response;
  }
}
