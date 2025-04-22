import { Uuid } from "../../shared/domain/value-objects/uuid.value-object";
import { Category } from "./category.entity";

describe("Category Entity Unit Tests", () => {
  beforeEach(() => {
    Category.prototype.validate = jest
      .fn()
      .mockImplementation(Category.prototype.validate);
  });

  it("should create with default values", () => {
    const category = new Category({ name: "Test" });

    expect(category.name).toBe("Test");
    expect(category.description).toBeNull();
    expect(category.is_active).toBe(false);
    expect(category.created_at).toBeInstanceOf(Date);
    expect(category.updated_at).toBeInstanceOf(Date);
    expect(category.category_id).toBeInstanceOf(Uuid);
  });

  it("should use static create with validation", () => {
    const category = Category.create({ name: "Movie" });

    expect(category.name).toBe("Movie");
    expect(category.validate).toHaveBeenCalledTimes(1);
    expect(category.validate).toHaveBeenCalledWith(["name"]);
  });

  it("should change name and update updated_at", async () => {
    const category = new Category({ name: "Old" });
    const oldDate = category.updated_at;

    await new Promise((r) => setTimeout(r, 10));
    category.changeName("New");

    expect(category.name).toBe("New");
    expect(category.updated_at.getTime()).toBeGreaterThan(oldDate.getTime());
    expect(category.validate).toHaveBeenCalledTimes(1);
    expect(category.validate).toHaveBeenCalledWith(["name"]);
  });

  it("should change description and update updated_at", async () => {
    const category = new Category({ name: "Test", description: "Old" });
    const oldDate = category.updated_at;

    await new Promise((r) => setTimeout(r, 1));
    category.changeDescription("New");

    expect(category.description).toBe("New");
    expect(category.updated_at.getTime()).toBeGreaterThan(oldDate.getTime());
    expect(category.validate).not.toHaveBeenCalled();
  });

  it("should activate and deactivate", async () => {
    const category = new Category({ name: "Test", is_active: false });
    const oldDate = category.updated_at;

    await new Promise((r) => setTimeout(r, 1));
    category.activate();
    expect(category.is_active).toBe(true);

    await new Promise((r) => setTimeout(r, 1));
    category.deactivate();
    expect(category.is_active).toBe(false);
    expect(category.updated_at.getTime()).toBeGreaterThan(oldDate.getTime());
    expect(category.validate).not.toHaveBeenCalled();
  });

  it("should return correct JSON", () => {
    const category = new Category({
      name: "Test",
      description: "desc",
      is_active: true,
    });
    const json = category.toJSON();

    expect(json).toEqual({
      category_id: category.category_id.id,
      name: "Test",
      description: "desc",
      is_active: true,
      created_at: category.created_at,
      updated_at: category.updated_at,
    });
  });

  it("should has notification errors when invalid name on creation", () => {
    const category = Category.create({ name: "t".repeat(256) });

    expect(category.notification.hasErrors()).toBeTruthy();
  });

  it("should has notification errors when invalid name on updating name", () => {
    const category = Category.create({ name: "Movie" });
    category.changeName("t".repeat(256));

    expect(category.notification.hasErrors()).toBeTruthy();
  });
});
