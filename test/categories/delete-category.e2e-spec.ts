import request from 'supertest';

import { ICategoryRepository } from '@core/category/domain/category.repository.interface';
import { CATEGORY_PROVIDERS } from 'src/nest-modules/categories-module/categories.providers';

import { startApp } from 'src/nest-modules/shared-module/testing/helpers';
import { HttpStatus } from '@nestjs/common';
import { CategoryBuilder } from '@core/category/domain/category.builder';

describe('CategoriesController (e2e)', () => {
  const appHelper = startApp();

  describe('/categories/:id (DELETE)', () => {
    describe('should error when id is invalid or not found', () => {
      const arrange = [
        {
          id: '88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
          expected: {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Not Found',
            message:
              'Category Not Found using ID: 88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
          },
        },
        {
          id: 'fake id',
          expected: {
            statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            error: 'Unprocessable Entity',
            message: 'Validation failed (uuid is expected)',
          },
        },
      ];

      it.each(arrange)('when id is $id', async ({ id, expected }) => {
        await request(appHelper.app.getHttpServer())
          .delete(`/categories/${id}`)
          .expect(expected.statusCode)
          .expect(expected);
      });
    });

    it('should delete a category with status 204', async () => {
      const categoryRepo = appHelper.app.get<ICategoryRepository>(
        CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
      );
      const category = new CategoryBuilder().build();
      await categoryRepo.insert(category);

      await request(appHelper.app.getHttpServer())
        .delete(`/categories/${category.category_id.id}`)
        .expect(204);

      await expect(
        categoryRepo.findById(category.category_id),
      ).resolves.toBeNull();
    });
  });
});
