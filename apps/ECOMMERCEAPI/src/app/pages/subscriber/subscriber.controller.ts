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

import { SubscriberService } from './subscriber.service';
import { AddSubscriberDto, FilterAndPaginationSubscriberDto, UpdateSubscriberDto } from '../../modules/subscriber/subscriber.dto';
import { MongoIdValidationPipe } from '../../shared/pipes/mongo-id-validation.pipe';
import { IResponsePayload } from 'flusysng/shared/interfaces';
import { ISubscriber } from '../../modules/subscriber/subscriber.interface';

@Controller('subscriber')
export class SubscriberController {
  private logger = new Logger(SubscriberController.name);

  constructor(private subscriberService: SubscriberService) { }

  /**
   * ADD DATA
   * addSubscriber()
   * insertManySubscriber()
   */
  @Post('/insert')
  @UsePipes(ValidationPipe)
  async addSubscriber(
    @Body()
    addSubscriberDto: AddSubscriberDto,
  ): Promise<IResponsePayload<ISubscriber>> {
    return await this.subscriberService.addSubscriber(addSubscriberDto);
  }

  /**
   * GET DATA
   * getAllSubscribers()
   * getSubscriberById()
   * getUserSubscriberById()
   */
  @Version(VERSION_NEUTRAL)
  @Post('/get-all')
  @UsePipes(ValidationPipe)
  async getAllSubscribers(
    @Body() filterSubscriberDto: FilterAndPaginationSubscriberDto,
    @Query('q') searchString: string,
  ): Promise<IResponsePayload<Array<ISubscriber>>> {
    return this.subscriberService.getAllSubscribers(filterSubscriberDto, searchString);
  }


  @Version(VERSION_NEUTRAL)
  @Get('/:id')
  async getSubscriberById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query() select: string,
  ): Promise<IResponsePayload<ISubscriber>> {
    return await this.subscriberService.getSubscriberById(id, select);
  }

  /**
   * UPDATE DATA
   * updateSubscriberById()
   * updateMultipleSubscriberById()
   */
  @Version(VERSION_NEUTRAL)
  @Post('/update')
  @UsePipes(ValidationPipe)
  async updateSubscriberById(
    @Body() updateSubscriberDto: UpdateSubscriberDto,
  ): Promise<IResponsePayload<String>> {
    return await this.subscriberService.updateSubscriberById(updateSubscriberDto);
  }

}
