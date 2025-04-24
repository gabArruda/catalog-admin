import { CreateCategoryOutput } from '@core/category/application/use-cases/create/create-category.use-case';
import { CategoriesController } from './categories.controller';
import { CreateCategoryDto } from './dto/create-category.dto';
import {
  CategoryCollectionPresenter,
  CategoryPresenter,
} from './categories.presenter';
import { UpdateCategoryOutput } from '@core/category/application/use-cases/update/update-category.use-case';
import { UpdateCategoryInput } from '@core/category/application/use-cases/update/update-category.input';
import { GetCategoryOutput } from '@core/category/application/use-cases/get/get-category.use-case';
import { ListCategoriesOutput } from '@core/category/application/use-cases/list/list-categories.use-case';
import { SortDirection } from '@core/shared/domain/repository/search.input';

describe('CategoriesController Unit Tests', () => {
  let controller: CategoriesController;

  beforeEach(() => {
    controller = new CategoriesController();
  });

  it('should create a category', async () => {
    const output: CreateCategoryOutput = {
      category_id: '9366b7dc-2d71-4799-b91c-c64adb205104',
      name: 'Movie',
      description: 'some description',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const mockCreateUseCase = {
      execute: jest.fn().mockResolvedValue(output),
    };
    //@ts-expect-error defined part of methods
    controller['createUseCase'] = mockCreateUseCase;
    const input: CreateCategoryDto = {
      name: 'Movie',
      description: 'some description',
      is_active: true,
    };

    const presenter = await controller.create(input);

    expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
    expect(presenter).toBeInstanceOf(CategoryPresenter);
    expect(presenter).toStrictEqual(new CategoryPresenter(output));
  });

  it('should update a category', async () => {
    const id = '9366b7dc-2d71-4799-b91c-c64adb205104';
    const output: UpdateCategoryOutput = {
      category_id: id,
      name: 'Movie',
      description: 'some description',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const mockUpdateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error defined part of methods
    controller['updateUseCase'] = mockUpdateUseCase;
    const input: Omit<UpdateCategoryInput, 'category_id'> = {
      name: 'Movie',
      description: 'some description',
      is_active: true,
    };
    const presenter = await controller.update(id, input);
    expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({
      category_id: id,
      ...input,
    });
    expect(presenter).toBeInstanceOf(CategoryPresenter);
    expect(presenter.name).toBe('Movie');
    expect(presenter.description).toBe('some description');
  });

  it('should delete a category', async () => {
    const expectedOutput = undefined;
    const mockDeleteUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
    };
    //@ts-expect-error defined part of methods
    controller['deleteUseCase'] = mockDeleteUseCase;
    const id = '9366b7dc-2d71-4799-b91c-c64adb205104';
    expect(controller.remove(id)).toBeInstanceOf(Promise);
    const output = await controller.remove(id);
    expect(mockDeleteUseCase.execute).toHaveBeenCalledWith({ category_id: id });
    expect(expectedOutput).toStrictEqual(output);
  });

  it('should get a category', async () => {
    const id = '9366b7dc-2d71-4799-b91c-c64adb205104';
    const output: GetCategoryOutput = {
      category_id: id,
      name: 'Movie',
      description: 'some description',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const mockGetUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error defined part of methods
    controller['getUseCase'] = mockGetUseCase;
    const presenter = await controller.findOne(id);
    expect(mockGetUseCase.execute).toHaveBeenCalledWith({ category_id: id });
    expect(presenter).toBeInstanceOf(CategoryPresenter);
    expect(presenter.name).toBe('Movie');
    expect(presenter.description).toBe('some description');
  });

  it('should list categories', async () => {
    const output: ListCategoriesOutput = {
      items: [
        {
          category_id: '9366b7dc-2d71-4799-b91c-c64adb205104',
          name: 'Movie',
          description: 'some description',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      current_page: 1,
      last_page: 1,
      per_page: 1,
      total: 1,
    };
    const mockListUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error defined part of methods
    controller['listUseCase'] = mockListUseCase;
    const searchParams = {
      page: 1,
      per_page: 2,
      sort: 'name',
      sort_dir: 'desc' as SortDirection,
      filter: 'test',
    };
    const presenter = await controller.search(searchParams);
    expect(presenter).toBeInstanceOf(CategoryCollectionPresenter);
    expect(mockListUseCase.execute).toHaveBeenCalledWith(searchParams);
    expect(presenter).toEqual(new CategoryCollectionPresenter(output));
  });
});
