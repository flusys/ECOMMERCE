import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AddAttributeDto, FilterAndPaginationAttributeDto, UpdateAttributeDto } from '../../modules/attribute/attribute.dto';
import { UtilsService } from '../../shared/modules/utils/utils.service';
import { IAttribute } from '../../modules/attribute/attribute.interface';
import { ErrorCodes } from '../../shared/enums/error-code.enum';
import { CounterService } from '../../shared/modules/counter/counter.service';
import { IResponsePayload } from 'flusysng/shared/interfaces';

@Injectable()
export class AttributeService {
  private logger = new Logger(AttributeService.name);

  constructor(
    @InjectModel('Attribute') private readonly attributeModel: Model<IAttribute>,
    private utilsService: UtilsService,
    private counterService: CounterService
  ) { }

  /**
   * ADD DATA
   * addAttribute()
   * insertManyAttribute()
   */
  async addAttribute(addAttributeDto: AddAttributeDto): Promise<IResponsePayload<IAttribute>> {
    try {
      const id = await this.counterService.getNextId('attribute_id');
      const createdAtString = this.utilsService.getDateString(new Date());
      const data = new this.attributeModel({ ...addAttributeDto, createdAtString, id });
      const saveData = await data.save();
      return {
        success: true,
        message: 'Success! Data Added.',
        data: saveData,
      } as unknown as IResponsePayload<IAttribute>;;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * GET DATA
   * getAllAttributes()
   * getAttributeById()
   * getUserAttributeById()
   */
  async getAllAttributes(
    filterAttributeDto: FilterAndPaginationAttributeDto,
    searchQuery?: string,
  ): Promise<IResponsePayload<Array<IAttribute>>> {
    const { filter } = filterAttributeDto;
    const { pagination } = filterAttributeDto;
    const { sort } = filterAttributeDto;
    const { select } = filterAttributeDto;

    // Essential Variables
    const aggregateSattributees = [];
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
      aggregateSattributees.push({ $match: mFilter });
    }

    if (Object.keys(mSort).length) {
      aggregateSattributees.push({ $sort: mSort });
    }

    if (!pagination) {
      aggregateSattributees.push({ $project: mSelect });
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

      aggregateSattributees.push(mPagination);

      aggregateSattributees.push({
        $project: {
          data: 1,
          count: { $arrayElemAt: ['$metadata.total', 0] },
        },
      });
    }

    try {
      const dataAggregates = await this.attributeModel.aggregate(aggregateSattributees);
      if (pagination) {
        return {
          ...{ ...dataAggregates[0] },
          ...{ success: true, message: 'Success' },
        } as IResponsePayload<Array<IAttribute>>;
      } else {
        return {
          result: dataAggregates,
          success: true,
          message: 'Success',
          total: dataAggregates.length,
          status: "Data Found"
        } as IResponsePayload<Array<IAttribute>>;
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

  async getAttributeById(id: string, select: string): Promise<IResponsePayload<IAttribute>> {
    try {
      const data = await this.attributeModel.findById(id).select(select);
      console.log('data', data);
      return {
        success: true,
        message: 'Success',
        data,
      } as unknown as IResponsePayload<IAttribute>;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   * UPDATE DATA
   * updateAttributeById()
   * updateMultipleAttributeById()
   */
  async updateAttributeById(
    updateAttributeDto: UpdateAttributeDto,
  ): Promise<IResponsePayload<String>> {
    try {
      const finalData = { ...updateAttributeDto };
      delete finalData.id;
      await this.attributeModel.findByIdAndUpdate(updateAttributeDto.id, {
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
