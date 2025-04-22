import { Uuid } from "../../shared/domain/value-objects/uuid.value-object";
import Chance from "chance";
import { Category, CategoryConstructorProps } from "./category.entity";

const chance = new Chance();

export class CategoryBuilder {
  private builderState: Partial<CategoryConstructorProps> = {};

  withId(id: Uuid): this {
    this.builderState.category_id = id;
    return this;
  }

  withName(name: string): this {
    this.builderState.name = name;
    return this;
  }

  withDescription(description: string | null): this {
    this.builderState.description =
      description || description === null
        ? description
        : chance.sentence({ words: 5 });
    return this;
  }

  activate(): this {
    this.builderState.is_active = true;
    return this;
  }

  deactivate(): this {
    this.builderState.is_active = false;
    return this;
  }

  withCreatedAt(date: Date): this {
    this.builderState.created_at = date;
    return this;
  }

  withUpdatedAt(date: Date): this {
    this.builderState.updated_at = date;
    return this;
  }

  private make(overrides: Partial<CategoryConstructorProps> = {}): Category {
    const getValue = <K extends keyof CategoryConstructorProps>(
      key: K,
      fallback: () => CategoryConstructorProps[K]
    ): CategoryConstructorProps[K] => {
      if (Object.prototype.hasOwnProperty.call(overrides, key)) {
        return overrides[key]!;
      }

      if (Object.prototype.hasOwnProperty.call(this.builderState, key)) {
        return this.builderState[key]!;
      }

      return fallback();
    };

    const category = new Category({
      category_id: getValue("category_id", () => new Uuid()),
      name: getValue("name", () => chance.word({ length: 10 })),
      description: getValue("description", () => null),
      is_active: getValue("is_active", () => false),
      created_at: getValue("created_at", () => new Date()),
      updated_at: getValue("updated_at", () => new Date()),
    });

    category.validate();
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
    this.builderState = {};
  }
}
