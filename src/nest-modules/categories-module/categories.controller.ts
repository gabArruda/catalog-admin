import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  ParseUUIDPipe,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryUseCase } from '@core/category/application/use-cases/create/create-category.use-case';
import { DeleteCategoryUseCase } from '@core/category/application/use-cases/delete/delete-category.use-case';
import { GetCategoryUseCase } from '@core/category/application/use-cases/get/get-category.use-case';
import { ListCategoriesUseCase } from '@core/category/application/use-cases/list/list-categories.use-case';
import { UpdateCategoryUseCase } from '@core/category/application/use-cases/update/update-category.use-case';
import { CreateCategoryDto } from './dto/create-category.dto';
import {
  CategoryCollectionPresenter,
  CategoryPresenter,
} from './categories.presenter';
import { SearchCategoriesDto } from './dto/search-categories.dto';
import { CategoryOutput } from '@core/category/application/use-cases/shared/category.output';

@Controller('categories')
export class CategoriesController {
  @Inject(CreateCategoryUseCase)
  private createUseCase: CreateCategoryUseCase;

  @Inject(DeleteCategoryUseCase)
  private deleteUseCase: DeleteCategoryUseCase;

  @Inject(GetCategoryUseCase)
  private getUseCase: GetCategoryUseCase;

  @Inject(ListCategoriesUseCase)
  private listUseCase: ListCategoriesUseCase;

  @Inject(UpdateCategoryUseCase)
  private updateUseCase: UpdateCategoryUseCase;

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const output = await this.createUseCase.execute(createCategoryDto);
    return new CategoryPresenter(output);
  }

  @Get()
  async search(@Query() searchCategoriesDto: SearchCategoriesDto) {
    const output = await this.listUseCase.execute(searchCategoriesDto);
    return new CategoryCollectionPresenter(output);
  }

  @Get(':id')
  async findOne(
    @Param(
      'id',
      new ParseUUIDPipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    id: string,
  ) {
    const output = await this.getUseCase.execute({ category_id: id });
    return new CategoryPresenter(output);
  }

  @Patch(':id')
  async update(
    @Param(
      'id',
      new ParseUUIDPipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const output = await this.updateUseCase.execute({
      category_id: id,
      ...updateCategoryDto,
    });
    return new CategoryPresenter(output);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param(
      'id',
      new ParseUUIDPipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    id: string,
  ) {
    return this.deleteUseCase.execute({ category_id: id });
  }

  static serialize(output: CategoryOutput) {
    return new CategoryPresenter(output);
  }
}
