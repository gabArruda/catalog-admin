import { IUseCase } from "../../../../shared/application/use-case.interface";
import { NotFoundError } from "../../../../shared/domain/errors/not-found.error";
import { EntityValidationError } from "../../../../shared/domain/errors/validation.error";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.value-object";
import { Category } from "../../../domain/category.entity";
import { ICategoryRepository } from "../../../domain/category.repository.interface";
import { CategoryOutput } from "../shared/category.output";

export type UpdateCategoryInput = {
  category_id: string;
  name?: string;
  description?: string;
  is_active?: boolean;
};

export type UpdateCategoryOutput = CategoryOutput;

export class UpdateCategoryUseCase
  implements IUseCase<UpdateCategoryInput, UpdateCategoryOutput>
{
  constructor(private readonly categoryRepo: ICategoryRepository) {}
  async execute(input: UpdateCategoryInput): Promise<UpdateCategoryOutput> {
    const uuid = new Uuid(input.category_id);
    const category = await this.categoryRepo.findById(uuid);

    if (!category) {
      throw new NotFoundError(input.category_id, Category);
    }

    if (typeof input.name !== "undefined") {
      category.changeName(input.name);
    }

    if (typeof input.description !== "undefined") {
      category.changeDescription(input.description);
    }

    if (typeof input.is_active !== "undefined") {
      input.is_active ? category.activate() : category.deactivate();
    }

    if (category.notification.hasErrors()) {
      throw new EntityValidationError(category.notification.toJSON());
    }

    await this.categoryRepo.update(category);

    return category.toJSON();
  }
}
