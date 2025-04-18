import { ISearchableRepository } from "../../shared/domain/repository/repository.interface";
import { SearchInput } from "../../shared/domain/repository/search.input";
import { SearchOutput } from "../../shared/domain/repository/search.output";
import { Uuid } from "../../shared/domain/value-objects/uuid.value-object";
import { Category } from "./category.entity";

export type CategoryFilter = string;

export class CategorySearchInput extends SearchInput<CategoryFilter> {}

export class CategorySearchOutput extends SearchOutput<Category> {}

export interface ICategoryRepository
  extends ISearchableRepository<
    Category,
    Uuid,
    CategoryFilter,
    CategorySearchInput,
    CategorySearchOutput
  > {}
