import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(NotFoundError)
export class NotFoundErrorFilter implements ExceptionFilter {
  catch(exception: NotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();

    response.status(HttpStatus.NOT_FOUND).json({
      statuscode: HttpStatus.NOT_FOUND,
      error: 'Not Found',
      message: exception.message,
    });
  }
}
