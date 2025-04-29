import { HttpStatus } from '@nestjs/common';
import request from 'supertest';

import { CreateCategoryFixture } from 'src/nest-modules/categories-module/category.fixture';
import { ICategoryRepository } from '@core/category/domain/category.repository.interface';
import { CATEGORY_PROVIDERS } from 'src/nest-modules/categories-module/categories.providers';

import { startApp } from 'src/nest-modules/shared-module/testing/helpers';
import { Uuid } from '@core/shared/domain/value-objects/uuid.value-object';

type CategoryResponse = {
  data: {
    id: string;
    name: string;
    description: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
};

type InvalidRequestEntry = {
  send_data: Record<string, any>;
  expected: {
    message: string[];
    statusCode: number;
    error: string;
  };
};
describe('CategoriesController (e2e)', () => {
  const appHelper = startApp();
  let categoryRepo: ICategoryRepository;

  beforeEach(() => {
    categoryRepo = appHelper.app.get<ICategoryRepository>(
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
    );
  });
  describe('/categories (POST)', () => {
    describe('should create a category', () => {
      const arrange = CreateCategoryFixture.arrangeForCreate();
      it.each(arrange)(
        'when body is $send_data',
        async ({ send_data, expected }) => {
          const res = await request(appHelper.app.getHttpServer())
            .post('/categories')
            .send(send_data)
            .expect(HttpStatus.CREATED);

          const body = res.body as CategoryResponse;
          const keysInResponse = CreateCategoryFixture.keysInResponse;
          expect(Object.keys(body)).toStrictEqual(['data']);
          expect(Object.keys(body.data)).toStrictEqual(keysInResponse);

          const id = body.data.id;
          const categoryCreated = await categoryRepo.findById(new Uuid(id));
          expect(categoryCreated).not.toBeNull();
          expect(categoryCreated!.toJSON()).toStrictEqual({
            category_id: body.data.id,
            created_at: new Date(body.data.created_at),
            updated_at: new Date(body.data.updated_at),
            ...expected,
          });
        },
      );
    });

    describe('should error with status 422 when body is invalid', () => {
      const invalidRequest = CreateCategoryFixture.arrangeInvalidRequest();
      const arrange: { label: string; value: InvalidRequestEntry }[] =
        Object.entries(invalidRequest).map(([key, value]) => ({
          label: key,
          value,
        }));

      it.each(arrange)('when body is $label', async ({ value }) => {
        await request(appHelper.app.getHttpServer())
          .post('/categories')
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('should error with status 422 when EntityValidationError', () => {
      const invalidRequest =
        CreateCategoryFixture.arrangeForEntityValidationError();
      const arrange: { label: string; value: InvalidRequestEntry }[] =
        Object.entries(invalidRequest).map(([key, value]) => ({
          label: key,
          value: value as InvalidRequestEntry,
        }));

      it.each(arrange)('when body is $label', async ({ value }) => {
        await request(appHelper.app.getHttpServer())
          .post('/categories')
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });
  });
});
