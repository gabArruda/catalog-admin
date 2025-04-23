import { ListCategoriesUseCase } from './list-categories.use-case';
import { CategoryInMemoryRepository } from '../../../infra/db/in-memory/category-in-memory.repository';
import { CategoryBuilder } from '../../../domain/category.builder';

describe('ListCategoriesUseCase Unit Tests', () => {
  let useCase: ListCategoriesUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new ListCategoriesUseCase(repository);
  });

  it('should return empty result', async () => {
    const output = await useCase.execute({});
    expect(output.total).toBe(0);
    expect(output.items).toHaveLength(0);
  });

  it('should list all categories', async () => {
    const categories = [
      new CategoryBuilder().withName('Movie').build(),
      new CategoryBuilder().withName('Documentary').build(),
    ];

    await repository.bulkInsert(categories);

    const output = await useCase.execute({});
    expect(output.total).toBe(2);
    expect(output.items.map((i) => i.name)).toEqual(
      expect.arrayContaining(['Movie', 'Documentary']),
    );
  });

  it('should apply pagination, sorting and filtering', async () => {
    const categories = [
      new CategoryBuilder().withName('b').build(),
      new CategoryBuilder().withName('a').build(),
      new CategoryBuilder().withName('c').build(),
    ];

    await repository.bulkInsert(categories);

    const output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: 'name',
      sort_dir: 'asc',
    });

    expect(output.total).toBe(3);
    expect(output.per_page).toBe(2);
    expect(output.last_page).toBe(2);
    expect(output.items).toHaveLength(2);
    expect(output.items[0].name).toBe('a');
    expect(output.items[1].name).toBe('b');
  });
});
