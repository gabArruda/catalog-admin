import { CategoryModel } from './category.model';
import { CategoryBuilder } from '../../../domain/category.builder';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.value-object';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import { CategorySequelizeRepository } from './category-sequelize.repository';
import { CategorySearchInput } from '../../../domain/category.repository.interface';
import { setupSequelize } from '../../../../shared/infra/testing/helpers';

describe('CategorySequelizeRepository Integration Tests', () => {
  let categoryRepository: CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    categoryRepository = new CategorySequelizeRepository(CategoryModel);
  });

  describe('search method tests', () => {
    it('should return paginated and filtered results', async () => {
      const builder = new CategoryBuilder();
      const categoryA = builder.withName('Node').build();
      const categoryB = builder.withName('Nest').build();
      const categoryC = builder.withName('Express').build();

      await categoryRepository.bulkInsert([categoryA, categoryB, categoryC]);

      const input = new CategorySearchInput({
        page: 1,
        per_page: 2,
        filter: 's',
        sort: 'name',
        sort_dir: 'asc',
      });

      const output = await categoryRepository.search(input);

      expect(output.total).toBe(2);
      expect(output.items.length).toBe(2);
      expect(output.items[0].name).toBe('Express');
      expect(output.items[1].name).toBe('Nest');
    });

    it('should sort by created_at desc when no sort is given', async () => {
      const now = new Date();
      const builder = new CategoryBuilder();
      const categoryA = builder
        .withName('Category A')
        .withCreatedAt(new Date(now.getTime() - 1000))
        .build();
      const categoryB = builder
        .withName('Category B')
        .withCreatedAt(now)
        .build();

      await categoryRepository.bulkInsert([categoryA, categoryB]);

      const input = new CategorySearchInput({
        page: 1,
        per_page: 10,
      });

      const output = await categoryRepository.search(input);

      expect(output.items[0].name).toBe('Category B');
      expect(output.items[1].name).toBe('Category A');
    });

    it('should return empty result for unmatched filter', async () => {
      const category = new CategoryBuilder().withName('JavaScript').build();
      await categoryRepository.insert(category);

      const input = new CategorySearchInput({
        page: 1,
        per_page: 5,
        filter: 'Python',
      });

      const output = await categoryRepository.search(input);

      expect(output.total).toBe(0);
      expect(output.items).toHaveLength(0);
    });

    it('should handle pagination correctly', async () => {
      const builder = new CategoryBuilder();
      const categories = builder.buildMany(5, [
        { name: 'One' },
        { name: 'Two' },
        { name: 'Three' },
        { name: 'Four' },
        { name: 'Five' },
      ]);

      await categoryRepository.bulkInsert(categories);

      const input = new CategorySearchInput({
        page: 2,
        per_page: 2,
        sort: 'name',
        sort_dir: 'asc',
      });

      const output = await categoryRepository.search(input);

      expect(output.total).toBe(5);
      expect(output.current_page).toBe(2);
      expect(output.items).toHaveLength(2);
      expect(output.items[0].name).toBe('One');
      expect(output.items[1].name).toBe('Three');
    });

    it('should not crash on invalid sort field (defaults to created_at)', async () => {
      const builder = new CategoryBuilder();
      const category = builder.build();
      await categoryRepository.insert(category);

      const input = new CategorySearchInput({
        page: 1,
        per_page: 1,
        sort: 'invalid_field' as any,
      });

      const output = await categoryRepository.search(input);

      expect(output.total).toBe(1);
      expect(output.items[0].name).toBe(category.name);
    });
  });

  it('should insert a category', async () => {
    let category = new CategoryBuilder().build();
    await categoryRepository.insert(category);

    let model = await CategoryModel.findByPk(category.category_id.id);
    expect(model?.toJSON()).toStrictEqual(category.toJSON());

    category = new CategoryBuilder()
      .withName('Movie')
      .withDescription('Movie Description')
      .activate()
      .build();
    await categoryRepository.insert(category);
    model = await CategoryModel.findByPk(category.category_id.id);
    expect(model?.toJSON()).toStrictEqual(category.toJSON());
  });

  it('should bulk insert categories', async () => {
    const category1 = new CategoryBuilder().build();
    const category2 = new CategoryBuilder().build();
    const category3 = new CategoryBuilder().build();
    const categories = [category1, category2, category3];

    await categoryRepository.bulkInsert(categories);

    const models = await CategoryModel.findAll();

    expect(models).toHaveLength(3);
  });

  it('should update a category', async () => {
    const category = new CategoryBuilder().build();
    await expect(categoryRepository.update(category)).rejects.toThrow(
      NotFoundError,
    );

    await categoryRepository.insert(category);
    category.activate();
    category.changeDescription('New desription');
    await categoryRepository.update(category);

    const categoryUpdated = await categoryRepository.findById(
      category.category_id,
    );
    expect(categoryUpdated).toStrictEqual(category);
  });

  it('should delete a category', async () => {
    const category = new CategoryBuilder().build();
    await expect(
      categoryRepository.delete(category.category_id),
    ).rejects.toThrow(NotFoundError);

    await categoryRepository.insert(category);
    let categoryInserted = await categoryRepository.findById(
      category.category_id,
    );
    expect(categoryInserted).toBeDefined();

    await categoryRepository.delete(category.category_id);
    categoryInserted = await categoryRepository.findById(category.category_id);

    expect(categoryInserted).toBeNull();
  });

  it('should find a category by id and return it or null if not found', async () => {
    let modelFound = await categoryRepository.findById(new Uuid());
    expect(modelFound).toBeNull();

    const category = new CategoryBuilder().build();
    await categoryRepository.insert(category);
    modelFound = await categoryRepository.findById(category.category_id);
    expect(modelFound?.toJSON()).toStrictEqual(category.toJSON());
  });

  it('should find all categories', async () => {
    let categoriesFound = await categoryRepository.findAll();
    expect(categoriesFound).toHaveLength(0);

    const category1 = new CategoryBuilder().build();
    await categoryRepository.insert(category1);
    const category2 = new CategoryBuilder().build();
    await categoryRepository.insert(category2);

    categoriesFound = await categoryRepository.findAll();
    expect(categoriesFound).toHaveLength(2);
    expect(categoriesFound).toEqual([category1, category2]);
  });
});
