import { CategoryBuilder } from './category.builder';
import { Uuid } from '../../shared/domain/value-objects/uuid.value-object';
import { Category } from './category.entity';

jest.mock('./category.entity', () => {
  const original = jest.requireActual('./category.entity');
  return {
    ...original,
    Category: class extends original.Category {
      validate = jest.fn();
    },
  };
});

describe('CategoryBuilder Unit Tests', () => {
  it('should build a single valid Category with random values', () => {
    const builder = new CategoryBuilder();
    const category = builder.build();

    expect(category).toBeInstanceOf(Category);
    expect(typeof category.name).toBe('string');
    expect(category.validate).toHaveBeenCalledTimes(1);
  });

  it('should use custom values when provided', () => {
    const customName = 'Custom Category';
    const customDesc = 'Custom Description';
    const customDate = new Date();
    const category = new CategoryBuilder()
      .withName(customName)
      .withDescription(customDesc)
      .withCreatedAt(customDate)
      .withUpdatedAt(customDate)
      .activate()
      .build();

    expect(category.name).toBe(customName);
    expect(category.description).toBe(customDesc);
    expect(category.is_active).toBe(true);
    expect(category.created_at).toBe(customDate);
    expect(category.updated_at).toBe(customDate);
    expect(category.validate).toHaveBeenCalledTimes(1);
  });

  it('should reset builder state after build()', () => {
    const builder = new CategoryBuilder().withName('One');
    const category1 = builder.build();
    const category2 = builder.build();

    expect(category1.name).toBe('One');
    expect(category2.name).not.toBe('One');
  });

  it('should build multiple Categories with random values', () => {
    const builder = new CategoryBuilder();
    const categories = builder.buildMany(3);

    expect(categories).toHaveLength(3);
    expect(categories[0]).toBeInstanceOf(Category);
  });

  it('should build multiple Categories with different overrides', () => {
    const builder = new CategoryBuilder();
    const overrides = [
      { name: 'category1', is_active: true },
      { name: 'category2', description: 'Test desc' },
      { name: 'category3', description: null, is_active: false },
    ];

    const categories = builder.buildMany(3, overrides);

    expect(categories).toHaveLength(3);
    expect(categories[0].name).toBe('category1');
    expect(categories[0].is_active).toBe(true);

    expect(categories[1].name).toBe('category2');
    expect(categories[1].description).toBe('Test desc');

    expect(categories[2].name).toBe('category3');
    expect(categories[2].description).toBeNull();
    expect(categories[2].is_active).toBe(false);

    for (const category of categories) {
      expect(category.validate).toHaveBeenCalled();
    }
  });

  it('should allow reuse of builder after buildMany', () => {
    const builder = new CategoryBuilder().withName('temp');
    builder.buildMany(1, [{ name: 'first' }]);

    const nextCategory = builder.build();
    expect(nextCategory.name).not.toBe('temp'); // reset should've cleared it
  });

  it('should accept custom UUID', () => {
    const uuid = new Uuid();
    const category = new CategoryBuilder().withId(uuid).build();

    expect(category.category_id).toEqual(uuid);
  });
});
