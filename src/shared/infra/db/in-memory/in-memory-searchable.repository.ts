import { Entity } from "../../../domain/entity";
import { ISearchableRepository } from "../../../domain/repository/repository.interface";
import {
  SearchInput,
  SortDirection,
} from "../../../domain/repository/search.input";
import { SearchOutput } from "../../../domain/repository/search.output";
import { ValueObject } from "../../../domain/value-object";
import { InMemoryRepository } from "./in-memory.repository";

export abstract class InMemorySearchableRepository<
    E extends Entity,
    EntityId extends ValueObject,
    Filter = string
  >
  extends InMemoryRepository<E, EntityId>
  implements ISearchableRepository<E, EntityId, Filter>
{
  sortableFields: string[] = [];
  async search(props: SearchInput<Filter>): Promise<SearchOutput<E>> {
    const itemsFiltered = await this.applyFilter(this.items, props.filter);
    const itemsSorted = this.applySort(
      itemsFiltered,
      props.sort,
      props.sort_dir
    );
    const itemsPaginated = this.applyPagination(
      itemsSorted,
      props.page,
      props.per_page
    );
    return new SearchOutput({
      items: itemsPaginated,
      total: itemsFiltered.length,
      current_page: props.page,
      per_page: props.per_page,
    });
  }

  protected abstract applyFilter(
    items: E[],
    filter: Filter | null
  ): Promise<E[]>;

  protected applySort(
    items: E[],
    sort: string | null,
    sort_dir: SortDirection | null,
    custom_getter?: (sort: string, item: E) => any
  ) {
    if (!sort || !this.sortableFields.includes(sort)) {
      return items;
    }

    const compareValues = (aValue: any, bValue: any) => {
      if (aValue < bValue) return sort_dir === "asc" ? -1 : 1;
      if (aValue > bValue) return sort_dir === "asc" ? 1 : -1;
      return 0;
    };

    return [...items].sort((a, b) => {
      const aValue = custom_getter
        ? custom_getter(sort, a)
        : a[sort as keyof E];
      const bValue = custom_getter
        ? custom_getter(sort, b)
        : b[sort as keyof E];

      return compareValues(aValue, bValue);
    });
  }

  protected applyPagination(
    items: E[],
    page: SearchInput["page"],
    per_page: SearchInput["per_page"]
  ) {
    const start = (page - 1) * per_page;
    const limit = start + per_page;
    return items.slice(start, limit);
  }
}
