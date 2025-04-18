import { Sequelize } from "sequelize-typescript";
import { CategoryModel } from "./category.model";
import { CategoryBuilder } from "../../../domain/category.builder";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.value-object";

describe("CategoryModel Integration Tests", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      models: [CategoryModel],
      logging: false,
    });
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });
  it("should insert and retrieve a category", async () => {
    const categoryBuilder = new CategoryBuilder().build();
    const categoryProps = {
      category_id: categoryBuilder.category_id.id,
      name: categoryBuilder.name,
      description: categoryBuilder.description,
      is_active: categoryBuilder.is_active,
      created_at: categoryBuilder.created_at,
      updated_at: categoryBuilder.updated_at,
    };

    const categoryCreated = await CategoryModel.create(categoryProps);
    expect(categoryCreated.toJSON()).toStrictEqual(categoryProps);

    const categoryFound = await CategoryModel.findByPk(
      categoryProps.category_id
    );

    expect(categoryFound).not.toBeNull();
    expect(categoryFound?.toJSON()).toStrictEqual(categoryProps);
  });

  it("should allow null description", async () => {
    const categoryBuilder = new CategoryBuilder().withDescription(null).build();
    const categoryProps = {
      category_id: categoryBuilder.category_id.id,
      name: categoryBuilder.name,
      description: categoryBuilder.description,
      is_active: categoryBuilder.is_active,
      created_at: categoryBuilder.created_at,
      updated_at: categoryBuilder.updated_at,
    };

    await CategoryModel.create(categoryProps);

    const category = await CategoryModel.findByPk(categoryProps.category_id);

    expect(category).not.toBeNull();
    expect(category?.description).toBeNull();
  });

  it("should throw validation error if required fields are missing", async () => {
    await expect(
      CategoryModel.create({
        category_id: new Uuid(),
        // name is missing
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      } as any)
    ).rejects.toThrow();
  });
});
