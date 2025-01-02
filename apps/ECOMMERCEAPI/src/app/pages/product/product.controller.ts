import {
  Body,
  Controller,
  Logger,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { ProductService } from './product.service';
import { IResponsePayload } from 'flusysng/shared/interfaces';
import { IProduct } from '../../modules/product/product.interface';
import { AddParentProductDto } from '../../modules/product/parent-product.dto';

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

}
