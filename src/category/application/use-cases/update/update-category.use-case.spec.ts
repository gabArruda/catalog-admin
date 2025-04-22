import { NotFoundError } from "../../../../shared/domain/errors/not-found.error";
import {
  InvalidUuidError,
  Uuid,
} from "../../../../shared/domain/value-objects/uuid.value-object";
import { CategoryBuilder } from "../../../domain/category.builder";
import { CategoryInMemoryRepository } from "../../../infra/db/in-memory/category-in-memory.repository";
import { UpdateCategoryUseCase } from "./update-category.use-case";

describe("UpdateCategoryUseCase Unit Tests", () => {
  let useCase: UpdateCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new UpdateCategoryUseCase(repository);
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

  it("should update name and description", async () => {
    const category = new CategoryBuilder()
      .withName("Old Name")
      .withDescription("Old Description")
      .activate()
      .build();

    await repository.insert(category);
    const beforeUpdate = new Date(category.updated_at);

    const input = {
      category_id: category.category_id.id,
      name: "New Name",
      description: "New Description",
    };

    const output = await useCase.execute(input);

    expect(output.name).toBe("New Name");
    expect(output.description).toBe("New Description");
    expect(output.is_active).toBe(true);
    expect(output.updated_at.getTime()).toBeGreaterThan(beforeUpdate.getTime());
  });

  it("should deactivate the category", async () => {
    const category = new CategoryBuilder().activate().build();

    await repository.insert(category);

    const input = {
      category_id: category.category_id.id,
      is_active: false,
    };

    const output = await useCase.execute(input);
    expect(output.is_active).toBe(false);
  });

  it("should activate the category", async () => {
    const category = new CategoryBuilder().build();

    await repository.insert(category);

    const input = {
      category_id: category.category_id.id,
      is_active: true,
    };

    const output = await useCase.execute(input);
    expect(output.is_active).toBe(true);
  });

  it("should handle a call with no optional fields changed", async () => {
    const category = new CategoryBuilder()
      .withName("Initial Name")
      .activate()
      .build();

    await repository.insert(category);

    const output = await useCase.execute({
      category_id: category.category_id.id,
    });

    expect(output.name).toBe("Initial Name");
    expect(output.is_active).toBe(true);
    expect(output.description).toBeNull();
  });
});
