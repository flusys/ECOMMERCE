import * as mongoose from 'mongoose';

export const BannerSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      required: false,
    },
    url: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    subTitle: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    mblImage: {
      type: String,
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
  }, {versionKey: false, timestamps: true }
);
