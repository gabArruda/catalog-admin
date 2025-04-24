import { ListCategoriesInput } from '@core/category/application/use-cases/list/list-categories.use-case';
import { SortDirection } from '@core/shared/domain/repository/search.input';

export class SearchCategoriesDto implements ListCategoriesInput {
  page?: number;
  per_page?: number;
  sort?: string;
  sort_dir?: SortDirection;
  filter?: string;
}
