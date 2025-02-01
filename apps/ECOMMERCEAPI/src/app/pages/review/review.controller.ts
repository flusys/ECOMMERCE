import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
  Version,
  VERSION_NEUTRAL,
} from '@nestjs/common';

import { ReviewService } from './review.service';
import { AddReviewDto, FilterAndPaginationReviewDto, UpdateReviewDto } from '../../modules/review/review.dto';
import { MongoIdValidationPipe } from '../../shared/pipes/mongo-id-validation.pipe';
import { IResponsePayload } from 'flusysng/shared/interfaces';
import { IReview } from '../../modules/review/review.interface';

@Controller('review')
export class ReviewController {
  private logger = new Logger(ReviewController.name);

  constructor(private reviewService: ReviewService) { }

  /**
   * ADD DATA
   * addReview()
   * insertManyReview()
   */
  @Post('/insert')
  @UsePipes(ValidationPipe)
  async addReview(
    @Body()
    addReviewDto: AddReviewDto,
  ): Promise<IResponsePayload<IReview>> {
    return await this.reviewService.addReview(addReviewDto);
  }

  /**
   * GET DATA
   * getAllReviews()
   * getReviewById()
   * getUserReviewById()
   */
  @Version(VERSION_NEUTRAL)
  @Post('/get-all')
  @UsePipes(ValidationPipe)
  async getAllReviews(
    @Body() filterReviewDto: FilterAndPaginationReviewDto,
    @Query('q') searchString: string,
  ): Promise<IResponsePayload<Array<IReview>>> {
    return this.reviewService.getAllReviews(filterReviewDto, searchString);
  }


  @Version(VERSION_NEUTRAL)
  @Get('/:id')
  async getReviewById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query() select: string,
  ): Promise<IResponsePayload<IReview>> {
    return await this.reviewService.getReviewById(id, select);
  }

  /**
   * UPDATE DATA
   * updateReviewById()
   * updateMultipleReviewById()
   */
  @Version(VERSION_NEUTRAL)
  @Post('/update')
  @UsePipes(ValidationPipe)
  async updateReviewById(
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<IResponsePayload<String>> {
    return await this.reviewService.updateReviewById(updateReviewDto);
  }

}
