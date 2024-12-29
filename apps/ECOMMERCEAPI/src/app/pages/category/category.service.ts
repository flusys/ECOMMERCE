import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddCategoryDto, FilterAndPaginationCategoryDto, UpdateCategoryDto } from '../../modules/category/category.dto';
import { UtilsService } from '../../shared/modules/utils/utils.service';
import { ICategory } from '../../modules/category/category.interface';
import { ErrorCodes } from '../../shared/enums/error-code.enum';
import { CounterService } from '../../shared/modules/counter/counter.service';
import { IResponsePayload } from 'flusysng/shared/interfaces';

@Injectable()
export class CategoryService {
  private logger = new Logger(CategoryService.name);

  constructor(
    @InjectModel('Category') private readonly attributeValueModel: Model<ICategory>,
    private utilsService: UtilsService,
    private counterService: CounterService
  ) { }

  /**
   * ADD DATA
   * addCategory()
   * insertManyCategory()
   */
  async addCategory(addCategoryDto: AddCategoryDto): Promise<IResponsePayload<ICategory>> {
    try {
      const id = await this.counterService.getNextId('attribute_value_id');
      const createdAtString = this.utilsService.getDateString(new Date());
      const data = new this.attributeValueModel({ ...addCategoryDto, createdAtString, id });
      const saveData = await data.save();
      return {
        success: true,
        message: 'Success! Data Added.',
        data: saveData,
      } as unknown as IResponsePayload<ICategory>;;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * GET DATA
   * getAllCategorys()
   * getCategoryById()
   * getUserCategoryById()
   */
  async getAllCategorys(
    filterCategoryDto: FilterAndPaginationCategoryDto,
    searchQuery?: string,
  ): Promise<IResponsePayload<Array<ICategory>>> {
    const { filter } = filterCategoryDto;
    const { pagination } = filterCategoryDto;
    const { sort } = filterCategoryDto;
    const { select } = filterCategoryDto;

    // Essential Variables
    const aggregatesCategoryes = [];
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
      aggregatesCategoryes.push({ $match: mFilter });
    }

    if (Object.keys(mSort).length) {
      aggregatesCategoryes.push({ $sort: mSort });
    }

    // Populate `attribute` field using `$lookup`
    aggregatesCategoryes.push({
      $lookup: {
        from: 'categories',
        localField: 'parent',
        foreignField: 'id',
        as: 'parent',
      },
    });
    // Unwind the array to make `attributeDetails` an object
    aggregatesCategoryes.push({
      $unwind: {
        path: '$parent',
        preserveNullAndEmptyArrays: true, // Optional: Include results even if `attributeDetails` is missing
      },
    });

    if (!pagination) {
      aggregatesCategoryes.push({ $project: mSelect });
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

      aggregatesCategoryes.push(mPagination);

      aggregatesCategoryes.push({
        $project: {
          data: 1,
          count: { $arrayElemAt: ['$metadata.total', 0] },
        },
      });
    }

    try {
      const dataAggregates = await this.attributeValueModel.aggregate(aggregatesCategoryes);
      if (pagination) {
        return {
          ...{ ...dataAggregates[0] },
          ...{ success: true, message: 'Success' },
        } as IResponsePayload<Array<ICategory>>;
      } else {
        return {
          result: dataAggregates,
          success: true,
          message: 'Success',
          total: dataAggregates.length,
          status: "Data Found"
        } as IResponsePayload<Array<ICategory>>;
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

  async getCategoryById(id: string, select: string): Promise<IResponsePayload<ICategory>> {
    try {
      const data = await this.attributeValueModel.findById(id).select(select);
      console.log('data', data);
      return {
        success: true,
        message: 'Success',
        data,
      } as unknown as IResponsePayload<ICategory>;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   * UPDATE DATA
   * updateCategoryById()
   * updateMultipleCategoryById()
   */
  async updateCategoryById(
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<IResponsePayload<String>> {
    try {
      const finalData = { ...updateCategoryDto };
      delete finalData.id;
      await this.attributeValueModel.findOneAndUpdate({ id: updateCategoryDto.id }, {
        $set: finalData,
      });
      return {
        success: true,
        message: 'Success',
      } as IResponsePayload<String>;
    } catch (err) {
      console.warn(err)
      throw new InternalServerErrorException();
    }
  }

}
