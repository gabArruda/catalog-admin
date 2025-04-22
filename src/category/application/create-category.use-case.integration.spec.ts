import { Uuid } from "../../shared/domain/value-objects/uuid.value-object";
import { setupSequelize } from "../../shared/infra/testing/helpers";
import { CategorySequelizeRepository } from "../infra/db/sequelize/category-sequelize.repository";
import { CategoryModel } from "../infra/db/sequelize/category.model";
import { CreateCategoryUseCase } from "./create-category.use-case";

describe("CreateCategoryUseCase Integration Tests", () => {
  let useCase: CreateCategoryUseCase;
  let repository: CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new CreateCategoryUseCase(repository);
  });

  it("should create a category", async () => {
    let output = await useCase.execute({ name: "test" });
    let entity = await repository.findById(new Uuid(output.category_id));
    expect(output).toEqual(entity?.toJSON());

    output = await useCase.execute({
      name: "test2",
      description: "some description",
      is_active: true,
    });
    entity = await repository.findById(new Uuid(output.category_id));
    expect(output).toStrictEqual(entity?.toJSON());
  });
});
