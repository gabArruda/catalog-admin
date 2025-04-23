import { CategorySequelizeRepository } from '../../../infra/db/sequelize/category-sequelize.repository';
import { CategoryModel } from '../../../infra/db/sequelize/category.model';
import { ListCategoriesUseCase } from './list-categories.use-case';
import { setupSequelize } from '../../../../shared/infra/testing/helpers';
import { CategoryBuilder } from '../../../domain/category.builder';

describe('ListCategoriesUseCase Integration Tests', () => {
  let useCase: ListCategoriesUseCase;
  let repository: CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new ListCategoriesUseCase(repository);
  });

  it('should return empty result', async () => {
    const output = await useCase.execute({});
    expect(output.total).toBe(0);
    expect(output.items).toHaveLength(0);
  });

  it('should return categories sorted by name', async () => {
    const categories = [
      new CategoryBuilder().withName('Zeta').build(),
      new CategoryBuilder().withName('Alpha').build(),
      new CategoryBuilder().withName('Beta').build(),
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
    expect(output.items[0].name).toBe('Alpha');
    expect(output.items[1].name).toBe('Beta');
  });

  it('should apply filter', async () => {
    const categories = [
      new CategoryBuilder().withName('Movies').build(),
      new CategoryBuilder().withName('Music').build(),
      new CategoryBuilder().withName('Games').build(),
    ];
    await repository.bulkInsert(categories);
    const output = await useCase.execute({ filter: 'Mu' });
    expect(output.total).toBe(1);
    expect(output.items[0].name).toBe('Music');
  });
});
