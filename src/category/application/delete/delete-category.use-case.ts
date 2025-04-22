import { IUseCase } from "../../../shared/application/use-case.interface";
import { Uuid } from "../../../shared/domain/value-objects/uuid.value-object";
import { ICategoryRepository } from "../../domain/category.repository.interface";

export type DeleteCategoryInput = {
  category_id: string;
};

export type DeleteCategoryOutput = void;

export class DeleteCategoryUseCase
  implements IUseCase<DeleteCategoryInput, DeleteCategoryOutput>
{
  constructor(private readonly categoryRepo: ICategoryRepository) {}
  async execute(input: DeleteCategoryInput): Promise<DeleteCategoryOutput> {
    const uuid = new Uuid(input.category_id);
    await this.categoryRepo.delete(uuid);
  }
}
