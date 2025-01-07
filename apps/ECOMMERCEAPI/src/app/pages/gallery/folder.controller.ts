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

import { FolderService } from './folder.service';
import { AddFolderDto, FilterAndPaginationFolderDto, UpdateFolderDto } from '../../modules/gallery/folder.dto';
import { MongoIdValidationPipe } from '../../shared/pipes/mongo-id-validation.pipe';
import { IResponsePayload } from 'flusysng/shared/interfaces';
import { IFolder } from '../../modules/gallery/folder.interface';

@Controller('folder')
export class FolderController {
  private logger = new Logger(FolderController.name);

  constructor(private folderService: FolderService) { }

  /**
   * ADD DATA
   * addFolder()
   * insertManyFolder()
   */
  @Post('/insert')
  @UsePipes(ValidationPipe)
  async addFolder(
    @Body()
    addFolderDto: AddFolderDto,
  ): Promise<IResponsePayload<IFolder>> {
    return await this.folderService.addFolder(addFolderDto);
  }

  /**
   * GET DATA
   * getAllFolders()
   * getFolderById()
   * getUserFolderById()
   */
  @Version(VERSION_NEUTRAL)
  @Post('/get-all')
  @UsePipes(ValidationPipe)
  async getAllFolders(
    @Body() filterFolderDto: FilterAndPaginationFolderDto,
    @Query('q') searchString: string,
  ): Promise<IResponsePayload<Array<IFolder>>> {
    return this.folderService.getAllFolders(filterFolderDto, searchString);
  }


  @Version(VERSION_NEUTRAL)
  @Get('/:id')
  async getFolderById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query() select: string,
  ): Promise<IResponsePayload<IFolder>> {
    return await this.folderService.getFolderById(id, select);
  }

  /**
   * UPDATE DATA
   * updateFolderById()
   * updateMultipleFolderById()
   */
  @Version(VERSION_NEUTRAL)
  @Post('/update')
  @UsePipes(ValidationPipe)
  async updateFolderById(
    @Body() updateFolderDto: UpdateFolderDto,
  ): Promise<IResponsePayload<String>> {
    return await this.folderService.updateFolderById(updateFolderDto);
  }

}
