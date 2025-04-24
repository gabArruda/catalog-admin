import { EntityValidationError } from '@core/shared/domain/errors/validation.error';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(EntityValidationError)
export class EntityValidationErrorFilter implements ExceptionFilter {
  catch(exception: EntityValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();

    const messages = Array.from(
      new Set(
        exception.error.flatMap((error) => {
          if (typeof error === 'string') {
            return [error];
          }

          if (typeof error === 'object' && error !== null) {
            return Object.values(error).flatMap((val) =>
              Array.isArray(val) ? val : [val],
            );
          }

          return [];
        }),
      ),
    );

    response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      statuscode: HttpStatus.UNPROCESSABLE_ENTITY,
      error: 'Unprocessable Entity',
      message: messages,
    });
  }
}
