import { UpdateCategoryInput } from '@core/category/application/use-cases/update/update-category.input';
import { OmitType } from '@nestjs/mapped-types';

class UpdateCategoryInputWithoutId extends OmitType(UpdateCategoryInput, [
  'category_id',
] as const) {}

export class UpdateCategoryDto extends UpdateCategoryInputWithoutId {}
