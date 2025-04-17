import { SearchInput } from "./search.input";

describe("SearchInput Unit Tests", () => {
  it("should assign page for empty param", () => {
    const params = new SearchInput();
    expect(params.page).toBe(1);
  });
  it.each([
    { page: null, expected: 1 },
    { page: undefined, expected: 1 },
    { page: "", expected: 1 },
    { page: "fake", expected: 1 },
    { page: 0, expected: 1 },
    { page: -1, expected: 1 },
    { page: 5.5, expected: 1 },
    { page: true, expected: 1 },
    { page: false, expected: 1 },
    { page: {}, expected: 1 },

    { page: 1, expected: 1 },
    { page: 2, expected: 2 },
  ])("should verify page prop %p", ({ page, expected }) => {
    expect(new SearchInput({ page: page as any }).page).toBe(expected);
  });

  it("should assign per_page for empty param", () => {
    const params = new SearchInput();
    expect(params.per_page).toBe(10);
  });
  it.each([
    { per_page: null, expected: 10 },
    { per_page: undefined, expected: 10 },
    { per_page: "", expected: 10 },
    { per_page: "fake", expected: 10 },
    { per_page: 0, expected: 10 },
    { per_page: -1, expected: 10 },
    { per_page: 5.5, expected: 10 },
    { per_page: true, expected: 10 },
    { per_page: false, expected: 10 },
    { per_page: {}, expected: 10 },

    { per_page: 1, expected: 1 },
    { per_page: 2, expected: 2 },
    { per_page: 15, expected: 15 },
  ])("should verify per_page prop %p", (i) => {
    expect(new SearchInput({ per_page: i.per_page as any }).per_page).toBe(
      i.expected
    );
  });

  it("should assign sort for empty param", () => {
    const params = new SearchInput();
    expect(params.sort).toBeNull();
  });
  it.each([
    { sort: null, expected: null },
    { sort: undefined, expected: null },
    { sort: "", expected: null },
    { sort: 0, expected: "0" },
    { sort: -1, expected: "-1" },
    { sort: 5.5, expected: "5.5" },
    { sort: true, expected: "true" },
    { sort: false, expected: "false" },
    { sort: {}, expected: "[object Object]" },
    { sort: "field", expected: "field" },
  ])("should verify sort props %p", (i) => {
    const params = new SearchInput();
    expect(params.sort).toBeNull();

    expect(new SearchInput({ sort: i.sort as any }).sort).toBe(i.expected);
  });

  it("should set sort_dir null when sort is null", () => {
    let params = new SearchInput();
    expect(params.sort_dir).toBeNull();

    params = new SearchInput({ sort: null });
    expect(params.sort_dir).toBeNull();

    params = new SearchInput({ sort: undefined });
    expect(params.sort_dir).toBeNull();

    params = new SearchInput({ sort: "" });
    expect(params.sort_dir).toBeNull();
  });
  it.each([
    { sort_dir: null, expected: "asc" },
    { sort_dir: undefined, expected: "asc" },
    { sort_dir: "", expected: "asc" },
    { sort_dir: 0, expected: "asc" },
    { sort_dir: "fake", expected: "asc" },

    { sort_dir: "asc", expected: "asc" },
    { sort_dir: "ASC", expected: "asc" },
    { sort_dir: "desc", expected: "desc" },
    { sort_dir: "DESC", expected: "desc" },
  ])("should verify sort_dir prop %p", (props) => {
    expect(
      new SearchInput({ sort: "field", sort_dir: props.sort_dir as any })
        .sort_dir
    ).toBe(props.expected);
  });

  it("should assign filter for empty param", () => {
    const params = new SearchInput();
    expect(params.filter).toBeNull();
  });
  it.each([
    { filter: null, expected: null },
    { filter: undefined, expected: null },
    { filter: "", expected: null },

    { filter: 0, expected: "0" },
    { filter: -1, expected: "-1" },
    { filter: 5.5, expected: "5.5" },
    { filter: true, expected: "true" },
    { filter: false, expected: "false" },
    { filter: {}, expected: "[object Object]" },
    { filter: "field", expected: "field" },
  ])("should verify filter props %p", (props) => {
    expect(new SearchInput({ filter: props.filter as any }).filter).toBe(
      props.expected
    );
  });
});
