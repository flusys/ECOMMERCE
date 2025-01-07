import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriberController } from './subscriber.controller';
import { SubscriberService } from './subscriber.service';
import { SubscriberSchema } from '../../modules/subscriber/subscriber.schema';
import { CounterModule } from '../../shared/modules/counter/counter.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Subscriber', schema: SubscriberSchema }]),
    CounterModule
  ],
  controllers: [SubscriberController],
  providers: [SubscriberService],
})
export class SubscriberModule {}
