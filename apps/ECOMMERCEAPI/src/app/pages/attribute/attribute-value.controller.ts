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

import { AttributeValueService } from './attribute-value.service';
import { AddAttributeValueDto, FilterAndPaginationAttributeValueDto, UpdateAttributeValueDto } from '../../modules/attribute/attribute-value.dto';
import { IResponsePayload } from 'flusysng/shared/interfaces';
import { MongoIdValidationPipe } from '../../shared/pipes/mongo-id-validation.pipe';
import { IAttributeValue } from '../../modules/attribute/attribute-value.interface';

@Controller('attribute-value')
export class AttributeValueController {
  private logger = new Logger(AttributeValueController.name);

  constructor(private attributeValueService: AttributeValueService) {}

  /**
   * ADD DATA
   * addAttributeValue()
   * insertManyAttributeValue()
   */
  @Post('/insert')
  @UsePipes(ValidationPipe)
  async addAttributeValue(
    @Body()
    addAttributeValueDto: AddAttributeValueDto,
  ): Promise<IResponsePayload<IAttributeValue>> {
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
  ): Promise<IResponsePayload<Array<IAttributeValue>>> {
    return this.attributeValueService.getAllAttributeValues(filterAttributeValueDto, searchString);
  }

  @Version(VERSION_NEUTRAL)
  @Get('/:id')
  async getAttributeValueById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query() select: string,
  ): Promise<IResponsePayload<IAttributeValue>> {
    return await this.attributeValueService.getAttributeValueById(id, select);
  }

  /**
   * UPDATE DATA
   * updateAttributeValueById()
   */
  @Version(VERSION_NEUTRAL)
  @Post('/update')
  @UsePipes(ValidationPipe)
  async updateAttributeValueById(
    @Body() updateAttributeValueDto: UpdateAttributeValueDto,
  ): Promise<IResponsePayload<String>> {
    return await this.attributeValueService.updateAttributeValueById(updateAttributeValueDto);
  }

}
