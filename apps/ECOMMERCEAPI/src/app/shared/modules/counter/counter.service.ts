import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Counter } from './counter.interface';

@Injectable()
export class CounterService {
  private logger = new Logger(CounterService.name);

  constructor(
    @InjectModel('Counter') private counterModel: Model<Counter>
  ) { }

  // Get next available id from the counter
  public async getNextId(_id: string): Promise<number> {
    const counter = await this.counterModel.findOneAndUpdate(
      { _id: _id },  // Use the name of the counter
      { $inc: { sequence_value: 1 } },  // Increment the counter by 1
      { new: true, upsert: true }  // If counter doesn't exist, create it
    );

    return counter.sequence_value;
  }
}
