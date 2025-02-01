import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { ReviewSchema } from '../../modules/review/review.schema';
import { CounterModule } from '../../shared/modules/counter/counter.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Review', schema: ReviewSchema }]),
    CounterModule
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
