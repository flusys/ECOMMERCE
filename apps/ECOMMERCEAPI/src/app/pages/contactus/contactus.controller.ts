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

import { ContactusService } from './contactus.service';
import { AddContactusDto, FilterAndPaginationContactusDto, UpdateContactusDto } from '../../modules/contactus/contactus.dto';
import { MongoIdValidationPipe } from '../../shared/pipes/mongo-id-validation.pipe';
import { IResponsePayload } from 'flusysng/shared/interfaces';
import { IContactus } from '../../modules/contactus/contactus.interface';

@Controller('contactus')
export class ContactusController {
  private logger = new Logger(ContactusController.name);

  constructor(private contactusService: ContactusService) { }

  /**
   * ADD DATA
   * addContactus()
   * insertManyContactus()
   */
  @Post('/insert')
  @UsePipes(ValidationPipe)
  async addContactus(
    @Body()
    addContactusDto: AddContactusDto,
  ): Promise<IResponsePayload<IContactus>> {
    return await this.contactusService.addContactus(addContactusDto);
  }

  /**
   * GET DATA
   * getAllContactuss()
   * getContactusById()
   * getUserContactusById()
   */
  @Version(VERSION_NEUTRAL)
  @Post('/get-all')
  @UsePipes(ValidationPipe)
  async getAllContactuss(
    @Body() filterContactusDto: FilterAndPaginationContactusDto,
    @Query('q') searchString: string,
  ): Promise<IResponsePayload<Array<IContactus>>> {
    return this.contactusService.getAllContactuss(filterContactusDto, searchString);
  }


  @Version(VERSION_NEUTRAL)
  @Get('/:id')
  async getContactusById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query() select: string,
  ): Promise<IResponsePayload<IContactus>> {
    return await this.contactusService.getContactusById(id, select);
  }

  /**
   * UPDATE DATA
   * updateContactusById()
   * updateMultipleContactusById()
   */
  @Version(VERSION_NEUTRAL)
  @Post('/update')
  @UsePipes(ValidationPipe)
  async updateContactusById(
    @Body() updateContactusDto: UpdateContactusDto,
  ): Promise<IResponsePayload<String>> {
    return await this.contactusService.updateContactusById(updateContactusDto);
  }

}
