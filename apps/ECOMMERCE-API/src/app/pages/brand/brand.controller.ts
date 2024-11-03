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

import { BrandService } from './brand.service';
import { AddBrandDto, FilterAndPaginationBrandDto, UpdateBrandDto } from '../../modules/brand/brand.dto';
import { ResponsePayload } from '../../shared/interfaces/response-payload.interface';
import { MongoIdValidationPipe } from '../../shared/pipes/mongo-id-validation.pipe';

@Controller('brand')
export class BrandController {
  private logger = new Logger(BrandController.name);

  constructor(private brandService: BrandService) {}

  /**
   * ADD DATA
   * addBrand()
   * insertManyBrand()
   */
  @Post('/add')
  @UsePipes(ValidationPipe)
  async addBrand(
    @Body()
    addBrandDto: AddBrandDto,
  ): Promise<ResponsePayload> {
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
  ): Promise<ResponsePayload> {
    return this.brandService.getAllBrands(filterBrandDto, searchString);
  }

  @Version(VERSION_NEUTRAL)
  @Get('/get-by-brand')
  async getBrandByName(@Query('name') name: string): Promise<ResponsePayload> {
    return this.brandService.getBrandByName(name);
  }

  @Version(VERSION_NEUTRAL)
  @Get('/:id')
  async getBrandById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query() select: string,
  ): Promise<ResponsePayload> {
    return await this.brandService.getBrandById(id, select);
  }

  @Version(VERSION_NEUTRAL)
  @Get('get-brand/:id')
  @UsePipes(ValidationPipe)
  async getUserBrandById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query() select: string,
  ): Promise<ResponsePayload> {
    return await this.brandService.getUserBrandById(id, select);
  }

  /**
   * UPDATE DATA
   * updateBrandById()
   * updateMultipleBrandById()
   */
  @Version(VERSION_NEUTRAL)
  @Put('/update/:id')
  @UsePipes(ValidationPipe)
  async updateBrandById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateBrandDto: UpdateBrandDto,
  ): Promise<ResponsePayload> {
    return await this.brandService.updateBrandById(id, updateBrandDto);
  }

  @Version(VERSION_NEUTRAL)
  @Put('/update-multiple')
  @UsePipes(ValidationPipe)
  async updateMultipleBrandById(
    @Body() updateBrandDto: UpdateBrandDto,
  ): Promise<ResponsePayload> {
    return await this.brandService.updateMultipleBrandById(
      updateBrandDto.ids,
      updateBrandDto,
    );
  }

  /**
   * DELETE DATA
   * deleteBrandById()
   * deleteMultipleBrandById()
   */
  @Version(VERSION_NEUTRAL)
  @Delete('/delete/:id')
  async deleteBrandById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query('checkUsage') checkUsage: boolean,
  ): Promise<ResponsePayload> {
    return await this.brandService.deleteBrandById(id, Boolean(checkUsage));
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple')
  @UsePipes(ValidationPipe)
  async deleteMultipleBrandById(
    @Body() data: { ids: string[] },
    @Query('checkUsage') checkUsage: boolean,
  ): Promise<ResponsePayload> {
    return await this.brandService.deleteMultipleBrandById(
      data.ids,
      Boolean(checkUsage),
    );
  }
}
