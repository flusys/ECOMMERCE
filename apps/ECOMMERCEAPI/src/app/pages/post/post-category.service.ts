import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddPostCategoryDto, FilterAndPaginationPostCategoryDto, UpdatePostCategoryDto } from '../../modules/post/post-category.dto';
import { UtilsService } from '../../shared/modules/utils/utils.service';
import { IPostCategory } from '../../modules/post/post-category.interface';
import { ErrorCodes } from '../../shared/enums/error-code.enum';
import { CounterService } from '../../shared/modules/counter/counter.service';
import { IResponsePayload } from 'flusysng/shared/interfaces';

@Injectable()
export class PostCategoryService {
  private logger = new Logger(PostCategoryService.name);

  constructor(
    @InjectModel('PostCategory') private readonly postCategoryModel: Model<IPostCategory>,
    private utilsService: UtilsService,
    private counterService: CounterService
  ) { }

  /**
   * ADD DATA
   * addPostCategory()
   * insertManyPostCategory()
   */
  async addPostCategory(addPostCategoryDto: AddPostCategoryDto): Promise<IResponsePayload<IPostCategory>> {
    try {
      const id = await this.counterService.getNextId('post_category_id');
      const createdAtString = this.utilsService.getDateString(new Date());
      const data = new this.postCategoryModel({ ...addPostCategoryDto, createdAtString, id });
      const saveData = await data.save();
      return {
        success: true,
        message: 'Success! Data Added.',
        data: saveData,
      } as unknown as IResponsePayload<IPostCategory>;;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * GET DATA
   * getAllPostCategorys()
   * getPostCategoryById()
   * getUserPostCategoryById()
   */
  async getAllPostCategorys(
    filterPostCategoryDto: FilterAndPaginationPostCategoryDto,
    searchQuery?: string,
  ): Promise<IResponsePayload<Array<IPostCategory>>> {
    const { filter } = filterPostCategoryDto;
    const { pagination } = filterPostCategoryDto;
    const { sort } = filterPostCategoryDto;
    const { select } = filterPostCategoryDto;

    // Essential Variables
    const aggregateSPostCategoryes = [];
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
      aggregateSPostCategoryes.push({ $match: mFilter });
    }

    if (Object.keys(mSort).length) {
      aggregateSPostCategoryes.push({ $sort: mSort });
    }

    if (!pagination) {
      aggregateSPostCategoryes.push({ $project: mSelect });
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

      aggregateSPostCategoryes.push(mPagination);

      aggregateSPostCategoryes.push({
        $project: {
          data: 1,
          count: { $arrayElemAt: ['$metadata.total', 0] },
        },
      });
    }

    try {
      const dataAggregates = await this.postCategoryModel.aggregate(aggregateSPostCategoryes);
      if (pagination) {
        return {
          ...{ ...dataAggregates[0] },
          ...{ success: true, message: 'Success' },
        } as IResponsePayload<Array<IPostCategory>>;
      } else {
        return {
          result: dataAggregates,
          success: true,
          message: 'Success',
          total: dataAggregates.length,
          status: "Data Found"
        } as IResponsePayload<Array<IPostCategory>>;
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

  async getAllPostCategorysWithValue(): Promise<IResponsePayload<Array<IPostCategory>>> {
    try {
      const dataAggregates = await this.postCategoryModel.aggregate([
        {
          $lookup: {
            from: 'post-categoryvalues', // The collection name for PostCategoryValue
            localField: 'id',
            foreignField: 'post-category',
            as: 'values'
          }
        }
      ]);
      
      return {
        result: dataAggregates,
        success: true,
        message: 'Success',
        total: dataAggregates.length,
        status: "Data Found"
      } as IResponsePayload<Array<IPostCategory>>;
    } catch (err) {
      this.logger.error(err);
      if (err.code && err.code.toString() === ErrorCodes.PROJECTION_MISMATCH) {
        throw new BadRequestException('Error! Projection mismatch');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async getPostCategoryById(id: string, select: string): Promise<IResponsePayload<IPostCategory>> {
    try {
      const data = await this.postCategoryModel.findById(id).select(select);
      console.log('data', data);
      return {
        success: true,
        message: 'Success',
        data,
      } as unknown as IResponsePayload<IPostCategory>;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   * UPDATE DATA
   * updatePostCategoryById()
   * updateMultiplePostCategoryById()
   */
  async updatePostCategoryById(
    updatePostCategoryDto: UpdatePostCategoryDto,
  ): Promise<IResponsePayload<String>> {
    try {
      const finalData = { ...updatePostCategoryDto };
      delete finalData.id;
      await this.postCategoryModel.findOneAndUpdate({ id: updatePostCategoryDto.id }, {
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
