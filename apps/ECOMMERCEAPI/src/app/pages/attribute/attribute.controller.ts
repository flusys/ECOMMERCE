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

import { AttributeService } from './attribute.service';
import { AddAttributeDto, FilterAndPaginationAttributeDto, UpdateAttributeDto } from '../../modules/attribute/attribute.dto';
import { IResponsePayload } from 'flusysng/shared/interfaces';
import { MongoIdValidationPipe } from '../../shared/pipes/mongo-id-validation.pipe';
import { IAttribute } from '../../modules/attribute/attribute.interface';

@Controller('attribute')
export class AttributeController {
  private logger = new Logger(AttributeController.name);

  constructor(private attributeService: AttributeService) {}

  /**
   * ADD DATA
   * addAttribute()
   * insertManyAttribute()
   */
  @Post('/insert')
  @UsePipes(ValidationPipe)
  async addAttribute(
    @Body()
    addAttributeDto: AddAttributeDto,
  ): Promise<IResponsePayload<IAttribute>> {
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
  ): Promise<IResponsePayload<Array<IAttribute>>> {
    return this.attributeService.getAllAttributes(filterAttributeDto, searchString);
  }



  @Version(VERSION_NEUTRAL)
  @Get('/get-all-with-values')
  @UsePipes(ValidationPipe)
  async getAllAttributesWithValue(): Promise<IResponsePayload<Array<IAttribute>>> {
    return this.attributeService.getAllAttributesWithValue();
  }


  

  @Version(VERSION_NEUTRAL)
  @Get('/:id')
  async getAttributeById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query() select: string,
  ): Promise<IResponsePayload<IAttribute>> {
    return await this.attributeService.getAttributeById(id, select);
  }

  /**
   * UPDATE DATA
   * updateAttributeById()
   */
  @Version(VERSION_NEUTRAL)
  @Post('/update')
  @UsePipes(ValidationPipe)
  async updateAttributeById(
    @Body() updateAttributeDto: UpdateAttributeDto,
  ): Promise<IResponsePayload<String>> {
    return await this.attributeService.updateAttributeById(updateAttributeDto);
  }

}
