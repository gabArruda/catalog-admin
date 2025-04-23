import {
  PaginationOutput,
  PaginationOutputMapper,
} from '../../../../shared/application/pagination.output';
import { IUseCase } from '../../../../shared/application/use-case.interface';
import { SortDirection } from '../../../../shared/domain/repository/search.input';
import {
  CategoryFilter,
  CategorySearchInput,
  ICategoryRepository,
} from '../../../domain/category.repository.interface';
import { CategoryOutput } from '../shared/category.output';

export type ListCategoriesInput = {
  page?: number;
  per_page?: number;
  sort?: string | null;
  sort_dir?: SortDirection | null;
  filter?: CategoryFilter | null;
};
export type ListCategoriesOutput = PaginationOutput<CategoryOutput>;

export class ListCategoriesUseCase
  implements IUseCase<ListCategoriesInput, ListCategoriesOutput>
{
  constructor(private categoryRepo: ICategoryRepository) {}

  async execute(input: ListCategoriesInput): Promise<ListCategoriesOutput> {
    const params = new CategorySearchInput(input);
    const searchOutput = await this.categoryRepo.search(params);
    const outputItems = searchOutput.items.map((item) => item.toJSON());

    return PaginationOutputMapper.toOutput(outputItems, searchOutput);
  }
}
