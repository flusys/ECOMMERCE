import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const AttributeValueSchema = new mongoose.Schema(
  {
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
      type: Schema.Types.ObjectId,
      ref: 'Attribute',
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
