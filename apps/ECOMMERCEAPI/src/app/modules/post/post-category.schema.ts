import * as mongoose from 'mongoose';

export const PostCategorySchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
  }, { versionKey: false,timestamps: true }
);
