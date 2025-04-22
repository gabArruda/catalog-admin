import { CategoryInMemoryRepository } from "../../infra/db/in-memory/category-in-memory.repository";
import { CreateCategoryUseCase } from "./create-category.use-case";

describe("CreateCategoryUseCase Unit Tests", () => {
  let useCase: CreateCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new CreateCategoryUseCase(repository);
  });

  it("should create a category", async () => {
    const spyInsert = jest.spyOn(repository, "insert");
    let output = await useCase.execute({ name: "test" });
    expect(spyInsert).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual(repository.items[0].toJSON());

    output = await useCase.execute({
      name: "test2",
      description: "some description",
      is_active: true,
    });
    expect(spyInsert).toHaveBeenCalledTimes(2);
    expect(output).toStrictEqual(repository.items[1].toJSON());
  });
});
