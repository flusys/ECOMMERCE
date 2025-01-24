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
  UsePipes,
  ValidationPipe,
  Version,
  VERSION_NEUTRAL,
} from '@nestjs/common';

import { PostService } from './post.service';
import { AddPostDto, FilterAndPaginationPostDto, UpdatePostDto } from '../../modules/post/post.dto';
import { IResponsePayload } from 'flusysng/shared/interfaces';
import { MongoIdValidationPipe } from '../../shared/pipes/mongo-id-validation.pipe';
import { IPost } from '../../modules/post/post.interface';

@Controller('post')
export class PostController {
  private logger = new Logger(PostController.name);

  constructor(private postService: PostService) {}

  /**
   * ADD DATA
   * addPost()
   * insertManyPost()
   */
  @Post('/insert')
  @UsePipes(ValidationPipe)
  async addPost(
    @Body()
    addPostDto: AddPostDto,
  ): Promise<IResponsePayload<IPost>> {
    return await this.postService.addPost(addPostDto);
  }

  /**
   * GET DATA
   * getAllPosts()
   * getPostById()
   * getUserPostById()
   */
  @Version(VERSION_NEUTRAL)
  @Post('/get-all')
  @UsePipes(ValidationPipe)
  async getAllPosts(
    @Body() filterPostDto: FilterAndPaginationPostDto,
    @Query('q') searchString: string,
  ): Promise<IResponsePayload<Array<IPost>>> {
    return this.postService.getAllPosts(filterPostDto, searchString);
  }



  @Version(VERSION_NEUTRAL)
  @Get('/get-all-with-values')
  @UsePipes(ValidationPipe)
  async getAllPostsWithValue(): Promise<IResponsePayload<Array<IPost>>> {
    return this.postService.getAllPostsWithValue();
  }


  

  @Version(VERSION_NEUTRAL)
  @Get('/:id')
  async getPostById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query() select: string,
  ): Promise<IResponsePayload<IPost>> {
    return await this.postService.getPostById(id, select);
  }

  /**
   * UPDATE DATA
   * updatePostById()
   */
  @Version(VERSION_NEUTRAL)
  @Post('/update')
  @UsePipes(ValidationPipe)
  async updatePostById(
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<IResponsePayload<String>> {
    return await this.postService.updatePostById(updatePostDto);
  }

}
