import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse } from '../../dto/apiResponse.dto';

@Catch(Error)
export class ErrorFilter implements ExceptionFilter<Error> {
  private readonly logger: Logger = new Logger(ErrorFilter.name);
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const response: ApiResponse = new ApiResponse();
    response.responseCode = HttpStatus.INTERNAL_SERVER_ERROR;
    response.responseMessage = exception.message;
    response.responseData = request.url;

    this.logger.log(
      `[ERROR] PATH: ${request.url} | Response: ${JSON.stringify(response)}`,
    );

    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response);
  }
}
