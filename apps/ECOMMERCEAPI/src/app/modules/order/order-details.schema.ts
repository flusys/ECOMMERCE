import * as mongoose from 'mongoose';

export const OrderDetailsSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
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
    shipmentPrice: {
      type: Number,
      required: false,
    },
    total: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
  },
  { timestamps: true, versionKey: false }
);