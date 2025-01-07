import {
  BadRequestException,
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
import { ErrorCodes } from '../../shared/enums/error-code.enum';

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



  /**
   * getAllProducts
   * getProductById
   * getProductBySlug
   */
  async getAllProducts(
    filterProductDto: any,
    searchQuery?: string,
  ): Promise<IResponsePayload<Array<IProduct>>> {
    const { filter } = filterProductDto;
    const { pagination } = filterProductDto;
    const { sort } = filterProductDto;
    const { select } = filterProductDto;

    this.logger.log('Not a Cached page');

    // Modify Id as Object ID
    if (filter && filter['categoryId']) {
      filter['parentProduct.category'] = filter['categoryId'];
    }

    if (filter && filter['brandId']) {
      filter['parentProduct.brand'] = filter['brandId'];
    }

    if (filter && filter['tagsId']) {
      filter['parentProduct.tags'] = filter['tagsId'];
    }

    // Aggregate Stages
    const aggregateStages = [];

    // Essential Variables
    let mFilter = {};
    let mSort = {};
    let mSelect = {};

    // Match
    if (filter) {
      mFilter = { ...mFilter, ...filter };
    }

    if (searchQuery) {
      mFilter = {
        $and: [
          mFilter,
          {
            $or: [
              { name: { $regex: searchQuery, $options: 'i' } },
              { 'parentProduct.category.name': { $regex: searchQuery, $options: 'i' } },
              { 'parentProduct.brand.name': { $regex: searchQuery, $options: 'i' } },
              { 'parentProduct.company.name': { $regex: searchQuery, $options: 'i' } },
              { 'parentProduct.tags.name': { $regex: searchQuery, $options: 'i' } },
            ],
          },
        ],
      };
    }

    aggregateStages.push({ $match: mFilter });

    // Lookup for Joining Parent Product and Related Data
    aggregateStages.push(
      {
        $lookup: {
          from: 'parentproducts',
          localField: 'parentProduct',
          foreignField: 'id',
          as: 'parentProduct',
        },
      },
      { $unwind: { path: '$parentProduct', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'categories',
          localField: 'parentProduct.category',
          foreignField: 'id',
          as: 'parentProduct.category',
        },
      },
      { $unwind: { path: '$parentProduct.category', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'brands',
          localField: 'parentProduct.brand',
          foreignField: 'id',
          as: 'parentProduct.brand',
        },
      },
      { $unwind: { path: '$parentProduct.brand', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'companies',
          localField: 'parentProduct.company',
          foreignField: 'id',
          as: 'parentProduct.company',
        },
      },
      { $unwind: { path: '$parentProduct.company', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'tags',
          localField: 'parentProduct.tags',
          foreignField: 'id',
          as: 'parentProduct.tags',
        },
      },
    );

    // Lookup for Joining Variants and Variant Attributes
    aggregateStages.push(
      {
        $lookup: {
          from: 'attributevalues',
          localField: 'variants',
          foreignField: 'id',
          as: 'variants',
        },
      },
      {
        $unwind: { path: '$variants', preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: 'attributes', // Join with 'attributes' collection
          localField: 'variants.attribute', // Join based on attribute reference
          foreignField: 'id',
          as: 'variants.attribute',
        },
      },
      {
        $unwind: { path: '$variants.attribute', preserveNullAndEmptyArrays: true },
      },
    );

    // Sort
    if (sort) {
      mSort = {};
      Object.keys(sort).forEach(item => {
        mSort = { ...mSort, ...{ [item]: sort['item'] == 'ASC' ? 1 : -1 } }
      });
    } else {
      mSort = { createdAt: -1 };
    }

    aggregateStages.push({ $sort: mSort });

    // Select
    if (select && select.length) {
      mSelect = select.reduce((prev, curr) => {
        return prev = { ...prev, ...{ [curr]: 1 } }
      }, {});
    } else {
      mSelect = { name: 1 };
    }

    aggregateStages.push({ $project: mSelect });

    // Pagination
    if (pagination) {
      aggregateStages.push(
        {
          $skip: pagination.pageSize * pagination.currentPage,
        },
        {
          $limit: pagination.pageSize,
        },
      );
    }

    try {
      const dataAggregates = await this.productModel.aggregate(aggregateStages);

      if (pagination) {
        return {
          result: dataAggregates,
          success: true,
          message: 'Success',
          total: dataAggregates.length,
        } as IResponsePayload<Array<IProduct>>;
      } else {
        return {
          result: dataAggregates,
          success: true,
          message: 'Success',
          total: dataAggregates.length,
        } as IResponsePayload<Array<IProduct>>;
      }
    } catch (err) {
      this.logger.error(err);
      if (err.code && err.code.toString() === ErrorCodes.PROJECTION_MISMATCH) {
        throw new BadRequestException('Error! Projection mismatch');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }


  async getProductById(id: string, select: string): Promise<IResponsePayload<IProduct>> {
    try {
      const data = await this.productModel
        .findById(id)
        .select(select)
        .populate('parentProduct')
        .populate('variants')
        .populate('parentProduct.tags')
        .populate('parentProduct.brand')
        .populate('parentProduct.category')
        .populate('parentProduct.company')
        .populate('variants.attribute');

      return {
        success: true,
        message: 'Success',
        data,
      } as unknown as IResponsePayload<IProduct>;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
