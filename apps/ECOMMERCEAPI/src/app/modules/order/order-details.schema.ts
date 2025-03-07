import * as mongoose from 'mongoose';
import { OrderStatus } from '../../shared/enums/status.enum';

export const OrderDetailsSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: false,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (v: string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: (props: any) => `${props.value} is not a valid email!`,
      },
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    createAccount: {
      type: Boolean,
      required: false,
      default: false,
    },
    differentAddress: {
      type: Boolean,
      required: false,
      default: false,
    },
    comment: {
      type: String,
      required: false,
      trim: true,
    },
    shipmentAmount: {
      type: Number,
      required: false,
    },
    total: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: OrderStatus,
      default: OrderStatus.PENDING,
    },
  },
  { timestamps: true, versionKey: false }
);