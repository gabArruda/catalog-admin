import { ValueObject } from '../value-object';

export type SortDirection = 'asc' | 'desc';

export type SearchInputConstructorProps<Filter = string> = {
  page?: number;
  per_page?: number;
  sort?: string | null;
  sort_dir?: SortDirection | null;
  filter?: Filter | null;
};

export class SearchInput<Filter = string> extends ValueObject {
  protected _page!: number;
  protected _per_page: number = 10;
  protected _sort!: string | null;
  protected _sort_dir!: SortDirection | null;
  protected _filter!: Filter | null;

  constructor(props: SearchInputConstructorProps<Filter> = {}) {
    super();
    this.page = props.page!;
    this.per_page = props.per_page!;
    this.sort = props.sort!;
    this.sort_dir = props.sort_dir!;
    this.filter = props.filter!;
  }

  get page() {
    return this._page;
  }
  private set page(value: number) {
    const page = +value;
    if (Number.isNaN(page) || page <= 0 || parseInt(page.toString()) !== page) {
      this._page = 1;
      return;
    }
    this._page = page;
  }

  get per_page() {
    return this._per_page;
  }
  private set per_page(value: number) {
    let _per_page = value === (true as any) ? this._per_page : +value;

    if (
      Number.isNaN(_per_page) ||
      _per_page <= 0 ||
      parseInt(_per_page as any) !== _per_page
    ) {
      _per_page = this._per_page;
    }

    this._per_page = _per_page;
  }

  get sort() {
    return this._sort;
  }
  private set sort(value: string | null) {
    this._sort =
      value === null || value === undefined || value === '' ? null : `${value}`;
  }

  get sort_dir() {
    return this._sort_dir;
  }
  private set sort_dir(value: SortDirection | null) {
    if (!this.sort) {
      this._sort_dir = null;
      return;
    }
    const dir = `${value}`.toLowerCase();
    this._sort_dir = dir === 'desc' ? 'desc' : 'asc';
  }

  get filter() {
    return this._filter;
  }
  private set filter(value: Filter | null) {
    this._filter =
      value == null || value === '' ? null : (`${value}` as Filter);
  }
}
