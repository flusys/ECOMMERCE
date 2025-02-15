import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
  Version,
  VERSION_NEUTRAL,
} from '@nestjs/common';

import { OrderDetailsService } from './order-details.service';
import { AddOrderDetailsDto, FilterAndPaginationOrderDetailsDto, UpdateOrderDetailsDto, UpdateOrderDetailsStatusDto } from '../../modules/order/order-details.dto';
import { IResponsePayload } from 'flusysng/shared/interfaces';
import { MongoIdValidationPipe } from '../../shared/pipes/mongo-id-validation.pipe';
import { IOrderDetails } from '../../modules/order/order-details.interface';

@Controller('order-details')
export class OrderDetailsController {
  private logger = new Logger(OrderDetailsController.name);

  constructor(private orderDetailsService: OrderDetailsService) {}

  /**
   * ADD DATA
   * addOrderDetails()
   * insertManyOrderDetails()
   */
  @Post('/insert')
  @UsePipes(ValidationPipe)
  async addOrderDetails(
    @Body()
    addOrderDetailsDto: AddOrderDetailsDto,
  ): Promise<IResponsePayload<IOrderDetails>> {
    return await this.orderDetailsService.addOrderDetails(addOrderDetailsDto);
  }

  /**
   * GET DATA
   * getAllOrderDetailss()
   * getOrderDetailsById()
   * getUserOrderDetailsById()
   */
  @Version(VERSION_NEUTRAL)
  @Post('/get-all')
  @UsePipes(ValidationPipe)
  async getAllOrderDetailss(
    @Body() filterOrderDetailsDto: FilterAndPaginationOrderDetailsDto,
    @Query('q') searchString: string,
  ): Promise<IResponsePayload<Array<IOrderDetails>>> {
    return this.orderDetailsService.getAllOrderDetails(filterOrderDetailsDto, searchString);
  }

  @Version(VERSION_NEUTRAL)
  @Get('/:id')
  async getOrderDetailsById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query() select: string,
  ): Promise<IResponsePayload<IOrderDetails>> {
    return await this.orderDetailsService.getOrderDetailsById(id, select);
  }

  /**
   * UPDATE DATA
   * updateOrderDetailsById()
   */
  @Version(VERSION_NEUTRAL)
  @Post('/update')
  @UsePipes(ValidationPipe)
  async updateOrderDetailsById(
    @Body() updateOrderDetailsDto: UpdateOrderDetailsDto,
  ): Promise<IResponsePayload<String>> {
    return await this.orderDetailsService.updateOrderDetailsById(updateOrderDetailsDto);
  }

  @Version(VERSION_NEUTRAL)
  @Post('/update-status')
  @UsePipes(ValidationPipe)
  async updateOrderDetailsStatusById(
    @Body() updateOrderDetailsDto: UpdateOrderDetailsStatusDto,
  ): Promise<IResponsePayload<String>> {
    return await this.orderDetailsService.updateOrderDetailsStatusById(updateOrderDetailsDto);
  }
}
