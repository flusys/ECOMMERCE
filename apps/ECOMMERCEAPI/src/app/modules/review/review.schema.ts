import * as mongoose from 'mongoose';

export const ReviewSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    star: {
      type: Number,
      required: false,
    },
    comment: {
      type: String,
      required: false,
    },
    user: {
      type: Number,
      ref: 'User',
      default: null,
    },
    product: {
      type: Number,
      ref: 'ParentProduct',
      default: null,
    },
    createdAtString: {
      type: String,
      required: false,
    },
    updatedAtString: {
      type: String,
      required: false,
    }
  }, {versionKey: false, timestamps: true }
);
