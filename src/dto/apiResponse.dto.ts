import { HttpStatus } from '@nestjs/common';

export class ApiResponse {
  responseCode: number;

  responseMessage: string;

  responseData: any;

  static getSuccessResponse() {
    const response: ApiResponse = new ApiResponse();
    response.responseCode = HttpStatus.OK;
    response.responseMessage = 'Success';
    return response;
  }
}
