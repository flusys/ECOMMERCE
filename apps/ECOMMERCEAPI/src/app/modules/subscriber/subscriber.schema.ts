import * as mongoose from 'mongoose';

export const SubscriberSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
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
