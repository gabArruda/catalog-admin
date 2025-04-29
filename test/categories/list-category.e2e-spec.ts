import { HttpStatus } from '@nestjs/common';
import request from 'supertest';

import { ListCategoriesFixture } from 'src/nest-modules/categories-module/category.fixture';
import { ICategoryRepository } from '@core/category/domain/category.repository.interface';
import { CATEGORY_PROVIDERS } from 'src/nest-modules/categories-module/categories.providers';

import { startApp } from 'src/nest-modules/shared-module/testing/helpers';
import { instanceToPlain } from 'class-transformer';
import { CategoriesController } from 'src/nest-modules/categories-module/categories.controller';
import { CategoryOutputMapper } from '@core/category/application/use-cases/shared/category.output';

describe('CategoriesController (e2e)', () => {
  const appHelper = startApp();
  let categoryRepo: ICategoryRepository;
  const { entitiesMap, arrange } =
    ListCategoriesFixture.arrangeIncrementedWithCreatedAt();

  beforeEach(async () => {
    categoryRepo = appHelper.app.get<ICategoryRepository>(
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
    );
    await categoryRepo.bulkInsert(Object.values(entitiesMap));
  });
  describe('/categories (GET)', () => {
    describe('should return categories sorted by created_at when request query is empty', () => {
      it.each(arrange)(
        'when query params is $send_data',
        async ({ send_data, expected }) => {
          const queryParams = toUrlSearchParams(send_data);
          return request(appHelper.app.getHttpServer())
            .get(`/categories/?${queryParams}`)
            .expect(HttpStatus.OK)
            .expect({
              data: expected.entities.map((e) =>
                instanceToPlain(
                  CategoriesController.serialize(
                    CategoryOutputMapper.toOutput(e),
                  ),
                ),
              ),
              meta: expected.meta,
            });
        },
      );
    });

    describe('should return categories using paginate, filter and sort', () => {
      it.each([arrange])(
        'when query params is $send_data',
        async ({ send_data, expected }) => {
          const queryParams = toUrlSearchParams(send_data);
          return request(appHelper.app.getHttpServer())
            .get(`/categories/?${queryParams}`)
            .expect(200)
            .expect({
              data: expected.entities.map((e) =>
                instanceToPlain(
                  CategoriesController.serialize(
                    CategoryOutputMapper.toOutput(e),
                  ),
                ),
              ),
              meta: expected.meta,
            });
        },
      );
    });
  });
});

function toUrlSearchParams(obj: Record<string, any>): string {
  return new URLSearchParams(
    Object.entries(obj)
      .filter(([, v]) => v !== undefined && v !== null)
      .reduce(
        (acc, [k, v]) => {
          acc[k] = String(v);
          return acc;
        },
        {} as Record<string, string>,
      ),
  ).toString();
}
