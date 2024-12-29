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

import { TagService } from './tag.service';
import { AddTagDto, FilterAndPaginationTagDto, UpdateTagDto } from '../../modules/tag/tag.dto';
import { IResponsePayload } from 'flusysng/shared/interfaces';
import { MongoIdValidationPipe } from '../../shared/pipes/mongo-id-validation.pipe';
import { ITag } from '../../modules/tag/tag.interface';

@Controller('tag')
export class TagController {
  private logger = new Logger(TagController.name);

  constructor(private tagService: TagService) {}

  /**
   * ADD DATA
   * addTag()
   * insertManyTag()
   */
  @Post('/insert')
  @UsePipes(ValidationPipe)
  async addTag(
    @Body()
    addTagDto: AddTagDto,
  ): Promise<IResponsePayload<ITag>> {
    return await this.tagService.addTag(addTagDto);
  }

  /**
   * GET DATA
   * getAllTags()
   * getTagById()
   * getUserTagById()
   */
  @Version(VERSION_NEUTRAL)
  @Post('/get-all')
  @UsePipes(ValidationPipe)
  async getAllTags(
    @Body() filterTagDto: FilterAndPaginationTagDto,
    @Query('q') searchString: string,
  ): Promise<IResponsePayload<Array<ITag>>> {
    return this.tagService.getAllTags(filterTagDto, searchString);
  }

  @Version(VERSION_NEUTRAL)
  @Get('/:id')
  async getTagById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query() select: string,
  ): Promise<IResponsePayload<ITag>> {
    return await this.tagService.getTagById(id, select);
  }

  /**
   * UPDATE DATA
   * updateTagById()
   */
  @Version(VERSION_NEUTRAL)
  @Post('/update')
  @UsePipes(ValidationPipe)
  async updateTagById(
    @Body() updateTagDto: UpdateTagDto,
  ): Promise<IResponsePayload<String>> {
    return await this.tagService.updateTagById(updateTagDto);
  }

}
