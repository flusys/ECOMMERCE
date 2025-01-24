import * as mongoose from 'mongoose';

export const CategorySchema = new mongoose.Schema(
  {
    id: {
      type: Number,  // Custom `id` field as the primary key
      required: true,
      unique: true,  // Ensure `id` is unique
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    parent: {
      type: Number,
      ref: 'Category',
      required: false,
    },
    isPopular: {
      type: Boolean,
      required: false,
    },
    createdAtString: {
      type: String,
      required: false,
    },
    updatedAtString: {
      type: String,
      required: false,
    },
  },
  {
    versionKey: false,
    timestamps: true
  },
);
