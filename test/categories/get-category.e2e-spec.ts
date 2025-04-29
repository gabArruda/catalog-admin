import { HttpStatus } from '@nestjs/common';
import request from 'supertest';

import { startApp } from 'src/nest-modules/shared-module/testing/helpers';
import { CATEGORY_PROVIDERS } from 'src/nest-modules/categories-module/categories.providers';
import { ICategoryRepository } from '@core/category/domain/category.repository.interface';
import { CategoryBuilder } from '@core/category/domain/category.builder';
import { GetCategoryFixture } from 'src/nest-modules/categories-module/category.fixture';
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

describe('CategoriesController (e2e)', () => {
  const appHelper = startApp();

  describe('/categories/:id (GET)', () => {
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

    it('should return a category ', async () => {
      const categoryRepo = appHelper.app.get<ICategoryRepository>(
        CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
      );
      const category = new CategoryBuilder().build();
      await categoryRepo.insert(category);

      const res = await request(appHelper.app.getHttpServer())
        .get(`/categories/${category.category_id.id}`)
        .expect(200);

      const body = res.body as CategoryResponse;
      const keyInResponse = GetCategoryFixture.keysInResponse;
      expect(Object.keys(body)).toStrictEqual(['data']);
      expect(Object.keys(body.data)).toStrictEqual(keyInResponse);

      const presenter = CategoriesController.serialize(
        CategoryOutputMapper.toOutput(category),
      );
      const serialized = instanceToPlain(presenter);
      for (const key of ['created_at', 'updated_at', 'deleted_at']) {
        if (serialized[key]) {
          serialized[key] = new Date(serialized[key] as Date).toISOString();
        }
      }
      expect(body.data).toMatchObject(serialized);
    });
  });
});
