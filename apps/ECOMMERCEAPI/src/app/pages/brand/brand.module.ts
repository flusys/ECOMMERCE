import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { BrandSchema } from '../../modules/brand/brand.schema';
import { CounterModule } from '../../shared/modules/counter/counter.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Brand', schema: BrandSchema }]),
    CounterModule
  ],
  controllers: [BrandController],
  providers: [BrandService],
})
export class BrandModule {}
