import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
  Version,
  VERSION_NEUTRAL,
} from '@nestjs/common';

import { CategoryService } from './category.service';
import { AddCategoryDto, FilterAndPaginationCategoryDto, UpdateCategoryDto } from '../../modules/category/category.dto';
import { IResponsePayload } from 'flusysng/shared/interfaces';
import { MongoIdValidationPipe } from '../../shared/pipes/mongo-id-validation.pipe';
import { ICategory } from '../../modules/category/category.interface';

@Controller('category')
export class CategoryController {
  private logger = new Logger(CategoryController.name);

  constructor(private categoryService: CategoryService) { }

  /**
   * ADD DATA
   * addCategory()
   * insertManyCategory()
   */
  @Post('/insert')
  @UsePipes(ValidationPipe)
  async addCategory(
    @Body()
    addCategoryDto: AddCategoryDto,
  ): Promise<IResponsePayload<ICategory>> {
    return await this.categoryService.addCategory(addCategoryDto);
  }

  /**
   * GET DATA
   * getAllCategorys()
   * getCategoryById()
   * getUserCategoryById()
   */
  @Version(VERSION_NEUTRAL)
  @Post('/get-all')
  @UsePipes(ValidationPipe)
  async getAllCategorys(
    @Body() filterCategoryDto: FilterAndPaginationCategoryDto,
    @Query('q') searchString: string,
  ): Promise<IResponsePayload<Array<ICategory>>> {
    return this.categoryService.getAllCategorys(filterCategoryDto, searchString);
  }

  @Version(VERSION_NEUTRAL)
  @Get('/:id')
  async getCategoryById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query() select: string,
  ): Promise<IResponsePayload<ICategory>> {
    return await this.categoryService.getCategoryById(id, select);
  }

  /**
   * UPDATE DATA
   * updateCategoryById()
   */
  @Version(VERSION_NEUTRAL)
  @Post('/update')
  @UsePipes(ValidationPipe)
  async updateCategoryById(
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<IResponsePayload<String>> {
    return await this.categoryService.updateCategoryById(updateCategoryDto);
  }

}
