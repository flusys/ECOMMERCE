import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactusController } from './contactus.controller';
import { ContactusService } from './contactus.service';
import { ContactusSchema } from '../../modules/contactus/contactus.schema';
import { CounterModule } from '../../shared/modules/counter/counter.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Contactus', schema: ContactusSchema }]),
    CounterModule
  ],
  controllers: [ContactusController],
  providers: [ContactusService],
})
export class ContactusModule {}
