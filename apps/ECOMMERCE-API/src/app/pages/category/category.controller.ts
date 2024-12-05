import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Version,
  VERSION_NEUTRAL,
} from '@nestjs/common';

import { CategoryService } from './category.service';
import { AddCategoryDto, FilterAndPaginationCategoryDto, UpdateCategoryDto } from '../../modules/category/category.dto';
import { ResponsePayload } from '../../shared/interfaces/response-payload.interface';
import { MongoIdValidationPipe } from '../../shared/pipes/mongo-id-validation.pipe';

@Controller('category')
export class CategoryController {
  private logger = new Logger(CategoryController.name);

  constructor(private categoryService: CategoryService) {}

  /**
   * ADD DATA
   * addCategory()
   * insertManyCategory()
   */
  @Post('/add')
  @UsePipes(ValidationPipe)
  async addCategory(
    @Body()
    addCategoryDto: AddCategoryDto,
  ): Promise<ResponsePayload> {
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
  ): Promise<ResponsePayload> {
    return this.categoryService.getAllCategorys(filterCategoryDto, searchString);
  }

  @Version(VERSION_NEUTRAL)
  @Get('/get-by-category')
  async getCategoryByName(@Query('name') name: string): Promise<ResponsePayload> {
    return this.categoryService.getCategoryByName(name);
  }

  @Version(VERSION_NEUTRAL)
  @Get('/:id')
  async getCategoryById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query() select: string,
  ): Promise<ResponsePayload> {
    return await this.categoryService.getCategoryById(id, select);
  }

  @Version(VERSION_NEUTRAL)
  @Get('get-category/:id')
  @UsePipes(ValidationPipe)
  async getUserCategoryById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query() select: string,
  ): Promise<ResponsePayload> {
    return await this.categoryService.getUserCategoryById(id, select);
  }

  /**
   * UPDATE DATA
   * updateCategoryById()
   * updateMultipleCategoryById()
   */
  @Version(VERSION_NEUTRAL)
  @Put('/update/:id')
  @UsePipes(ValidationPipe)
  async updateCategoryById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<ResponsePayload> {
    return await this.categoryService.updateCategoryById(id, updateCategoryDto);
  }

  @Version(VERSION_NEUTRAL)
  @Put('/update-multiple')
  @UsePipes(ValidationPipe)
  async updateMultipleCategoryById(
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<ResponsePayload> {
    return await this.categoryService.updateMultipleCategoryById(
      updateCategoryDto.ids,
      updateCategoryDto,
    );
  }

  /**
   * DELETE DATA
   * deleteCategoryById()
   * deleteMultipleCategoryById()
   */
  @Version(VERSION_NEUTRAL)
  @Delete('/delete/:id')
  async deleteCategoryById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query('checkUsage') checkUsage: boolean,
  ): Promise<ResponsePayload> {
    return await this.categoryService.deleteCategoryById(id, Boolean(checkUsage));
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple')
  @UsePipes(ValidationPipe)
  async deleteMultipleCategoryById(
    @Body() data: { ids: string[] },
    @Query('checkUsage') checkUsage: boolean,
  ): Promise<ResponsePayload> {
    return await this.categoryService.deleteMultipleCategoryById(
      data.ids,
      Boolean(checkUsage),
    );
  }
}
