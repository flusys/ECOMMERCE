import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddContactusDto, FilterAndPaginationContactusDto, UpdateContactusDto } from '../../modules/contactus/contactus.dto';
import { IResponsePayload } from "flusysng/shared/interfaces";
import { UtilsService } from '../../shared/modules/utils/utils.service';
import { IContactus } from '../../modules/contactus/contactus.interface';
import { ErrorCodes } from '../../shared/enums/error-code.enum';
import { CounterService } from '../../shared/modules/counter/counter.service';

@Injectable()
export class ContactusService {
  private logger = new Logger(ContactusService.name);

  constructor(
    @InjectModel('Contactus') private readonly contactusModel: Model<IContactus>,
    private utilsService: UtilsService,
    private counterService: CounterService
  ) { }

  /**
   * ADD DATA
   * addContactus()
   * insertManyContactus()
   */
  async addContactus(addContactusDto: AddContactusDto): Promise<IResponsePayload<IContactus>> {
    try {
      const id = await this.counterService.getNextId('contactus_id')
      const createdAtString = this.utilsService.getDateString(new Date());
      const data = new this.contactusModel({ ...addContactusDto, createdAtString, id: id });
      const saveData = await data.save();

      return {
        success: true,
        message: 'Success! Data Added.',
        data: saveData,
      } as unknown as IResponsePayload<IContactus>;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * GET DATA
   * getAllContactuss()
   * getContactusById()
   * getUserContactusById()
   */
  async getAllContactuss(
    filterContactusDto: FilterAndPaginationContactusDto,
    searchQuery?: string,
  ): Promise<IResponsePayload<Array<IContactus>>> {
    const { filter } = filterContactusDto;
    const { pagination } = filterContactusDto;
    const { sort } = filterContactusDto;
    const { select } = filterContactusDto;

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
      const dataAggregates = await this.contactusModel.aggregate(aggregateStages);
      if (pagination) {
        return {
          ...{ ...dataAggregates[0] },
          ...{ success: true, message: 'Success' },
        } as IResponsePayload<Array<IContactus>>;
      } else {
        return {
          result: dataAggregates,
          success: true,
          message: 'Success',
          total: dataAggregates.length,
          status: "Data Found"
        } as IResponsePayload<Array<IContactus>>;
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

  async getContactusById(id: string, select: string): Promise<IResponsePayload<IContactus>> {
    try {
      const data = await this.contactusModel.findById(id).select(select);
      console.log('data', data);
      return {
        success: true,
        message: 'Success',
        data,
      } as unknown as IResponsePayload<IContactus>;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   * UPDATE DATA
   * updateContactusById()
   * updateMultipleContactusById()
   */
  async updateContactusById(
    updateContactusDto: UpdateContactusDto,
  ): Promise<IResponsePayload<String>> {
    try {
      const finalData = { ...updateContactusDto };

      await this.contactusModel.findOneAndUpdate({id:updateContactusDto.id}, {
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
