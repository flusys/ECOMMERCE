import { Schema } from 'mongoose';
import * as mongoose from 'mongoose';

const ParentProductSchema = new mongoose.Schema(
  {
    readOnly: {
      type: Boolean,
      required: true,
      default: false,
    },
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    images: [
      {
        type: String,
      },
    ],
    description: {
      type: String,
      default: null,
    },
    isHtml: {
      type: Boolean,
      default: null,
    },
    serial: {
      type: Number,
      default: null,
    },
    shortDesc: {
      type: String,
      default: null,
    },
    seoTitle: {
      type: String,
      default: null,
    },
    seoDescription: {
      type: String,
      default: null,
    },
    seoKeywords: [
      {
        type: String,
      },
    ],
    videoUrl: {
      type: String,
      default: null,
    },
    videoThumbnailImage: {
      type: String,
      default: null,
    },
    specifications: [
      {
        key: String,
        value: String,
      },
    ],
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
      default: null,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      default: null,
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Tag',
      },
    ],
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    isFeature: {
      type: Boolean,
      default: null,
    },
    status: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
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
    timestamps: true,
  },
);
