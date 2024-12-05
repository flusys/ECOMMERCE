import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AddAttributeValueDto, FilterAndPaginationAttributeValueDto, UpdateAttributeValueDto } from '../../modules/attribute/attribute-value.dto';
import { ResponsePayload } from '../../shared/interfaces/response-payload.interface';
import { UtilsService } from '../../shared/modules/utils/utils.service';
import { IAttributeValue } from '../../modules/attribute/attribute-value.interface';
import { ErrorCodes } from '../../shared/enums/error-code.enum';

const ObjectId = Types.ObjectId;

@Injectable()
export class AttributeValueService {
  private logger = new Logger(AttributeValueService.name);

  constructor(
    @InjectModel('AttributeValue') private readonly attributeValueModel: Model<IAttributeValue>,
    private utilsService: UtilsService,
  ) {}

  /**
   * ADD DATA
   * addAttributeValue()
   * insertManyAttributeValue()
   */
  async addAttributeValue(addAttributeValueDto: AddAttributeValueDto): Promise<ResponsePayload> {
    try {
      const createdAtString = this.utilsService.getDateString(new Date());
      const data = new this.attributeValueModel({ ...addAttributeValueDto, createdAtString });
      const saveData = await data.save();

      return {
        success: true,
        message: 'Success! Data Added.',
        data: {
          _id: saveData._id,
        },
      } as ResponsePayload;
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
  ): Promise<ResponsePayload> {
    const { filter } = filterAttributeValueDto;
    const { pagination } = filterAttributeValueDto;
    const { sort } = filterAttributeValueDto;
    const { select } = filterAttributeValueDto;

    // Essential Variables
    const aggregateStages = [];
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
      mSort = sort;
    } else {
      mSort = { createdAt: -1 };
    }

    // Select
    if (select) {
      mSelect = { ...select };
    } else {
      mSelect = { name: 1 };
    }

    // Finalize
    if (Object.keys(mFilter).length) {
      aggregateStages.push({ $match: mFilter });
    }

    if (Object.keys(mSort).length) {
      aggregateStages.push({ $sort: mSort });
    }

    if (!pagination) {
      aggregateStages.push({ $project: mSelect });
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
              } /* IF PAGE START FROM 0 OR (pagination.currentPage - 1) IF PAGE 1*/,
              { $limit: pagination.pageSize },
            ],
          },
        };
      }

      aggregateStages.push(mPagination);

      aggregateStages.push({
        $project: {
          data: 1,
          count: { $arrayElemAt: ['$metadata.total', 0] },
        },
      });
    }

    try {
      const dataAggregates = await this.attributeValueModel.aggregate(aggregateStages);
      if (pagination) {
        return {
          ...{ ...dataAggregates[0] },
          ...{ success: true, message: 'Success' },
        } as ResponsePayload;
      } else {
        return {
          data: dataAggregates,
          success: true,
          message: 'Success',
          count: dataAggregates.length,
        } as ResponsePayload;
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

  async getAttributeValueById(id: string, select: string): Promise<ResponsePayload> {
    try {
      const data = await this.attributeValueModel.findById(id).select(select);
      console.log('data', data);
      return {
        success: true,
        message: 'Success',
        data,
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async getAttributeValueByName(
    name: string,
    select?: string,
  ): Promise<ResponsePayload> {
    try {
      const data = await this.attributeValueModel.find({ name: name });
      // console.log('data', data);
      return {
        success: true,
        message: 'Success',
        data,
      } as ResponsePayload;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async getUserAttributeValueById(id: string, select: string): Promise<ResponsePayload> {
    try {
      const data = await this.attributeValueModel.findById(id).select(select);
      console.log('data', data);
      return {
        success: true,
        message: 'Success',
        data,
      } as ResponsePayload;
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
    id: string,
    updateAttributeValueDto: UpdateAttributeValueDto,
  ): Promise<ResponsePayload> {
    try {
      const finalData = { ...updateAttributeValueDto };

      await this.attributeValueModel.findByIdAndUpdate(id, {
        $set: finalData,
      });
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async updateMultipleAttributeValueById(
    ids: string[],
    updateAttributeValueDto: UpdateAttributeValueDto,
  ): Promise<ResponsePayload> {
    const mIds = ids.map((m) => new ObjectId(m));

    try {
      await this.attributeValueModel.updateMany(
        { _id: { $in: mIds } },
        { $set: updateAttributeValueDto },
      );

      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   * DELETE DATA
   * deleteAttributeValueById()
   * deleteMultipleAttributeValueById()
   */
  async deleteAttributeValueById(
    id: string,
    checkUsage: boolean,
  ): Promise<ResponsePayload> {
    let data;
    try {
      data = await this.attributeValueModel.findById(id);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
    if (!data) {
      throw new NotFoundException('No Data found!');
    }
    if (data.readOnly) {
      throw new NotFoundException('Sorry! Read only data can not be deleted');
    }
    try {
      await this.attributeValueModel.findByIdAndDelete(id);
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteMultipleAttributeValueById(
    ids: string[],
    checkUsage: boolean,
  ): Promise<ResponsePayload> {
    try {
      const mIds = ids.map((m) => new ObjectId(m));
      await this.attributeValueModel.deleteMany({ _id: mIds });
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
