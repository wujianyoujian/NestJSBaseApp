import { ArgumentsHost, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

/**
 * 基本异常的返回信息
 */
export class BaseExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    let message = exception.message;
    let isDeepestMessage = false;
    while (!isDeepestMessage) {
      isDeepestMessage = !message.message;
      message = isDeepestMessage ? message : message.message;
    }
    const errorResponse = {
      code: -1,
      message: message || '请求失败',
    };
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status);
    response.header('content-Type', 'application/json; charset=utf-8');
    response.send(errorResponse);
  }
}