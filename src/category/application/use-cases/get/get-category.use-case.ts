import { IUseCase } from "../../../../shared/application/use-case.interface";
import { NotFoundError } from "../../../../shared/domain/errors/not-found.error";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.value-object";
import { Category } from "../../../domain/category.entity";
import { ICategoryRepository } from "../../../domain/category.repository.interface";
import { CategoryOutput } from "../shared/category.output";

export type GetCategoryInput = {
  category_id: string;
};

export type GetCategoryOutput = CategoryOutput;

export class GetCategoryUseCase
  implements IUseCase<GetCategoryInput, GetCategoryOutput>
{
  constructor(private readonly categoryRepo: ICategoryRepository) {}
  async execute(input: GetCategoryInput): Promise<GetCategoryOutput> {
    const uuid = new Uuid(input.category_id);
    const category = await this.categoryRepo.findById(uuid);

    if (!category) {
      throw new NotFoundError(input.category_id, Category);
    }

    return category.toJSON();
  }
}
