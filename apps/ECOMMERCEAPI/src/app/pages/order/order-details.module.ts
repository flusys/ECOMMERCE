import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderDetailsController } from './order-details.controller';
import { OrderDetailsService } from './order-details.service';
import { OrderDetailsSchema } from '../../modules/order/order-details.schema';
import { OrderItemSchema } from '../../modules/order/order-item.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'OrderDetails', schema: OrderDetailsSchema },
      { name: 'OrderItem', schema: OrderItemSchema },
    ]),
  ],
  controllers: [OrderDetailsController],
  providers: [OrderDetailsService],
})
export class OrderDetailsModule {}
