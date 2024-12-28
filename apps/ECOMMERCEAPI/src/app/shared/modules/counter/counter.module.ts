import { Global, Module } from '@nestjs/common';
import { CounterService } from './counter.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CounterSchema } from './counter.schema';

@Global()
@Module({
  imports: [
     MongooseModule.forFeature([{ name: 'Counter', schema: CounterSchema }]),
  ],
  providers: [CounterService],
  exports: [CounterService],
})
export class CounterModule {}
