import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class WrapperDataInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<{ data: unknown } | Record<string, any>> {
    return next.handle().pipe(
      map((body: unknown) => {
        if (
          !body ||
          (typeof body === 'object' && body !== null && 'meta' in body)
        ) {
          return body as Record<string, any>;
        }
        return { data: body };
      }),
    );
  }
}
