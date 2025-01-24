import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AddPostDto, FilterAndPaginationPostDto, UpdatePostDto } from '../../modules/post/post.dto';
import { UtilsService } from '../../shared/modules/utils/utils.service';
import { IPost } from '../../modules/post/post.interface';
import { ErrorCodes } from '../../shared/enums/error-code.enum';
import { CounterService } from '../../shared/modules/counter/counter.service';
import { IResponsePayload } from 'flusysng/shared/interfaces';

@Injectable()
export class PostService {
  private logger = new Logger(PostService.name);

  constructor(
    @InjectModel('Post') private readonly postModel: Model<IPost>,
    private utilsService: UtilsService,
    private counterService: CounterService
  ) { }

  /**
   * ADD DATA
   * addPost()
   * insertManyPost()
   */
  async addPost(addPostDto: AddPostDto): Promise<IResponsePayload<IPost>> {
    try {
      const id = await this.counterService.getNextId('post_id');
      const createdAtString = this.utilsService.getDateString(new Date());
      const data = new this.postModel({ ...addPostDto, createdAtString, id });
      const saveData = await data.save();
      return {
        success: true,
        message: 'Success! Data Added.',
        data: saveData,
      } as unknown as IResponsePayload<IPost>;;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * GET DATA
   * getAllPosts()
   * getPostById()
   * getUserPostById()
   */
  async getAllPosts(
    filterPostDto: FilterAndPaginationPostDto,
    searchQuery?: string,
  ): Promise<IResponsePayload<Array<IPost>>> {
    const { filter } = filterPostDto;
    const { pagination } = filterPostDto;
    const { sort } = filterPostDto;
    const { select } = filterPostDto;

    // Essential Variables
    const aggregateSpostes = [];
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
      aggregateSpostes.push({ $match: mFilter });
    }

    if (Object.keys(mSort).length) {
      aggregateSpostes.push({ $sort: mSort });
    }

    // Populate `category` field using `$lookup`
    aggregateSpostes.push({
      $lookup: {
        from: 'postcategories',
        localField: 'category',
        foreignField: 'id',
        as: 'category',
      },
    },
      {
        $unwind: {
          path: '$category',
          preserveNullAndEmptyArrays: true,
        },
      });

    if (!pagination) {
      aggregateSpostes.push({ $project: mSelect });
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

      aggregateSpostes.push(mPagination);

      aggregateSpostes.push({
        $project: {
          data: 1,
          count: { $arrayElemAt: ['$metadata.total', 0] },
        },
      });
    }

    try {
      const dataAggregates = await this.postModel.aggregate(aggregateSpostes);
      if (pagination) {
        return {
          result: dataAggregates[0].data,
          success: true,
          message: 'Success',
          total: dataAggregates[0].count,
        } as IResponsePayload<Array<IPost>>;
      } else {
        return {
          result: dataAggregates,
          success: true,
          message: 'Success',
          total: dataAggregates.length,
          status: "Data Found"
        } as IResponsePayload<Array<IPost>>;
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

  async getAllPostsWithValue(): Promise<IResponsePayload<Array<IPost>>> {
    try {
      const dataAggregates = await this.postModel.aggregate([
        {
          $lookup: {
            from: 'postvalues', // The collection name for PostValue
            localField: 'id',
            foreignField: 'post',
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
      } as IResponsePayload<Array<IPost>>;
    } catch (err) {
      this.logger.error(err);
      if (err.code && err.code.toString() === ErrorCodes.PROJECTION_MISMATCH) {
        throw new BadRequestException('Error! Projection mismatch');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async getPostById(id: string, select: string): Promise<IResponsePayload<IPost>> {
    try {
      const data = await this.postModel.findById(id).select(select);
      console.log('data', data);
      return {
        success: true,
        message: 'Success',
        data,
      } as unknown as IResponsePayload<IPost>;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   * UPDATE DATA
   * updatePostById()
   * updateMultiplePostById()
   */
  async updatePostById(
    updatePostDto: UpdatePostDto,
  ): Promise<IResponsePayload<String>> {
    try {
      const finalData = { ...updatePostDto };
      delete finalData.id;
      await this.postModel.findOneAndUpdate({ id: updatePostDto.id }, {
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
