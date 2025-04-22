import { NotFoundError } from "../../../../shared/domain/errors/not-found.error";
import {
  InvalidUuidError,
  Uuid,
} from "../../../../shared/domain/value-objects/uuid.value-object";
import { setupSequelize } from "../../../../shared/infra/testing/helpers";
import { CategoryBuilder } from "../../../domain/category.builder";
import { CategorySequelizeRepository } from "../../../infra/db/sequelize/category-sequelize.repository";
import { CategoryModel } from "../../../infra/db/sequelize/category.model";
import { DeleteCategoryUseCase } from "./delete-category.use-case";

describe("CreateCategoryUseCase Integration Tests", () => {
  let useCase: DeleteCategoryUseCase;
  let repository: CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new DeleteCategoryUseCase(repository);
  });

  it("should throw when category is invalid or not found", async () => {
    await expect(useCase.execute({ category_id: "invalid" })).rejects.toThrow(
      InvalidUuidError
    );
    const uuid = new Uuid();
    await expect(useCase.execute({ category_id: uuid.id })).rejects.toThrow(
      NotFoundError
    );
  });

  it("should delete a category", async () => {
    const category = new CategoryBuilder().build();
    await repository.insert(category);

    await expect(
      useCase.execute({ category_id: category.category_id.id })
    ).resolves.not.toThrow();

    expect(await repository.findById(category.category_id)).toBeNull();
  });
});
