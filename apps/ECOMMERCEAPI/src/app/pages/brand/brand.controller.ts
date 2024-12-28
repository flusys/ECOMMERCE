import {
  Body,
  Controller,
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

import { BrandService } from './brand.service';
import { AddBrandDto, FilterAndPaginationBrandDto, UpdateBrandDto } from '../../modules/brand/brand.dto';
import { ResponsePayload } from '../../shared/interfaces/response-payload.interface';
import { MongoIdValidationPipe } from '../../shared/pipes/mongo-id-validation.pipe';
import { IResponsePayload } from 'flusysng/shared/interfaces';
import { IBrand } from '../../modules/brand/brand.interface';

@Controller('brand')
export class BrandController {
  private logger = new Logger(BrandController.name);

  constructor(private brandService: BrandService) { }

  /**
   * ADD DATA
   * addBrand()
   * insertManyBrand()
   */
  @Post('/insert')
  @UsePipes(ValidationPipe)
  async addBrand(
    @Body()
    addBrandDto: AddBrandDto,
  ): Promise<IResponsePayload<IBrand>> {
    return await this.brandService.addBrand(addBrandDto);
  }

  /**
   * GET DATA
   * getAllBrands()
   * getBrandById()
   * getUserBrandById()
   */
  @Version(VERSION_NEUTRAL)
  @Post('/get-all')
  @UsePipes(ValidationPipe)
  async getAllBrands(
    @Body() filterBrandDto: FilterAndPaginationBrandDto,
    @Query('q') searchString: string,
  ): Promise<IResponsePayload<Array<IBrand>>> {
    return this.brandService.getAllBrands(filterBrandDto, searchString);
  }


  @Version(VERSION_NEUTRAL)
  @Get('/:id')
  async getBrandById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query() select: string,
  ): Promise<IResponsePayload<IBrand>> {
    return await this.brandService.getBrandById(id, select);
  }

  /**
   * UPDATE DATA
   * updateBrandById()
   * updateMultipleBrandById()
   */
  @Version(VERSION_NEUTRAL)
  @Post('/update')
  @UsePipes(ValidationPipe)
  async updateBrandById(
    @Body() updateBrandDto: UpdateBrandDto,
  ): Promise<IResponsePayload<String>> {
    return await this.brandService.updateBrandById(updateBrandDto);
  }

}
