import { IUseCase } from "../../../../shared/application/use-case.interface";
import { EntityValidationError } from "../../../../shared/domain/errors/validation.error";
import { Category } from "../../../domain/category.entity";
import { ICategoryRepository } from "../../../domain/category.repository.interface";
import { CategoryOutput } from "../shared/category.output";

export type CreateCategoryInput = {
  name: string;
  description?: string | null;
  is_active?: boolean;
};

export type CreateCategoryOutput = CategoryOutput;

export class CreateCategoryUseCase
  implements IUseCase<CreateCategoryInput, CreateCategoryOutput>
{
  constructor(private readonly categoryRepo: ICategoryRepository) {}
  async execute(input: CreateCategoryInput): Promise<CreateCategoryOutput> {
    const entity = Category.create(input);

    if (entity.notification.hasErrors()) {
      throw new EntityValidationError(entity.notification.toJSON());
    }

    await this.categoryRepo.insert(entity);

    return entity.toJSON();
  }
}
