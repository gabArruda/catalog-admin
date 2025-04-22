import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  validateSync,
} from "class-validator";

export type UpdateCategoryInputProps = {
  category_id: string;
  name?: string;
  description?: string;
  is_active?: boolean;
};

export class UpdateCategoryInput {
  @IsString()
  @IsNotEmpty()
  category_id!: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  constructor(props: UpdateCategoryInputProps) {
    if (!props) return;
    this.category_id = props.category_id;
    props.name && (this.name = props.name);
    props.description && (this.description = props.description);
    props.is_active !== null &&
      props.is_active !== undefined &&
      (this.is_active = props.is_active);
  }
}

export class ValidateUpdateCategoryInput {
  static validate(input: UpdateCategoryInput) {
    return validateSync(input);
  }
}
