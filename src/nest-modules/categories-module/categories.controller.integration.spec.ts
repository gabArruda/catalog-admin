import { ICategoryRepository } from '@core/category/domain/category.repository.interface';
import { CategoriesController } from './categories.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from '../database-module/database.module';
import { ConfigModule } from '../config-module/config.module';
import { CategoriesModule } from './categories.module';
import { CATEGORY_PROVIDERS } from './categories.providers';
import { CreateCategoryUseCase } from '@core/category/application/use-cases/create/create-category.use-case';
import { UpdateCategoryUseCase } from '@core/category/application/use-cases/update/update-category.use-case';
import { ListCategoriesUseCase } from '@core/category/application/use-cases/list/list-categories.use-case';
import { GetCategoryUseCase } from '@core/category/application/use-cases/get/get-category.use-case';
import { DeleteCategoryUseCase } from '@core/category/application/use-cases/delete/delete-category.use-case';
import {
  CreateCategoryFixture,
  ListCategoriesFixture,
  UpdateCategoryFixture,
} from './category.fixture';
import { Uuid } from '@core/shared/domain/value-objects/uuid.value-object';
import { CategoryCollectionPresenter } from './categories.presenter';
import { CategoryBuilder } from '@core/category/domain/category.builder';

describe('CategoriesController Integration Tests', () => {
  let controller: CategoriesController;
  let repository: ICategoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DatabaseModule, CategoriesModule],
    }).compile();
    controller = module.get<CategoriesController>(CategoriesController);
    repository = module.get<ICategoryRepository>(
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(controller['createUseCase']).toBeInstanceOf(CreateCategoryUseCase);
    expect(controller['updateUseCase']).toBeInstanceOf(UpdateCategoryUseCase);
    expect(controller['listUseCase']).toBeInstanceOf(ListCategoriesUseCase);
    expect(controller['getUseCase']).toBeInstanceOf(GetCategoryUseCase);
    expect(controller['deleteUseCase']).toBeInstanceOf(DeleteCategoryUseCase);
  });

  describe('should create a category', () => {
    const arrange = CreateCategoryFixture.arrangeForCreate();
    test.each(arrange)(
      'when body is $send_data',
      async ({ send_data, expected }) => {
        const presenter = await controller.create(send_data);
        const entity = await repository.findById(new Uuid(presenter.id));
        expect(entity!.toJSON()).toStrictEqual({
          category_id: presenter.id,
          created_at: presenter.created_at,
          updated_at: presenter.updated_at,
          ...expected,
        });
        expect(presenter).toMatchObject(expected);
      },
    );
  });

  describe('should update a category', () => {
    const arrange = UpdateCategoryFixture.arrangeForUpdate();

    const category = new CategoryBuilder().build();

    beforeEach(async () => {
      await repository.insert(category);
    });

    it.each(arrange)(
      'when body is $send_data',
      async ({ send_data, expected }) => {
        const presenter = await controller.update(
          category.category_id.id,
          send_data,
        );
        const entity = await repository.findById(new Uuid(presenter.id));
        expect(entity!.toJSON()).toStrictEqual({
          category_id: presenter.id,
          created_at: presenter.created_at,
          updated_at: presenter.updated_at,
          name: expected.name ?? category.name,
          description:
            'description' in expected
              ? expected.description
              : category.description,
          is_active:
            expected.is_active === true || expected.is_active === false
              ? expected.is_active
              : category.is_active,
        });
      },
    );
  });

  it('should delete a category', async () => {
    const category = new CategoryBuilder().build();
    await repository.insert(category);
    const response = await controller.remove(category.category_id.id);
    expect(response).not.toBeDefined();
    await expect(repository.findById(category.category_id)).resolves.toBeNull();
  });

  it('should get a category', async () => {
    const category = new CategoryBuilder().build();
    await repository.insert(category);
    const presenter = await controller.findOne(category.category_id.id);

    expect(presenter.id).toBe(category.category_id.id);
    expect(presenter.name).toBe(category.name);
    expect(presenter.description).toBe(category.description);
    expect(presenter.is_active).toBe(category.is_active);
    expect(presenter.created_at).toStrictEqual(category.created_at);
  });

  describe('search method', () => {
    describe('should sorted categories by created_at', () => {
      const { entitiesMap, arrange } =
        ListCategoriesFixture.arrangeIncrementedWithCreatedAt();

      beforeEach(async () => {
        await repository.bulkInsert(Object.values(entitiesMap));
      });

      it.each(arrange)(
        'when send_data is $send_data',
        async ({ send_data, expected }) => {
          const presenter = await controller.search(send_data);
          const { entities, ...paginationProps } = expected;
          expect(presenter).toEqual(
            new CategoryCollectionPresenter({
              items: entities.map((entity) => {
                return entity.toJSON();
              }),
              ...paginationProps.meta,
            }),
          );
        },
      );
    });

    describe('should return categories using pagination, sort and filter', () => {
      const { entitiesMap, arrange } = ListCategoriesFixture.arrangeUnsorted();

      beforeEach(async () => {
        await repository.bulkInsert(Object.values(entitiesMap));
      });

      test.each(arrange)(
        'when send_data is $send_data',
        async ({ send_data, expected }) => {
          const presenter = await controller.search(send_data);
          const { entities, ...paginationProps } = expected;
          expect(presenter).toEqual(
            new CategoryCollectionPresenter({
              items: entities.map((entity) => {
                return entity.toJSON();
              }),
              ...paginationProps.meta,
            }),
          );
        },
      );
    });
  });
});
