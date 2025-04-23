import { Chance } from 'chance';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import {
  InvalidUuidError,
  Uuid,
} from '../../../../shared/domain/value-objects/uuid.value-object';
import { setupSequelize } from '../../../../shared/infra/testing/helpers';
import { CategoryBuilder } from '../../../domain/category.builder';
import { CategorySequelizeRepository } from '../../../infra/db/sequelize/category-sequelize.repository';
import { CategoryModel } from '../../../infra/db/sequelize/category.model';
import { UpdateCategoryUseCase } from './update-category.use-case';
import { EntityValidationError } from '../../../../shared/domain/errors/validation.error';

const chance = new Chance();
describe('UpdateCategoryUseCase Integration Tests', () => {
  let useCase: UpdateCategoryUseCase;
  let repository: CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new UpdateCategoryUseCase(repository);
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

  it('should update name and description', async () => {
    const entity = new CategoryBuilder()
      .withName('Original Name')
      .withDescription('Original Description')
      .activate()
      .build();

    await repository.insert(entity);

    const beforeUpdate = new Date(entity.updated_at);

    const input = {
      category_id: entity.category_id.id,
      name: 'Updated Name',
      description: 'Updated Description',
    };

    const output = await useCase.execute(input);

    expect(output.name).toBe('Updated Name');
    expect(output.description).toBe('Updated Description');
    expect(output.is_active).toBe(true);
    expect(output.updated_at.getTime()).toBeGreaterThan(beforeUpdate.getTime());

    const updatedModel = await CategoryModel.findByPk(entity.category_id.id);
    expect(updatedModel?.name).toBe('Updated Name');
    expect(updatedModel?.description).toBe('Updated Description');
  });

  it('should activate a previously inactive category', async () => {
    const entity = new CategoryBuilder().deactivate().build();
    await repository.insert(entity);

    const output = await useCase.execute({
      category_id: entity.category_id.id,
      is_active: true,
    });

    expect(output.is_active).toBe(true);

    const updated = await repository.findById(entity.category_id);
    expect(updated?.is_active).toBe(true);
  });

  it('should deactivate a previously active category', async () => {
    const entity = new CategoryBuilder().activate().build();
    await repository.insert(entity);

    const output = await useCase.execute({
      category_id: entity.category_id.id,
      is_active: false,
    });

    expect(output.is_active).toBe(false);

    const updated = await repository.findById(entity.category_id);
    expect(updated?.is_active).toBe(false);
  });

  it('should perform a no-op update when no fields are provided', async () => {
    const entity = new CategoryBuilder()
      .withName('Same Name')
      .activate()
      .build();
    await repository.insert(entity);

    const beforeUpdate = new Date(entity.updated_at);

    const output = await useCase.execute({
      category_id: entity.category_id.id,
    });

    expect(output.name).toBe('Same Name');
    expect(output.description).toBe(null);
    expect(output.is_active).toBe(true);
    expect(output.updated_at.getTime()).toEqual(beforeUpdate.getTime());
  });

  it('should throw when model has invalid name', async () => {
    const category = new CategoryBuilder().withName('Initial Name').build();

    await repository.insert(category);

    await expect(
      useCase.execute({
        category_id: category.category_id.id,
        name: chance.word({ length: 256 }),
      }),
    ).rejects.toThrow(EntityValidationError);
  });
});
