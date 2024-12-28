import * as mongoose from 'mongoose';

export const CounterSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },  // e.g., 'brand_id'
    sequence_value: { type: Number, required: true }
  }, { timestamps: true }
);
