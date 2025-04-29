import { Controller, Get, HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { Server } from 'http';
import { EntityValidationError } from '@core/shared/domain/errors/validation.error';
import { EntityValidationErrorFilter } from './entity-validation-error.filter';

@Controller('stub')
class StubController {
  @Get()
  index() {
    throw new EntityValidationError([
      'another error',
      { field1: ['field1 is required'] },
      { field2: ['field2 is required'] },
    ]);
  }
}

describe('EntityValidationErrorFilter', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [StubController],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new EntityValidationErrorFilter());
    await app.init();
  });
  it('should be defined', () => {
    expect(new EntityValidationErrorFilter()).toBeDefined();
  });

  it('should catch a EntityValidationError', () => {
    return request(app.getHttpServer() as Server)
      .get('/stub')
      .expect(422)
      .expect({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        error: 'Unprocessable Entity',
        message: ['another error', 'field1 is required', 'field2 is required'],
      });
  });
});
