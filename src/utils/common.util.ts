import { ApiResponse } from '../dto/apiResponse.dto';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { HttpStatus } from '@nestjs/common';
import { getPrismaErrorMessage } from './prisma.util';

export const translatePrismaError = (err: Error, defaultMessage: string) => {
  const response: ApiResponse = new ApiResponse();
  response.responseMessage = defaultMessage;
  switch (err.name) {
    case PrismaClientKnownRequestError.name:
      response.responseCode = HttpStatus.BAD_REQUEST;
      response.responseData = getPrismaErrorMessage(err);
      break;
    case PrismaClientValidationError.name:
      response.responseCode = HttpStatus.BAD_REQUEST;
      const messages = err.message.split('\n');
      response.responseData =
        messages[messages.length - 1]?.trim() ??
        PrismaClientValidationError.name;
      break;
    default:
      response.responseCode = HttpStatus.INTERNAL_SERVER_ERROR;
      break;
  }
  return response;
};
