import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import {
  InvalidUuidError,
  Uuid,
} from '../../../../shared/domain/value-objects/uuid.value-object';
import { CategoryBuilder } from '../../../domain/category.builder';
import { CategoryInMemoryRepository } from '../../../infra/db/in-memory/category-in-memory.repository';
import { GetCategoryUseCase } from './get-category.use-case';

describe('GetCategoryUseCase Unit Tests', () => {
  let useCase: GetCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
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

  it('should get a category', async () => {
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
