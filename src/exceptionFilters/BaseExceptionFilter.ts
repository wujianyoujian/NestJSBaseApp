import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

/**
 * 基本异常的返回信息
 */
@Catch()
export class BaseExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse<Response>();

    const message = exception?.response?.message || exception.message
    const errorResponse = {
      code: -1,
      message: String(message) || '请求失败',
    };
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status);
    response.header('content-Type', 'application/json; charset=utf-8');
    response.send(errorResponse);
  }
}
