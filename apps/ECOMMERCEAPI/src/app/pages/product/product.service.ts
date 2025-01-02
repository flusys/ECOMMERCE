import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UtilsService } from '../../shared/modules/utils/utils.service';
import { IProduct } from '../../modules/product/product.interface';
import { CounterService } from '../../shared/modules/counter/counter.service';
import { IResponsePayload } from 'flusysng/shared/interfaces';
import { AddParentProductDto } from '../../modules/product/parent-product.dto';
import { IParentProduct } from '../../modules/product/parent-product.interface';

@Injectable()
export class ProductService {
  private logger = new Logger(ProductService.name);

  constructor(
    @InjectModel('ParentProduct') private readonly parentProductModel: Model<IParentProduct>,
    @InjectModel('Product') private readonly productModel: Model<IProduct>,
    private utilsService: UtilsService,
    private counterService: CounterService
  ) { }

  /**
  * ADD DATA
  * addProduct()
  */
  async addProduct(addProductDto: AddParentProductDto): Promise<IResponsePayload<IProduct>> {
    try {
      // Generate a unique ID for the parent product
      const parentProductId = await this.counterService.getNextId('parent_product_id');

      // Handle the 'chields' (child products)
      const childProductIds = [];
      if (addProductDto.chields && addProductDto.chields.length > 0) {
        for (const childDto of addProductDto.chields) {
          // Generate unique ID for each child
          const childId = await this.counterService.getNextId('product_id');

          // Merge child ID with its data
          const childData = { ...childDto, id: childId, parentProduct: parentProductId };

          // Save the child product in the database
          const childProductModel = new this.productModel(childData); // Assuming the schema is the same
          const savedChild = await childProductModel.save();

          // Store the child ID
          childProductIds.push(savedChild.id);
        }
      }

      // Add the generated parent ID and child IDs to the DTO
      const productData = {
        ...addProductDto,
        id: parentProductId,
      };

      // Create and save the ParentProduct document
      const newProduct = new this.parentProductModel(productData);
      await newProduct.save();

      this.logger.log(`Product with chields added successfully: Parent ID ${parentProductId}`);

      return {
        success: true,
        message: 'Success! Data Added.',
        data: newProduct,
      } as unknown as IResponsePayload<IProduct>;
    } catch (error) {
      this.logger.error('Failed to add product with chields', error.stack);
      throw new InternalServerErrorException('An error occurred while adding the product.');
    }
  }

}
