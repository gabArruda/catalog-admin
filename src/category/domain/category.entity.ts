import { Entity } from "../../shared/domain/entity";
import { ValueObject } from "../../shared/domain/value-object";
import { Uuid } from "../../shared/domain/value-objects/uuid.value-object";
import { CategoryValidatorFactory } from "./category.validator";

export type CategoryConstructorProps = {
  category_id?: Uuid;
  name: string;
  description?: string | null;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
};

export type CategoryCreateCommand = {
  name: string;
  description?: string | null;
  is_active?: boolean;
};

export class Category extends Entity {
  category_id: Uuid;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;

  constructor(props: CategoryConstructorProps) {
    super();

    this.category_id = props.category_id ?? new Uuid();
    this.name = props.name;
    this.description = props.description ?? null;
    this.is_active = props.is_active ?? false;
    this.created_at = props.created_at ?? new Date();
    this.updated_at = props.updated_at ?? new Date();
  }

  get entity_id(): ValueObject {
    return this.category_id;
  }

  static create(props: CategoryCreateCommand): Category {
    const category = new Category(props);
    category.validate(["name"]);
    return category;
  }

  changeName(name: string): void {
    this.name = name;
    this.updated_at = new Date();
    this.validate(["name"]);
  }

  changeDescription(description: string): void {
    this.description = description;
    this.updated_at = new Date();
  }

  activate() {
    this.is_active = true;
    this.updated_at = new Date();
  }

  deactivate() {
    this.is_active = false;
    this.updated_at = new Date();
  }

  validate(fields?: string[]) {
    const validator = CategoryValidatorFactory.create();
    return validator.validate(this.notification, this, fields);
  }

  toJSON() {
    return {
      category_id: this.category_id.id,
      name: this.name,
      description: this.description,
      is_active: this.is_active,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
