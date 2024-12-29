import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddAttributeValueDto, FilterAndPaginationAttributeValueDto, UpdateAttributeValueDto } from '../../modules/attribute/attribute-value.dto';
import { UtilsService } from '../../shared/modules/utils/utils.service';
import { IAttributeValue } from '../../modules/attribute/attribute-value.interface';
import { ErrorCodes } from '../../shared/enums/error-code.enum';
import { CounterService } from '../../shared/modules/counter/counter.service';
import { IResponsePayload } from 'flusysng/shared/interfaces';

@Injectable()
export class AttributeValueService {
  private logger = new Logger(AttributeValueService.name);

  constructor(
    @InjectModel('AttributeValue') private readonly attributeValueModel: Model<IAttributeValue>,
    private utilsService: UtilsService,
    private counterService: CounterService
  ) { }

  /**
   * ADD DATA
   * addAttributeValue()
   * insertManyAttributeValue()
   */
  async addAttributeValue(addAttributeValueDto: AddAttributeValueDto): Promise<IResponsePayload<IAttributeValue>> {
    try {
      const id = await this.counterService.getNextId('attribute_value_id');
      const createdAtString = this.utilsService.getDateString(new Date());
      const data = new this.attributeValueModel({ ...addAttributeValueDto, createdAtString, id });
      const saveData = await data.save();
      return {
        success: true,
        message: 'Success! Data Added.',
        data: saveData,
      } as unknown as IResponsePayload<IAttributeValue>;;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * GET DATA
   * getAllAttributeValues()
   * getAttributeValueById()
   * getUserAttributeValueById()
   */
  async getAllAttributeValues(
    filterAttributeValueDto: FilterAndPaginationAttributeValueDto,
    searchQuery?: string,
  ): Promise<IResponsePayload<Array<IAttributeValue>>> {
    const { filter } = filterAttributeValueDto;
    const { pagination } = filterAttributeValueDto;
    const { sort } = filterAttributeValueDto;
    const { select } = filterAttributeValueDto;

    // Essential Variables
    const aggregatesAttributeValuees = [];
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
      aggregatesAttributeValuees.push({ $match: mFilter });
    }

    if (Object.keys(mSort).length) {
      aggregatesAttributeValuees.push({ $sort: mSort });
    }

    // Populate `attribute` field using `$lookup`
    aggregatesAttributeValuees.push({
      $lookup: {
        from: 'attributes',
        localField: 'attribute',
        foreignField: 'id',
        as: 'attribute',
      },
    });
    // Unwind the array to make `attributeDetails` an object
    aggregatesAttributeValuees.push({
      $unwind: {
        path: '$attribute',
        preserveNullAndEmptyArrays: true, // Optional: Include results even if `attributeDetails` is missing
      },
    });

    if (!pagination) {
      aggregatesAttributeValuees.push({ $project: mSelect });
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

      aggregatesAttributeValuees.push(mPagination);

      aggregatesAttributeValuees.push({
        $project: {
          data: 1,
          count: { $arrayElemAt: ['$metadata.total', 0] },
        },
      });
    }

    try {
      const dataAggregates = await this.attributeValueModel.aggregate(aggregatesAttributeValuees);
      if (pagination) {
        return {
          ...{ ...dataAggregates[0] },
          ...{ success: true, message: 'Success' },
        } as IResponsePayload<Array<IAttributeValue>>;
      } else {
        return {
          result: dataAggregates,
          success: true,
          message: 'Success',
          total: dataAggregates.length,
          status: "Data Found"
        } as IResponsePayload<Array<IAttributeValue>>;
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

  async getAttributeValueById(id: string, select: string): Promise<IResponsePayload<IAttributeValue>> {
    try {
      const data = await this.attributeValueModel.findById(id).select(select);
      console.log('data', data);
      return {
        success: true,
        message: 'Success',
        data,
      } as unknown as IResponsePayload<IAttributeValue>;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   * UPDATE DATA
   * updateAttributeValueById()
   * updateMultipleAttributeValueById()
   */
  async updateAttributeValueById(
    updateAttributeValueDto: UpdateAttributeValueDto,
  ): Promise<IResponsePayload<String>> {
    try {
      const finalData = { ...updateAttributeValueDto };
      delete finalData.id;
      await this.attributeValueModel.findOneAndUpdate({id:updateAttributeValueDto.id}, {
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
