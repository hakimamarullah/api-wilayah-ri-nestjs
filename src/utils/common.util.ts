import { ApiResponse } from '../dto/apiResponse.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { HttpStatus } from '@nestjs/common';
import { getPrismaErrorMessage } from './prisma.util';

export const getErrorResponse = (err: any, defaultMessage: string) => {
  const response: ApiResponse = new ApiResponse();
  response.responseMessage = defaultMessage;
  if (err instanceof PrismaClientKnownRequestError) {
    response.responseCode = HttpStatus.BAD_REQUEST;
    response.responseData = getPrismaErrorMessage(err);
  } else {
    response.responseCode = HttpStatus.INTERNAL_SERVER_ERROR;
    response.responseData = err.message;
  }
  return response;
};
