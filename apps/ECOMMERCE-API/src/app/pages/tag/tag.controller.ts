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
import { ResponsePayload } from '../../shared/interfaces/response-payload.interface';
import { MongoIdValidationPipe } from '../../shared/pipes/mongo-id-validation.pipe';

@Controller('tag')
export class TagController {
  private logger = new Logger(TagController.name);

  constructor(private tagService: TagService) {}

  /**
   * ADD DATA
   * addTag()
   * insertManyTag()
   */
  @Post('/add')
  @UsePipes(ValidationPipe)
  async addTag(
    @Body()
    addTagDto: AddTagDto,
  ): Promise<ResponsePayload> {
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
  ): Promise<ResponsePayload> {
    return this.tagService.getAllTags(filterTagDto, searchString);
  }

  @Version(VERSION_NEUTRAL)
  @Get('/get-by-tag')
  async getTagByName(@Query('name') name: string): Promise<ResponsePayload> {
    return this.tagService.getTagByName(name);
  }

  @Version(VERSION_NEUTRAL)
  @Get('/:id')
  async getTagById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query() select: string,
  ): Promise<ResponsePayload> {
    return await this.tagService.getTagById(id, select);
  }

  @Version(VERSION_NEUTRAL)
  @Get('get-tag/:id')
  @UsePipes(ValidationPipe)
  async getUserTagById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query() select: string,
  ): Promise<ResponsePayload> {
    return await this.tagService.getUserTagById(id, select);
  }

  /**
   * UPDATE DATA
   * updateTagById()
   * updateMultipleTagById()
   */
  @Version(VERSION_NEUTRAL)
  @Put('/update/:id')
  @UsePipes(ValidationPipe)
  async updateTagById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateTagDto: UpdateTagDto,
  ): Promise<ResponsePayload> {
    return await this.tagService.updateTagById(id, updateTagDto);
  }

  @Version(VERSION_NEUTRAL)
  @Put('/update-multiple')
  @UsePipes(ValidationPipe)
  async updateMultipleTagById(
    @Body() updateTagDto: UpdateTagDto,
  ): Promise<ResponsePayload> {
    return await this.tagService.updateMultipleTagById(
      updateTagDto.ids,
      updateTagDto,
    );
  }

  /**
   * DELETE DATA
   * deleteTagById()
   * deleteMultipleTagById()
   */
  @Version(VERSION_NEUTRAL)
  @Delete('/delete/:id')
  async deleteTagById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query('checkUsage') checkUsage: boolean,
  ): Promise<ResponsePayload> {
    return await this.tagService.deleteTagById(id, Boolean(checkUsage));
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple')
  @UsePipes(ValidationPipe)
  async deleteMultipleTagById(
    @Body() data: { ids: string[] },
    @Query('checkUsage') checkUsage: boolean,
  ): Promise<ResponsePayload> {
    return await this.tagService.deleteMultipleTagById(
      data.ids,
      Boolean(checkUsage),
    );
  }
}
