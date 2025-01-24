import {
  Body,
  Controller,
  Delete,
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

import { PostCategoryService } from './post-category.service';
import { AddPostCategoryDto, FilterAndPaginationPostCategoryDto, UpdatePostCategoryDto } from '../../modules/post/post-category.dto';
import { IResponsePayload } from 'flusysng/shared/interfaces';
import { MongoIdValidationPipe } from '../../shared/pipes/mongo-id-validation.pipe';
import { IPostCategory } from '../../modules/post/post-category.interface';

@Controller('post-category')
export class PostCategoryController {
  private logger = new Logger(PostCategoryController.name);

  constructor(private postCategoryService: PostCategoryService) {}

  /**
   * ADD DATA
   * addPostCategory()
   * insertManyPostCategory()
   */
  @Post('/insert')
  @UsePipes(ValidationPipe)
  async addPostCategory(
    @Body()
    addPostCategoryDto: AddPostCategoryDto,
  ): Promise<IResponsePayload<IPostCategory>> {
    return await this.postCategoryService.addPostCategory(addPostCategoryDto);
  }

  /**
   * GET DATA
   * getAllPostCategorys()
   * getPostCategoryById()
   * getUserPostCategoryById()
   */
  @Version(VERSION_NEUTRAL)
  @Post('/get-all')
  @UsePipes(ValidationPipe)
  async getAllPostCategorys(
    @Body() filterPostCategoryDto: FilterAndPaginationPostCategoryDto,
    @Query('q') searchString: string,
  ): Promise<IResponsePayload<Array<IPostCategory>>> {
    return this.postCategoryService.getAllPostCategorys(filterPostCategoryDto, searchString);
  }



  @Version(VERSION_NEUTRAL)
  @Get('/get-all-with-values')
  @UsePipes(ValidationPipe)
  async getAllPostCategorysWithValue(): Promise<IResponsePayload<Array<IPostCategory>>> {
    return this.postCategoryService.getAllPostCategorysWithValue();
  }


  

  @Version(VERSION_NEUTRAL)
  @Get('/:id')
  async getPostCategoryById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query() select: string,
  ): Promise<IResponsePayload<IPostCategory>> {
    return await this.postCategoryService.getPostCategoryById(id, select);
  }

  /**
   * UPDATE DATA
   * updatePostCategoryById()
   */
  @Version(VERSION_NEUTRAL)
  @Post('/update')
  @UsePipes(ValidationPipe)
  async updatePostCategoryById(
    @Body() updatePostCategoryDto: UpdatePostCategoryDto,
  ): Promise<IResponsePayload<String>> {
    return await this.postCategoryService.updatePostCategoryById(updatePostCategoryDto);
  }

}
