import * as mongoose from 'mongoose';

export const TagSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    readOnly: {
      type: Boolean,
      required: false,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    priority: {
      type: Number,
      required: false,
    }
  }, { timestamps: true }
);
