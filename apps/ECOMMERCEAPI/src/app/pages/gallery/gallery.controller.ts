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

import { GalleryService } from './gallery.service';
import { AddGalleryDto, FilterAndPaginationGalleryDto, UpdateGalleryDto } from '../../modules/gallery/gallery.dto';
import { MongoIdValidationPipe } from '../../shared/pipes/mongo-id-validation.pipe';
import { IResponsePayload } from 'flusysng/shared/interfaces';
import { IGallery } from '../../modules/gallery/gallery.interface';

@Controller('gallery')
export class GalleryController {
  private logger = new Logger(GalleryController.name);

  constructor(private galleryService: GalleryService) { }

  /**
   * ADD DATA
   * addGallery()
   * insertManyGallery()
   */
  @Post('/insert')
  @UsePipes(ValidationPipe)
  async addGallery(
    @Body()
    addGalleryDto: AddGalleryDto,
  ): Promise<IResponsePayload<IGallery>> {
    return await this.galleryService.addGallery(addGalleryDto);
  }
  @Post('/insert-many')
  @UsePipes(ValidationPipe)
  async insertManyGallery(
    @Body()
    addGalleryDto: Array<AddGalleryDto>,
  ): Promise<IResponsePayload<string>> {
    return await this.galleryService.insertManyGallery(addGalleryDto);
  }
  /**
   * GET DATA
   * getAllGallerys()
   * getGalleryById()
   * getUserGalleryById()
   */
  @Version(VERSION_NEUTRAL)
  @Post('/get-all')
  @UsePipes(ValidationPipe)
  async getAllGallerys(
    @Body() filterGalleryDto: FilterAndPaginationGalleryDto,
    @Query('q') searchString: string,
  ): Promise<IResponsePayload<Array<IGallery>>> {
    return this.galleryService.getAllGallerys(filterGalleryDto, searchString);
  }


  @Version(VERSION_NEUTRAL)
  @Get('/:id')
  async getGalleryById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query() select: string,
  ): Promise<IResponsePayload<IGallery>> {
    return await this.galleryService.getGalleryById(id, select);
  }

  /**
   * UPDATE DATA
   * updateGalleryById()
   * updateMultipleGalleryById()
   */
  @Version(VERSION_NEUTRAL)
  @Post('/update')
  @UsePipes(ValidationPipe)
  async updateGalleryById(
    @Body() updateGalleryDto: UpdateGalleryDto,
  ): Promise<IResponsePayload<String>> {
    return await this.galleryService.updateGalleryById(updateGalleryDto);
  }

}
