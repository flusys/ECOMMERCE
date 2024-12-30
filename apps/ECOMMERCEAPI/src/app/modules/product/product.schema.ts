import * as mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    readOnly: {
      type: Boolean,
      required: true,
      default: false,
    },
    image: {
      type: String,
      default: null,
    },
    warning: {
      type: String,
      default: null,
    },
    warningDay: {
      type: Number,
      default: null,
    },
    refundable: {
      type: Boolean,
      required: true,
      default: false,
    },
    returnable: {
      type: Boolean,
      required: true,
      default: false,
    },
    sku: {
      type: String,
      default: null,
    },
    barCode: {
      type: String,
      unique: true,
      default: null,
    },
    price: {
      type: Number,
      default: null,
    },
    ingredients: [
      {
        key: String,
        value: String,
      },
    ],
    trackQuantity: {
      type: Boolean,
      default: null,
    },
    stockQuantity: {
      type: Boolean,
      default: null,
    },
    earnPoint: {
      type: Number,
      default: null,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    activeOnline: {
      type: Boolean,
      required: true,
      default: true,
    },
    status: {
      type: String,
      default: null,
    },
    parentProduct: {
      type: Number,
      ref: 'parentproducts',
      required: true,
    },
    variants: [
      {
        type: Number,
        ref: 'attributevalues',
      },
    ],
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
