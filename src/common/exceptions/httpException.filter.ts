import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse } from '../../dto/apiResponse.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const response: ApiResponse = new ApiResponse();
    response.responseCode = status;
    response.responseMessage = exception.message;
    response.responseData = request.url;

    res.status(status).json(response);
  }
}
