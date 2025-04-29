import { Entity } from '@core/shared/domain/entity';
import { NotFoundErrorFilter } from './not-found-error.filter';
import { Controller, Get, HttpStatus, INestApplication } from '@nestjs/common';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { Server } from 'http';

class StubEntity extends Entity {
  entity_id: any;
  toJSON(): Required<object> {
    return {};
  }
}

@Controller('stub')
class StubController {
  @Get()
  index() {
    throw new NotFoundError('fake id', StubEntity);
  }
}

describe('NotFoundErrorFilter', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [StubController],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new NotFoundErrorFilter());
    await app.init();
  });
  it('should be defined', () => {
    expect(new NotFoundErrorFilter()).toBeDefined();
  });

  it('should catch a NotFoundError', () => {
    return request(app.getHttpServer() as Server)
      .get('/stub')
      .expect(404)
      .expect({
        statusCode: HttpStatus.NOT_FOUND,
        error: 'Not Found',
        message: 'StubEntity Not Found using ID: fake id',
      });
  });
});
