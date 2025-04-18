import { NotFoundError } from "../../../../shared/domain/errors/not-found.error";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.value-object";
import { Category } from "../../../domain/category.entity";
import {
  CategorySearchInput,
  CategorySearchOutput,
  ICategoryRepository,
} from "../../../domain/category.repository.interface";
import { CategoryModel } from "./category.model";
import { Op } from "sequelize";

export class CategorySequelizeRepository implements ICategoryRepository {
  sortableFields: string[] = ["name", "created_at", "updated_at"];

  constructor(private categoryModel: typeof CategoryModel) {}

  async search(props: CategorySearchInput): Promise<CategorySearchOutput> {
    const offset = (props.page - 1) * props.per_page;
    const limit = props.per_page;
    const { rows: models, count } = await this.categoryModel.findAndCountAll({
      ...(props.filter && {
        where: {
          name: { [Op.like]: `%${props.filter}%` },
        },
      }),
      order:
        props.sort && this.sortableFields.includes(props.sort)
          ? [[props.sort, props.sort_dir ?? "asc"]]
          : [["created_at", "desc"]],
      offset,
      limit,
    });
    return new CategorySearchOutput({
      items: models.map(
        (model) =>
          new Category({
            category_id: new Uuid(model.category_id),
            name: model.name,
            description: model.description,
            is_active: model.is_active,
            created_at: model.created_at,
            updated_at: model.updated_at,
          })
      ),
      current_page: props.page,
      per_page: props.per_page,
      total: count,
    });
  }

  async insert(entity: Category): Promise<void> {
    await this.categoryModel.create({
      category_id: entity.category_id.id,
      name: entity.name,
      description: entity.description,
      is_active: entity.is_active,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    });
  }

  async bulkInsert(entities: Category[]): Promise<void> {
    await this.categoryModel.bulkCreate(
      entities.map((entity) => ({
        category_id: entity.category_id.id,
        name: entity.name,
        description: entity.description,
        is_active: entity.is_active,
        created_at: entity.created_at,
        updated_at: entity.updated_at,
      }))
    );
  }

  async update(entity: Category): Promise<void> {
    const id = entity.category_id.id;
    const model = await this.categoryModel.findByPk(id);
    if (!model) {
      throw new NotFoundError(id, this.getEntity());
    }
    await this.categoryModel.update(
      {
        category_id: entity.category_id.id,
        name: entity.name,
        description: entity.description,
        is_active: entity.is_active,
        created_at: entity.created_at,
        updated_at: entity.updated_at,
      },
      { where: { category_id: id } }
    );
  }

  async delete(entity_id: Uuid): Promise<void> {
    const id = entity_id.id;
    const model = await this.categoryModel.findByPk(id);
    if (!model) {
      throw new NotFoundError(id, this.getEntity());
    }
    await this.categoryModel.destroy({ where: { category_id: id } });
  }

  async findById(entity_id: Uuid): Promise<Category | null> {
    const model = await this.categoryModel.findByPk(entity_id.id);
    if (model === null) return null;
    return new Category({
      category_id: new Uuid(model.category_id),
      name: model.name,
      description: model.description,
      is_active: model.is_active,
      created_at: model.created_at,
      updated_at: model.updated_at,
    });
  }

  async findAll(): Promise<Category[]> {
    const models = await this.categoryModel.findAll();
    return models.map((model) => {
      return new Category({
        category_id: new Uuid(model.category_id),
        name: model.name,
        description: model.description,
        is_active: model.is_active,
        created_at: model.created_at,
        updated_at: model.updated_at,
      });
    });
  }

  getEntity(): new (...args: any[]) => Category {
    return Category;
  }
}
