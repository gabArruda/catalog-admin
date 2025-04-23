import { CategoryModel } from './category.model';
import { Category } from '../../../domain/category.entity';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.value-object';
import Chance from 'chance';
import { CategoryModelMapper } from './category-model-mapper';
import { EntityValidationError } from '../../../../shared/domain/errors/validation.error';
import { setupSequelize } from '../../../../shared/infra/testing/helpers';

const chance = new Chance();

describe('CategoryModelMapper Integration', () => {
  setupSequelize({ models: [CategoryModel] });

  const baseProps = {
    category_id: new Uuid(),
    name: chance.word(),
    description: chance.sentence({ words: 5 }),
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  };

  describe('toModel', () => {
    it('should map a Category entity to CategoryModel instance', async () => {
      const entity = new Category({ ...baseProps });

      const modelPlain = CategoryModelMapper.toModel(entity);

      const created = await CategoryModel.create(modelPlain);

      expect(created.category_id).toBe(entity.category_id.id);
      expect(created.name).toBe(entity.name);
      expect(created.description).toBe(entity.description);
    });
  });

  describe('toEntity', () => {
    it('should map a CategoryModel instance to a Category entity', async () => {
      const model = await CategoryModel.create({
        ...baseProps,
        category_id: baseProps.category_id.id,
      });

      const entity = CategoryModelMapper.toEntity(model);

      expect(entity).toBeInstanceOf(Category);
      expect(entity.category_id.id).toBe(model.category_id);
      expect(entity.name).toBe(model.name);
      expect(entity.description).toBe(model.description);
    });

    it('should throw when model has invalid name', () => {
      const invalidModel = {
        ...baseProps,
        category_id: baseProps.category_id.id,
        name: chance.word({ length: 256 }),
      } as any as CategoryModel;

      expect(() => CategoryModelMapper.toEntity(invalidModel)).toThrow(
        EntityValidationError,
      );
    });
  });
});
