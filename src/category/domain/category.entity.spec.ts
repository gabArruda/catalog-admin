import { EntityValidationError } from "../../shared/domain/validators/validation.error";
import { Uuid } from "../../shared/domain/value-objects/uuid.value-object";
import { Category } from "./category.entity";

describe("Category unit tests", () => {
  let validateSpy: jest.SpyInstance<void, [entity: Category], any>;
  beforeEach(() => {
    validateSpy = jest.spyOn(Category, "validate");
  });
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
      expect(validateSpy).toHaveBeenCalledTimes(1);
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
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("methods that update a value", () => {
    it("should change category name", () => {
      const category = Category.create({
        name: "Movie",
      });
      category.changeName("TV Show");
      expect(category.name).toBe("TV Show");
      expect(validateSpy).toHaveBeenCalledTimes(2);
    });

    it("should change category description", () => {
      const category = Category.create({
        name: "Movie",
      });
      expect(category.description).toBeNull();
      category.changeDescription("Movie description");
      expect(category.description).toBe("Movie description");
      expect(validateSpy).toHaveBeenCalledTimes(2);
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

describe("Category validator tests", () => {
  describe("create command", () => {
    it("should throw when name is invalid", () => {
      expect(() => {
        Category.create({ name: "" });
      }).toThrow(EntityValidationError);
      expect(() => {
        Category.create({ name: null as unknown as string });
      }).toThrow(EntityValidationError);
      expect(() => {
        Category.create({ name: "a".repeat(256) });
      }).toThrow(EntityValidationError);
      expect(() => {
        Category.create({ name: 10 as unknown as string });
      }).toThrow(EntityValidationError);
    });

    it("should throw when description is invalid", () => {
      expect(() => {
        Category.create({ name: "test", description: 10 as unknown as string });
      }).toThrow(EntityValidationError);
    });

    it("should throw when is_active is invalid", () => {
      expect(() => {
        Category.create({ name: "test", is_active: 10 as unknown as boolean });
      }).toThrow(EntityValidationError);
      expect(() => {
        Category.create({ name: "test", is_active: "" as unknown as boolean });
      }).toThrow(EntityValidationError);
    });
  });
});
