import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Response<T> {
  data?: T;

  [propsName: string]: any;
}

/**
 * 基本的拦截响应信息
 */
@Injectable()
export class BaseTransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        if (!data) {
          throw new HttpException('Data Not Found', HttpStatus.NOT_FOUND);
        }
        return Object.assign(
          {},
          {
            code: 0,
            message: (typeof data === 'string' && data) || '请求成功'
          },
          (data instanceof Object && {data}) || {}
        );
      })
    );
  }
}
