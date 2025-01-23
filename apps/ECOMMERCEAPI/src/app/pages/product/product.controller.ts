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

import { ProductService } from './product.service';
import { IResponsePayload } from 'flusysng/shared/interfaces';
import { IProduct } from '../../modules/product/product.interface';
import { AddParentProductDto } from '../../modules/product/parent-product.dto';
import { MongoIdValidationPipe } from '../../shared/pipes/mongo-id-validation.pipe';
import { FilterAndPaginationProductDto } from '../../modules/product/product.dto';
import { IParentProduct } from '../../modules/product/parent-product.interface';

@Controller('product')
export class ProductController {
  private logger = new Logger(ProductController.name);

  constructor(private productService: ProductService) { }

  /**
   * ADD DATA
   * addProduct()
   * insertManyProduct()
   */
  @Post('/insert')
  @UsePipes(ValidationPipe)
  async addProduct(
    @Body()
    addProductDto: AddParentProductDto,
  ): Promise<IResponsePayload<IProduct>> {
    return await this.productService.addProduct(addProductDto);
  }

  @Post('/update')
  @UsePipes(ValidationPipe)
  async updateProduct(
    @Body()
    addProductDto: AddParentProductDto,
  ): Promise<IResponsePayload<IProduct>> {
    return await this.productService.updateProduct(addProductDto);
  }

  /**
   * GET DATA
   * getAllProducts()
   * getProductById()
   */
  @Version(VERSION_NEUTRAL)
  @Post('/get-all')
  @UsePipes(ValidationPipe)
  async getAllProducts(
    @Body() filterProductDto: FilterAndPaginationProductDto,
    @Query('q') searchString: string,
  ): Promise<IResponsePayload<Array<IProduct>>> {
    return this.productService.getAllProducts(filterProductDto, searchString);
  }

  @Version(VERSION_NEUTRAL)
  @Get('parent-product/:id')
  async getParentProductDetailsById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query() select: string,
  ): Promise<IResponsePayload<IParentProduct>> {
    return await this.productService.getParentProductDetailsById(id, select);
  }



  @Version(VERSION_NEUTRAL)
  @Delete('delete/:id')
  async deleteProduct(
    @Param('id') id: number,
  ): Promise<IResponsePayload<string>> {
    return await this.productService.deleteProduct(id);
  }
}
