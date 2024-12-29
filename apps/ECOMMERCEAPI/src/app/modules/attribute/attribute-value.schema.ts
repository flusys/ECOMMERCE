import * as mongoose from 'mongoose';

export const AttributeValueSchema = new mongoose.Schema(
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
    attribute: {
      type: Number,
      ref: 'Attribute',
      required: true,
    },
  }, { timestamps: true }
);
