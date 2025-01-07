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

import { BannerService } from './banner.service';
import { AddBannerDto, FilterAndPaginationBannerDto, UpdateBannerDto } from '../../modules/banner/banner.dto';
import { MongoIdValidationPipe } from '../../shared/pipes/mongo-id-validation.pipe';
import { IResponsePayload } from 'flusysng/shared/interfaces';
import { IBanner } from '../../modules/banner/banner.interface';

@Controller('banner')
export class BannerController {
  private logger = new Logger(BannerController.name);

  constructor(private bannerService: BannerService) { }

  /**
   * ADD DATA
   * addBanner()
   * insertManyBanner()
   */
  @Post('/insert')
  @UsePipes(ValidationPipe)
  async addBanner(
    @Body()
    addBannerDto: AddBannerDto,
  ): Promise<IResponsePayload<IBanner>> {
    return await this.bannerService.addBanner(addBannerDto);
  }

  /**
   * GET DATA
   * getAllBanners()
   * getBannerById()
   * getUserBannerById()
   */
  @Version(VERSION_NEUTRAL)
  @Post('/get-all')
  @UsePipes(ValidationPipe)
  async getAllBanners(
    @Body() filterBannerDto: FilterAndPaginationBannerDto,
    @Query('q') searchString: string,
  ): Promise<IResponsePayload<Array<IBanner>>> {
    return this.bannerService.getAllBanners(filterBannerDto, searchString);
  }


  @Version(VERSION_NEUTRAL)
  @Get('/:id')
  async getBannerById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query() select: string,
  ): Promise<IResponsePayload<IBanner>> {
    return await this.bannerService.getBannerById(id, select);
  }

  /**
   * UPDATE DATA
   * updateBannerById()
   * updateMultipleBannerById()
   */
  @Version(VERSION_NEUTRAL)
  @Post('/update')
  @UsePipes(ValidationPipe)
  async updateBannerById(
    @Body() updateBannerDto: UpdateBannerDto,
  ): Promise<IResponsePayload<String>> {
    return await this.bannerService.updateBannerById(updateBannerDto);
  }

}
