import { SearchOutput } from "../domain/repository/search.output";

export type PaginationOutput<Item = any> = {
  items: Item[];
  total: number;
  current_page: number;
  per_page: number;
  last_page: number;
};

export class PaginationOutputMapper {
  static toOutput<Item = any>(
    items: Item[],
    props: Omit<SearchOutput, "items">
  ): PaginationOutput<Item> {
    return {
      items,
      total: props.total,
      current_page: props.current_page,
      per_page: props.per_page,
      last_page: props.last_page,
    };
  }
}
