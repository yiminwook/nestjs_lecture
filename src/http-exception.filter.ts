import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const exceptionResponse: any = exception.getResponse();
    const message = exceptionResponse.message;

    const errorResponse = {
      statusCode: status,
      error: exceptionResponse.error || 'Internal Server Error',
      message: Array.isArray(message) ? message : [message], // 메시지를 배열로 변환
    };

    response.status(status).json(errorResponse);
  }
}
