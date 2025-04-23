import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import {
  InvalidUuidError,
  Uuid,
} from '../../../../shared/domain/value-objects/uuid.value-object';
import { setupSequelize } from '../../../../shared/infra/testing/helpers';
import { CategoryBuilder } from '../../../domain/category.builder';
import { CategorySequelizeRepository } from '../../../infra/db/sequelize/category-sequelize.repository';
import { CategoryModel } from '../../../infra/db/sequelize/category.model';
import { GetCategoryUseCase } from './get-category.use-case';

describe('GetCategoryUseCase Integration Tests', () => {
  let useCase: GetCategoryUseCase;
  let repository: CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new GetCategoryUseCase(repository);
  });

  it('should throw when category is invalid or not found', async () => {
    await expect(useCase.execute({ category_id: 'invalid' })).rejects.toThrow(
      InvalidUuidError,
    );
    const uuid = new Uuid();
    await expect(useCase.execute({ category_id: uuid.id })).rejects.toThrow(
      NotFoundError,
    );
  });

  it('should get category data by ID', async () => {
    const category = new CategoryBuilder().build();
    await repository.insert(category);

    const input = { category_id: category.category_id.id };
    const output = await useCase.execute(input);

    expect(output.category_id).toBe(category.category_id.id);
    expect(output.name).toBe(category.name);
    expect(output.description).toBe(category.description);
    expect(output.is_active).toBe(category.is_active);
    expect(output.created_at).toEqual(category.created_at);
    expect(output.updated_at).toEqual(category.updated_at);
  });
});
