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

import { AttributeService } from './attribute.service';
import { AddAttributeDto, FilterAndPaginationAttributeDto, UpdateAttributeDto } from '../../modules/attribute/attribute.dto';
import { ResponsePayload } from '../../shared/interfaces/response-payload.interface';
import { MongoIdValidationPipe } from '../../shared/pipes/mongo-id-validation.pipe';

@Controller('attribute')
export class AttributeController {
  private logger = new Logger(AttributeController.name);

  constructor(private attributeService: AttributeService) {}

  /**
   * ADD DATA
   * addAttribute()
   * insertManyAttribute()
   */
  @Post('/add')
  @UsePipes(ValidationPipe)
  async addAttribute(
    @Body()
    addAttributeDto: AddAttributeDto,
  ): Promise<ResponsePayload> {
    return await this.attributeService.addAttribute(addAttributeDto);
  }

  /**
   * GET DATA
   * getAllAttributes()
   * getAttributeById()
   * getUserAttributeById()
   */
  @Version(VERSION_NEUTRAL)
  @Post('/get-all')
  @UsePipes(ValidationPipe)
  async getAllAttributes(
    @Body() filterAttributeDto: FilterAndPaginationAttributeDto,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    return this.attributeService.getAllAttributes(filterAttributeDto, searchString);
  }

  @Version(VERSION_NEUTRAL)
  @Get('/get-by-attribute')
  async getAttributeByName(@Query('name') name: string): Promise<ResponsePayload> {
    return this.attributeService.getAttributeByName(name);
  }

  @Version(VERSION_NEUTRAL)
  @Get('/:id')
  async getAttributeById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query() select: string,
  ): Promise<ResponsePayload> {
    return await this.attributeService.getAttributeById(id, select);
  }

  @Version(VERSION_NEUTRAL)
  @Get('get-attribute/:id')
  @UsePipes(ValidationPipe)
  async getUserAttributeById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query() select: string,
  ): Promise<ResponsePayload> {
    return await this.attributeService.getUserAttributeById(id, select);
  }

  /**
   * UPDATE DATA
   * updateAttributeById()
   * updateMultipleAttributeById()
   */
  @Version(VERSION_NEUTRAL)
  @Put('/update/:id')
  @UsePipes(ValidationPipe)
  async updateAttributeById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateAttributeDto: UpdateAttributeDto,
  ): Promise<ResponsePayload> {
    return await this.attributeService.updateAttributeById(id, updateAttributeDto);
  }

  @Version(VERSION_NEUTRAL)
  @Put('/update-multiple')
  @UsePipes(ValidationPipe)
  async updateMultipleAttributeById(
    @Body() updateAttributeDto: UpdateAttributeDto,
  ): Promise<ResponsePayload> {
    return await this.attributeService.updateMultipleAttributeById(
      updateAttributeDto.ids,
      updateAttributeDto,
    );
  }

  /**
   * DELETE DATA
   * deleteAttributeById()
   * deleteMultipleAttributeById()
   */
  @Version(VERSION_NEUTRAL)
  @Delete('/delete/:id')
  async deleteAttributeById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query('checkUsage') checkUsage: boolean,
  ): Promise<ResponsePayload> {
    return await this.attributeService.deleteAttributeById(id, Boolean(checkUsage));
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple')
  @UsePipes(ValidationPipe)
  async deleteMultipleAttributeById(
    @Body() data: { ids: string[] },
    @Query('checkUsage') checkUsage: boolean,
  ): Promise<ResponsePayload> {
    return await this.attributeService.deleteMultipleAttributeById(
      data.ids,
      Boolean(checkUsage),
    );
  }
}
