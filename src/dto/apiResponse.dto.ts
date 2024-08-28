import { HttpStatus } from '@nestjs/common';

export class ApiResponse {
  responseCode: number;

  responseMessage: string;

  responseData: any;

  static getSuccessResponse(message?: string) {
    const response: ApiResponse = new ApiResponse();
    response.responseCode = HttpStatus.OK;
    response.responseMessage = message ?? 'Success';
    return response;
  }
}
