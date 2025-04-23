import { SearchOutput } from './search.output';

describe('SearchOutput Unit Tests', () => {
  it('constructor props', () => {
    const result = new SearchOutput({
      items: ['entity1', 'entity2'] as any,
      total: 4,
      current_page: 1,
      per_page: 2,
    });

    expect(result).toEqual({
      items: ['entity1', 'entity2'],
      total: 4,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });
  });

  it('should set last_page to 1 when per_page field is greater than total field', () => {
    const result = new SearchOutput({
      items: [] as any,
      total: 4,
      current_page: 1,
      per_page: 15,
    });

    expect(result.last_page).toBe(1);
  });

  it('should correctly set last_page prop when total is not a multiple of per_page', () => {
    const result = new SearchOutput({
      items: [] as any,
      total: 101,
      current_page: 1,
      per_page: 20,
    });

    expect(result.last_page).toBe(6);
  });
});
