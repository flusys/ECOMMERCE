import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ParentProductSchema } from '../../modules/product/parent-product.schema';
import { ProductSchema } from '../../modules/product/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'ParentProduct', schema: ParentProductSchema },
      { name: 'Product', schema: ProductSchema }
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
