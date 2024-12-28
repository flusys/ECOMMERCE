import { Document } from 'mongoose';
export interface Counter extends Document {
    _id: string;  // The name of the counter (e.g., 'brand_id')
    sequence_value: number;  // The current value of the counter
}