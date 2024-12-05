import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AttributeValueController } from './attribute-value.controller';
import { AttributeValueService } from './attribute-value.service';
import { AttributeValueSchema } from '../../modules/attribute/attribute-value.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'AttributeValue', schema: AttributeValueSchema }]),
  ],
  controllers: [AttributeValueController],
  providers: [AttributeValueService],
})
export class AttributeValueModule {}
