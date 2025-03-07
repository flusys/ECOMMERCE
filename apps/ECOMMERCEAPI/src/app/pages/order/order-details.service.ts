import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddOrderDetailsDto, FilterAndPaginationOrderDetailsDto, UpdateOrderDetailsDto, UpdateOrderDetailsStatusDto } from '../../modules/order/order-details.dto';
import { UtilsService } from '../../shared/modules/utils/utils.service';
import { IOrderDetails } from '../../modules/order/order-details.interface';
import { ErrorCodes } from '../../shared/enums/error-code.enum';
import { CounterService } from '../../shared/modules/counter/counter.service';
import { IResponsePayload } from 'flusysng/shared/interfaces';
import { IOrderItem } from '../../modules/order/order-item.interface';
import * as bcrypt from 'bcrypt';
import { IUser } from '../../modules/user/user.interface';

@Injectable()
export class OrderDetailsService {
  private logger = new Logger(OrderDetailsService.name);

  constructor(
    @InjectModel('OrderDetails') private readonly orderDetailsModel: Model<IOrderDetails>,
    @InjectModel('OrderItems') private readonly orderItemModel: Model<IOrderItem>,
    @InjectModel('User') private readonly userModel: Model<IUser>,
    private utilsService: UtilsService,
    private counterService: CounterService
  ) { }

  /**
   * ADD DATA
   * addOrderDetails()
   * insertManyOrderDetails()
   */
  async addOrderDetails(addOrderDetailsDto: AddOrderDetailsDto): Promise<IResponsePayload<IOrderDetails>> {
    try {
      const id = await this.counterService.getNextId('order_details_id');
      const createdAtString = this.utilsService.getDateString(new Date());
      // Handle the 'chields' (child z)
      const childProductIds = [];
      if (addOrderDetailsDto.products && addOrderDetailsDto.products.length > 0) {
        for (const childDto of addOrderDetailsDto.products) {
          try {
            // Generate unique ID for each child
            const childId = await this.counterService.getNextId('order_item_id');
            // Merge child ID with its data
            const childData = { ...childDto, id: childId, createdAtString, orderDetails: id };
            // Save the child product in the database
            const childProductModel = new this.orderItemModel(childData); // Assuming the schema is the same
            const savedChild = await childProductModel.save();
            // Store the child ID
            childProductIds.push(savedChild.id);
          } catch (error) {
            this.logger.error('Failed to add product with chields', error.stack);
          }
        }
      }

      if (addOrderDetailsDto.createAccount) {
        const existingUser = await this.userModel.findOne({ email: addOrderDetailsDto.email });
        if (!existingUser) {
          const salt = await bcrypt.genSalt();
          const hashedPass = await bcrypt.hash('123456', salt);
          const userId = await this.counterService.getNextId('user_id');
          const mData = {
            ...addOrderDetailsDto, ...{
              password: hashedPass,
              hasAccess: true,
              username: addOrderDetailsDto.email,
              id: userId
            }
          };
          const newUser = new this.userModel(mData);
          await newUser.save();
        }
      }

      const data = new this.orderDetailsModel({ ...addOrderDetailsDto, createdAtString, id });
      const saveData = await data.save();
      return {
        success: true,
        message: 'Success! Data Added.',
        data: saveData,
      } as unknown as IResponsePayload<IOrderDetails>;;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * GET DATA
   * getAllOrderDetailss()
   * getOrderDetailsById()
   * getUserOrderDetailsById()
   */
  async getAllOrderDetails(
    filterOrderDetailsDto: FilterAndPaginationOrderDetailsDto,
    searchQuery?: string,
  ): Promise<IResponsePayload<Array<IOrderDetails>>> {
    const { filter } = filterOrderDetailsDto;
    const { pagination } = filterOrderDetailsDto;
    const { sort } = filterOrderDetailsDto;

    // Essential Variables
    const aggregatesOrderDetailses = [];
    let mFilter = {};
    let mSort = {};
    let mPagination = {};

    // Match
    if (filter) {
      mFilter = { ...mFilter, ...filter };
    }
    if (searchQuery) {
      mFilter = { ...mFilter, ...{ name: new RegExp(searchQuery, 'i') } };
    }

    // Sort
    if (sort) {
      mSort = {};
      Object.keys(sort).forEach(item => {
        mSort = { ...mSort, ...{ [item]: sort[item] === 'ASC' ? 1 : -1 } };
      });
    }

    // Finalize
    if (Object.keys(mFilter).length) {
      aggregatesOrderDetailses.push({ $match: mFilter });
    }


    // Add custom sort field for orderStatus
    aggregatesOrderDetailses.push({
      $addFields: {
        orderStatusSortOrder: {
          $switch: {
            branches: [
              { case: { $eq: ['$orderStatus', 'Pending'] }, then: 1 },
              { case: { $eq: ['$orderStatus', 'Processing'] }, then: 2 },
              { case: { $eq: ['$orderStatus', 'Shipped'] }, then: 3 },
              { case: { $eq: ['$orderStatus', 'Delivered'] }, then: 4 },
              { case: { $eq: ['$orderStatus', 'Cancelled'] }, then: 5 },
            ],
            default: 6, // Default value if orderStatus does not match any case
          },
        },
      },
    });

    if (Object.keys(mSort).length) {
      aggregatesOrderDetailses.push({ $sort: mSort });
    } else {
      aggregatesOrderDetailses.push({ $sort: { orderStatusSortOrder: 1 } });
    }


    // Populate `product` field using `$lookup`
    aggregatesOrderDetailses.push(
      {
        $lookup: {
          from: 'orderitems',
          localField: 'id',
          foreignField: 'orderDetails',
          as: 'orderitems',
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: 'orderitems.product',
          foreignField: 'id',
          as: 'product',
        },
      },
      {
        $lookup: {
          from: 'parentproducts',
          localField: 'product.parentProduct',
          foreignField: 'id',
          as: 'parentProduct',
        },
      },
      {
        $lookup: {
          from: 'attributevalues',
          localField: 'product.variants',
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
          orderitems: {
            $map: {
              input: '$orderitems',
              as: 'orderitems',
              in: {
                _id: '$$orderitems._id',
                id: '$$orderitems.id',
                quantity: '$$orderitems.quantity',
                price: '$$orderitems.price',
                total: '$$orderitems.total',
                orderStatus: '$$orderitems.orderStatus',
                product: {
                  $let: {
                    vars: {
                      productData: {
                        $first: {
                          $filter: {
                            input: '$product',
                            as: 'product',
                            cond: { '$eq': ['$$product.id', '$$orderitems.product'] }
                          }
                        }
                      }
                    },
                    in: {
                      id: '$$productData.id',
                      price: '$$productData.price',
                      image: '$$productData.image',
                      parentProduct: {
                        $first: {
                          $filter: {
                            input: '$parentProduct',
                            as: 'parentProduct',
                            cond: { '$eq': ['$$parentProduct.id', '$$productData.parentProduct'] }
                          }
                        }
                      },
                      variants: {
                        $map: {
                          input: {
                            $filter: {
                              input: '$variantDetails',
                              as: 'variant',
                              cond: { '$in': ['$$variant.id', '$$productData.variants'] }
                            }
                          },
                          as: 'variant',
                          in: {
                            id: '$$variant.id',
                            name: '$$variant.name',
                            attribute: {
                              $first: {
                                $filter: {
                                  input: '$attributeDetails',
                                  as: 'attr',
                                  cond: { '$eq': ['$$attr.id', '$$variant.attribute'] }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    );

    // Select
    const mSelect = {
      "_id": 1,
      "id": 1,
      "firstName": 1,
      "lastName": 1,
      "address": 1,
      "email": 1,
      "phone": 1,
      "createAccount": 1,
      "differentAddress": 1,
      "comment": 1,
      "shipmentAmount": 1,
      "total": 1,
      "orderStatus": 1,
      "orderStatusSortOrder": 1,

      "orderitems.id": 1,
      "orderitems.quantity": 1,
      "orderitems.price": 1,
      "orderitems.total": 1,
      "orderitems.orderStatus": 1,

      "orderitems.product._id": 1,
      "orderitems.product.id": 1,
      "orderitems.product.price": 1,
      "orderitems.product.image": 1,

      "orderitems.product.parentProduct.id": 1,
      "orderitems.product.parentProduct.name": 1,
      "orderitems.product.parentProduct.readOnly": 1,
      "orderitems.product.parentProduct.slug": 1,
      "orderitems.product.parentProduct.images": 1,

      "orderitems.product.variants.id": 1,
      "orderitems.product.variants.name": 1,
      "orderitems.product.variants.attribute.id": 1,
      "orderitems.product.variants.attribute.name": 1,
    };

    if (!pagination) {
      aggregatesOrderDetailses.push({ $project: mSelect });
    }

    // Pagination
    if (pagination) {
      if (Object.keys(mSelect).length) {
        mPagination = {
          $facet: {
            metadata: [{ $count: 'total' }],
            data: [
              {
                $skip: pagination.pageSize * pagination.currentPage,
              } /* IF PAGE START FROM 0 OR (pagination.currentPage - 1) IF PAGE 1*/,
              { $limit: pagination.pageSize },
              { $project: mSelect },
            ],
          },
        };
      } else {
        mPagination = {
          $facet: {
            metadata: [{ $count: 'total' }],
            data: [
              {
                $skip: pagination.pageSize * pagination.currentPage,
              },
              { $limit: pagination.pageSize },
            ],
          },
        };
      }

      aggregatesOrderDetailses.push(mPagination);

      aggregatesOrderDetailses.push({
        $project: {
          data: 1,
          count: { $arrayElemAt: ['$metadata.total', 0] },
        },
      });
    }

    try {
      const dataAggregates = await this.orderDetailsModel.aggregate(aggregatesOrderDetailses);
      if (pagination) {
        return {
          ...{ ...dataAggregates[0] },
          ...{ success: true, message: 'Success' },
        } as IResponsePayload<Array<IOrderDetails>>;
      } else {
        return {
          result: dataAggregates,
          success: true,
          message: 'Success',
          total: dataAggregates.length,
          status: "Data Found"
        } as IResponsePayload<Array<IOrderDetails>>;
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

  async getOrderDetailsById(id: string, select: string): Promise<IResponsePayload<IOrderDetails>> {
    try {
      const data = await this.orderDetailsModel.findById(id).select(select);
      console.log('data', data);
      return {
        success: true,
        message: 'Success',
        data,
      } as unknown as IResponsePayload<IOrderDetails>;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   * UPDATE DATA
   * updateOrderDetailsById()
   * updateMultipleOrderDetailsById()
   */
  async updateOrderDetailsById(
    updateOrderDetailsDto: UpdateOrderDetailsDto,
  ): Promise<IResponsePayload<String>> {
    try {
      const childProductIds = [];
      updateOrderDetailsDto.products.forEach(async (childDto) => {
        try {
          if (childDto.id) {
            const childData = { ...childDto, orderDetails: updateOrderDetailsDto.id };
            await this.orderItemModel.updateOne({ id: childData.id }, childData);
            childProductIds.push(childData.id);
          } else {
            const childId = await this.counterService.getNextId('order_item_id');
            const childData = { ...childDto, id: childId, orderDetails: updateOrderDetailsDto.id };
            const childProductModel = new this.orderItemModel(childData);
            const savedChild = await childProductModel.save();
            childProductIds.push(savedChild.id);
          }
        } catch (error) {
          this.logger.error('Failed to add product with chields', error.stack);
        }
      });
      await this.orderItemModel.deleteMany({
        product: updateOrderDetailsDto.id,
        id: { $nin: childProductIds }
      });
      delete updateOrderDetailsDto.products;

      const finalData = { ...updateOrderDetailsDto };
      delete finalData.id;
      await this.orderDetailsModel.findOneAndUpdate({ id: updateOrderDetailsDto.id }, {
        $set: finalData,
      });
      return {
        success: true,
        message: 'Success',
      } as IResponsePayload<String>;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async updateOrderDetailsStatusById(
    updateOrderDetailsDto: UpdateOrderDetailsStatusDto,
  ): Promise<IResponsePayload<String>> {
    try {
      await this.orderDetailsModel.findOneAndUpdate({ id: updateOrderDetailsDto.id }, {
        orderStatus: updateOrderDetailsDto.status
      });
      return {
        success: true,
        message: 'Successfully Updated',
      } as IResponsePayload<String>;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }
}
