import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse } from '../../dto/apiResponse.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { translatePrismaError } from '../../utils/common.util';

@Catch(Error)
export class ErrorFilter implements ExceptionFilter<Error> {
  private readonly logger: Logger = new Logger(ErrorFilter.name);
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const response: ApiResponse = this.getErrorResponse(exception, request);
    this.logger.log(
      `[ERROR] PATH: ${request.url} | Response: ${JSON.stringify(response)}`,
    );

    res.status(response.responseCode).json(response);
  }

  getResponseCode(e: Error) {
    switch ((e as any).name) {
      case BadRequestException.name:
        return HttpStatus.BAD_REQUEST;
      case PrismaClientKnownRequestError.name:
        return HttpStatus.BAD_REQUEST;
      case NotFoundException.name:
        return HttpStatus.NOT_FOUND;
      case HttpException.name:
        return (e as HttpException).getStatus();
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  getErrorResponse(e: Error, request: Request): ApiResponse {
    const response: ApiResponse = new ApiResponse();
    if (e instanceof PrismaClientKnownRequestError) {
      return translatePrismaError(e, 'Operasi Database Gagal');
    } else {
      response.responseCode = this.getResponseCode(e);
      response.responseMessage = e.message;
      response.responseData = request.url;
    }
    return response;
  }
}
