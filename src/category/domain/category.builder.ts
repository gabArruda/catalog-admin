import { Uuid } from "../../shared/domain/value-objects/uuid.value-object";
import Chance from "chance";
import { Category, CategoryConstructorProps } from "./category.entity";

const chance = new Chance();

export class CategoryBuilder {
  private _category_id?: Uuid;
  private _name?: string;
  private _description?: string | null;
  private _is_active?: boolean;
  private _created_at?: Date;
  private _updated_at?: Date;

  withId(id: Uuid): this {
    this._category_id = id;
    return this;
  }

  withName(name: string): this {
    this._name = name;
    return this;
  }

  withDescription(description: string | null): this {
    this._description = description;
    return this;
  }

  activate(): this {
    this._is_active = true;
    return this;
  }

  deactivate(): this {
    this._is_active = false;
    return this;
  }

  withCreatedAt(date: Date): this {
    this._created_at = date;
    return this;
  }

  withUpdatedAt(date: Date): this {
    this._updated_at = date;
    return this;
  }

  private make(overrides: Partial<CategoryConstructorProps> = {}): Category {
    const has = Object.prototype.hasOwnProperty.bind(overrides);

    const category = new Category({
      category_id: has("category_id")
        ? overrides.category_id
        : this._category_id ?? new Uuid(),

      name: has("name")
        ? overrides.name!
        : this._name ?? chance.word({ length: 10 }),

      description: has("description")
        ? overrides.description ?? null
        : this._description ?? chance.sentence({ words: 5 }),

      is_active: has("is_active")
        ? overrides.is_active!
        : this._is_active ?? chance.bool(),

      created_at: has("created_at")
        ? overrides.created_at!
        : this._created_at ?? new Date(),

      updated_at: has("updated_at")
        ? overrides.updated_at!
        : this._updated_at ?? new Date(),
    });

    Category.validate(category);
    return category;
  }

  build(): Category {
    const category = this.make();
    this.reset();
    return category;
  }

  buildMany(
    count: number,
    overridesList: Partial<CategoryConstructorProps>[] = []
  ): Category[] {
    const categories: Category[] = [];

    for (let i = 0; i < count; i++) {
      const overrides = overridesList[i] ?? {};
      categories.push(this.make(overrides));
    }

    this.reset();
    return categories;
  }

  private reset(): void {
    this._category_id = undefined;
    this._name = undefined;
    this._description = undefined;
    this._is_active = undefined;
    this._created_at = undefined;
    this._updated_at = undefined;
  }
}
