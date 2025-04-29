import { Category } from '@core/category/domain/category.entity';

export type CategoryOutput = {
  category_id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
};

export class CategoryOutputMapper {
  static toOutput(entity: Category): CategoryOutput {
    const { category_id, ...otherProps } = entity.toJSON();
    return {
      category_id: category_id,
      ...otherProps,
    };
  }
}
