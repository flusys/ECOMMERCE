import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderDetailsController } from './order-details.controller';
import { OrderDetailsService } from './order-details.service';
import { OrderDetailsSchema } from '../../modules/order/order-details.schema';
import { OrderItemSchema } from '../../modules/order/order-item.schema';
import { UserSchema } from '../../modules/user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'OrderDetails', schema: OrderDetailsSchema },
      { name: 'OrderItems', schema: OrderItemSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  controllers: [OrderDetailsController],
  providers: [OrderDetailsService],
})
export class OrderDetailsModule {}
