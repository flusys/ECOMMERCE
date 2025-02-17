import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddGalleryDto, FilterAndPaginationGalleryDto, UpdateGalleryDto } from '../../modules/gallery/gallery.dto';
import { IResponsePayload } from "flusysng/shared/interfaces";
import { UtilsService } from '../../shared/modules/utils/utils.service';
import { IGallery } from '../../modules/gallery/gallery.interface';
import { ErrorCodes } from '../../shared/enums/error-code.enum';
import { CounterService } from '../../shared/modules/counter/counter.service';

@Injectable()
export class GalleryService {
  private logger = new Logger(GalleryService.name);

  constructor(
    @InjectModel('Gallery') private readonly galleryModel: Model<IGallery>,
    private utilsService: UtilsService,
    private counterService: CounterService
  ) { }

  /**
   * ADD DATA
   * addGallery()
   * insertManyGallery()
   */
  async addGallery(addGalleryDto: AddGalleryDto): Promise<IResponsePayload<IGallery>> {
    try {
      const id = await this.counterService.getNextId('gallery_id')
      const createdAtString = this.utilsService.getDateString(new Date());
      const data = new this.galleryModel({ ...addGalleryDto, createdAtString, id: id });
      const saveData = await data.save();

      return {
        success: true,
        message: 'Success! Data Added.',
        data: saveData,
      } as unknown as IResponsePayload<IGallery>;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async insertManyGallery(addGalleryDto: Array<AddGalleryDto>): Promise<IResponsePayload<string>> {
    try {

      await addGalleryDto.map(async (item) => {
        const id = await this.counterService.getNextId('gallery_id')
        const createdAtString = this.utilsService.getDateString(new Date());
        const data = new this.galleryModel({ ...item, createdAtString, id: id });
        await data.save();
      })
      return {
        success: true,
        message: 'Success! Data Added.',
      } as unknown as IResponsePayload<string>;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }
  /**
   * GET DATA
   * getAllGallerys()
   * getGalleryById()
   * getUserGalleryById()
   */
  async getAllGallerys(
    filterGalleryDto: FilterAndPaginationGalleryDto,
    searchQuery?: string,
  ): Promise<IResponsePayload<Array<IGallery>>> {
    const { filter } = filterGalleryDto;
    const { pagination } = filterGalleryDto;
    const { sort } = filterGalleryDto;
    const { select } = filterGalleryDto;

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
      const dataAggregates = await this.galleryModel.aggregate(aggregateStages);
      if (pagination) {
        return {
          result: dataAggregates[0].data,
          success: true,
          message: 'Success',
          total: dataAggregates[0].count,
          status: "Data Found"
        } as IResponsePayload<Array<IGallery>>;
      } else {
        return {
          result: dataAggregates,
          success: true,
          message: 'Success',
          total: dataAggregates.length,
          status: "Data Found"
        } as IResponsePayload<Array<IGallery>>;
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

  async getGalleryById(id: string, select: string): Promise<IResponsePayload<IGallery>> {
    try {
      const data = await this.galleryModel.findById(id).select(select);
      console.log('data', data);
      return {
        success: true,
        message: 'Success',
        data,
      } as unknown as IResponsePayload<IGallery>;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   * UPDATE DATA
   * updateGalleryById()
   * updateMultipleGalleryById()
   */
  async updateGalleryById(
    updateGalleryDto: UpdateGalleryDto,
  ): Promise<IResponsePayload<String>> {
    try {
      const finalData = { ...updateGalleryDto };

      await this.galleryModel.findOneAndUpdate({ id: updateGalleryDto.id }, {
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
