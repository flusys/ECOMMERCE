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

import { AttributeValueService } from './attribute-value.service';
import { AddAttributeValueDto, FilterAndPaginationAttributeValueDto, UpdateAttributeValueDto } from '../../modules/attribute/attribute-value.dto';
import { ResponsePayload } from '../../shared/interfaces/response-payload.interface';
import { MongoIdValidationPipe } from '../../shared/pipes/mongo-id-validation.pipe';

@Controller('attribute-value')
export class AttributeValueController {
  private logger = new Logger(AttributeValueController.name);

  constructor(private attributeValueService: AttributeValueService) {}

  /**
   * ADD DATA
   * addAttributeValue()
   * insertManyAttributeValue()
   */
  @Post('/add')
  @UsePipes(ValidationPipe)
  async addAttributeValue(
    @Body()
    addAttributeValueDto: AddAttributeValueDto,
  ): Promise<ResponsePayload> {
    return await this.attributeValueService.addAttributeValue(addAttributeValueDto);
  }

  /**
   * GET DATA
   * getAllAttributeValues()
   * getAttributeValueById()
   * getUserAttributeValueById()
   */
  @Version(VERSION_NEUTRAL)
  @Post('/get-all')
  @UsePipes(ValidationPipe)
  async getAllAttributeValues(
    @Body() filterAttributeValueDto: FilterAndPaginationAttributeValueDto,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    return this.attributeValueService.getAllAttributeValues(filterAttributeValueDto, searchString);
  }

  @Version(VERSION_NEUTRAL)
  @Get('/get-by-attribute-value')
  async getAttributeValueByName(@Query('name') name: string): Promise<ResponsePayload> {
    return this.attributeValueService.getAttributeValueByName(name);
  }

  @Version(VERSION_NEUTRAL)
  @Get('/:id')
  async getAttributeValueById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query() select: string,
  ): Promise<ResponsePayload> {
    return await this.attributeValueService.getAttributeValueById(id, select);
  }

  @Version(VERSION_NEUTRAL)
  @Get('get-attribute-value/:id')
  @UsePipes(ValidationPipe)
  async getUserAttributeValueById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query() select: string,
  ): Promise<ResponsePayload> {
    return await this.attributeValueService.getUserAttributeValueById(id, select);
  }

  /**
   * UPDATE DATA
   * updateAttributeValueById()
   * updateMultipleAttributeValueById()
   */
  @Version(VERSION_NEUTRAL)
  @Put('/update/:id')
  @UsePipes(ValidationPipe)
  async updateAttributeValueById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateAttributeValueDto: UpdateAttributeValueDto,
  ): Promise<ResponsePayload> {
    return await this.attributeValueService.updateAttributeValueById(id, updateAttributeValueDto);
  }

  @Version(VERSION_NEUTRAL)
  @Put('/update-multiple')
  @UsePipes(ValidationPipe)
  async updateMultipleAttributeValueById(
    @Body() updateAttributeValueDto: UpdateAttributeValueDto,
  ): Promise<ResponsePayload> {
    return await this.attributeValueService.updateMultipleAttributeValueById(
      updateAttributeValueDto.ids,
      updateAttributeValueDto,
    );
  }

  /**
   * DELETE DATA
   * deleteAttributeValueById()
   * deleteMultipleAttributeValueById()
   */
  @Version(VERSION_NEUTRAL)
  @Delete('/delete/:id')
  async deleteAttributeValueById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query('checkUsage') checkUsage: boolean,
  ): Promise<ResponsePayload> {
    return await this.attributeValueService.deleteAttributeValueById(id, Boolean(checkUsage));
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple')
  @UsePipes(ValidationPipe)
  async deleteMultipleAttributeValueById(
    @Body() data: { ids: string[] },
    @Query('checkUsage') checkUsage: boolean,
  ): Promise<ResponsePayload> {
    return await this.attributeValueService.deleteMultipleAttributeValueById(
      data.ids,
      Boolean(checkUsage),
    );
  }
}
