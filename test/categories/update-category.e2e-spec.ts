import { HttpStatus } from '@nestjs/common';
import request from 'supertest';

import { UpdateCategoryFixture } from 'src/nest-modules/categories-module/category.fixture';
import { ICategoryRepository } from '@core/category/domain/category.repository.interface';
import { CATEGORY_PROVIDERS } from 'src/nest-modules/categories-module/categories.providers';

import { startApp } from 'src/nest-modules/shared-module/testing/helpers';
import { CategoryBuilder } from '@core/category/domain/category.builder';
import { Uuid } from '@core/shared/domain/value-objects/uuid.value-object';
import { CategoriesController } from 'src/nest-modules/categories-module/categories.controller';
import { CategoryOutputMapper } from '@core/category/application/use-cases/shared/category.output';
import { instanceToPlain } from 'class-transformer';

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
  const uuid = '9366b7dc-2d71-4799-b91c-c64adb205104';

  beforeEach(() => {
    categoryRepo = appHelper.app.get<ICategoryRepository>(
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
    );
  });

  describe('/categories/:id (PATCH)', () => {
    describe('should error when id is invalid or not found', () => {
      const arrange = [
        {
          id: '88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
          expected: {
            message:
              'Category Not Found using ID: 88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Not Found',
          },
        },
        {
          id: 'fake id',
          expected: {
            statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            message: 'Validation failed (uuid is expected)',
            error: 'Unprocessable Entity',
          },
        },
      ];

      it.each(arrange)('when id is $id', async ({ id, expected }) => {
        await request(appHelper.app.getHttpServer())
          .get(`/categories/${id}`)
          .expect(expected.statusCode)
          .expect(expected);
      });
    });

    describe('should error with 422 when request body is invalid', () => {
      const invalidRequest = UpdateCategoryFixture.arrangeInvalidRequest();
      const arrange: { label: string; value: InvalidRequestEntry }[] =
        Object.entries(invalidRequest).map(([key, value]) => ({
          label: key,
          value: value as InvalidRequestEntry,
        }));
      it.each(arrange)('when body is $label', ({ value }) => {
        return request(appHelper.app.getHttpServer())
          .patch(`/categories/${uuid}`)
          .send(value.send_data)
          .expect(HttpStatus.UNPROCESSABLE_ENTITY)
          .expect(value.expected);
      });
    });

    describe('should error with 422 when throw EntityValidationError', () => {
      const validationError =
        UpdateCategoryFixture.arrangeForEntityValidationError();
      const arrange: { label: string; value: InvalidRequestEntry }[] =
        Object.entries(validationError).map(([key, value]) => ({
          label: key,
          value: value as InvalidRequestEntry,
        }));

      test.each(arrange)('when body is $label', async ({ value }) => {
        const category = new CategoryBuilder().build();
        await categoryRepo.insert(category);
        return request(appHelper.app.getHttpServer())
          .patch(`/categories/${category.category_id.id}`)
          .send(value.send_data)
          .expect(HttpStatus.UNPROCESSABLE_ENTITY)
          .expect(value.expected);
      });
    });

    describe('should update a category', () => {
      const arrange = UpdateCategoryFixture.arrangeForUpdate();

      test.each(arrange)('when body is $send_data', async ({ send_data }) => {
        const categoryCreated = new CategoryBuilder().build();
        await categoryRepo.insert(categoryCreated);

        const res = await request(appHelper.app.getHttpServer())
          .patch(`/categories/${categoryCreated.category_id.id}`)
          .send(send_data)
          .expect(HttpStatus.OK);

        const body = res.body as CategoryResponse;
        const keyInResponse = UpdateCategoryFixture.keysInResponse;
        expect(Object.keys(body)).toStrictEqual(['data']);
        expect(Object.keys(body.data)).toStrictEqual(keyInResponse);
        const id = body.data.id;
        const categoryUpdated = await categoryRepo.findById(new Uuid(id));
        const presenter = CategoriesController.serialize(
          CategoryOutputMapper.toOutput(categoryUpdated!),
        );
        const serialized = instanceToPlain(presenter);
        expect(body.data).toStrictEqual(serialized);
      });
    });
  });
});
