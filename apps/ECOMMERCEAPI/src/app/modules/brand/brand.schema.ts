import * as mongoose from 'mongoose';

export const BrandSchema = new mongoose.Schema(
  {
    id: { 
      type: Number, 
      required: true,
      unique: true,
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
    isActive: {
      type: Boolean,
      required: false,
    },
    serial: {
      type: Number,
      required: false,
    },
    createdAtString: {
      type: String,
      required: false,
    },
    updatedAtString: {
      type: String,
      required: false,
    }
  }, { timestamps: true }
);
