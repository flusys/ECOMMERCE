import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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


  async updateProduct(addProductDto: AddParentProductDto): Promise<IResponsePayload<IProduct>> {
    try {
      addProductDto.chields.forEach(async (childDto) => {
        if (childDto.id) {
          const childData = { ...childDto, parentProduct: addProductDto.id };
          await this.productModel.updateOne({ id: childData.id }, childData);
        } else {
          const childId = await this.counterService.getNextId('product_id');
          const childData = { ...childDto, id: childId, parentProduct: addProductDto.id };
          const childProductModel = new this.productModel(childData); // Assuming the schema is the same
          await childProductModel.save();
        }
      });

      delete addProductDto.chields;
      const updateProduct = await this.parentProductModel.updateOne({ id: addProductDto.id }, addProductDto);
      return {
        success: true,
        message: 'Success! Data Updated.',
        data: updateProduct,
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
          as: 'variantDetails',
        },
      },
      {
        $lookup: {
          from: 'attributes',
          localField: 'variantDetails.attribute',
          foreignField: 'id',
          as: 'attributeDetails',
        },
      },
      {
        $addFields: {
          variants: {
            $map: {
              input: '$variantDetails',
              as: 'variant',
              in: {
                id: '$$variant.id',
                name: '$$variant.name',
                attribute: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: '$attributeDetails',
                        as: 'attr',
                        cond: { $eq: ['$$attr.id', '$$variant.attribute'] },
                      },
                    },
                    0,
                  ],
                },
              },
            },
          },
        },
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
      mSelect = {
        price: 1,
        image: 1,
        warningDay: 1,
        warning: 1,
        refundable: 1,
        returnable: 1,
        sku: 1,
        barCode: 1,
        ingredients: 1,
        trackQuantity: 1,
        stockQuantity: 1,
        earnPoint: 1,
        isActive: 1,
        activeOnline: 1,
        status: 1,
        "parentProduct._id": 1,
        "parentProduct.name": 1,
        "parentProduct.readOnly": 1,
        "parentProduct.slug": 1,
        "parentProduct.images": 1,
        "parentProduct.description": 1,
        "parentProduct.isHtml": 1,
        "parentProduct.category.name": 1,
        "parentProduct.brand.name": 1,
        "parentProduct.company.name": 1,
        "parentProduct.tags.name": 1,

        "variants.name": 1,
        "variants.attribute.name": 1,
      };
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


  async getParentProductDetailsById(id: string, select: string): Promise<IResponsePayload<IParentProduct>> {
    const aggregateStages = [];
    // aggregateStages.push({ $match: { _id: new Types.ObjectId(id) } });

    aggregateStages.push(
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: 'id',
          as: 'category',
        },
      },
      { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'brands',
          localField: 'brand',
          foreignField: 'id',
          as: 'brand',
        },
      },
      { $unwind: { path: '$brand', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'companies',
          localField: 'company',
          foreignField: 'id',
          as: 'company',
        },
      },
      { $unwind: { path: '$company', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'tags',
          localField: 'tags',
          foreignField: 'id',
          as: 'tags',
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: 'id',
          foreignField: 'parentProduct',
          as: 'products',
        },
      },
      {
        $lookup: {
          from: 'attributevalues',
          localField: 'products.variants',
          foreignField: 'id',
          as: 'variantDetails',
        },
      },
      {
        $lookup: {
          from: 'attributes',
          localField: 'variantDetails.attribute',
          foreignField: 'id',
          as: 'attributeDetails',
        },
      },
      {
        $addFields: {
          products: {
            $map: {
              input: '$products',
              as: 'products',
              in: {
                id: '$$products.id',
                price: '$$products.price',
                image: '$$products.image',
                warning: '$$products.warning',
                warningDay: '$$products.warningDay',
                refundable: '$$products.refundable',
                returnable: '$$products.returnable',
                sku: '$$products.sku',
                barCode: '$$products.barCode',
                ingredients: '$$products.ingredients',
                trackQuantity: '$$products.trackQuantity',
                stockQuantity: '$$products.stockQuantity',
                earnPoint: '$$products.earnPoint',
                isActive: '$$products.isActive',
                activeOnline: '$$products.activeOnline',
                status: '$$products.status',
                variants: {
                  $map: {
                    input: '$variantDetails',
                    as: 'variant',
                    in: {
                      id: '$$variant.id',
                      name: '$$variant.name',
                      attribute: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: '$attributeDetails',
                              as: 'attr',
                              cond: { $eq: ['$$attr.id', '$$variant.attribute'] },
                            },
                          },
                          0,
                        ],
                      },
                    },
                  },
                },

              },
            },
          },
        },
      },
    );


    // Select
    const mSelect = {
      "_id": 1,
      "id": 1,
      "name": 1,
      "readOnly": 1,
      "slug": 1,
      "images": 1,
      "description": 1,
      "isHtml": 1,
      "serial": 1,
      "shortDesc": 1,
      "seoTitle": 1,
      "seoDescription": 1,
      "seoKeywords": 1,
      "videoUrl": 1,
      "videoThumbnailImage": 1,
      "specifications": 1,
      "isFeature": 1,
      "status": 1,
      "isActive": 1,
      "createdAtString": 1,
      "updatedAtString": 1,
      "category.id": 1,
      "category.name": 1,
      "brand.id": 1,
      "brand.name": 1,
      "company.id": 1,
      "company.name": 1,
      "tags.id": 1,
      "tags.name": 1,


      "products.id": 1,
      "products.price": 1,
      "products.image": 1,
      "products.warning": 1,
      "products.warningDay": 1,
      "products.refundable": 1,
      "products.returnable": 1,
      "products.sku": 1,
      "products.barCode": 1,
      "products.ingredients": 1,
      "products.trackQuantity": 1,
      "products.stockQuantity": 1,
      "products.earnPoint": 1,
      "products.isActive": 1,
      "products.activeOnline": 1,
      "products.status": 1,

      "products.variants.id": 1,
      "products.variants.name": 1,
      "products.variants.attribute.id": 1,
      "products.variants.attribute.name": 1,
    };;
    aggregateStages.push({ $project: mSelect });

    try {
      const dataAggregates = await this.parentProductModel.aggregate(aggregateStages);
      return {
        result: dataAggregates[0],
        success: true,
        message: 'Success',
        total: dataAggregates.length,
      } as IResponsePayload<IParentProduct>;
    } catch (err) {
      this.logger.error(err);
      if (err.code && err.code.toString() === ErrorCodes.PROJECTION_MISMATCH) {
        throw new BadRequestException('Error! Projection mismatch');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }


  async deleteProduct(id: number): Promise<IResponsePayload<string>> {
    try {
      const deleteProduct = await this.productModel.deleteOne({ id: id });  
      return {
        success: true,
        message: 'Success! Data Deleted.',
        data: deleteProduct,
      } as unknown as IResponsePayload<string>;
    } catch (err) {
      this.logger.error(err);
      if (err.code && err.code.toString() === ErrorCodes.PROJECTION_MISMATCH) {
        throw new BadRequestException('Error! Projection mismatch');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
  
}
