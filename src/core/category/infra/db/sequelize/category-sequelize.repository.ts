import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.value-object';
import { Category } from '../../../domain/category.entity';
import {
  CategorySearchInput,
  CategorySearchOutput,
  ICategoryRepository,
} from '../../../domain/category.repository.interface';
import { CategoryModelMapper } from './category-model-mapper';
import { CategoryModel } from './category.model';
import { Op } from 'sequelize';

export class CategorySequelizeRepository implements ICategoryRepository {
  sortableFields: string[] = ['name', 'created_at', 'updated_at'];

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
          ? [[props.sort, props.sort_dir ?? 'asc']]
          : [['created_at', 'desc']],
      offset,
      limit,
    });
    return new CategorySearchOutput({
      items: models.map((model) => {
        return CategoryModelMapper.toEntity(model);
      }),
      current_page: props.page,
      per_page: props.per_page,
      total: count,
    });
  }

  async insert(entity: Category): Promise<void> {
    const model = CategoryModelMapper.toModel(entity);
    await this.categoryModel.create(model);
  }

  async bulkInsert(entities: Category[]): Promise<void> {
    const models = entities.map((entity) =>
      CategoryModelMapper.toModel(entity),
    );
    await this.categoryModel.bulkCreate(models);
  }

  async update(entity: Category): Promise<void> {
    const id = entity.category_id.id;
    const categoryFound = await this.categoryModel.findByPk(id);
    if (!categoryFound) {
      throw new NotFoundError(id, this.getEntity());
    }
    const model = CategoryModelMapper.toModel(entity);
    await this.categoryModel.update(model, { where: { category_id: id } });
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
    return model ? CategoryModelMapper.toEntity(model) : null;
  }

  async findAll(): Promise<Category[]> {
    const models = await this.categoryModel.findAll();

    return models.map((model) => {
      return CategoryModelMapper.toEntity(model);
    });
  }

  getEntity(): new (...args: any[]) => Category {
    return Category;
  }
}
