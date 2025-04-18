import { Sequelize } from "sequelize-typescript";
import { CategoryModel } from "./category.model";
import { CategorySequelizeRepository } from "./category-sequelize.repository";
import { CategoryBuilder } from "../../../domain/category.builder";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.value-object";
import _ from "lodash";
import { NotFoundError } from "../../../../shared/domain/errors/not-found.error";

describe("CategorySequelizeRepository Integration Tests", () => {
  let sequelize: Sequelize;
  let categoryRepository: CategorySequelizeRepository;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      models: [CategoryModel],
      logging: false,
    });
    await sequelize.sync({ force: true });
    categoryRepository = new CategorySequelizeRepository(CategoryModel);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  // TODO: Create tests for the search

  it("should insert a category", async () => {
    let category = new CategoryBuilder().build();
    await categoryRepository.insert(category);

    let model = await CategoryModel.findByPk(category.category_id.id);
    expect(model?.toJSON()).toStrictEqual(category.toJSON());

    category = new CategoryBuilder()
      .withName("Movie")
      .withDescription("Movie Description")
      .activate()
      .build();
    await categoryRepository.insert(category);
    model = await CategoryModel.findByPk(category.category_id.id);
    expect(model?.toJSON()).toStrictEqual(category.toJSON());
  });

  it("should bulk insert categories", async () => {
    const category1 = new CategoryBuilder().build();
    const category2 = new CategoryBuilder().build();
    const category3 = new CategoryBuilder().build();
    const categories = [category1, category2, category3];

    await categoryRepository.bulkInsert(categories);

    const models = await CategoryModel.findAll();

    expect(models).toHaveLength(3);
  });

  it("should update a category", async () => {
    const category = new CategoryBuilder().build();
    await expect(categoryRepository.update(category)).rejects.toThrow(
      NotFoundError
    );

    await categoryRepository.insert(category);
    category.activate();
    category.changeDescription("New desription");
    await categoryRepository.update(category);

    const categoryUpdated = await categoryRepository.findById(
      category.category_id
    );
    expect(categoryUpdated).toStrictEqual(category);
  });

  it("should delete a category", async () => {
    const category = new CategoryBuilder().build();
    await expect(
      categoryRepository.delete(category.category_id)
    ).rejects.toThrow(NotFoundError);

    await categoryRepository.insert(category);
    let categoryInserted = await categoryRepository.findById(
      category.category_id
    );
    expect(categoryInserted).toBeDefined();

    await categoryRepository.delete(category.category_id);
    categoryInserted = await categoryRepository.findById(category.category_id);

    expect(categoryInserted).toBeNull();
  });

  it("should find a category by id and return it or null if not found", async () => {
    let modelFound = await categoryRepository.findById(new Uuid());
    expect(modelFound).toBeNull();

    const category = new CategoryBuilder().build();
    await categoryRepository.insert(category);
    modelFound = await categoryRepository.findById(category.category_id);
    expect(modelFound?.toJSON()).toStrictEqual(category.toJSON());
  });

  it("should find all categories", async () => {
    let categoriesFound = await categoryRepository.findAll();
    expect(categoriesFound).toHaveLength(0);

    const category1 = new CategoryBuilder().build();
    await categoryRepository.insert(category1);
    const category2 = new CategoryBuilder().build();
    await categoryRepository.insert(category2);

    categoriesFound = await categoryRepository.findAll();
    expect(categoriesFound).toHaveLength(2);
    expect(categoriesFound).toEqual([category1, category2]);
  });
});
