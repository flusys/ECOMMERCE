import * as mongoose from 'mongoose';

export const BrandSchema = new mongoose.Schema(
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
  }, { timestamps: true , _id: false  }
);
