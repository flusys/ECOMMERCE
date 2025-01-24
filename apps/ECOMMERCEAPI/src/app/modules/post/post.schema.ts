import * as mongoose from 'mongoose';

export const PostSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: Number,
      ref: 'PostCategory',
      required: false,
    },
  }, { versionKey: false,timestamps: true }
);
