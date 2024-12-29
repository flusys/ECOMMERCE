import * as mongoose from 'mongoose';

export const AttributeSchema = new mongoose.Schema(
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
  }, { versionKey: false,timestamps: true }
);
