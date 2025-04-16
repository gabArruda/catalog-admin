import { Uuid } from "../../shared/domain/value-objects/uuid.value-object";
import { Category } from "./category.entity";

describe("Category unit tests", () => {
  describe("constructor", () => {
    it("should create a category with default values", () => {
      const category = new Category({
        name: "Movie",
      });
      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBeNull();
      expect(category.is_active).toBeFalsy();
      expect(category.created_at).toBeInstanceOf(Date);
      expect(category.updated_at).toBeInstanceOf(Date);
    });

    it("should create a category with optional values", () => {
      const uuid = new Uuid();
      const category = new Category({
        category_id: uuid,
        name: "TV Show",
        description: "TV Show description",
        is_active: true,
      });
      expect(category.category_id).toEqual(uuid);
      expect(category.name).toBe("TV Show");
      expect(category.description).toBe("TV Show description");
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
      expect(category.updated_at).toBeInstanceOf(Date);
    });
  });

  describe("create command", () => {
    it("should create a category with default values", () => {
      const category = Category.create({
        name: "Movie",
      });
      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBeNull();
      expect(category.is_active).toBeFalsy();
      expect(category.created_at).toBeInstanceOf(Date);
      expect(category.updated_at).toBeInstanceOf(Date);
    });

    it("should create a category with optional values", () => {
      const category = Category.create({
        name: "TV Show",
        description: "TV Show description",
        is_active: true,
      });
      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("TV Show");
      expect(category.description).toBe("TV Show description");
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
      expect(category.updated_at).toBeInstanceOf(Date);
    });
  });

  describe("methods that update a value", () => {
    it("should change category name", () => {
      const category = Category.create({
        name: "Movie",
      });
      category.changeName("TV Show");
      expect(category.name).toBe("TV Show");
    });

    it("should change category description", () => {
      const category = Category.create({
        name: "Movie",
      });
      expect(category.description).toBeNull();
      category.changeDescription("Movie description");
      expect(category.description).toBe("Movie description");
    });

    it("should activate and deactivate a category", () => {
      const category = Category.create({
        name: "Movie",
      });
      expect(category.is_active).toBeFalsy();
      category.activate();
      expect(category.is_active).toBeTruthy();
      category.deactivate();
      expect(category.is_active).toBeFalsy();
    });
  });
});
