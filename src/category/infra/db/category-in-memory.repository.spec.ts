import { CategoryBuilder } from "../../domain/category.builder";
import { Category } from "../../domain/category.entity";
import { CategoryInMemoryRepository } from "./category-in-memory.repository";

describe("Category In Memory Repository Unit Tests", () => {
  let repository: CategoryInMemoryRepository;

  beforeEach(() => (repository = new CategoryInMemoryRepository()));

  it("should not filter items when filter object is null", async () => {
    const items = new CategoryBuilder().buildMany(1);
    const filterSpy = jest.spyOn(items, "filter");

    const itemsFiltered = await repository["applyFilter"](items, null);
    expect(filterSpy).not.toHaveBeenCalled();
    expect(itemsFiltered).toStrictEqual(items);
  });

  it("should filter items using filter parameter", async () => {
    const items = new CategoryBuilder().buildMany(3, [
      { name: "test" },
      { name: "TEST" },
      { name: "fake" },
    ]);

    const filterSpy = jest.spyOn(items, "filter");

    const itemsFiltered = await repository["applyFilter"](items, "TEST");
    expect(filterSpy).toHaveBeenCalledTimes(1);
    expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
  });

  it("should sort by created_at when sort param is null", async () => {
    const created_at = new Date();
    const builder = new CategoryBuilder();

    const items = [
      builder.withName("test").withCreatedAt(created_at).build(),
      builder
        .withName("TEST")
        .withCreatedAt(new Date(created_at.getTime() + 100))
        .build(),
      builder
        .withName("fake")
        .withCreatedAt(new Date(created_at.getTime() + 200))
        .build(),
    ];

    const itemsSorted = await repository["applySort"](items, null, null);
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);
  });

  it("should sort by name", async () => {
    const builder = new CategoryBuilder();
    const items = [
      builder.withName("c").build(),
      builder.withName("b").build(),
      builder.withName("a").build(),
    ];

    let itemsSorted = await repository["applySort"](items, "name", "asc");
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);

    itemsSorted = await repository["applySort"](items, "name", "desc");
    expect(itemsSorted).toStrictEqual([items[0], items[1], items[2]]);
  });
});
