import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddOrderDetailsDto, FilterAndPaginationOrderDetailsDto, UpdateOrderDetailsDto } from '../../modules/order/order-details.dto';
import { UtilsService } from '../../shared/modules/utils/utils.service';
import { IOrderDetails } from '../../modules/order/order-details.interface';
import { ErrorCodes } from '../../shared/enums/error-code.enum';
import { CounterService } from '../../shared/modules/counter/counter.service';
import { IResponsePayload } from 'flusysng/shared/interfaces';
import { IOrderItem } from '../../modules/order/order-item.interface';

@Injectable()
export class OrderDetailsService {
  private logger = new Logger(OrderDetailsService.name);

  constructor(
    @InjectModel('OrderDetails') private readonly orderDetailsModel: Model<IOrderDetails>,
    @InjectModel('OrderItem') private readonly orderItemModel: Model<IOrderItem>,
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

      // Handle the 'chields' (child products)
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
  async getAllOrderDetailss(
    filterOrderDetailsDto: FilterAndPaginationOrderDetailsDto,
    searchQuery?: string,
  ): Promise<IResponsePayload<Array<IOrderDetails>>> {
    const { filter } = filterOrderDetailsDto;
    const { pagination } = filterOrderDetailsDto;
    const { sort } = filterOrderDetailsDto;
    const { select } = filterOrderDetailsDto;

    // Essential Variables
    const aggregatesOrderDetailses = [];
    let mFilter = {};
    let mSort = {};
    let mSelect = {};
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
        mSort = { ...mSort, ...{ [item]: sort['item'] == 'ASC' ? 1 : -1 } }
      });
    } else {
      mSort = { createdAt: -1 };
    }

    // Select
    if (select && select.length) {
      mSelect = select.reduce((prev, curr) => {
        return prev = { ...prev, ...{ [curr]: 1 } }
      }, {});
    } else {
      mSelect = { name: 1 };
    }

    // Finalize
    if (Object.keys(mFilter).length) {
      aggregatesOrderDetailses.push({ $match: mFilter });
    }

    if (Object.keys(mSort).length) {
      aggregatesOrderDetailses.push({ $sort: mSort });
    }

    // Populate `order` field using `$lookup`
    aggregatesOrderDetailses.push({
      $lookup: {
        from: 'orders',
        localField: 'order',
        foreignField: 'id',
        as: 'order',
      },
    });
    // Unwind the array to make `orderDetails` an object
    aggregatesOrderDetailses.push({
      $unwind: {
        path: '$order',
        preserveNullAndEmptyArrays: true, // Optional: Include results even if `orderDetails` is missing
      },
    });

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

}
