import * as mongoose from 'mongoose';

export const OrderItemSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    orderDetails: {
      type: Number, 
      ref: 'OrderDetails',
      required: true,
    },
    product: {
      type: Number, 
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);